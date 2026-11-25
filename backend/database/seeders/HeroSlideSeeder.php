<?php

namespace Database\Seeders;

use App\Models\HeroSlide;
use Illuminate\Database\Seeder;

class HeroSlideSeeder extends Seeder
{
    public function run(): void
    {
        HeroSlide::query()->delete();

        HeroSlide::create([
            'order' => 0,
            'image' => 'rased-doyen-nkc.jpeg',
            'caption_fr' => "Signature du RASED à Nouakchott, en Mauritanie — de gauche à droite : Pr Mohamed Aly Louly, directeur de l'ENS de Nouakchott (Mauritanie) ; Pr Moustapha Sokhna, doyen de la FASTEF-UCAD (Sénégal) ; Pr Abdellatif Kidai, doyen de la Faculté des Sciences de l'Éducation de l'Université Mohammed V de Rabat (Maroc).",
            'caption_en' => "Signing of RASED in Nouakchott, Mauritania — from left to right: Pr Mohamed Aly Louly, Director of ENS Nouakchott (Mauritania); Pr Moustapha Sokhna, Dean of FASTEF-UCAD (Senegal); Pr Abdellatif Kidai, Dean of the Faculty of Educational Sciences, Mohammed V University of Rabat (Morocco).",
        ]);

        HeroSlide::create([
            'order' => 1,
            'image' => 'rased-secretaire-general.jpeg',
            'caption_fr' => 'Abdallahi El Kerim (à gauche), Secrétaire général du RASED.',
            'caption_en' => 'Abdallahi El Kerim (left), Secretary General of RASED.',
        ]);
    }
}
