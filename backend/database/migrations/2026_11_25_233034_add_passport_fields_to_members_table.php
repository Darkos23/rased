<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::table('members', function (Blueprint $table) {
            $table->string('reference_code')->nullable()->after('rank');
            $table->string('country_code', 3)->nullable()->after('nationality_flag');
            $table->string('coordinates_label')->nullable()->after('country_code');
            $table->json('tags')->nullable()->after('coordinates_label');
        });
    }

    public function down(): void
    {
        Schema::table('members', function (Blueprint $table) {
            $table->dropColumn(['reference_code', 'country_code', 'coordinates_label', 'tags']);
        });
    }
};
