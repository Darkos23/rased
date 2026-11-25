<x-app-layout>
    <div class="max-w-3xl mx-auto px-4 py-16">
        <h1 class="font-outfit text-3xl font-extrabold text-ui-text mb-10">{{ __('nav.articles') }}</h1>

        <form method="POST" action="{{ route('articles.update', $article->id) }}" enctype="multipart/form-data" class="space-y-6">
            @csrf
            @method('PUT')

            <div>
                <x-input-label for="title" value="{{ app()->getLocale() === 'fr' ? 'Titre' : 'Title' }}" />
                <x-text-input id="title" name="title" class="block mt-1 w-full" :value="old('title', $article->title)" required />
                <x-input-error :messages="$errors->get('title')" class="mt-2" />
            </div>

            <div>
                <x-input-label for="category" value="{{ app()->getLocale() === 'fr' ? 'Catégorie' : 'Category' }}" />
                <x-text-input id="category" name="category" class="block mt-1 w-full" :value="old('category', $article->category)" />
            </div>

            <div>
                <x-input-label for="thumbnail" value="{{ app()->getLocale() === 'fr' ? 'Vignette' : 'Thumbnail' }}" />
                @if ($article->thumbnail)
                    <img src="{{ $article->thumbnail }}" alt="" class="w-32 h-20 object-cover rounded-lg mt-1 mb-2">
                @endif
                <input id="thumbnail" type="file" name="thumbnail" accept="image/*" class="block mt-1 w-full text-sm">
                <x-input-error :messages="$errors->get('thumbnail')" class="mt-2" />
            </div>

            <div x-data="richTextEditor(@js(old('body', $article->body)))" x-init="$watch('value', v => $refs.bodyInput.value = v)">
                <x-input-label value="{{ app()->getLocale() === 'fr' ? 'Contenu' : 'Content' }}" />
                <input type="hidden" name="body" x-ref="bodyInput" :value="value" required>

                <div class="flex flex-wrap gap-1 border border-b-0 border-gray-300 rounded-t-md p-2 bg-ui-bg">
                    <button type="button" @click="run(c => c.toggleBold())" :class="isActive('bold') && 'bg-brand-100'" class="px-2 py-1 rounded text-sm font-bold">B</button>
                    <button type="button" @click="run(c => c.toggleItalic())" :class="isActive('italic') && 'bg-brand-100'" class="px-2 py-1 rounded text-sm italic">I</button>
                    <button type="button" @click="run(c => c.toggleUnderline())" :class="isActive('underline') && 'bg-brand-100'" class="px-2 py-1 rounded text-sm underline">U</button>
                    <button type="button" @click="run(c => c.toggleHeading({ level: 2 }))" :class="isActive('heading', { level: 2 }) && 'bg-brand-100'" class="px-2 py-1 rounded text-sm font-bold">H2</button>
                    <button type="button" @click="run(c => c.toggleHeading({ level: 3 }))" :class="isActive('heading', { level: 3 }) && 'bg-brand-100'" class="px-2 py-1 rounded text-sm font-bold">H3</button>
                    <button type="button" @click="run(c => c.toggleBulletList())" :class="isActive('bulletList') && 'bg-brand-100'" class="px-2 py-1 rounded text-sm">• List</button>
                    <button type="button" @click="run(c => c.toggleOrderedList())" :class="isActive('orderedList') && 'bg-brand-100'" class="px-2 py-1 rounded text-sm">1. List</button>
                    <button type="button" @click="run(c => c.toggleBlockquote())" :class="isActive('blockquote') && 'bg-brand-100'" class="px-2 py-1 rounded text-sm">"</button>
                    <button type="button" @click="setLink()" :class="isActive('link') && 'bg-brand-100'" class="px-2 py-1 rounded text-sm">Link</button>
                    <button type="button" @click="run(c => c.undo())" class="px-2 py-1 rounded text-sm">↺</button>
                    <button type="button" @click="run(c => c.redo())" class="px-2 py-1 rounded text-sm">↻</button>
                </div>
                <div x-ref="editorEl" class="prose max-w-none border border-gray-300 rounded-b-md p-4 min-h-[300px] focus:outline-none"></div>
                <x-input-error :messages="$errors->get('body')" class="mt-2" />
            </div>

            <div>
                <x-input-label for="status" value="{{ app()->getLocale() === 'fr' ? 'Statut' : 'Status' }}" />
                <select id="status" name="status" class="block mt-1 border-gray-300 rounded-md shadow-sm">
                    <option value="draft" @selected($article->status === 'draft')>{{ app()->getLocale() === 'fr' ? 'Brouillon' : 'Draft' }}</option>
                    <option value="published" @selected($article->status === 'published')>{{ app()->getLocale() === 'fr' ? 'Publié' : 'Published' }}</option>
                </select>
            </div>

            <x-primary-button>{{ app()->getLocale() === 'fr' ? 'Enregistrer' : 'Save' }}</x-primary-button>
        </form>
    </div>
</x-app-layout>
