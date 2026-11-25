<?php

// Point d'entrée racine — Hostinger sert public_html/ au lieu de public_html/public/
// Ce fichier relaie toutes les requêtes vers public/index.php sans changer REQUEST_URI.

use Illuminate\Foundation\Application;
use Illuminate\Http\Request;

define('LARAVEL_START', microtime(true));

// Maintenance mode
if (file_exists($maintenance = __DIR__ . '/storage/framework/maintenance.php')) {
    require $maintenance;
}

// Autoload
require __DIR__ . '/vendor/autoload.php';

// Boot Laravel depuis la racine (chemins déjà relatifs à la racine du projet)
/** @var Application $app */
$app = require_once __DIR__ . '/bootstrap/app.php';

$app->handleRequest(Request::capture());
