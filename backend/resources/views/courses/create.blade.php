<x-app-layout>
    <div class="max-w-3xl mx-auto px-4 py-16" x-data="{ lessons: [{ title: '', content: '', video_url: '', duration_min: '' }] }">
        <h1 class="font-outfit text-3xl font-extrabold text-ui-text mb-10">{{ __('nav.courses') }}</h1>

        <form method="POST" action="{{ route('courses.store') }}" enctype="multipart/form-data" class="space-y-6">
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
                <x-input-label for="level" value="{{ app()->getLocale() === 'fr' ? 'Niveau' : 'Level' }}" />
                <select id="level" name="level" class="block mt-1 border-gray-300 rounded-md shadow-sm">
                    <option value="beginner">{{ app()->getLocale() === 'fr' ? 'Débutant' : 'Beginner' }}</option>
                    <option value="intermediate">{{ app()->getLocale() === 'fr' ? 'Intermédiaire' : 'Intermediate' }}</option>
                    <option value="advanced">{{ app()->getLocale() === 'fr' ? 'Avancé' : 'Advanced' }}</option>
                </select>
            </div>

            <div>
                <x-input-label for="thumbnail" value="{{ app()->getLocale() === 'fr' ? 'Vignette' : 'Thumbnail' }}" />
                <input id="thumbnail" type="file" name="thumbnail" accept="image/*" class="block mt-1 w-full text-sm">
                <x-input-error :messages="$errors->get('thumbnail')" class="mt-2" />
            </div>

            <div>
                <div class="flex items-center justify-between mb-3">
                    <x-input-label value="{{ app()->getLocale() === 'fr' ? 'Leçons' : 'Lessons' }}" />
                    <button type="button" @click="lessons.push({ title: '', content: '', video_url: '', duration_min: '' })" class="text-xs font-bold text-accent">+ {{ app()->getLocale() === 'fr' ? 'Ajouter une leçon' : 'Add lesson' }}</button>
                </div>

                <template x-for="(lesson, i) in lessons" :key="i">
                    <div class="border border-ui-border rounded-xl p-4 mb-3 space-y-2">
                        <div class="flex items-center justify-between">
                            <span class="text-xs font-bold text-ui-muted" x-text="`{{ app()->getLocale() === 'fr' ? 'Leçon' : 'Lesson' }} ${i + 1}`"></span>
                            <button type="button" @click="lessons.splice(i, 1)" x-show="lessons.length > 1" class="text-xs text-red-600">{{ app()->getLocale() === 'fr' ? 'Retirer' : 'Remove' }}</button>
                        </div>
                        <input type="text" :name="`lessons[${i}][title]`" x-model="lesson.title" placeholder="{{ app()->getLocale() === 'fr' ? 'Titre de la leçon' : 'Lesson title' }}" class="block w-full border-gray-300 rounded-md shadow-sm text-sm" required>
                        <textarea :name="`lessons[${i}][content]`" x-model="lesson.content" rows="2" placeholder="{{ app()->getLocale() === 'fr' ? 'Contenu' : 'Content' }}" class="block w-full border-gray-300 rounded-md shadow-sm text-sm"></textarea>
                        <div class="flex gap-2">
                            <input type="text" :name="`lessons[${i}][video_url]`" x-model="lesson.video_url" placeholder="Video URL" class="flex-1 border-gray-300 rounded-md shadow-sm text-sm">
                            <input type="number" :name="`lessons[${i}][duration_min]`" x-model="lesson.duration_min" placeholder="min" class="w-20 border-gray-300 rounded-md shadow-sm text-sm">
                        </div>
                    </div>
                </template>
            </div>

            <div>
                <x-input-label for="status" value="{{ app()->getLocale() === 'fr' ? 'Statut' : 'Status' }}" />
                <select id="status" name="status" class="block mt-1 border-gray-300 rounded-md shadow-sm">
                    <option value="draft">{{ app()->getLocale() === 'fr' ? 'Brouillon' : 'Draft' }}</option>
                    <option value="published">{{ app()->getLocale() === 'fr' ? 'Publié' : 'Published' }}</option>
                </select>
            </div>

            <x-primary-button>{{ app()->getLocale() === 'fr' ? 'Publier' : 'Publish' }}</x-primary-button>
        </form>
    </div>
</x-app-layout>
