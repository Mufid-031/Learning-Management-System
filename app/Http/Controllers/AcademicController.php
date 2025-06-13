<?php

namespace App\Http\Controllers;

use App\Models\Quiz;
use App\Services\ProgressService;
use Inertia\Inertia;
use App\Models\Course;
use App\Models\Lesson;
use App\Models\Payment;
use App\Models\Student;
use App\Models\Submission;
use Illuminate\Support\Str;
use Illuminate\Http\Request;
use App\Models\SubmissionHistory;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\Auth;
use App\Http\Resources\CourseResource;
use App\Http\Resources\LessonResource;
use App\Http\Resources\StudentResource;
use App\Models\CourseEnrollment;
use App\Models\LessonCompletion;
use Illuminate\Support\Facades\DB;

class AcademicController extends Controller
{
    protected $progressService;

    public function __construct(ProgressService $progressService)
    {
        $this->progressService = $progressService;
    }

    public function index(Course $course)
    {
        $courses = Course::where('status', 'published')->with([
            'academic',
            'ratings',
            'modules',
            'students'
        ])
            ->whereHas('academic', fn($query) => $query->where('status', 'published'))
            ->get();
        $course->load([
            'academic',
            'modules.lessons',
            'students.user',
            'ratings' => fn($query) => $query->with('student.user')->limit(2),
        ]);

        // No longer relying on session('snapToken') from a redirect here
        // The snapToken will now be handled directly by the client-side axios call.
        return Inertia::render('academics/course', [
            'courses' => CourseResource::collection($courses),
            'course' => new CourseResource($course),
        ]);
    }

    public function show(Course $course, Lesson $lesson)
    {
        $courses = Course::where('status', 'published')->with([
            'academic',
            'ratings',
            'modules',
            'students'
        ])
            ->whereHas('academic', fn($query) => $query->where('status', 'published'))
            ->get();

        $course->load([
            'academic',
            'ratings',
            'modules',
            'students.user',
            'modules.lessons.module.course',
        ]);

        $lesson->load([
            'module.lessons',
            'module.course',
            'quizzes' => function ($query) {
                $query->inRandomOrder()->limit(4);
            }
        ]);

        $user = Auth::user();

        $student = Student::where('user_id', '=', $user->id)
            ->with([
                'user',
                'submissionHistories' => function ($query) use ($lesson) {
                    $query->where('lesson_id', '=', $lesson->id)->with('submissions');
                },
                'courseProgresses' => function ($query) use ($course) {
                    $query->where('course_id', '=', $course->id)->with('course');
                },
                'lessonCompletions.lesson'
            ])
            ->first();

        return Inertia::render('academics/tutorials', [
            'courses' => CourseResource::collection($courses),
            'course' => new CourseResource($course),
            'lesson' => new LessonResource($lesson),
            'student' => new StudentResource($student),
        ]);
    }

    public function enrollCourse(Course $course)
    {
        $user = Auth::user();
        $student = Student::where('user_id', $user->id)->first();

        $existingEnrollment = CourseEnrollment::where([
            'student_id' => $student->id,
            'course_id' => $course->id
        ]);

        if (!$existingEnrollment->exists()) {
            CourseEnrollment::create([
                'student_id' => $student->id,
                'course_id' => $course->id
            ]);
        }

        (new ProgressService())->updateCourseProgress($student, $course);

        return response()->json([
            'message' => 'You have successfully enrolled in this course!'
        ]);
    }

    public function payments(Course $course)
    {
        $user = Auth::user();

        try {
            // Configure Midtrans (do this once)
            \Midtrans\Config::$serverKey = config('midtrans.serverKey');
            \Midtrans\Config::$isProduction = false; // Set to true for Production Environment (accept real transaction).
            \Midtrans\Config::$isSanitized = true;
            \Midtrans\Config::$is3ds = true;

            // 1. Handle free courses immediately
            if ($course->price == 0) {
                $student = Student::where('user_id', $user->id)->first();
                if ($student && !$student->courses()->where('course_id', $course->id)->exists()) {
                    $student->courses()->attach($course->id);
                }
                return response()->json([
                    'redirectUrl' => route('academics.show', [
                        'course' => $course->id,
                        'lesson' => $course->modules[0]->lessons[0]->id // Make sure this path is valid
                    ]),
                    'message' => 'You have successfully enrolled in this free course!',
                ]);
            }

            // 2. Check for existing payment
            $existingPayment = Payment::where([
                'course_id' => $course->id,
                'user_id' => $user->id,
            ])->first();

            $snapToken = null;

            if ($existingPayment) {
                if ($existingPayment->status == 'paid') {
                    $course->load([
                        'modules.lessons'
                    ]);

                    $lessonId = $course->modules[0]->lessons[0]->id;
                    // If already paid, return redirect URL
                    return response()->json([
                        'redirectUrl' => "/academies/$course->id/tutorials/$lessonId",
                        'message' => 'You have already paid for this course. Enjoy!',
                    ]);
                }

                // If pending or expired, re-generate token for the existing payment_id
                // Midtrans allows re-generation of snap token for same order_id
                $params = [
                    'transaction_details' => [
                        'order_id' => $existingPayment->payment_id,
                        'gross_amount' => $existingPayment->amount,
                    ],
                    'customer_details' => [
                        'name' => $user->name,
                        'email' => $user->email,
                    ],
                ];
                $snapToken = \Midtrans\Snap::getSnapToken($params);
            } else {
                // No existing payment, create a new one
                $createPayment = Payment::create([
                    'payment_id' => Str::uuid(),
                    'user_id' => $user->id,
                    'course_id' => $course->id,
                    'amount' => $course->price,
                    'status' => 'pending',
                    'payment_method' => null,
                    'payment_detail' => null,
                    'paid_at' => null,
                    'expired_at' => now()->addHour(),
                ]);

                $params = [
                    'transaction_details' => [
                        'order_id' => $createPayment->payment_id,
                        'gross_amount' => $createPayment->amount,
                    ],
                    'customer_details' => [
                        'name' => $user->name,
                        'email' => $user->email,
                    ],
                ];
                $snapToken = \Midtrans\Snap::getSnapToken($params);
            }

            // Always return a JSON response with the snapToken
            return response()->json(['snapToken' => $snapToken]);
        } catch (\Exception $e) {
            Log::error('Midtrans payment processing failed: ' . $e->getMessage(), ['trace' => $e->getTraceAsString()]);
            // Return an error JSON response
            return response()->json(['error' => 'Failed to process payment. Please try again or contact support.'], 500);
        }
    }

    public function confirmPayment(Course $course)
    {
        try {
            $user = Auth::user();
            $student = Student::where('user_id', $user->id)->first();

            $payment = Payment::where([
                'course_id' => $course->id,
                'user_id' => $user->id,
            ]);

            if ($payment->exists()) {
                $payment->update([
                    'status' => 'paid',
                    'paid_at' => now(),
                ]);
            }
        } catch (\Exception $e) {
            Log::error('Midtrans payment processing failed: ' . $e->getMessage(), ['trace' => $e->getTraceAsString()]);
            // Return an error JSON response
            return response()->json(['error' => 'Failed to process payment. Please try again or contact support.'], 500);
        }
    }

    public function markLessonCompleted(Request $request, Lesson $lesson)
    {
        $user = Auth::user();
        $student = Student::where('user_id', $user->id)->first();

        if (!$student) {
            return redirect()->back()->with('error', 'Student profile not found.');
        }

        try {
            // Cek apakah pelajaran sudah ditandai selesai sebelumnya
            LessonCompletion::firstOrCreate(
                [
                    'student_id' => $student->id,
                    'lesson_id' => $lesson->id,
                ],
                [
                    'completed_at' => now(), // Tandai waktu penyelesaian
                ]
            );

            $lesson->load(['module.course']);

            // Setelah pelajaran ditandai selesai, Anda harus memicu update progress kursus
            // (memanggil ProgressService yang sudah kita diskusikan sebelumnya)
            // Anda perlu mendapatkan objek Course dari Lesson ini
            $course = $lesson->module->course;
            (new ProgressService())->updateCourseProgress($student, $course);


            return redirect()->back()->with('success', 'Lesson marked as complete!');
        } catch (\Exception $e) {
            // Tangani jika ada error (misalnya, constraint unique sudah ada)
            Log::error("Failed to mark lesson {$lesson->id} complete for student {$student->id}: " . $e->getMessage());
            return redirect()->back()->with('error', 'Failed to mark lesson as complete.');
        }
    }

    public function quizzesSubmit(Request $request)
    {
        $request->validate([
            'submissions' => ['required', 'array'],
            'submissions.*.quiz_id' => ['required', 'exists:quizzes,id'],
            'submissions.*.selected_answer' => ['nullable', 'string'],
        ]);

        $userId = Auth::id();
        // Ambil objek Student lengkap, bukan hanya ID-nya
        $student = Student::where('user_id', $userId)->first();
        if (!$student) {
            return redirect()->route('login')->with('error', 'Please log in to submit quizzes.');
        }

        // Ambil ID kuis pertama dari submissions
        $firstQuizId = $request->input('submissions.0.quiz_id');

        // Temukan kuis pertama dan muat relasi lesson dan module.course
        $quiz = Quiz::with('lesson.module.course')->find($firstQuizId);

        // Pastikan kuis, pelajaran, dan kursus ditemukan
        if (!$quiz || !$quiz->lesson || !$quiz->lesson->module || !$quiz->lesson->module->course) {
            return redirect()->back()->with('error', 'Invalid quiz submission: Associated lesson or course not found.');
        }

        $lesson = $quiz->lesson; // Objek Lesson
        $course = $lesson->module->course; // Objek Course

        try {
            DB::beginTransaction(); // Mulai transaksi database

            $submissionHistory = SubmissionHistory::create([
                'lesson_id' => $lesson->id, // Gunakan ID dari objek Lesson
                'student_id' => $student->id, // Gunakan ID dari objek Student
                'status' => 'pending',
                'grade' => null,
            ]);

            $correctAnswersCount = 0;
            $totalQuizzesInSubmission = count($request->submissions); // Total kuis dalam submission ini

            foreach ($request->submissions as $submissionData) {
                $quizId = $submissionData['quiz_id'];
                $selectedAnswer = $submissionData['selected_answer'];

                $quiz = Quiz::find($quizId); // Ambil setiap kuis untuk validasi dan jawaban

                $isCorrect = false;
                if ($quiz && $quiz->answer === $selectedAnswer) {
                    $isCorrect = true;
                    $correctAnswersCount++;
                }

                Submission::create([
                    'student_id' => $student->id,
                    'quiz_id' => $quizId,
                    'submission_history_id' => $submissionHistory->id,
                    'selected_answer' => $selectedAnswer,
                    'is_correct' => $isCorrect,
                ]);
            }

            $passingScorePercentage = 75;
            $scorePercentage = ($totalQuizzesInSubmission > 0) ? ($correctAnswersCount / $totalQuizzesInSubmission) * 100 : 0;

            $status = ($scorePercentage >= $passingScorePercentage) ? 'passed' : 'failed';
            $grade = round($scorePercentage, 2) . '%';

            $submissionHistory->update([
                'status' => $status,
                'grade' => $grade,
            ]);

            // Panggil ProgressService untuk memperbarui kemajuan kursus
            $this->progressService->updateCourseProgress($student, $course);

            DB::commit(); // Commit transaksi jika semua berhasil

            return redirect()->back()->with('success', 'Quiz submitted successfully.');
        } catch (\Exception $e) {
            DB::rollBack(); // Rollback transaksi jika ada error
            Log::error('Quiz submission failed: ' . $e->getMessage(), ['trace' => $e->getTraceAsString()]);

            return redirect()->back()->with('error', 'Failed to submit quiz.');
        }
    }
}
