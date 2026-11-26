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
            'name' => 'Pr Abdellatif Kidai',
            'photo' => 'portrait-kidai.jpg',
            'rank' => 1,
            'reference_code' => 'RASED · PRES-001',
            'category_fr' => 'Présidence',
            'category_en' => 'Presidency',
            'role_fr' => 'Président du RASED · Doyen de la FSE',
            'role_en' => 'President of RASED · Dean of FSE',
            'institution_fr' => 'Faculté des Sciences de l’Éducation, Université Mohammed V',
            'institution_en' => 'Faculty of Education Sciences, Mohammed V University',
            'place' => 'Rabat, Maroc',
            'nationality_flag' => '🇲🇦',
            'country_code' => 'MAR',
            'coordinates_label' => '34°01′N · 06°50′W',
            'tags' => ['Politiques éducatives', 'Gouvernance', 'Mutations sociales'],
            'highlights' => [
                ['fr' => 'Président en exercice du Réseau Africain des Sciences de l’Éducation (RASED)', 'en' => 'Sitting President of the African Network of Education Sciences (RASED)'],
                ['fr' => 'Doyen de la Faculté des Sciences de l’Éducation (FSE) de l’Université Mohammed V de Rabat', 'en' => 'Dean of the Faculty of Education Sciences (FSE), Mohammed V University, Rabat'],
                ['fr' => 'Co-signataire de l’acte constitutif du RASED à Nouakchott', 'en' => 'Co-signatory of the RASED founding act in Nouakchott'],
                ['fr' => 'Spécialiste des politiques éducatives, des mutations sociales et de la gouvernance universitaire', 'en' => 'Specialist in educational policy, social change, and university governance'],
            ],
        ]);

        Member::create([
            'name' => 'Abdallahi El Kerim',
            'photo' => 'rased-sg-portrait.jpeg',
            'rank' => 2,
            'reference_code' => 'RASED · SG-002',
            'category_fr' => 'Secrétariat général',
            'category_en' => 'Secretary General',
            'role_fr' => 'Secrétaire général du RASED',
            'role_en' => 'Secretary General of RASED',
            'institution_fr' => 'École Normale Supérieure de Nouakchott',
            'institution_en' => 'École Normale Supérieure, Nouakchott',
            'place' => 'Nouakchott, Mauritanie',
            'nationality_flag' => '🇲🇷',
            'country_code' => 'MRT',
            'coordinates_label' => '18°05′N · 15°58′W',
            'tags' => ['Coopération UNESCO/ISESCO', 'Ingénierie de formation', 'HDR Sciences Éd.'],
            'highlights' => [
                ['fr' => "Directeur de la Formation et de la coopération à l'ENS de Nouakchott, depuis 1988", 'en' => 'Director of Training and Cooperation at ENS Nouakchott, since 1988'],
                ['fr' => 'HDR (2018) et Doctorat en sciences de l’éducation (2004), Université Mohammed V, Rabat', 'en' => 'HDR (2018) and PhD in Educational Sciences (2004), Mohammed V University, Rabat'],
                ['fr' => "Membre du Haut Conseil de l'Éducation, Présidence de la République (Mauritanie)", 'en' => 'Member of the Higher Council of Education, Office of the President (Mauritania)'],
                ['fr' => 'Expert et consultant international : UNESCO, ISESCO, BID, UNICEF', 'en' => 'International expert and consultant: UNESCO, ISESCO, IDB, UNICEF'],
            ],
        ]);

        Member::create([
            'name' => 'Pr Moustapha Sokhna',
            'photo' => 'portrait-sokhna.jpg',
            'rank' => 3,
            'reference_code' => 'RASED · FND-003',
            'category_fr' => 'Membre fondateur',
            'category_en' => 'Founding member',
            'role_fr' => 'Doyen de la FASTEF · UCAD',
            'role_en' => 'Dean of FASTEF · UCAD',
            'institution_fr' => 'FASTEF · Université Cheikh Anta Diop de Dakar',
            'institution_en' => 'FASTEF · Cheikh Anta Diop University of Dakar',
            'place' => 'Dakar, Sénégal',
            'nationality_flag' => '🇸🇳',
            'country_code' => 'SEN',
            'coordinates_label' => '14°41′N · 17°28′W',
            'tags' => ['Didactique des maths', 'Numérique éducatif', 'Formation enseignante'],
            'highlights' => [
                ['fr' => 'Doyen de la Faculté des Sciences et Technologies de l’Éducation et de la Formation (FASTEF · UCAD)', 'en' => 'Dean of the Faculty of Education & Training Sciences and Technologies (FASTEF · UCAD)'],
                ['fr' => 'Co-signataire de la charte constitutive du RASED à Nouakchott', 'en' => 'Co-signatory of the RASED founding charter in Nouakchott'],
                ['fr' => 'Professeur titulaire engagé dans la didactique des mathématiques, le numérique éducatif et la formation des enseignants', 'en' => 'Full professor active in mathematics didactics, educational technology, and teacher training'],
                ['fr' => 'Institution hôte du portail numérique officiel rased-ucad.com', 'en' => 'Host institution of the official digital portal rased-ucad.com'],
            ],
        ]);

        Member::create([
            'name' => 'Pr Mohamed Aly Louly',
            'photo' => 'portrait-louly.jpg',
            'rank' => 4,
            'reference_code' => 'RASED · FND-004',
            'category_fr' => 'Membre fondateur',
            'category_en' => 'Founding member',
            'role_fr' => 'Directeur de l’ENS de Nouakchott',
            'role_en' => 'Director of ENS Nouakchott',
            'institution_fr' => 'École Normale Supérieure de Nouakchott',
            'institution_en' => 'École Normale Supérieure, Nouakchott',
            'place' => 'Nouakchott, Mauritanie',
            'nationality_flag' => '🇲🇷',
            'country_code' => 'MRT',
            'coordinates_label' => '18°05′N · 15°58′W',
            'tags' => ['Direction académique', 'Curricula ENS', 'Coopération régionale'],
            'highlights' => [
                ['fr' => 'Directeur de l’École Normale Supérieure (ENS) de Nouakchott', 'en' => 'Director of the École Normale Supérieure (ENS) of Nouakchott'],
                ['fr' => 'Hôte et co-signataire du lancement officiel du RASED à Nouakchott', 'en' => 'Host and co-signatory of the official RASED launch in Nouakchott'],
                ['fr' => 'Acteur majeur de la modernisation des parcours de formation des enseignants et de l’ouverture scientifique régionale', 'en' => 'Key driver of teacher-training modernization and regional scientific outreach'],
            ],
        ]);
    }
}
