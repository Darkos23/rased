# Projet Fastef

Bienvenue sur le dépôt du projet **Fastef**. Il s'agit d'une application web complète (Full-stack) séparée en deux parties distinctes :
- **Un Backend (API)** : développé avec le framework PHP **Laravel**.
- **Un Frontend (Interface Utilisateur)** : développé avec le framework React **Next.js**.

---

## 🛠️ Prérequis

Avant de lancer le projet, assurez-vous d'avoir installé sur votre machine :
- **PHP** (version 8.3 ou supérieure) et **Composer**
- **Node.js** (version 18 ou supérieure) et **npm**

---

## 🚀 Installation et Démarrage

Pour faire fonctionner le projet sur votre ordinateur, vous devez lancer le Backend et le Frontend en même temps.

### 1. Démarrer le Backend (Laravel)

Ouvrez un terminal et exécutez les commandes suivantes :

```bash
# Aller dans le dossier du backend
cd backend

# Installer les dépendances PHP
composer install

# Créer le fichier de configuration environnement
cp .env.example .env

# Générer la clé de sécurité de l'application
php artisan key:generate

# Préparer la base de données
php artisan migrate

# Lancer le serveur local
php artisan serve
```
✅ Le serveur API sera accessible à l'adresse : **http://localhost:8000**

---

### 2. Démarrer le Frontend (Next.js)

Ouvrez un **deuxième terminal** et exécutez ces commandes :

```bash
# Aller dans le dossier du frontend
cd frontend

# Installer les dépendances JavaScript
npm install

# Lancer le serveur de développement
npm run dev
```
✅ L'interface utilisateur sera accessible à l'adresse : **http://localhost:3000**

---

## 📚 Technologies utilisées

- **Backend :** Laravel 13, Sanctum (Authentification), SQLite / Eloquent ORM.
- **Frontend :** Next.js 16 (React), TypeScript, Tailwind CSS, Zod & React Hook Form.
