<?php

namespace Database\Seeders;

use App\Models\Member;
use Illuminate\Database\Seeder;

class MemberSeeder extends Seeder
{
    public function run(): void
    {
        Member::query()->delete();

        Member::create([
            'name' => 'Abdallahi El Kerim',
            'photo' => 'rased-sg-portrait.jpeg',
            'rank' => 1,
            'category_fr' => 'Secrétariat général',
            'category_en' => 'Secretary General',
            'role_fr' => 'Secrétaire général du RASED',
            'role_en' => 'Secretary General of RASED',
            'institution_fr' => 'École Normale Supérieure de Nouakchott',
            'institution_en' => 'École Normale Supérieure, Nouakchott',
            'place' => 'Nouakchott, Mauritanie',
            'nationality_flag' => '🇲🇷',
            'highlights' => [
                ['fr' => "Directeur de la Formation et de la coopération à l'ENS de Nouakchott, depuis 1988", 'en' => 'Director of Training and Cooperation at ENS Nouakchott, since 1988'],
                ['fr' => 'HDR (2018) et Doctorat en sciences de l’éducation (2004), Université Mohammed V, Rabat', 'en' => 'HDR (2018) and PhD in Educational Sciences (2004), Mohammed V University, Rabat'],
                ['fr' => "Membre du Haut Conseil de l'Éducation, Présidence de la République (Mauritanie)", 'en' => 'Member of the Higher Council of Education, Office of the President (Mauritania)'],
                ['fr' => 'Expert et consultant : UNESCO, ISESCO, BID, UNICEF', 'en' => 'Expert and consultant: UNESCO, ISESCO, IDB, UNICEF'],
            ],
        ]);

        Member::create([
            'name' => 'Pr Abdellatif Kidai',
            'photo' => null,
            'rank' => 2,
            'category_fr' => 'Présidence',
            'category_en' => 'Presidency',
            'role_fr' => 'Président du RASED',
            'role_en' => 'President of RASED',
            'institution_fr' => 'Faculté des Sciences de l’Éducation, Université Mohammed V',
            'institution_en' => 'Faculty of Educational Sciences, Mohammed V University',
            'place' => 'Rabat, Maroc',
            'nationality_flag' => null,
            'highlights' => [],
        ]);

        Member::create([
            'name' => 'Pr Moustapha Sokhna',
            'photo' => null,
            'rank' => 3,
            'category_fr' => 'Membre fondateur',
            'category_en' => 'Founding member',
            'role_fr' => 'Doyen de la FASTEF · UCAD',
            'role_en' => 'Dean of FASTEF · UCAD',
            'institution_fr' => 'FASTEF · UCAD',
            'institution_en' => 'FASTEF · UCAD',
            'place' => 'Dakar, Sénégal',
            'nationality_flag' => '🇸🇳',
            'highlights' => [],
        ]);

        Member::create([
            'name' => 'Pr Mohamed Aly Louly',
            'photo' => null,
            'rank' => 3,
            'category_fr' => 'Membre fondateur',
            'category_en' => 'Founding member',
            'role_fr' => 'Directeur de l’ENS de Nouakchott',
            'role_en' => 'Director of ENS Nouakchott',
            'institution_fr' => 'École Normale Supérieure',
            'institution_en' => 'École Normale Supérieure',
            'place' => 'Nouakchott, Mauritanie',
            'nationality_flag' => null,
            'highlights' => [],
        ]);
    }
}
