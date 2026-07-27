<?php

namespace Database\Seeders;

use App\Models\Article;
use App\Models\Course;
use App\Models\Lesson;
use App\Models\Meeting;
use App\Models\User;
use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;
use Illuminate\Support\Str;

class DatabaseSeeder extends Seeder
{
    use WithoutModelEvents;

    public function run(): void
    {
        /* ── Utilisateurs ─────────────────────────────── */
        $admin = User::create([
            'name'     => 'Admin RASED',
            'email'    => 'admin@rased.sn',
            'password' => 'rased2026',
            'role'     => 'admin',
            'locale'   => 'fr',
            'bio'      => 'Administrateur de la plateforme RASED.',
        ]);

        $teachers = collect([
            ['name' => 'Pr. Amadou Diallo',    'email' => 'a.diallo@ucad.sn',    'bio' => 'Professeur en Sciences de l\'Éducation, spécialiste des pédagogies actives.'],
            ['name' => 'Dr. Fatou Ndiaye',     'email' => 'f.ndiaye@ucad.sn',    'bio' => 'Maître de conférences en Didactique des mathématiques.'],
            ['name' => 'Pr. Ibrahima Sow',     'email' => 'i.sow@ucad.sn',       'bio' => 'Professeur en Technologies Éducatives et Formation à distance.'],
        ])->map(fn ($t) => User::create([...$t, 'password' => 'fastef2024', 'role' => 'teacher', 'locale' => 'fr']));

        $researchers = collect([
            ['name' => 'Dr. Mariama Bah',      'email' => 'm.bah@ucad.sn',       'bio' => 'Chercheuse en sociologie de l\'éducation.'],
            ['name' => 'Dr. Ousmane Camara',   'email' => 'o.camara@ucad.sn',    'bio' => 'Chercheur en ingénierie pédagogique et TICE.'],
            ['name' => 'Dr. Aïssatou Sarr',    'email' => 'a.sarr@ucad.sn',      'bio' => 'Chercheuse en politiques éducatives en Afrique subsaharienne.'],
        ])->map(fn ($r) => User::create([...$r, 'password' => 'fastef2024', 'role' => 'researcher', 'locale' => 'fr']));

        $allAuthors = $teachers->merge([$admin]);

        /* ── Articles ─────────────────────────────────── */
        $articles = [
            [
                'title'    => 'Vers une pédagogie inclusive dans les universités africaines',
                'body'     => '<p>L\'inclusion éducative représente aujourd\'hui l\'un des défis majeurs des systèmes universitaires africains. Face à la diversité croissante des profils étudiants — étudiants en situation de handicap, primo-arrivants, apprenants en zone rurale — les établissements d\'enseignement supérieur doivent repenser leurs pratiques pédagogiques.</p><h2>Enjeux et définition</h2><p>La pédagogie inclusive vise à adapter l\'enseignement aux besoins de chacun, sans exclure ni stigmatiser. Elle s\'appuie sur trois piliers : l\'accessibilité physique et numérique, la flexibilité des méthodes d\'évaluation, et la formation continue des enseignants.</p><h2>Expériences au sein de la FASTEF</h2><p>Depuis 2022, la FASTEF a initié plusieurs projets pilotes visant à universaliser l\'accès à ses contenus pédagogiques. Parmi eux, la mise en ligne de ressources sous-titrées, la création de groupes de soutien inter-promotions, et l\'adaptation des évaluations pour les étudiants à besoins spécifiques.</p><p>Ces initiatives ont permis d\'augmenter de 18 % le taux de réussite des étudiants concernés lors des deux dernières années académiques.</p><h2>Conclusion</h2><p>L\'inclusion n\'est pas une option mais une nécessité pour bâtir des systèmes éducatifs équitables et performants. La FASTEF s\'inscrit dans cette dynamique en faisant de l\'accessibilité une priorité institutionnelle.</p>',
                'category' => 'Pédagogie',
                'lang'     => 'fr',
                'author'   => $teachers[0],
            ],
            [
                'title'    => 'L\'intégration des TICE dans l\'enseignement secondaire au Sénégal',
                'body'     => '<p>Les Technologies de l\'Information et de la Communication pour l\'Éducation (TICE) transforment profondément les pratiques d\'enseignement et d\'apprentissage au Sénégal. Cette étude examine leur niveau d\'intégration dans les lycées de la région de Dakar.</p><h2>État des lieux</h2><p>Une enquête menée auprès de 120 enseignants du secondaire révèle que 68 % d\'entre eux utilisent régulièrement des outils numériques en classe, contre 31 % en 2018. Toutefois, cette adoption reste inégale selon les disciplines et les établissements.</p><h2>Obstacles identifiés</h2><p>Les principaux freins à l\'intégration des TICE sont : l\'insuffisance d\'équipements fiables (connectivité, tablettes, vidéoprojecteurs), le manque de formation continue des enseignants, et l\'absence de ressources numériques en langues locales.</p><h2>Recommandations</h2><p>Pour accélérer cette transformation, il est recommandé d\'investir massivement dans les infrastructures, de former les enseignants à la pédagogie numérique, et de développer des contenus adaptés au contexte sénégalais.</p>',
                'category' => 'Numérique',
                'lang'     => 'fr',
                'author'   => $teachers[2],
            ],
            [
                'title'    => 'Didactique des mathématiques : approches constructivistes en contexte bilingue',
                'body'     => '<p>L\'enseignement des mathématiques dans un contexte bilingue français-wolof pose des défis spécifiques que la didactique contemporaine s\'efforce de relever. Cette contribution explore les apports des approches constructivistes dans ce contexte particulier.</p><h2>Le constructivisme comme cadre théorique</h2><p>Inspiré des travaux de Piaget et Vygotsky, le constructivisme postule que l\'apprenant construit activement ses connaissances à travers ses expériences. En mathématiques, cela se traduit par des situations-problèmes ancrées dans le réel, favorisant la résolution collective et le débat argumentatif.</p><h2>Expérimentation en contexte bilingue</h2><p>Une expérimentation menée dans trois collèges de Dakar a montré que l\'utilisation alternée du français et du wolof dans les phases de conceptualisation améliorait la compréhension des notions abstraites chez les élèves de 5e et 4e.</p><p>Les résultats indiquent une progression moyenne de 22 points sur 100 aux évaluations diagnostiques après six semaines d\'expérimentation.</p>',
                'category' => 'Didactique',
                'lang'     => 'fr',
                'author'   => $teachers[1],
            ],
            [
                'title'    => 'Open Educational Resources in Sub-Saharan Africa: Challenges and Opportunities',
                'body'     => '<p>Open Educational Resources (OER) have emerged as a transformative force in global education, offering freely accessible, adaptable learning materials to teachers and students worldwide. In Sub-Saharan Africa, where educational resources remain scarce and costly, OER present both significant opportunities and particular challenges.</p><h2>The Promise of OER</h2><p>For institutions like FASTEF, OER can dramatically reduce the cost of educational materials, democratize access to quality content, and foster collaboration between academic institutions across the continent and beyond.</p><h2>Key Challenges</h2><p>Despite their promise, OER adoption faces several barriers in the region: limited internet connectivity, language barriers (most OER are in English or French rather than local languages), and a lack of awareness among educators about available resources.</p><h2>The Way Forward</h2><p>Developing regional OER repositories in local languages, building educator capacity through training programs, and establishing institutional policies that incentivize OER creation are critical steps toward realizing the full potential of open education in Sub-Saharan Africa.</p>',
                'category' => 'Recherche',
                'lang'     => 'en',
                'author'   => $researchers[1],
            ],
            [
                'title'    => 'Formation à distance et équité éducative en Afrique de l\'Ouest',
                'body'     => '<p>La pandémie de COVID-19 a mis en lumière les inégalités structurelles qui caractérisent l\'accès à l\'éducation en Afrique de l\'Ouest. La formation à distance, longtemps perçue comme un palliatif, s\'impose aujourd\'hui comme une modalité éducative à part entière.</p><h2>Un accélérateur d\'inégalités ?</h2><p>Si la formation à distance offre de nouvelles possibilités d\'accès, elle risque également de creuser les inégalités existantes si elle n\'est pas accompagnée de politiques inclusives. L\'accès aux équipements et à la connexion internet reste très inégal au sein des pays d\'Afrique de l\'Ouest.</p><h2>Vers une formation à distance équitable</h2><p>Plusieurs leviers permettent d\'atténuer ces inégalités : le développement de contenus accessibles hors ligne, l\'utilisation de la radio et de la télévision éducatives, et la mise en place de points d\'accès numériques dans les zones rurales.</p>',
                'category' => 'Formation',
                'lang'     => 'fr',
                'author'   => $researchers[0],
            ],
            [
                'title'    => 'Évaluation par compétences dans l\'enseignement supérieur',
                'body'     => '<p>L\'approche par compétences (APC) transforme profondément les pratiques d\'évaluation dans l\'enseignement supérieur africain. Cette réflexion propose une analyse critique de ses fondements théoriques et de ses modalités de mise en œuvre à la FASTEF.</p><h2>Fondements de l\'APC</h2><p>L\'APC vise à évaluer non seulement les savoirs disciplinaires, mais aussi les savoir-faire et les savoir-être. Elle implique une révision profonde des référentiels de formation et des outils d\'évaluation.</p><h2>Mise en œuvre à la FASTEF</h2><p>Depuis la réforme LMD, la FASTEF a progressivement adopté l\'APC dans ses filières de formation. Des portfolios, des mises en situation professionnelle et des jurys mixtes composés d\'enseignants et de professionnels ont été introduits dans plusieurs masters.</p>',
                'category' => 'Évaluation',
                'lang'     => 'fr',
                'author'   => $teachers[0],
            ],
        ];

        foreach ($articles as $data) {
            $author = $data['author'];
            $slug   = Str::slug($data['title']) . '-' . Str::random(5);
            Article::create([
                'title'     => $data['title'],
                'slug'      => $slug,
                'body'      => $data['body'],
                'category'  => $data['category'],
                'lang'      => $data['lang'],
                'status'    => 'published',
                'author_id' => $author->id,
            ]);
        }

        /* ── Cours ────────────────────────────────────── */
        $coursesData = [
            [
                'title'       => 'Introduction à la pédagogie universitaire',
                'description' => 'Ce cours propose une initiation aux fondements théoriques et pratiques de la pédagogie universitaire contemporaine. Il couvre les grands courants pédagogiques, les méthodes actives et l\'ingénierie de formation.',
                'level'       => 'beginner',
                'teacher'     => $teachers[0],
                'lessons'     => [
                    ['title' => 'Les courants pédagogiques du 20e siècle',             'duration_min' => 45, 'content' => '<p>De Dewey à Freire, ce cours retrace les grandes évolutions de la pensée pédagogique moderne.</p>'],
                    ['title' => 'Méthodes actives et apprentissage par problèmes',       'duration_min' => 60, 'content' => '<p>L\'apprentissage par problèmes (APP) place l\'apprenant au centre du processus. Nous examinerons des cas pratiques issus de l\'enseignement supérieur.</p>'],
                    ['title' => 'Ingénierie pédagogique : concevoir un cours',           'duration_min' => 50, 'content' => '<p>Comment structurer un cours universitaire ? Objectifs pédagogiques, progression, évaluation : tous les outils pour concevoir une formation cohérente.</p>'],
                    ['title' => 'Évaluation des apprentissages : méthodes et outils',   'duration_min' => 45, 'content' => '<p>Évaluation formative, sommative, par compétences : panorama des pratiques évaluatives et de leurs fondements théoriques.</p>'],
                ],
            ],
            [
                'title'       => 'Technologies Éducatives et Enseignement Hybride',
                'description' => 'Maîtrisez les outils numériques pour concevoir des formations hybrides efficaces. De la scénarisation pédagogique à la production de ressources multimédias.',
                'level'       => 'intermediate',
                'teacher'     => $teachers[2],
                'lessons'     => [
                    ['title' => 'Introduction aux LMS : Moodle, Canvas et alternatives',  'duration_min' => 40, 'content' => '<p>Les plateformes de gestion de l\'apprentissage (LMS) constituent l\'épine dorsale de la formation en ligne. Panorama des solutions disponibles et critères de choix.</p>'],
                    ['title' => 'Scénarisation pédagogique pour le numérique',             'duration_min' => 55, 'content' => '<p>Adapter sa progression pédagogique aux contraintes du numérique : synchrone vs asynchrone, granularité des contenus, rythme d\'apprentissage.</p>'],
                    ['title' => 'Production de ressources multimédias',                    'duration_min' => 70, 'content' => '<p>Vidéos pédagogiques, podcasts, infographies : outils de production accessibles et bonnes pratiques de conception multimédia.</p>'],
                    ['title' => 'Animer une classe virtuelle',                             'duration_min' => 45, 'content' => '<p>Techniques d\'animation pour maintenir l\'engagement en visioconférence : sondages, ateliers collaboratifs, breakout rooms.</p>'],
                    ['title' => 'Évaluer les apprentissages en ligne',                     'duration_min' => 40, 'content' => '<p>Quiz adaptatifs, devoirs en ligne, évaluation par les pairs : méthodes d\'évaluation adaptées au contexte numérique.</p>'],
                ],
            ],
            [
                'title'       => 'Didactique des mathématiques — Niveau avancé',
                'description' => 'Cours avancé destiné aux enseignants et chercheurs en didactique. Il aborde les théories de la transposition didactique, les situations fondamentales et l\'ingénierie didactique.',
                'level'       => 'advanced',
                'teacher'     => $teachers[1],
                'lessons'     => [
                    ['title' => 'La transposition didactique : Chevallard revisité',       'duration_min' => 60, 'content' => '<p>La théorie de la transposition didactique explique le processus par lequel un savoir savant devient un savoir enseigné. Analyse et exemples.</p>'],
                    ['title' => 'La théorie des situations didactiques de Brousseau',      'duration_min' => 65, 'content' => '<p>Guy Brousseau a développé un cadre théorique fondamental pour la didactique des mathématiques. Étude des situations a-didactiques et du contrat didactique.</p>'],
                    ['title' => 'Ingénierie didactique : méthodologie de recherche',       'duration_min' => 75, 'content' => '<p>L\'ingénierie didactique comme cadre méthodologique pour la conception et l\'analyse de séquences d\'enseignement en mathématiques.</p>'],
                ],
            ],
            [
                'title'       => 'Recherche en Sciences de l\'Éducation : Méthodes qualitatives',
                'description' => 'Initiation aux méthodes de recherche qualitative en sciences de l\'éducation. Entretiens, observations ethnographiques, analyse de contenu : fondements et mise en pratique.',
                'level'       => 'intermediate',
                'teacher'     => $teachers[0],
                'lessons'     => [
                    ['title' => 'Postures épistémologiques en sciences de l\'éducation',   'duration_min' => 50, 'content' => '<p>Positivisme, interprétativisme, constructivisme : quels fondements épistémologiques pour la recherche en éducation ?</p>'],
                    ['title' => 'L\'entretien de recherche : types et techniques',          'duration_min' => 55, 'content' => '<p>Entretien directif, semi-directif, non-directif : caractéristiques, usage et techniques de conduite.</p>'],
                    ['title' => 'L\'observation ethnographique en milieu scolaire',         'duration_min' => 60, 'content' => '<p>Comment observer une classe de façon rigoureuse ? Grilles d\'observation, posture du chercheur et enjeux éthiques.</p>'],
                    ['title' => 'Analyse qualitative de données : codes et thèmes',        'duration_min' => 65, 'content' => '<p>Codage ouvert, axial et sélectif : méthodes d\'analyse qualitative des données issues de la recherche en éducation.</p>'],
                ],
            ],
        ];

        foreach ($coursesData as $cData) {
            $teacher = $cData['teacher'];
            $slug    = Str::slug($cData['title']) . '-' . Str::random(5);
            $course  = Course::create([
                'title'       => $cData['title'],
                'slug'        => $slug,
                'description' => $cData['description'],
                'level'       => $cData['level'],
                'status'      => 'published',
                'teacher_id'  => $teacher->id,
            ]);
            foreach ($cData['lessons'] as $i => $lData) {
                Lesson::create([
                    'course_id'    => $course->id,
                    'title'        => $lData['title'],
                    'content'      => $lData['content'],
                    'order'        => $i + 1,
                    'duration_min' => $lData['duration_min'],
                ]);
            }
        }

        /* ── Réunions ─────────────────────────────────── */
        $meetingsData = [
            [
                'title'       => 'Séminaire : Réforme LMD et qualité de l\'enseignement',
                'description' => 'Discussion ouverte sur les enjeux de la réforme LMD dans les universités africaines et ses implications pour la qualité de l\'enseignement.',
                'host'        => $admin,
                'scheduled_at'=> now()->addDays(5)->setTime(10, 0),
                'status'      => 'scheduled',
            ],
            [
                'title'       => 'Atelier : Conception de ressources pédagogiques numériques',
                'description' => 'Atelier pratique animé par le Dr. Sow pour découvrir les outils de création de contenus e-learning : H5P, Genially, Canva for Education.',
                'host'        => $teachers[2],
                'scheduled_at'=> now()->addDays(12)->setTime(14, 0),
                'status'      => 'scheduled',
            ],
            [
                'title'       => 'Conférence internationale : Éducation et développement durable en Afrique',
                'description' => 'Conférence réunissant des chercheurs de 15 pays africains autour des liens entre systèmes éducatifs et objectifs de développement durable (ODD 4).',
                'host'        => $admin,
                'scheduled_at'=> now()->addDays(21)->setTime(9, 0),
                'status'      => 'scheduled',
            ],
            [
                'title'       => 'Table ronde : Place des langues nationales dans l\'enseignement supérieur',
                'description' => 'Quelle place pour le wolof, le pulaar ou le soninké dans l\'enseignement supérieur sénégalais ? Débat avec chercheurs et décideurs.',
                'host'        => $teachers[0],
                'scheduled_at'=> now()->addDays(30)->setTime(15, 30),
                'status'      => 'scheduled',
            ],
            [
                'title'       => 'Réunion pédagogique — Département Sciences de l\'Éducation',
                'description' => 'Réunion mensuelle du département pour le suivi des formations et la coordination des activités pédagogiques du semestre.',
                'host'        => $admin,
                'scheduled_at'=> now()->subDays(10)->setTime(9, 0),
                'status'      => 'ended',
            ],
        ];

        foreach ($meetingsData as $mData) {
            Meeting::create([
                'title'        => $mData['title'],
                'description'  => $mData['description'],
                'host_id'      => $mData['host']->id,
                'scheduled_at' => $mData['scheduled_at'],
                'status'       => $mData['status'],
            ]);
        }
    }
}
