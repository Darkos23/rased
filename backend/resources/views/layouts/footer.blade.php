<footer class="bg-brand-900 text-white/80">
    <div class="max-w-7xl mx-auto px-4 md:px-12 py-12">
        <div class="flex flex-col md:flex-row md:items-center md:justify-between gap-6">
            <div class="flex items-center gap-3">
                <img src="{{ asset('rased-logo.png') }}" alt="RASED" class="w-10 h-10 rounded-lg bg-white/10 p-1">
                <div>
                    <p class="font-outfit font-bold text-white">RASED</p>
                    <p class="text-xs text-white/50">{{ __('footer.tagline') }}</p>
                </div>
            </div>

            <nav class="flex flex-wrap gap-x-6 gap-y-2 text-sm">
                <a href="{{ url('/') }}" class="hover:text-white transition-colors">{{ __('nav.home') }}</a>
                <a href="{{ route('articles.index') }}" class="hover:text-white transition-colors">{{ __('nav.articles') }}</a>
                <a href="{{ route('membres') }}" class="hover:text-white transition-colors">{{ __('nav.members') }}</a>
            </nav>
        </div>

        <div class="mt-8 pt-6 border-t border-white/10 text-xs text-white/40">
            &copy; {{ date('Y') }} RASED — {{ __('footer.rights') }}
        </div>
    </div>
</footer>
