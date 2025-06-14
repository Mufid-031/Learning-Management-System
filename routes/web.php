<?php

use App\Http\Resources\RatingResource;
use App\Models\Rating;
use Inertia\Inertia;
use App\Models\Course;
use App\Models\Academic;
use App\Http\Middleware\IsAdmin;
use App\Http\Middleware\IsStudent;
use Illuminate\Support\Facades\Route;
use App\Http\Resources\CourseResource;
use App\Http\Resources\AcademicResource;
use App\Http\Controllers\ReplyController;
use App\Http\Controllers\RatingController;
use App\Http\Controllers\StudentController;
use App\Http\Controllers\AcademicController;
use App\Http\Controllers\DiscussionController;
use App\Http\Controllers\LearningPathController;
use App\Http\Controllers\Admin\AdminQuizController;
use App\Http\Controllers\Admin\AdminUserController;
use App\Http\Controllers\Admin\AdminCourseController;
use App\Http\Controllers\Admin\AdminLessonController;
use App\Http\Controllers\Admin\AdminModuleController;
use App\Http\Controllers\Admin\AdminAcademicController;
use App\Http\Controllers\Admin\AdminDashboardController;

Route::get('/', function () {
    $academics = Academic::where('status', 'published')->with([
        'courses' => fn($query) =>
        $query->where('status', 'published')->with([
            'modules' => fn($query) => $query->where('status', 'published')->with([
                'lessons' => fn($query) => $query->where('status', 'published')
            ])
        ]),
        'courses.students',
    ])->get();

    $courses = Course::where('status', 'published')->get();

    $ratings = Rating::with(['student.user', 'course'])->inRandomOrder()->get();

    return Inertia::render('welcome', [
        'academics' => AcademicResource::collection($academics),
        'courses' => CourseResource::collection($courses),
        'ratings' => RatingResource::collection($ratings),
    ]);
})->name('home');

Route::controller(LearningPathController::class)->group(function () {
    Route::get('/learning-paths', 'index')
        ->name('learning-path.index');
    Route::get('/learning-paths/{academic}', 'show')
        ->name('learning-path.show');
});

Route::controller(AcademicController::class)->group(function () {
    Route::get('/academies/{course}', 'index')
        ->name('academics.index');
    Route::get('/academies/{course}/tutorials/{lesson}', 'show')
        ->name('academics.show')
        ->middleware(['auth', IsStudent::class]);
    Route::post('/academies/quizzes/submit', 'quizzesSubmit')
        ->name('academics.quizzes.submit');
    Route::post('/academies/course/{course}/enroll', 'enrollCourse')
        ->name('academics.enroll');
    Route::post('/academies/course/{course}/payments', 'payments')
        ->name('academics.payments');
    Route::post('/academies/course/{course}/confirm-payment', 'confirmPayment')
        ->name('academics.confirm-payment');
    Route::post('/lessons/{lesson}/complete', [AcademicController::class, 'markLessonCompleted'])
        ->name('lessons.complete');
    Route::post('/module/complete/{module}', [AcademicController::class, 'markModuleCompleted'])
        ->name('modules.complete');
});

Route::controller(RatingController::class)->group(function () {
    Route::get('/ratings', 'index')
        ->name('ratings.index');
    Route::post('/ratings', 'store')
        ->name('ratings.store');
    Route::delete('/ratings/{rating}', 'destroy')
        ->name('ratings.destroy');
});

Route::middleware(['auth', 'verified', IsAdmin::class])->group(function () {
    Route::get('dashboard', [AdminDashboardController::class, 'index'])
        ->name('dashboard');
    Route::resource('users', AdminUserController::class);
    Route::resource('academics', AdminAcademicController::class);
    Route::resource('courses', AdminCourseController::class);
    Route::resource('modules', AdminModuleController::class);
    Route::resource('lessons', AdminLessonController::class);
    Route::resource('quizzes', AdminQuizController::class);
    Route::put('/academics/{academic}/status', [AdminAcademicController::class, 'updateStatus'])
        ->name('academics.updateStatus');
    Route::put('/courses/{course}/status', [AdminCourseController::class, 'updateStatus'])
        ->name('courses.updateStatus');
    Route::post('/courses/reorder', [AdminCourseController::class, 'reorder'])
        ->name('courses.reorder');
    Route::put('/modules/{module}/status', [AdminModuleController::class, 'updateStatus'])
        ->name('modules.updateStatus');
    Route::post('/modules/reorder', [AdminModuleController::class, 'reorder'])
        ->name('modules.reorder');
    Route::put('/lessons/{lesson}/status', [AdminLessonController::class, 'updateStatus'])
        ->name('lessons.updateStatus');
    Route::post('/lessons/reorder', [AdminLessonController::class, 'reorder'])
        ->name('lessons.reorder');
});

Route::middleware(['auth', 'verified', IsStudent::class])->prefix('student')->group(function () {
    Route::get('/dashboard', [StudentController::class, 'index'])
        ->name('student.dashboard');
    Route::get('/academic', [StudentController::class, 'academic'])
        ->name('student.academic');
    Route::get('/settings/profile', [StudentController::class, 'edit'])
        ->name('student.settings.profile');
    Route::get('/settings/password', [StudentController::class, 'editPassword'])
        ->name('student.settings.password');
    Route::get('/{user:name}/profile', [StudentController::class, 'profile'])
        ->name('student.profile');
    Route::get('/settings/appearance', [StudentController::class, 'appearance'])
        ->name('student.settings.appearance');
    Route::get('/courses/{course}/certificate-data', [StudentController::class, 'getCertificateData'])
        ->name('courses.certificate.data');
    Route::get('/certificate/print', function () {
        return Inertia::render('student/CertificatePrintPage'); // Ini akan menjadi halaman React baru Anda
    })->name('certificate.print.page');
    Route::get('/courses/{course}/rate', [StudentController::class, 'createCourseRating'])
        ->name('courses.rate.create');
    Route::post('/courses/{course}/rate', [StudentController::class, 'storeCourseRating'])
        ->name('courses.rate.store');
    Route::get('/certificate/{course}', [StudentController::class, 'certificate'])
        ->name('student.certificate');
});

Route::middleware(['auth'])->group(function () {
    Route::resource('discussions', DiscussionController::class);
    Route::post('discussions/{discussionthread}/like', [DiscussionController::class, 'like'])->name('discussions.like');
    Route::resource('replies', ReplyController::class);
    Route::post('replies/{reply}/like', [ReplyController::class, 'like'])->name('replies.like');
});

require __DIR__ . '/settings.php';
require __DIR__ . '/auth.php';
