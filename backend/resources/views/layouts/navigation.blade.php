<nav x-data="{ open: false }" class="bg-ui-panel border-b border-ui-border sticky top-0 z-30">
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div class="flex justify-between h-16">
            <div class="flex">
                <div class="shrink-0 flex items-center gap-2">
                    <a href="{{ url('/') }}" class="flex items-center gap-2">
                        <img src="{{ asset('rased-logo.png') }}" alt="RASED" class="h-9 w-auto">
                        <span class="font-outfit font-extrabold text-ui-text hidden sm:inline">RASED</span>
                    </a>
                </div>

                <div class="hidden space-x-6 sm:-my-px sm:ms-10 sm:flex items-center">
                    <x-nav-link :href="url('/')" :active="request()->routeIs('home')">{{ __('nav.home') }}</x-nav-link>
                    <x-nav-link :href="route('articles.index')" :active="request()->routeIs('articles.*')">{{ __('nav.articles') }}</x-nav-link>
                    <x-nav-link :href="route('membres')" :active="request()->routeIs('membres')">{{ __('nav.members') }}</x-nav-link>
                    <x-nav-link :href="route('commissions')" :active="request()->routeIs('commissions')">{{ __('nav.commissions') }}</x-nav-link>
                </div>
            </div>

            <div class="hidden sm:flex sm:items-center sm:ms-6 gap-3">
                <!-- Language switcher -->
                <div class="flex items-center text-xs font-bold text-ui-muted">
                    <a href="{{ route('lang.switch', 'fr') }}" class="px-2 py-1 rounded {{ app()->getLocale() === 'fr' ? 'bg-brand-50 text-brand-700' : 'hover:text-ui-text' }}">FR</a>
                    <span class="text-ui-border">/</span>
                    <a href="{{ route('lang.switch', 'en') }}" class="px-2 py-1 rounded {{ app()->getLocale() === 'en' ? 'bg-brand-50 text-brand-700' : 'hover:text-ui-text' }}">EN</a>
                </div>

                @auth
                    <x-dropdown align="right" width="48">
                        <x-slot name="trigger">
                            <button class="inline-flex items-center px-3 py-2 border border-transparent text-sm leading-4 font-medium rounded-md text-ui-muted bg-white hover:text-ui-text focus:outline-none transition ease-in-out duration-150">
                                <div>{{ Auth::user()->name }}</div>
                                <div class="ms-1">
                                    <svg class="fill-current h-4 w-4" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20">
                                        <path fill-rule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clip-rule="evenodd" />
                                    </svg>
                                </div>
                            </button>
                        </x-slot>
                        <x-slot name="content">
                            <x-dropdown-link :href="route('dashboard')">{{ __('nav.dashboard') }}</x-dropdown-link>
                            <x-dropdown-link :href="route('profile.edit')">{{ __('nav.profile') }}</x-dropdown-link>
                            @if(Auth::user()->isAdmin())
                                <x-dropdown-link :href="route('admin.users')">{{ __('nav.admin_users') }}</x-dropdown-link>
                            @endif
                            <form method="POST" action="{{ route('logout') }}">
                                @csrf
                                <x-dropdown-link :href="route('logout')" onclick="event.preventDefault(); this.closest('form').submit();">
                                    {{ __('nav.logout') }}
                                </x-dropdown-link>
                            </form>
                        </x-slot>
                    </x-dropdown>
                @else
                    <a href="{{ route('login') }}" class="text-sm font-medium text-ui-muted hover:text-ui-text">{{ __('nav.login') }}</a>
                    <a href="{{ route('register') }}" class="text-sm font-bold bg-brand-600 text-white px-4 py-2 rounded-full hover:bg-brand-700 transition">{{ __('nav.register') }}</a>
                @endauth
            </div>

            <div class="-me-2 flex items-center sm:hidden">
                <button @click="open = ! open" class="inline-flex items-center justify-center p-2 rounded-md text-ui-muted hover:text-ui-text hover:bg-ui-bg focus:outline-none transition duration-150 ease-in-out">
                    <svg class="h-6 w-6" stroke="currentColor" fill="none" viewBox="0 0 24 24">
                        <path :class="{'hidden': open, 'inline-flex': ! open }" class="inline-flex" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6h16M4 12h16M4 18h16" />
                        <path :class="{'hidden': ! open, 'inline-flex': open }" class="hidden" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
                    </svg>
                </button>
            </div>
        </div>
    </div>

    <div :class="{'block': open, 'hidden': ! open}" class="hidden sm:hidden">
        <div class="pt-2 pb-3 space-y-1">
            <x-responsive-nav-link :href="url('/')">{{ __('nav.home') }}</x-responsive-nav-link>
            <x-responsive-nav-link :href="route('articles.index')">{{ __('nav.articles') }}</x-responsive-nav-link>
            <x-responsive-nav-link :href="route('membres')">{{ __('nav.members') }}</x-responsive-nav-link>
            <x-responsive-nav-link :href="route('commissions')">{{ __('nav.commissions') }}</x-responsive-nav-link>
        </div>

        <div class="pt-4 pb-1 border-t border-ui-border">
            @auth
                <div class="px-4">
                    <div class="font-medium text-base text-ui-text">{{ Auth::user()->name }}</div>
                    <div class="font-medium text-sm text-ui-muted">{{ Auth::user()->email }}</div>
                </div>
                <div class="mt-3 space-y-1">
                    <x-responsive-nav-link :href="route('dashboard')">{{ __('nav.dashboard') }}</x-responsive-nav-link>
                    <x-responsive-nav-link :href="route('profile.edit')">{{ __('nav.profile') }}</x-responsive-nav-link>
                    <form method="POST" action="{{ route('logout') }}">
                        @csrf
                        <x-responsive-nav-link :href="route('logout')" onclick="event.preventDefault(); this.closest('form').submit();">
                            {{ __('nav.logout') }}
                        </x-responsive-nav-link>
                    </form>
                </div>
            @else
                <div class="mt-3 space-y-1">
                    <x-responsive-nav-link :href="route('login')">{{ __('nav.login') }}</x-responsive-nav-link>
                    <x-responsive-nav-link :href="route('register')">{{ __('nav.register') }}</x-responsive-nav-link>
                </div>
            @endauth
        </div>
    </div>
</nav>
