FROM php:8.3-apache

# Installer les dépendances système et extensions PHP nécessaires
RUN apt-get update && apt-get install -y \
    libpng-dev \
    libjpeg-dev \
    libfreetype6-dev \
    libzip-dev \
    libpq-dev \
    zip \
    unzip \
    && docker-php-ext-configure gd --with-freetype --with-jpeg \
    && docker-php-ext-install gd pdo pdo_mysql pdo_pgsql zip

# Activer le module Apache Rewrite (nécessaire pour Laravel)
RUN a2enmod rewrite

# Configurer Apache pour écouter sur le port dynamique fourni par Render ($PORT)
ENV PORT=10000
RUN sed -i "s/Listen 80/Listen \${PORT}/g" /etc/apache2/ports.conf
RUN sed -i "s/<VirtualHost \*:80>/<VirtualHost \*:\${PORT}>/g" /etc/apache2/sites-available/000-default.conf

# Définir le dossier public de Laravel comme racine du site web
ENV APACHE_DOCUMENT_ROOT /var/www/html/public
RUN sed -ri -e 's!/var/www/html!${APACHE_DOCUMENT_ROOT}!g' /etc/apache2/sites-available/*.conf
RUN sed -ri -e 's!/var/www/!${APACHE_DOCUMENT_ROOT}!g' /etc/apache2/apache2.conf /etc/apache2/conf-available/*.conf

# Copier le code de l'application
WORKDIR /var/www/html
COPY . .

# Installer Composer et les dépendances du projet
COPY --from=composer:latest /usr/bin/composer /usr/bin/composer
RUN composer install --no-dev --optimize-autoloader

# Donner les permissions adéquates aux dossiers de cache et de stockage
RUN chown -R www-data:www-data /var/www/html/storage /var/www/html/bootstrap/cache

# Exposer le port
EXPOSE ${PORT}
