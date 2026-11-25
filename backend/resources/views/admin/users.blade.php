<x-app-layout>
    <div class="max-w-5xl mx-auto px-4 py-16">
        <h1 class="font-outfit text-3xl font-extrabold text-ui-text mb-10">{{ __('nav.admin_users') }}</h1>

        @if (session('status') === 'role-updated')
            <p class="mb-6 text-sm font-medium text-brand-700">{{ app()->getLocale() === 'fr' ? 'Rôle mis à jour.' : 'Role updated.' }}</p>
        @elseif (session('status') === 'user-deleted')
            <p class="mb-6 text-sm font-medium text-brand-700">{{ app()->getLocale() === 'fr' ? 'Utilisateur supprimé.' : 'User deleted.' }}</p>
        @endif

        <form method="GET" class="flex gap-3 mb-6">
            <input type="text" name="search" value="{{ request('search') }}" placeholder="{{ app()->getLocale() === 'fr' ? 'Rechercher...' : 'Search...' }}" class="border-gray-300 rounded-md shadow-sm text-sm flex-1">
            <select name="role" class="border-gray-300 rounded-md shadow-sm text-sm" onchange="this.form.submit()">
                <option value="">{{ app()->getLocale() === 'fr' ? 'Tous les rôles' : 'All roles' }}</option>
                <option value="admin" @selected(request('role') === 'admin')>Admin</option>
                <option value="teacher" @selected(request('role') === 'teacher')>{{ app()->getLocale() === 'fr' ? 'Enseignant' : 'Teacher' }}</option>
                <option value="researcher" @selected(request('role') === 'researcher')>{{ app()->getLocale() === 'fr' ? 'Chercheur' : 'Researcher' }}</option>
            </select>
        </form>

        <div class="overflow-x-auto rounded-2xl border border-ui-border">
            <table class="w-full text-sm">
                <thead class="bg-ui-bg text-ui-muted text-xs uppercase">
                    <tr>
                        <th class="text-left px-4 py-3">{{ app()->getLocale() === 'fr' ? 'Nom' : 'Name' }}</th>
                        <th class="text-left px-4 py-3">Email</th>
                        <th class="text-left px-4 py-3">{{ app()->getLocale() === 'fr' ? 'Rôle' : 'Role' }}</th>
                        <th class="px-4 py-3"></th>
                    </tr>
                </thead>
                <tbody class="divide-y divide-ui-border">
                    @foreach ($users as $u)
                        <tr>
                            <td class="px-4 py-3 font-medium text-ui-text">{{ $u->name }}</td>
                            <td class="px-4 py-3 text-ui-muted">{{ $u->email }}</td>
                            <td class="px-4 py-3">
                                @if ($u->id !== auth()->id())
                                    <form method="POST" action="{{ route('admin.users.role', $u->id) }}">
                                        @csrf
                                        @method('PUT')
                                        <select name="role" onchange="this.form.submit()" class="border-gray-300 rounded-md shadow-sm text-xs">
                                            <option value="admin" @selected($u->role === 'admin')>Admin</option>
                                            <option value="teacher" @selected($u->role === 'teacher')>{{ app()->getLocale() === 'fr' ? 'Enseignant' : 'Teacher' }}</option>
                                            <option value="researcher" @selected($u->role === 'researcher')>{{ app()->getLocale() === 'fr' ? 'Chercheur' : 'Researcher' }}</option>
                                        </select>
                                    </form>
                                @else
                                    <span class="text-xs text-ui-muted">{{ $u->role }}</span>
                                @endif
                            </td>
                            <td class="px-4 py-3 text-right">
                                @if ($u->id !== auth()->id())
                                    <form method="POST" action="{{ route('admin.users.destroy', $u->id) }}" onsubmit="return confirm('{{ app()->getLocale() === 'fr' ? 'Supprimer cet utilisateur ?' : 'Delete this user?' }}')">
                                        @csrf
                                        @method('DELETE')
                                        <button type="submit" class="text-xs font-bold text-red-600">{{ app()->getLocale() === 'fr' ? 'Supprimer' : 'Delete' }}</button>
                                    </form>
                                @endif
                            </td>
                        </tr>
                    @endforeach
                </tbody>
            </table>
        </div>

        <div class="mt-6">{{ $users->links() }}</div>
    </div>
</x-app-layout>
