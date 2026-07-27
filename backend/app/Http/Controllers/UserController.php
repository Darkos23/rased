<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Storage;
use App\Models\User;
use App\Models\Article;
use App\Models\Course;
use App\Models\Meeting;

class UserController extends Controller
{
    public function me(Request $request)
    {
        return response()->json($request->user());
    }

    public function update(Request $request)
    {
        $data = $request->validate([
            'name'   => 'sometimes|string|max:255',
            'bio'    => 'nullable|string',
            'avatar' => 'nullable|string',
            'locale' => 'in:fr,en',
        ]);

        $request->user()->update($data);

        return response()->json($request->user());
    }

    public function uploadAvatar(Request $request)
    {
        $request->validate([
            'avatar' => 'required|image|max:2048', // 2 Mo max
        ]);

        $user = $request->user();

        // Supprimer l'ancien avatar s'il est dans storage
        if ($user->avatar && str_contains($user->avatar, '/storage/avatars/')) {
            $oldPath = 'avatars/' . basename($user->avatar);
            Storage::disk('public')->delete($oldPath);
        }

        $path = $request->file('avatar')->store('avatars', 'public');
        $url  = asset('storage/' . $path);

        $user->update(['avatar' => $url]);

        return response()->json(['url' => $url]);
    }

    public function changePassword(Request $request)
    {
        $data = $request->validate([
            'current_password'      => 'required|string',
            'password'              => 'required|string|min:8|confirmed',
        ]);

        if (! Hash::check($data['current_password'], $request->user()->password)) {
            return response()->json(['message' => 'Mot de passe actuel incorrect.'], 422);
        }

        $request->user()->update(['password' => Hash::make($data['password'])]);

        return response()->json(['message' => 'Mot de passe modifié avec succès.']);
    }

    /* ── Admin : liste des utilisateurs ── */
    public function listUsers(Request $request)
    {
        if ($request->user()->role !== 'admin') {
            return response()->json(['message' => 'Forbidden'], 403);
        }

        $query = User::query()->select('id', 'name', 'email', 'role', 'avatar', 'created_at');

        if ($search = $request->query('search')) {
            $query->where(function ($q) use ($search) {
                $q->where('name', 'ilike', "%{$search}%")
                  ->orWhere('email', 'ilike', "%{$search}%");
            });
        }

        if ($role = $request->query('role')) {
            $query->where('role', $role);
        }

        return response()->json($query->latest()->paginate(15));
    }

    /* ── Admin : changer le rôle d'un utilisateur ── */
    public function updateRole(Request $request, $id)
    {
        if ($request->user()->role !== 'admin') {
            return response()->json(['message' => 'Forbidden'], 403);
        }

        $data = $request->validate([
            'role' => 'required|in:admin,teacher,researcher',
        ]);

        $user = User::findOrFail($id);

        if ($user->id === $request->user()->id) {
            return response()->json(['message' => 'Vous ne pouvez pas modifier votre propre rôle.'], 422);
        }

        $user->update(['role' => $data['role']]);

        return response()->json($user);
    }

    /* ── Admin : supprimer un utilisateur ── */
    public function destroyUser(Request $request, $id)
    {
        if ($request->user()->role !== 'admin') {
            return response()->json(['message' => 'Forbidden'], 403);
        }

        $user = User::findOrFail($id);

        if ($user->id === $request->user()->id) {
            return response()->json(['message' => 'Vous ne pouvez pas supprimer votre propre compte.'], 422);
        }

        // Supprimer avatar si local
        if ($user->avatar && str_contains($user->avatar, '/storage/avatars/')) {
            Storage::disk('public')->delete('avatars/' . basename($user->avatar));
        }

        $user->delete();

        return response()->json(['message' => 'Utilisateur supprimé.']);
    }

    public function dashboard(Request $request)
    {
        $user = $request->user();

        return match ($user->role) {
            'admin' => response()->json([
                'role'        => 'admin',
                'articles'    => Article::count(),
                'courses'     => Course::count(),
                'meetings'    => Meeting::count(),
                'researchers' => User::where('role', 'researcher')->count(),
                'teachers'    => User::where('role', 'teacher')->count(),
            ]),
            'teacher' => response()->json([
                'role'        => 'teacher',
                'my_courses'  => $user->courses()->latest()->take(5)->get(),
                'my_articles' => $user->articles()->latest()->take(5)->get(),
                'my_meetings' => $user->meetings()->orderBy('scheduled_at')->take(5)->get(),
            ]),
            'researcher' => response()->json([
                'role'        => 'researcher',
                'my_articles' => $user->articles()->latest()->take(5)->get(),
                'upcoming'    => Meeting::where('status', 'scheduled')
                                    ->orderBy('scheduled_at')
                                    ->take(5)->get(),
            ]),
            default => response()->json(['role' => $user->role]),
        };
    }
}
