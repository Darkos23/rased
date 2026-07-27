'use client'

import Navbar from '@/components/layout/Navbar'
import Footer from '@/components/layout/Footer'
import { useLang } from '@/contexts/LanguageContext'

export default function CommissionsPage() {
  const { lang, t } = useLang()

  const commissions = lang === 'fr' ? [
    {
      title: 'Recherche scientifique et Innovation',
      missions: [
        'Élaborer la politique scientifique du RASED',
        'Identifier les priorités de recherche',
        'Coordonner les projets de recherche collaboratifs',
        'Promouvoir les publications scientifiques',
        'Développer les réseaux de chercheurs',
        'Assurer la veille scientifique et technologique',
      ],
    },
    {
      title: 'Formation, Pédagogie et Développement des compétences',
      missions: [
        'Promouvoir l’amélioration de la formation initiale et continue des enseignants',
        'Coordonner les écoles doctorales et les formations de courte durée',
        'Développer les référentiels de compétences',
        'Promouvoir les innovations pédagogiques',
        'Favoriser la mobilité des enseignants et des étudiants',
      ],
    },
    {
      title: 'Coopération, Partenariats et Mobilité',
      missions: [
        'Développer les partenariats nationaux et internationaux',
        'Préparer les conventions de coopération',
        'Identifier les opportunités de financement',
        'Promouvoir les échanges académiques',
        'Coordonner les programmes de mobilité des enseignants, chercheurs et étudiants',
      ],
    },
    {
      title: 'Communication, Publications et Transformation numérique',
      missions: [
        'Élaborer la stratégie de communication du RASED',
        'Administrer le site internet et les plateformes numériques',
        'Assurer la visibilité des activités du Réseau',
        'Coordonner la publication de la Revue africaine des sciences de l’éducation',
        'Gérer les archives numériques et les réseaux sociaux institutionnels',
      ],
    },
    {
      title: 'Gouvernance, Éthique et Assurance qualité',
      missions: [
        'Promouvoir la bonne gouvernance',
        'Veiller au respect des Statuts et du Règlement intérieur',
        'Élaborer les procédures administratives',
        'Promouvoir l’intégrité scientifique',
        'Mettre en place le système d’assurance qualité',
        'Suivre les indicateurs de performance du Réseau',
      ],
    },
    {
      title: 'Finances, Ressources et Développement institutionnel',
      missions: [
        'Contribuer à l’élaboration du budget annuel',
        'Proposer des stratégies de mobilisation des ressources',
        'Assurer le suivi des financements obtenus',
        'Rechercher des partenaires techniques et financiers',
        'Contribuer à la durabilité financière du Réseau',
      ],
    },
  ] : [
    {
      title: 'Scientific Research and Innovation',
      missions: [
        'Develop RASED’s scientific policy',
        'Identify research priorities',
        'Coordinate collaborative research projects',
        'Promote scientific publications',
        'Develop researcher networks',
        'Ensure scientific and technological monitoring',
      ],
    },
    {
      title: 'Training, Pedagogy and Skills Development',
      missions: [
        'Promote the improvement of initial and continuing teacher training',
        'Coordinate doctoral schools and short-term training',
        'Develop skills frameworks',
        'Promote pedagogical innovation',
        'Foster mobility of teachers and students',
      ],
    },
    {
      title: 'Cooperation, Partnerships and Mobility',
      missions: [
        'Develop national and international partnerships',
        'Prepare cooperation agreements',
        'Identify funding opportunities',
        'Promote academic exchanges',
        'Coordinate mobility programmes for teachers, researchers and students',
      ],
    },
    {
      title: 'Communication, Publications and Digital Transformation',
      missions: [
        'Develop RASED’s communication strategy',
        'Manage the website and digital platforms',
        'Ensure visibility of the network’s activities',
        'Coordinate the publication of the African Journal of Educational Sciences',
        'Manage digital archives and institutional social media',
      ],
    },
    {
      title: 'Governance, Ethics and Quality Assurance',
      missions: [
        'Promote good governance',
        'Ensure compliance with the Statutes and Internal Regulations',
        'Develop administrative procedures',
        'Promote scientific integrity',
        'Implement the quality assurance system',
        'Monitor the network’s performance indicators',
      ],
    },
    {
      title: 'Finance, Resources and Institutional Development',
      missions: [
        'Contribute to the preparation of the annual budget',
        'Propose resource mobilisation strategies',
        'Monitor funding obtained',
        'Seek technical and financial partners',
        'Contribute to the network’s financial sustainability',
      ],
    },
  ]

  return (
    <>
      <Navbar />
      <main className="min-h-screen bg-ui-panel pt-32 pb-24">
        <div className="max-w-6xl mx-auto px-4 md:px-8">
          <div className="text-center max-w-2xl mx-auto mb-6">
            <h1 className="font-outfit text-3xl md:text-4xl font-extrabold text-ui-text mb-3">{t.static_page.commissions_title}</h1>
            <p className="text-ui-muted">{t.static_page.commissions_sub}</p>
          </div>

          <p className="text-xs text-ui-muted text-center max-w-2xl mx-auto mb-16">
            {lang === 'fr'
              ? 'Organes techniques et consultatifs du Réseau, chaque Commission est composée d’un Président, d’un Vice-président, d’un Rapporteur, d’un Rapporteur adjoint et d’un représentant de chaque institution membre, pour un mandat de trois ans renouvelable une fois (Règlement intérieur, art. 53-55).'
              : 'Technical and advisory bodies of the Network, each Commission is composed of a Chair, a Vice-Chair, a Rapporteur, a Deputy Rapporteur and one representative from each member institution, for a three-year term renewable once (Internal Regulations, art. 53-55).'}
          </p>

          <div className="grid md:grid-cols-2 gap-5">
            {commissions.map((c, i) => (
              <div key={c.title} className="bg-white border border-ui-border rounded-2xl shadow-soft p-8">
                <div className="flex items-start gap-4 mb-5">
                  <span className="flex-shrink-0 w-9 h-9 rounded-full bg-brand-50 text-brand-700 text-sm font-bold flex items-center justify-center">{i + 1}</span>
                  <h2 className="font-outfit text-lg font-bold text-ui-text leading-snug pt-1">{c.title}</h2>
                </div>
                <ul className="space-y-2.5">
                  {c.missions.map((m) => (
                    <li key={m} className="flex items-start gap-2.5 text-sm text-ui-muted leading-relaxed">
                      <span className="flex-shrink-0 w-1.5 h-1.5 rounded-full bg-accent mt-2" />
                      {m}
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>
      </main>
      <Footer />
    </>
  )
}
