<x-app-layout>
    <div class="max-w-3xl mx-auto px-4 py-16">
        <h1 class="font-outfit text-3xl font-extrabold text-ui-text mb-10">{{ __('nav.meetings') }}</h1>

        <form method="POST" action="{{ route('meetings.store') }}" class="space-y-6">
            @csrf

            <div>
                <x-input-label for="title" value="{{ app()->getLocale() === 'fr' ? 'Titre' : 'Title' }}" />
                <x-text-input id="title" name="title" class="block mt-1 w-full" :value="old('title')" required />
                <x-input-error :messages="$errors->get('title')" class="mt-2" />
            </div>

            <div>
                <x-input-label for="description" value="{{ app()->getLocale() === 'fr' ? 'Description' : 'Description' }}" />
                <textarea id="description" name="description" rows="3" class="block mt-1 w-full border-gray-300 rounded-md shadow-sm">{{ old('description') }}</textarea>
            </div>

            <div>
                <x-input-label for="scheduled_at" value="{{ app()->getLocale() === 'fr' ? 'Date et heure' : 'Date and time' }}" />
                <input type="datetime-local" id="scheduled_at" name="scheduled_at" value="{{ old('scheduled_at') }}" class="block mt-1 w-full border-gray-300 rounded-md shadow-sm" required>
                <x-input-error :messages="$errors->get('scheduled_at')" class="mt-2" />
            </div>

            <x-primary-button>{{ app()->getLocale() === 'fr' ? 'Planifier' : 'Schedule' }}</x-primary-button>
        </form>
    </div>
</x-app-layout>
