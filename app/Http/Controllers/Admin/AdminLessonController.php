<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Lesson;
use App\Http\Requests\StoreLessonRequest;
use App\Http\Requests\UpdateLessonRequest;
use App\Http\Resources\CourseResource;
use App\Http\Resources\LessonResource;
use App\Http\Resources\ModuleResource;
use App\Models\Course;
use App\Models\Module;
use Illuminate\Support\Facades\Log;
use Inertia\Inertia;

class AdminLessonController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        $lessons = Lesson::with('module', 'subLessons')->get();

        return Inertia::render('admin/lessons/index', [
            'lessons' => LessonResource::collection($lessons),
            'success' => session('success'),
            'error' => session('error')
        ]);
    }

    /**
     * Show the form for creating a new resource.
     */
    public function create()
    {
        $courses = Course::all();
        $modules = Module::all();

        return Inertia::render('admin/lessons/create', [
            'courses' => CourseResource::collection($courses),
            'modules' => ModuleResource::collection($modules),
        ]);
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(StoreLessonRequest $request)
    {
        try {
            $validated = $request->validated();

            Lesson::create($validated);

            return redirect()->route('lessons.index')->with('success', 'Lesson created successfully.');
        } catch (\Exception $e) {
            Log::error($e->getMessage());

            return redirect()->back()->with('error', 'Failed to create lesson.');
        }
    }

    /**
     * Display the specified resource.
     */
    public function show(Lesson $lesson)
    {
        //
    }

    /**
     * Show the form for editing the specified resource.
     */
    public function edit(Lesson $lesson)
    {
        $courses = Course::all();
        $modules = Module::all();

        return Inertia::render('admin/lessons/edit', [
            'lesson' => new LessonResource($lesson),
            'courses' => CourseResource::collection($courses),
            'modules' => ModuleResource::collection($modules),
            'success' => session('success'),
            'error' => session('error')
        ]);
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(UpdateLessonRequest $request, Lesson $lesson)
    {
        try {
            $validated = $request->validated();

            $lesson->update($validated);

            return redirect()->route('lessons.index')->with('success', 'Lesson updated successfully.');
        } catch (\Exception $e) {
            Log::error($e->getMessage());

            return redirect()->back()->with('error', 'Failed to update lesson.');
        }
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(Lesson $lesson)
    {
        try {
            $lesson->delete();

            return redirect()->back()->with('success', 'Lesson deleted successfully.');
        } catch (\Exception $e) {
            Log::error($e->getMessage());

            return redirect()->back()->with('error', 'Failed to delete lesson.');
        }
    }
}
