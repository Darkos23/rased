<x-app-layout>
    <div class="max-w-3xl mx-auto px-4 py-16">
        <h1 class="font-outfit text-3xl font-extrabold text-ui-text mb-10">{{ __('nav.courses') }}</h1>

        <form method="POST" action="{{ route('courses.update', $course->id) }}" enctype="multipart/form-data" class="space-y-6">
            @csrf
            @method('PUT')

            <div>
                <x-input-label for="title" value="{{ app()->getLocale() === 'fr' ? 'Titre' : 'Title' }}" />
                <x-text-input id="title" name="title" class="block mt-1 w-full" :value="old('title', $course->title)" required />
                <x-input-error :messages="$errors->get('title')" class="mt-2" />
            </div>

            <div>
                <x-input-label for="description" value="{{ app()->getLocale() === 'fr' ? 'Description' : 'Description' }}" />
                <textarea id="description" name="description" rows="3" class="block mt-1 w-full border-gray-300 rounded-md shadow-sm">{{ old('description', $course->description) }}</textarea>
            </div>

            <div>
                <x-input-label for="level" value="{{ app()->getLocale() === 'fr' ? 'Niveau' : 'Level' }}" />
                <select id="level" name="level" class="block mt-1 border-gray-300 rounded-md shadow-sm">
                    <option value="beginner" @selected($course->level === 'beginner')>{{ app()->getLocale() === 'fr' ? 'Débutant' : 'Beginner' }}</option>
                    <option value="intermediate" @selected($course->level === 'intermediate')>{{ app()->getLocale() === 'fr' ? 'Intermédiaire' : 'Intermediate' }}</option>
                    <option value="advanced" @selected($course->level === 'advanced')>{{ app()->getLocale() === 'fr' ? 'Avancé' : 'Advanced' }}</option>
                </select>
            </div>

            <div>
                <x-input-label for="thumbnail" value="{{ app()->getLocale() === 'fr' ? 'Vignette' : 'Thumbnail' }}" />
                @if ($course->thumbnail)
                    <img src="{{ $course->thumbnail }}" alt="" class="w-32 h-20 object-cover rounded-lg mt-1 mb-2">
                @endif
                <input id="thumbnail" type="file" name="thumbnail" accept="image/*" class="block mt-1 w-full text-sm">
                <x-input-error :messages="$errors->get('thumbnail')" class="mt-2" />
            </div>

            <div>
                <x-input-label for="status" value="{{ app()->getLocale() === 'fr' ? 'Statut' : 'Status' }}" />
                <select id="status" name="status" class="block mt-1 border-gray-300 rounded-md shadow-sm">
                    <option value="draft" @selected($course->status === 'draft')>{{ app()->getLocale() === 'fr' ? 'Brouillon' : 'Draft' }}</option>
                    <option value="published" @selected($course->status === 'published')>{{ app()->getLocale() === 'fr' ? 'Publié' : 'Published' }}</option>
                </select>
            </div>

            <x-primary-button>{{ app()->getLocale() === 'fr' ? 'Enregistrer' : 'Save' }}</x-primary-button>
        </form>
    </div>
</x-app-layout>
