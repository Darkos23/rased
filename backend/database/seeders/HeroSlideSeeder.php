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
            'title_fr' => 'Signature officielle du RASED',
            'title_en' => 'Official Signing of the RASED Network',
            'tag_fr' => 'Acte fondateur · Nouakchott',
            'tag_en' => 'Founding Act · Nouakchott',
            'location_fr' => 'Nouakchott, Mauritanie',
            'location_en' => 'Nouakchott, Mauritania',
            'caption_fr' => "Signature du RASED à Nouakchott, en Mauritanie — de gauche à droite : Pr Mohamed Aly Louly, directeur de l'ENS de Nouakchott (Mauritanie) ; Pr Moustapha Sokhna, doyen de la FASTEF-UCAD (Sénégal) ; Pr Abdellatif Kidai, doyen de la Faculté des Sciences de l'Éducation de l'Université Mohammed V de Rabat (Maroc).",
            'caption_en' => "Signing of RASED in Nouakchott, Mauritania — from left to right: Pr Mohamed Aly Louly, Director of ENS Nouakchott (Mauritania); Pr Moustapha Sokhna, Dean of FASTEF-UCAD (Senegal); Pr Abdellatif Kidai, Dean of the Faculty of Educational Sciences, Mohammed V University of Rabat (Morocco).",
        ]);

        HeroSlide::create([
            'order' => 1,
            'image' => 'rased-secretaire-general.jpeg',
            'title_fr' => 'Abdallahi El Kerim, Secrétaire général',
            'title_en' => 'Abdallahi El Kerim, Secretary-General',
            'tag_fr' => 'Secrétariat général · Coordination permanente',
            'tag_en' => 'General Secretariat · Permanent Coordination',
            'location_fr' => 'ENS de Nouakchott',
            'location_en' => 'ENS Nouakchott',
            'caption_fr' => 'Abdallahi El Kerim, Secrétaire général du RASED (à gauche sur la photo), Directeur de la Formation et de la coopération à l\'École Normale Supérieure de Nouakchott, assurant l\'administration permanente du Réseau.',
            'caption_en' => 'Abdallahi El Kerim, Secretary-General of RASED (pictured left), Director of Training and Cooperation at ENS Nouakchott, overseeing the day-to-day administration of the Network.',
        ]);

        HeroSlide::create([
            'order' => 2,
            'image' => 'rased-research-library.png',
            'title_fr' => 'Un espace africain de référence scientifique',
            'title_en' => 'A Premier African Space for Educational Research',
            'tag_fr' => 'Écoles doctorales & Recherche conjointe',
            'tag_en' => 'Joint Doctoral Schools & Research',
            'location_fr' => 'Dakar · Rabat · Nouakchott',
            'location_en' => 'Dakar · Rabat · Nouakchott',
            'caption_fr' => 'Programmes de recherche inter-laboratoires, co-tutelles doctorales, mobilité académique et publication de la Revue africaine des sciences de l\'éducation entre l\'Afrique de l\'Ouest et le Maghreb.',
            'caption_en' => 'Inter-laboratory research programs, joint doctoral supervision, academic mobility, and publication of the African Journal of Education Sciences across West Africa and the Maghreb.',
        ]);
    }
}
