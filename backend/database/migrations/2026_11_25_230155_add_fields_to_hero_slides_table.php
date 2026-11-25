<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::table('hero_slides', function (Blueprint $table) {
            $table->string('title_fr')->nullable()->after('image');
            $table->string('title_en')->nullable()->after('title_fr');
            $table->string('tag_fr')->nullable()->after('title_en');
            $table->string('tag_en')->nullable()->after('tag_fr');
            $table->string('location_fr')->nullable()->after('tag_en');
            $table->string('location_en')->nullable()->after('location_fr');
        });
    }

    public function down(): void
    {
        Schema::table('hero_slides', function (Blueprint $table) {
            $table->dropColumn(['title_fr', 'title_en', 'tag_fr', 'tag_en', 'location_fr', 'location_en']);
        });
    }
};
