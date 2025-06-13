<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class StoreCourseRequest extends FormRequest
{
    /**
     * Determine if the user is authorized to make this request.
     */
    public function authorize(): bool
    {
        return true;
    }

    /**
     * Get the validation rules that apply to the request.
     *
     * @return array<string, \Illuminate\Contracts\Validation\ValidationRule|array<mixed>|string>
     */
    public function rules(): array
    {
        return [
            'title' => 'required|string',
            'image' => 'required|image|mimes:jpeg,png,jpg,gif|max:5000',
            'information' => 'required|string',
            'description' => 'required|string',
            'order' => 'required|integer',
            'duration' => 'required|integer',
            'difficulty' => 'required|in:beginner,intermediate,advanced',
            'price' => 'required|integer',
            'status' => 'nullable|in:published,draft',
            'academic_id' => 'required|exists:academics,id',
        ];
    }
}
