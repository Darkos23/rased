<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::table('commissions', function (Blueprint $table) {
            $table->string('code')->nullable()->after('order');
            $table->string('tag_fr')->nullable()->after('code');
            $table->string('tag_en')->nullable()->after('tag_fr');
        });
    }

    public function down(): void
    {
        Schema::table('commissions', function (Blueprint $table) {
            $table->dropColumn(['code', 'tag_fr', 'tag_en']);
        });
    }
};
