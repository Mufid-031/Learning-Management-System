<?php

namespace App\Http\Controllers;

use App\Http\Resources\CertificateResource;
use App\Http\Resources\CourseResource;
use App\Http\Resources\StudentResource;
use App\Http\Resources\UserResource;
use App\Models\Certificate;
use App\Models\Course;
use App\Models\CourseProgress;
use App\Models\Rating;
use App\Models\Student;
use App\Models\User;
use Illuminate\Contracts\Auth\MustVerifyEmail;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Log;
use Inertia\Inertia;

class StudentController extends Controller
{

    public function index()
    {
        $user = Auth::user();

        $student = Student::where('user_id', '=', $user->id)
            ->with([
                'user',
                'enrollments',
                // 'enrollments.course.academic',
                // 'enrollments.course.modules.lessons',
                // 'enrollments.course.students.user',
                // 'enrollments.ratings',
                'courseProgresses.course',
            ])
            ->first();

        return Inertia::render('student/dashboard', [
            'student' => new StudentResource($student),
        ]);
    }

    public function academic()
    {
        $user = Auth::user();

        $student = Student::where('user_id', '=', $user->id)
            ->with([
                'user',
                'enrollments',
                'courseProgresses.course.ratings.student',
            ])
            ->first();

        return Inertia::render('student/academic', [
            'student' => new StudentResource($student),
        ]);
    }

    public function edit(Request $request)
    {
        $courses = Course::all();

        return Inertia::render('student/settings/profile', [
            'courses' => CourseResource::collection($courses),
            'mustVerifyEmail' => $request->user() instanceof MustVerifyEmail,
            'status' => $request->session()->get('status'),
        ]);
    }

    public function editPassword(Request $request)
    {
        $courses = Course::all();
        return Inertia::render('student/settings/password', [
            'courses' => CourseResource::collection($courses),
            'mustVerifyEmail' => $request->user() instanceof MustVerifyEmail,
            'status' => $request->session()->get('status'),
        ]);
    }

    public function profile(User $user)
    {
        $courses = Course::all();
        $user->load([
            'student.courseProgresses',
            'student.courseProgresses.course.modules.lessons.quizzes',
            'student.courseProgresses.course.students.user',
            'student.courseProgresses.course.ratings.student',
        ]);

        return Inertia::render('student/profile', [
            'courses' => CourseResource::collection($courses),
            'user' => new UserResource($user),
        ]);
    }

    public function appearance()
    {
        $courses = Course::all();

        return Inertia::render('student/settings/appearance', [
            'courses' => CourseResource::collection($courses),
        ]);
    }

    public function createCourseRating(Course $course)
    {
        $user = Auth::user();
        $student = Student::where('user_id', $user->id)->first();

        if (!$student) {
            return redirect()->route('login')->with('error', 'Student profile not found.');
        }

        // Cek apakah siswa sudah pernah memberikan rating untuk kursus ini
        $existingRating = Rating::where('student_id', $student->id)
            ->where('course_id', $course->id)
            ->first();

        return Inertia::render('student/rating-course', [
            'course' => new CourseResource($course),
            'student' => new StudentResource($student), // Pass student data for student_id
            'existingRating' => $existingRating ? [
                'rating' => $existingRating->rating,
                'comment' => $existingRating->comment,
            ] : null,
        ]);
    }

    /**
     * Store a new course rating or update an existing one.
     *
     * @param Request $request
     * @param Course $course
     * @return \Illuminate\Http\RedirectResponse
     */
    public function storeCourseRating(Request $request, Course $course)
    {
        $request->validate([
            'rating' => ['required', 'integer', 'min:1', 'max:5'],
            'comment' => ['nullable', 'string', 'max:1000'],
        ]);

        $user = Auth::user();
        $student = Student::where('user_id', $user->id)->first();

        if (!$student) {
            return redirect()->back()->with('error', 'Student profile not found.');
        }

        try {
            // Cari atau buat record rating
            $rating = Rating::updateOrCreate( // Menggunakan updateOrCreate
                [
                    'student_id' => $student->id,
                    'course_id' => $course->id,
                ],
                [
                    'rating' => $request->rating,
                    'comment' => $request->comment,
                ]
            );

            return redirect()->route('student.academic')->with('success', 'Rating kursus berhasil disimpan!');
        } catch (\Exception $e) {
            Log::error('Error saving course rating: ' . $e->getMessage(), ['trace' => $e->getTraceAsString()]);
            return redirect()->back()->with('error', 'Gagal menyimpan rating kursus.');
        }
    }

    public function certificate(Course $course)
    {
        $user = Auth::user();
        $student = Student::where('user_id', $user->id)->first();

        $certificate = Certificate::firstOrCreate(
            [
                'student_id' => $student->id,
                'course_id' => $course->id,
            ]
            // Argumen kedua di sini adalah nilai tambahan untuk pembuatan record jika belum ada.
            // Contoh: ['issue_date' => now()] jika Anda punya kolom 'issue_date' di tabel certificates
        )
            ->with([
                'student.user',
                'student.courseProgresses.course',
                'course.academic',
            ])
            ->first();

        return Inertia::render('student/certificate', [
            'certificate' => new CertificateResource($certificate),
        ]);
    }
}
