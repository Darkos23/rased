<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('members', function (Blueprint $table) {
            $table->id();
            $table->string('name');
            $table->string('photo')->nullable();
            $table->unsignedInteger('rank');
            $table->string('category_fr');
            $table->string('category_en');
            $table->string('role_fr');
            $table->string('role_en');
            $table->string('institution_fr')->nullable();
            $table->string('institution_en')->nullable();
            $table->string('place')->nullable();
            $table->string('nationality_flag')->nullable();
            $table->json('highlights')->nullable();
            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('members');
    }
};
