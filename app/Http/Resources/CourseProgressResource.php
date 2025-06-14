<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class CourseProgressResource extends JsonResource
{
    /**
     * Transform the resource into an array.
     *
     * @return array<string, mixed>
     */
    public function toArray(Request $request): array
    {
        return [
            'id' => $this->id,
            'student' => new StudentResource($this->whenLoaded('student')),
            'course' => new CourseResource($this->whenLoaded('course')),
            'lessons_completed' => $this->lessons_completed,
            'total_lessons' => $this->total_lessons,
            'quizzes_passed' => $this->quizzes_passed,
            'total_quizzes' => $this->total_quizzes,
            'progress_percentage' => $this->progress_percentage,
            'is_completed' => $this->is_completed,
            'completed_at' => $this->completed_at,
            'created_at' => $this->created_at,
            'updated_at' => $this->updated_at
        ];
    }
}
