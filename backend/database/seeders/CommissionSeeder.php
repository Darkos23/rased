<?php

namespace Database\Seeders;

use App\Models\Commission;
use Illuminate\Database\Seeder;

class CommissionSeeder extends Seeder
{
    public function run(): void
    {
        Commission::query()->delete();

        $data = [
            [
                'title_fr' => 'Recherche scientifique et Innovation',
                'title_en' => 'Scientific Research and Innovation',
                'missions_fr' => [
                    'Élaborer la politique scientifique du RASED',
                    'Identifier les priorités de recherche',
                    'Coordonner les projets de recherche collaboratifs',
                    'Promouvoir les publications scientifiques',
                    'Développer les réseaux de chercheurs',
                    'Assurer la veille scientifique et technologique',
                ],
                'missions_en' => [
                    'Develop RASED’s scientific policy',
                    'Identify research priorities',
                    'Coordinate collaborative research projects',
                    'Promote scientific publications',
                    'Develop researcher networks',
                    'Ensure scientific and technological monitoring',
                ],
            ],
            [
                'title_fr' => 'Formation, Pédagogie et Développement des compétences',
                'title_en' => 'Training, Pedagogy and Skills Development',
                'missions_fr' => [
                    'Promouvoir l’amélioration de la formation initiale et continue des enseignants',
                    'Coordonner les écoles doctorales et les formations de courte durée',
                    'Développer les référentiels de compétences',
                    'Promouvoir les innovations pédagogiques',
                    'Favoriser la mobilité des enseignants et des étudiants',
                ],
                'missions_en' => [
                    'Promote the improvement of initial and continuing teacher training',
                    'Coordinate doctoral schools and short-term training',
                    'Develop skills frameworks',
                    'Promote pedagogical innovation',
                    'Foster mobility of teachers and students',
                ],
            ],
            [
                'title_fr' => 'Coopération, Partenariats et Mobilité',
                'title_en' => 'Cooperation, Partnerships and Mobility',
                'missions_fr' => [
                    'Développer les partenariats nationaux et internationaux',
                    'Préparer les conventions de coopération',
                    'Identifier les opportunités de financement',
                    'Promouvoir les échanges académiques',
                    'Coordonner les programmes de mobilité des enseignants, chercheurs et étudiants',
                ],
                'missions_en' => [
                    'Develop national and international partnerships',
                    'Prepare cooperation agreements',
                    'Identify funding opportunities',
                    'Promote academic exchanges',
                    'Coordinate mobility programmes for teachers, researchers and students',
                ],
            ],
            [
                'title_fr' => 'Communication, Publications et Transformation numérique',
                'title_en' => 'Communication, Publications and Digital Transformation',
                'missions_fr' => [
                    'Élaborer la stratégie de communication du RASED',
                    'Administrer le site internet et les plateformes numériques',
                    'Assurer la visibilité des activités du Réseau',
                    'Coordonner la publication de la Revue africaine des sciences de l’éducation',
                    'Gérer les archives numériques et les réseaux sociaux institutionnels',
                ],
                'missions_en' => [
                    'Develop RASED’s communication strategy',
                    'Manage the website and digital platforms',
                    'Ensure visibility of the network’s activities',
                    'Coordinate the publication of the African Journal of Educational Sciences',
                    'Manage digital archives and institutional social media',
                ],
            ],
            [
                'title_fr' => 'Gouvernance, Éthique et Assurance qualité',
                'title_en' => 'Governance, Ethics and Quality Assurance',
                'missions_fr' => [
                    'Promouvoir la bonne gouvernance',
                    'Veiller au respect des Statuts et du Règlement intérieur',
                    'Élaborer les procédures administratives',
                    'Promouvoir l’intégrité scientifique',
                    'Mettre en place le système d’assurance qualité',
                    'Suivre les indicateurs de performance du Réseau',
                ],
                'missions_en' => [
                    'Promote good governance',
                    'Ensure compliance with the Statutes and Internal Regulations',
                    'Develop administrative procedures',
                    'Promote scientific integrity',
                    'Implement the quality assurance system',
                    'Monitor the network’s performance indicators',
                ],
            ],
            [
                'title_fr' => 'Finances, Ressources et Développement institutionnel',
                'title_en' => 'Finance, Resources and Institutional Development',
                'missions_fr' => [
                    'Contribuer à l’élaboration du budget annuel',
                    'Proposer des stratégies de mobilisation des ressources',
                    'Assurer le suivi des financements obtenus',
                    'Rechercher des partenaires techniques et financiers',
                    'Contribuer à la durabilité financière du Réseau',
                ],
                'missions_en' => [
                    'Contribute to the preparation of the annual budget',
                    'Propose resource mobilisation strategies',
                    'Monitor funding obtained',
                    'Seek technical and financial partners',
                    'Contribute to the network’s financial sustainability',
                ],
            ],
        ];

        foreach ($data as $i => $c) {
            Commission::create([...$c, 'order' => $i]);
        }
    }
}
