<x-app-layout>
    <div class="max-w-5xl mx-auto px-4 py-16">
        <div class="flex items-center justify-between mb-10">
            <h1 class="font-outfit text-3xl font-extrabold text-ui-text">{{ __('nav.articles') }}</h1>
            @auth
                @if (in_array(auth()->user()->role, ['admin', 'teacher']))
                    <a href="{{ route('articles.create') }}" class="text-sm font-bold bg-brand-600 text-white px-4 py-2 rounded-full hover:bg-brand-700 transition">+ {{ app()->getLocale() === 'fr' ? 'Nouvel article' : 'New article' }}</a>
                @endif
            @endauth
        </div>

        <div class="grid sm:grid-cols-2 gap-6">
            @forelse ($articles as $article)
                <a href="{{ route('articles.show', $article->slug) }}" class="block rounded-2xl border border-ui-border overflow-hidden hover:shadow-lg hover:-translate-y-1 transition-all duration-300 bg-ui-panel">
                    @if ($article->thumbnail)
                        <img src="{{ $article->thumbnail }}" alt="" class="w-full h-40 object-cover">
                    @else
                        <div class="w-full h-40 bg-brand-50"></div>
                    @endif
                    <div class="p-5">
                        @if ($article->category)
                            <p class="text-[10px] font-bold text-accent uppercase tracking-[0.2em] mb-2">{{ $article->category }}</p>
                        @endif
                        <h2 class="font-outfit text-lg font-bold text-ui-text leading-snug">{{ $article->title }}</h2>
                        <p class="text-xs text-ui-muted mt-2">{{ $article->author->name }} · {{ $article->created_at->format('d/m/Y') }}</p>
                    </div>
                </a>
            @empty
                <p class="text-ui-muted col-span-2">{{ __('nav.articles') }} — {{ __('members.progressive_note') }}</p>
            @endforelse
        </div>

        <div class="mt-10">{{ $articles->links() }}</div>
    </div>
</x-app-layout>
