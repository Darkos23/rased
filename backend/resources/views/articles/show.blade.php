<x-app-layout>
    <div class="max-w-3xl mx-auto px-4 py-16">
        @if ($article->thumbnail)
            <img src="{{ $article->thumbnail }}" alt="" class="w-full h-64 object-cover rounded-2xl mb-8">
        @endif

        @if ($article->category)
            <p class="text-[10px] font-bold text-accent uppercase tracking-[0.2em] mb-3">{{ $article->category }}</p>
        @endif

        <h1 class="font-outfit text-3xl font-extrabold text-ui-text mb-3">{{ $article->title }}</h1>
        <p class="text-sm text-ui-muted mb-10">{{ $article->author->name }} · {{ $article->created_at->format('d/m/Y') }}</p>

        <div class="prose max-w-none text-ui-text">
            {!! $article->body !!}
        </div>

        @auth
            @if (auth()->id() === $article->author_id || auth()->user()->isAdmin())
                <div class="mt-10 pt-6 border-t border-ui-border flex gap-4">
                    <a href="{{ route('articles.edit', $article->slug) }}" class="text-sm font-bold text-accent">{{ app()->getLocale() === 'fr' ? 'Modifier' : 'Edit' }}</a>
                    <form method="POST" action="{{ route('articles.destroy', $article->id) }}" onsubmit="return confirm('{{ app()->getLocale() === 'fr' ? 'Supprimer cet article ?' : 'Delete this article?' }}')">
                        @csrf
                        @method('DELETE')
                        <button type="submit" class="text-sm font-bold text-red-600">{{ app()->getLocale() === 'fr' ? 'Supprimer' : 'Delete' }}</button>
                    </form>
                </div>
            @endif
        @endauth
    </div>
</x-app-layout>
