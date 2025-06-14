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
use App\Models\Module;
use Illuminate\Support\Facades\DB;
use Throwable; // Import Throwable for broader exception catching

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
            'module.course.modules.lessons',
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
            \Midtrans\Config::$serverKey = config('midtrans.serverKey');
            \Midtrans\Config::$isProduction = false;
            \Midtrans\Config::$isSanitized = true;
            \Midtrans\Config::$is3ds = true;

            if ($course->price == 0) {
                $student = Student::where('user_id', $user->id)->first();
                if ($student && !$student->courses()->where('course_id', $course->id)->exists()) {
                    $student->courses()->attach($course->id);
                }
                return response()->json([
                    'redirectUrl' => route('academics.show', [
                        'course' => $course->id,
                        // Safely access lesson ID with optional chaining
                        'lesson' => $course->modules[0]->lessons[0]->id ?? null
                    ]),
                    'message' => 'You have successfully enrolled in this free course!',
                ]);
            }

            $existingPayment = Payment::where([
                'course_id' => $course->id,
                'user_id' => $user->id,
            ])->first();

            $snapToken = null;

            if ($existingPayment) {
                if ($existingPayment->status == 'paid') {
                    $course->load(['modules.lessons']);
                    $lessonId = $course->modules[0]->lessons[0]->id ?? null; // Safely access lesson ID
                    return response()->json([
                        'redirectUrl' => "/academies/$course->id/tutorials/$lessonId",
                        'message' => 'You have already paid for this course. Enjoy!',
                    ]);
                }

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

            return response()->json(['snapToken' => $snapToken]);
        } catch (\Exception $e) {
            Log::error('Midtrans payment processing failed: ' . $e->getMessage(), ['trace' => $e->getTraceAsString()]);
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
            DB::beginTransaction(); // Start a transaction for atomicity

            LessonCompletion::firstOrCreate(
                [
                    'student_id' => $student->id,
                    'lesson_id' => $lesson->id,
                ],
                [
                    'completed_at' => now(),
                ]
            );

            $lesson->load(['module.course']);
            $course = $lesson->module->course;

            // Update course progress after a lesson is completed
            $this->progressService->updateCourseProgress($student, $course);

            DB::commit(); // Commit the transaction

            return redirect()->back()->with('success', 'Lesson marked as complete!');
        } catch (Throwable $e) { // Use Throwable to catch all errors and exceptions
            DB::rollBack(); // Rollback on error
            Log::error("Failed to mark lesson {$lesson->id} complete for student {$student->id}: " . $e->getMessage(), ['trace' => $e->getTraceAsString()]);
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
        $student = Student::where('user_id', $userId)->first();
        if (!$student) {
            return redirect()->route('login')->with('error', 'Please log in to submit quizzes.');
        }

        $firstQuizId = $request->input('submissions.0.quiz_id');
        $quiz = Quiz::with('lesson.module.course')->find($firstQuizId);

        if (!$quiz || !$quiz->lesson || !$quiz->lesson->module || !$quiz->lesson->module->course) {
            return redirect()->back()->with('error', 'Invalid quiz submission: Associated lesson or course not found.');
        }

        $lesson = $quiz->lesson;
        $course = $lesson->module->course;

        try {
            DB::beginTransaction();

            $submissionHistory = SubmissionHistory::create([
                'lesson_id' => $lesson->id,
                'student_id' => $student->id,
                'status' => 'pending',
                'grade' => null,
            ]);

            $correctAnswersCount = 0;
            $totalQuizzesInSubmission = count($request->submissions);

            foreach ($request->submissions as $submissionData) {
                $quizId = $submissionData['quiz_id'];
                $selectedAnswer = $submissionData['selected_answer'];

                $quiz = Quiz::find($quizId);

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

            $this->progressService->updateCourseProgress($student, $course);

            DB::commit();

            return redirect()->back()->with('success', 'Quiz submitted successfully.');
        } catch (Throwable $e) { // Use Throwable
            DB::rollBack();
            Log::error('Quiz submission failed: ' . $e->getMessage(), ['trace' => $e->getTraceAsString()]);
            return redirect()->back()->with('error', 'Failed to submit quiz.');
        }
    }

    public function markModuleCompleted(Request $request, Module $module)
    {
        try {
            $user_id = Auth::id();

            $student = Student::where('user_id', $user_id)->first();

            if (!$student) {
                return redirect()->route('login')->with('error', 'Please log in to complete the module.');
            }

            // Load lessons on the module being completed
            $module->load(['course', 'lessons']);

            if (!$module) {
                return redirect()->back()->with('error', 'The module you are trying to complete was not found.');
            }

            $course = $module->course;

            DB::beginTransaction(); // Start transaction for module completion process

            // 1. Ensure all lessons in the current module are marked as completed for the student
            foreach ($module->lessons as $lesson) {
                LessonCompletion::firstOrCreate(
                    [
                        'student_id' => $student->id,
                        'lesson_id' => $lesson->id,
                    ],
                    [
                        'completed_at' => now(),
                    ]
                );
            }

            // 2. Update the overall course progress.
            // This is crucial because ProgressService calculates based on existing LessonCompletions.
            $this->progressService->updateCourseProgress($student, $course);

            DB::commit(); // Commit the transaction if all operations succeed

            // Now, determine the next navigation
            $nextModule = Module::where('course_id', $course->id)
                ->where('order', $module->order + 1)
                ->first();

            if ($nextModule) {
                $firstLessonOfNextModule = Lesson::where('module_id', $nextModule->id)
                    ->where('order', 1)
                    ->first();

                if ($firstLessonOfNextModule) {
                    return redirect()->to(
                        "/academies/{$course->id}/tutorials/{$firstLessonOfNextModule->id}"
                    )->with('success', 'Module completed successfully! Redirecting to the next module.');
                } else {
                    return redirect()->to("/academies/{$course->id}")->with('info', 'Module completed, but the next module has no lessons. You are back at the course overview.');
                }
            } else {
                return redirect()->to("/academies/{$course->id}")->with('success', 'Congratulations! You have completed the entire course.');
            }
        } catch (Throwable $e) { // Use Throwable to catch all types of errors
            DB::rollBack(); // Rollback transaction on any error
            Log::error("Error completing module '{$module->id}' for user '{$user_id}': " . $e->getMessage(), [
                'module_id' => $module->id,
                'user_id' => $user_id,
                'exception' => $e->getTraceAsString() // Log full trace for better debugging
            ]);
            return redirect()->back()->with('error', 'An unexpected error occurred while trying to complete the module. Please try again.');
        }
    }
}
