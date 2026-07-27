<?php

namespace App\Http\Controllers;

use App\Models\Article;
use Illuminate\Http\Request;
use Illuminate\Support\Str;

class ArticleController extends Controller
{
    public function index(Request $request)
    {
        $articles = Article::with('author:id,name,avatar')
            ->where('status', 'published')
            ->when($request->search, fn($q, $s) => $q->where(fn($q2) => $q2
                ->where('title', 'ilike', "%{$s}%")
                ->orWhere('body',  'ilike', "%{$s}%")))
            ->when($request->category, fn($q, $c) => $q->where('category', $c))
            ->when($request->lang,     fn($q, $l) => $q->where('lang', $l))
            ->latest()
            ->paginate(12);

        return response()->json($articles);
    }

    public function show(string $slug)
    {
        $article = Article::with('author:id,name,avatar', 'comments.author:id,name,avatar')
            ->where('slug', $slug)
            ->where('status', 'published')
            ->firstOrFail();

        return response()->json($article);
    }

    public function store(Request $request)
    {
        $this->authorizeRole($request, ['admin', 'teacher']);

        if (! $request->user()->hasVerifiedEmail()) {
            return response()->json(['message' => 'Veuillez vérifier votre adresse email avant de publier.'], 403);
        }

        $data = $request->validate([
            'title'     => 'required|string|max:255',
            'body'      => 'required|string',
            'thumbnail' => 'nullable|string',
            'status'    => 'in:draft,published',
            'category'  => 'nullable|string',
            'lang'      => 'in:fr,en',
        ]);

        $article = $request->user()->articles()->create([
            ...$data,
            'slug' => Str::slug($data['title']) . '-' . Str::random(5),
        ]);

        return response()->json($article, 201);
    }

    public function update(Request $request, string $id)
    {
        $article = Article::findOrFail($id);
        $this->authorizeOwnerOrAdmin($request, $article->author_id);

        $data = $request->validate([
            'title'     => 'sometimes|string|max:255',
            'body'      => 'sometimes|string',
            'thumbnail' => 'nullable|string',
            'status'    => 'in:draft,published',
            'category'  => 'nullable|string',
            'lang'      => 'in:fr,en',
        ]);

        $article->update($data);

        return response()->json($article);
    }

    public function destroy(Request $request, string $id)
    {
        $article = Article::findOrFail($id);
        $this->authorizeOwnerOrAdmin($request, $article->author_id);
        $article->delete();

        return response()->json(null, 204);
    }

    private function authorizeRole(Request $request, array $roles)
    {
        if (! in_array($request->user()->role, $roles)) {
            abort(403, 'Action non autorisée.');
        }
    }

    private function authorizeOwnerOrAdmin(Request $request, int $ownerId)
    {
        if ($request->user()->id !== $ownerId && $request->user()->role !== 'admin') {
            abort(403, 'Action non autorisée.');
        }
    }
}
