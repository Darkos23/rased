<?php

namespace App\Http\Controllers;

use App\Models\Meeting;
use App\Services\JitsiJwtService;
use Illuminate\Http\Request;
use Illuminate\Support\Str;

class MeetingController extends Controller
{
    public function index(Request $request)
    {
        $meetings = Meeting::with('host:id,name,avatar')
            ->when($request->search, fn($q, $s) => $q->where(fn($q2) => $q2
                ->where('title',       'ilike', "%{$s}%")
                ->orWhere('description', 'ilike', "%{$s}%")))
            ->when($request->status, fn($q, $st) => $q->where('status', $st))
            ->orderByRaw("CASE WHEN status = 'live' THEN 0 WHEN status = 'scheduled' THEN 1 ELSE 2 END")
            ->orderBy('scheduled_at')
            ->paginate(20);

        return response()->json($meetings);
    }

    public function show(string $id)
    {
        $meeting = Meeting::with('host:id,name,avatar')->findOrFail($id);
        return response()->json($meeting);
    }

    public function store(Request $request)
    {
        if (! in_array($request->user()->role, ['admin', 'teacher'])) {
            abort(403);
        }

        if (! $request->user()->hasVerifiedEmail()) {
            return response()->json(['message' => 'Veuillez vérifier votre adresse email avant de publier.'], 403);
        }

        $data = $request->validate([
            'title'        => 'required|string|max:255',
            'description'  => 'nullable|string',
            'scheduled_at' => 'required|date|after:now',
        ]);

        // Génération automatique d'une salle JaaS unique
        $appId  = config('services.jaas.app_id');
        $roomId = 'fastef-' . Str::uuid();
        $data['google_meet_url'] = "https://8x8.vc/{$appId}/{$roomId}";

        $meeting = $request->user()->meetings()->create($data);

        return response()->json($meeting, 201);
    }

    public function update(Request $request, string $id)
    {
        $meeting = Meeting::findOrFail($id);

        if ($request->user()->id !== $meeting->host_id && $request->user()->role !== 'admin') {
            abort(403);
        }

        $data = $request->validate([
            'title'        => 'sometimes|string|max:255',
            'description'  => 'nullable|string',
            'scheduled_at' => 'sometimes|date',
            'status'       => 'in:scheduled,live,ended',
        ]);

        $meeting->update($data);

        return response()->json($meeting->load('host:id,name,avatar'));
    }

    public function destroy(Request $request, string $id)
    {
        $meeting = Meeting::findOrFail($id);

        if ($request->user()->id !== $meeting->host_id && $request->user()->role !== 'admin') {
            abort(403);
        }

        $meeting->delete();

        return response()->json(null, 204);
    }

    public function token(Request $request, string $id)
    {
        $meeting = Meeting::findOrFail($id);

        if (! $meeting->google_meet_url) {
            return response()->json(['error' => 'Aucune salle configurée.'], 422);
        }

        $jwt = app(JitsiJwtService::class)->generateToken($request->user(), $meeting);

        return response()->json(['token' => $jwt]);
    }

    public function addRecording(Request $request, string $id)
    {
        $meeting = Meeting::findOrFail($id);

        if ($request->user()->id !== $meeting->host_id && $request->user()->role !== 'admin') {
            abort(403);
        }

        $data = $request->validate([
            'recording_url' => 'required|url',
        ]);

        $meeting->update([
            'recording_url' => $data['recording_url'],
            'status'        => 'ended',
        ]);

        return response()->json($meeting);
    }
}
