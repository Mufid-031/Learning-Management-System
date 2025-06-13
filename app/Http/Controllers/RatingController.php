<?php

namespace App\Http\Controllers;

use App\Http\Resources\AcademicResource;
use App\Http\Resources\CourseResource;
use App\Models\Academic;
use App\Models\Course;
use App\Models\Rating;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Log;
use Inertia\Inertia;

class RatingController extends Controller
{
    public function index()
    {
        $courses = Course::where('status', 'published')->with([
            'academic',
            'ratings',
            'modules',
            'students'
        ])
            ->whereHas('academic', fn($query) => $query->where('status', 'published'))
            ->get();
        $academics = Academic::with([
            'courses' => function ($query) {
                $query->whereHas('ratings') // hanya courses yang punya ratings
                    ->with([
                        'modules',
                        'ratings.student.user', // eager loading relasi nested ratings -> student -> user,
                        'ratings.course'
                    ]);
            }
        ])->get();


        return Inertia::render('ratings', [
            'courses' => CourseResource::collection($courses),
            'academics' => AcademicResource::collection($academics),
            'success' => session('success'),
            'error' => session('error'),
        ]);
    }

    public function store(Request $request)
    {
        try {
            $validated = $request->validate([
                'course_id' => 'required|exists:courses,id',
                'student_id' => 'required|exists:students,id',
                'rating' => 'required|integer|min:1|max:5',
                'comment' => 'nullable|string',
            ]);

            $rating = Rating::where([
                'course_id' => $validated['course_id'],
                'student_id' => $validated['student_id'],
            ])->first();

            if ($rating) {
                $rating->update($validated);
                return redirect()->back()->with('success', 'Rating updated successfully.');
            } else {
                Rating::create($validated);
                return redirect()->back()->with('success', 'Rating created successfully.');
            }
        } catch (\Exception $e) {
            Log::error($e->getMessage());

            return redirect()->back()->with('error', 'Failed to create rating.');
        }
    }

    public function destroy(Rating $rating)
    {
        try {
            $rating->delete();
            return redirect()->back()->with('success', 'Rating deleted successfully.');
        } catch (\Exception $e) {
            Log::error($e->getMessage());

            return redirect()->back()->with('error', 'Failed to delete rating.');
        }
    }
}
