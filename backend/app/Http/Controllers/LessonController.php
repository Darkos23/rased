<?php

namespace App\Http\Controllers;

use App\Models\Course;
use App\Models\Lesson;
use Illuminate\Http\Request;

class LessonController extends Controller
{
    public function byCourse(string $courseId)
    {
        $course = Course::findOrFail($courseId);
        return response()->json($course->lessons);
    }

    public function store(Request $request)
    {
        if (! in_array($request->user()->role, ['admin', 'teacher'])) {
            abort(403);
        }

        $data = $request->validate([
            'course_id'    => 'required|exists:courses,id',
            'title'        => 'required|string|max:255',
            'content'      => 'nullable|string',
            'video_url'    => 'nullable|url',
            'order'        => 'integer|min:0',
            'duration_min' => 'integer|min:0',
        ]);

        $lesson = Lesson::create($data);

        return response()->json($lesson, 201);
    }

    public function update(Request $request, string $id)
    {
        $lesson = Lesson::findOrFail($id);
        $course = $lesson->course;

        if ($request->user()->id !== $course->teacher_id && $request->user()->role !== 'admin') {
            abort(403);
        }

        $data = $request->validate([
            'title'        => 'sometimes|string|max:255',
            'content'      => 'nullable|string',
            'video_url'    => 'nullable|url',
            'order'        => 'integer|min:0',
            'duration_min' => 'integer|min:0',
        ]);

        $lesson->update($data);

        return response()->json($lesson);
    }

    public function destroy(Request $request, string $id)
    {
        $lesson = Lesson::findOrFail($id);
        $course = $lesson->course;

        if ($request->user()->id !== $course->teacher_id && $request->user()->role !== 'admin') {
            abort(403);
        }

        $lesson->delete();

        return response()->json(null, 204);
    }
}
