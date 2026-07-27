# Projet Fastef - Spécifications Techniques

Ce document s'adresse aux équipes techniques et d'infrastructure chargées d'évaluer et de déployer le projet **Fastef** sur les serveurs de l'UCAD.

## 🎯 Description du Projet
L'application Fastef est une plateforme web moderne conçue pour gérer des contenus et processus spécifiques à la faculté. Son architecture repose sur un modèle **Client-Serveur Découplé**, séparant un Backend orienté API (Headless) et un Frontend réactif gérant l'interface utilisateur.

---

## 🏗️ Architecture et Stack Technologique

### 1. Backend (Moteur API REST)
Le backend sert exclusivement d'API pour le frontend. Il gère la logique métier, l'authentification et l'accès à la base de données.
- **Framework :** Laravel (version 13.x)
- **Langage :** PHP `^8.3`
- **Authentification :** Laravel Sanctum (sécurisation par tokens API pour Single Page Applications)
- **Base de données :** Compatible avec MySQL, PostgreSQL ou SQLite (via Eloquent ORM). 

### 2. Frontend (Interface Utilisateur)
Le frontend consomme l'API Laravel et se charge du rendu de l'application côté client/serveur.
- **Framework :** Next.js `16.x`
- **Langage :** TypeScript / JavaScript
- **Librairies clés :** React `19.x`, Tailwind CSS `4.x` (UI), NextAuth (Sessions), Zod (Validation de données).

---

## ⚙️ Prérequis d'Hébergement (Production)

Pour héberger ce projet dans vos infrastructures, voici les prérequis serveurs :

### Environnement Backend (API)
Nécessite un serveur web classique capable d'exécuter PHP moderne.
- **Serveur Web :** Nginx ou Apache (avec mod_rewrite activé).
- **PHP :** Version `8.3` ou supérieure.
- **Extensions PHP requises :** Ctype, cURL, DOM, Fileinfo, Filter, Hash, Mbstring, OpenSSL, PCRE, PDO, Session, Tokenizer, XML (Standards Laravel).
- **Gestionnaire de dépendances :** Composer (pour l'installation initiale).
- **Base de données :** MySQL `8.0+`, MariaDB `10.3+` ou PostgreSQL.

### Environnement Frontend (Next.js)
Next.js utilise le rendu hybride (SSR - Server Side Rendering) et nécessite donc un environnement d'exécution Node.js en production, et non un simple serveur de fichiers statiques.
- **Moteur d'exécution :** Node.js `18.x` ou supérieur.
- **Gestionnaire de processus :** Utilisation recommandée de **PM2** (ou Docker) pour maintenir le processus Node (`npm run start`) actif en arrière-plan.
- **Reverse Proxy :** Configurer Nginx ou Apache pour rediriger le trafic HTTP (port 80/443) vers le port local de l'application Next.js (généralement `3000`).

---

## 📦 Processus de Déploiement Simplifié

1. **Backend :** Cloner le dossier `backend`, exécuter `composer install --optimize-autoloader --no-dev`, configurer le `.env` pour la base de données de production, et pointer le serveur web (Nginx/Apache) sur le dossier `backend/public`.
2. **Frontend :** Cloner le dossier `frontend`, exécuter `npm install`, configurer le `.env` pour pointer vers l'URL publique de l'API Laravel, puis builder le projet avec `npm run build`. Enfin, lancer l'application via `pm2 start npm --name "fastef-front" -- run start`.
