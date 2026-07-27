// Annuaire des membres du RASED — source unique pour la page /membres et,
// à terme, pour tout autre endroit du site qui doit lister des personnes.
//
// Pour ajouter un membre : ajouter une entrée ici avec les infos RÉELLES
// disponibles (CV, statuts du réseau, etc.). Ne jamais inventer une fonction,
// une institution ou un fait — laisser `highlights` vide tant qu'on n'a pas
// de source fiable (CV, confirmation du doyen...).
//
// `rank` détermine l'ordre d'affichage (plus petit = affiché en premier).
// `category` regroupe les cards par organe/statut (Secrétariat général,
// Présidence, Membres fondateurs...).

export interface MemberHighlight {
  fr: string
  en: string
}

export interface Member {
  id: string
  name: string
  /** Chemin vers une photo réelle dans /public, si disponible. */
  photo?: string
  rank: number
  category: { fr: string; en: string }
  role: { fr: string; en: string }
  institution?: { fr: string; en: string }
  place?: string
  /** Nationalité réelle (source : CV ou déclaration officielle) — absente tant que non confirmée. */
  nationality?: { fr: string; en: string; flag: string }
  /** Faits vérifiés et sourcés (CV, statuts...) — vide tant qu'aucune source n'est fournie. */
  highlights?: MemberHighlight[]
}

export const members: Member[] = [
  {
    id: 'el-kerim',
    name: 'Abdallahi El Kerim',
    photo: '/rased-sg-portrait.jpeg',
    rank: 1,
    category: { fr: 'Secrétariat général', en: 'Secretary General' },
    role: { fr: 'Secrétaire général du RASED', en: 'Secretary General of RASED' },
    institution: { fr: 'École Normale Supérieure de Nouakchott', en: 'École Normale Supérieure, Nouakchott' },
    place: 'Nouakchott, Mauritanie',
    nationality: { fr: 'Mauritanienne', en: 'Mauritanian', flag: '🇲🇷' },
    highlights: [
      {
        fr: "Directeur de la Formation et de la coopération à l'ENS de Nouakchott, depuis 1988",
        en: 'Director of Training and Cooperation at ENS Nouakchott, since 1988',
      },
      {
        fr: 'HDR (2018) et Doctorat en sciences de l’éducation (2004), Université Mohammed V, Rabat',
        en: 'HDR (2018) and PhD in Educational Sciences (2004), Mohammed V University, Rabat',
      },
      {
        fr: "Membre du Haut Conseil de l'Éducation, Présidence de la République (Mauritanie)",
        en: 'Member of the Higher Council of Education, Office of the President (Mauritania)',
      },
      {
        fr: 'Expert et consultant : UNESCO, ISESCO, BID, UNICEF',
        en: 'Expert and consultant: UNESCO, ISESCO, IDB, UNICEF',
      },
    ],
  },
  {
    id: 'kidai',
    name: 'Pr Abdellatif Kidai',
    rank: 2,
    category: { fr: 'Présidence', en: 'Presidency' },
    role: { fr: 'Président du RASED', en: 'President of RASED' },
    institution: { fr: 'Faculté des Sciences de l’Éducation, Université Mohammed V', en: 'Faculty of Educational Sciences, Mohammed V University' },
    place: 'Rabat, Maroc',
  },
  {
    id: 'sokhna',
    name: 'Pr Moustapha Sokhna',
    rank: 3,
    category: { fr: 'Membre fondateur', en: 'Founding member' },
    role: { fr: 'Doyen de la FASTEF · UCAD', en: 'Dean of FASTEF · UCAD' },
    institution: { fr: 'FASTEF · UCAD', en: 'FASTEF · UCAD' },
    place: 'Dakar, Sénégal',
    nationality: { fr: 'Sénégalaise', en: 'Senegalese', flag: '🇸🇳' },
  },
  {
    id: 'louly',
    name: 'Pr Mohamed Aly Louly',
    rank: 3,
    category: { fr: 'Membre fondateur', en: 'Founding member' },
    role: { fr: 'Directeur de l’ENS de Nouakchott', en: 'Director of ENS Nouakchott' },
    institution: { fr: 'École Normale Supérieure', en: 'École Normale Supérieure' },
    place: 'Nouakchott, Mauritanie',
  },
]
