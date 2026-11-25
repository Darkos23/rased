# Projet RASED - Spécifications Techniques

Ce document s'adresse aux équipes techniques et d'infrastructure chargées d'évaluer et de déployer le projet **RASED**.

## Description du Projet

RASED est une plateforme web de gestion de contenus et processus académiques (articles, cours, réunions, membres, commissions). C'est une application **Laravel monolithique** : un seul bloc PHP, sans serveur Node.js séparé en production.

---

## Architecture et Stack Technologique

- **Framework :** Laravel (version 13.x)
- **Langage :** PHP `^8.3`
- **Frontend :** Vues Blade + Alpine.js (interactivité) + Tailwind CSS (via Vite, compilé au build, pas de runtime Node.js en production)
- **Éditeur riche :** TipTap (bundlé via Vite, utilisé uniquement sur les pages de création/édition d'articles)
- **Authentification :** Sessions Laravel (Breeze)
- **Base de données :** MySQL/MariaDB ou PostgreSQL (via Eloquent ORM)

---

## Prérequis d'Hébergement (Production)

- **Serveur Web :** Apache (avec `mod_rewrite` activé) ou Nginx.
- **PHP :** Version `8.3` ou supérieure.
- **Extensions PHP requises :** Ctype, cURL, DOM, Fileinfo, Filter, Hash, Mbstring, OpenSSL, PCRE, PDO, Session, Tokenizer, XML (standards Laravel).
- **Gestionnaire de dépendances :** Composer (installation initiale uniquement — pas requis en production si `vendor/` est déployé tel quel).
- **Base de données :** MySQL `8.0+`, MariaDB `10.3+` ou PostgreSQL.
- **Node.js :** requis uniquement en local/CI pour `npm run build` (Vite) — **jamais** en production.

---

## Processus de Déploiement

Le dossier `backend/` est l'intégralité du projet. Sur un hébergement mutualisé où le document root pointe sur `public_html/` (sans possibilité de le rediriger vers `backend/public/`), le dépôt inclut déjà le nécessaire pour déployer **le contenu de `backend/` directement dans `public_html/`** :

- `backend/index.php` (racine) : point d'entrée qui boote Laravel depuis la racine du projet au lieu de `public/`.
- `backend/.htaccess` (racine) : bloque l'accès direct aux dossiers sensibles (`app/`, `vendor/`, etc.) et sert les fichiers statiques de `public/` de façon transparente.

### Étapes

1. Cloner/uploader le contenu de `backend/` à la racine de `public_html/`.
2. `composer install --optimize-autoloader --no-dev`
3. `cp .env.example .env` puis configurer les identifiants de base de données, `APP_URL`, etc.
4. `php artisan key:generate`
5. `php artisan migrate --force` (et `php artisan db:seed --force` si des données de démonstration/réelles sont nécessaires)
6. `ln -s ../storage/app/public public/storage` (ou `php artisan storage:link` si l'environnement le permet)
7. En local (avant upload) : `npm install && npm run build` — commit/upload le dossier `public/build/` généré.

Si l'hébergement permet de pointer le document root directement sur `backend/public/` (VPS, Hostinger Node.js App non nécessaire ici puisque tout est PHP), l'étape du `index.php`/`.htaccess` racine n'est pas nécessaire : la structure Laravel standard suffit.
