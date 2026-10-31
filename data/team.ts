export type Tier = 1 | 2 | 3 | 4;

export type Wing = 'Technical' | 'Executive';

export type TeamId =
  | 'council'
  | 'infrastructure'
  | 'cp'
  | 'dsa'
  | 'media&creative'
  | 'publicrelations'
  | 'eventmanagement';

export interface PersonLinks {
  github?: string;
  linkedin?: string;
  codeforces?: string;
}

export interface Person {
  id: string;
  name: string;
  role: string;
  tier: Tier;
  team: string;
  teamId: TeamId;
  wing?: Wing;
  photo?: string;
  links?: PersonLinks;
  isGeneralSecretary?: boolean;
  isPresident?: boolean;
  isVicePresident?: boolean;
  isExecutive?: boolean;
  isTechnicalHead?: boolean;
  isOperationalHead?: boolean;
  isHead?: boolean;
}

export interface TeamGroup {
  id: TeamId;
  name: string;
  wing: Wing;
  headName: string;
  headId: string;
  memberCount: number;
}

export const teamMembers: Person[] = [
  // ─── Council Members ───────────────────────────────────────────────────────
  {
    id: 'MF-01',
    name: 'Amrit Raj Yadav',
    role: 'President',
    tier: 1,
    team: 'Council',
    teamId: 'council',
    isPresident: true,
    photo: 'https://res.cloudinary.com/zd7lhykz/image/upload/v1790873122/IMG_20260927_131129.jpg',
    links: {
      github: 'https://github.com/amrit-11022007',
      codeforces: 'https://codeforces.com/profile/im.mortal',
      linkedin: 'https://www.linkedin.com/in/amrit-raj-yadav-b07293378/',
    },
  },
  {
    id: 'MF-02',
    name: 'Ayush Jha',
    role: 'Vice president',
    tier: 1,
    team: 'Council',
    teamId: 'council',
    isVicePresident: true,
    photo: 'https://res.cloudinary.com/zd7lhykz/image/upload/v1790875199/WhatsApp_Image_2026-10-01_at_10.49.05_PM.jpg',
    links: {
      github: 'https://github.com/codewithayuu',
      linkedin: 'https://www.linkedin.com/in/ayushjha08/',
    },
  },
  // General Secretary (Left)
  {
    id: 'MF-03',
    name: 'Ridhima Bhatt',
    role: 'General secretary',
    tier: 1,
    team: 'Council',
    teamId: 'council',
    isGeneralSecretary: true,
    photo: 'https://res.cloudinary.com/zd7lhykz/image/upload/v1790873113/IMG_20260927_124358.jpg',
    links: {
      github: 'https://github.com/ridhaa13',
    },
  },
  // Executive (Middle - Left of Touching Pair)
  {
    id: 'MF-04',
    name: 'Anurag Jha',
    role: 'Executive',
    tier: 1,
    team: 'Council',
    teamId: 'council',
    wing: 'Executive',
    isExecutive: true,
    photo: 'https://res.cloudinary.com/zd7lhykz/image/upload/v1790873589/IMG_5896_-_Anurag.jpg',
    links: {
      linkedin: 'https://www.linkedin.com/in/anurag-kumar-91b7a7418/',
    },
  },
  // Technical Head (Middle - Right of Touching Pair)
  {
    id: 'MF-05',
    name: 'Keshav Garg',
    role: 'Technical head',
    tier: 1,
    team: 'Council',
    teamId: 'council',
    wing: 'Technical',
    isTechnicalHead: true,
    photo: 'https://res.cloudinary.com/zd7lhykz/image/upload/v1793360676/Keshav_Garg_Technical_Head.png',
    links: {
      github: 'https://github.com/keshavgarg521-bit',
      linkedin: 'https://www.linkedin.com/in/keshav-garg-169399365/',
      codeforces: 'https://codeforces.com/profile/keshavgarg521',
    },
  },
  // Head of Operations (Right)
  {
    id: 'MF-06',
    name: 'Rishit Srivastava',
    role: 'Head of operations',
    tier: 1,
    team: 'Council',
    teamId: 'council',
    isOperationalHead: true,
    photo: 'https://res.cloudinary.com/zd7lhykz/image/upload/v1790873181/1790497275196.jpg',
    links: {
      github: 'https://github.com/Ris2hit',
      linkedin: 'https://www.linkedin.com/in/rishit-srivastava/',
      codeforces: 'https://codeforces.com/profile/rish.it',
    },
  },

  // ─── Technical Wing: Infrastructure ────────────────────────────────────────
  {
    id: 'MF-07',
    name: 'Yash Gupta',
    role: 'Infrastructure team',
    tier: 4,
    team: 'Infrastructure',
    teamId: 'infrastructure',
    wing: 'Technical',
    isHead: true,
    photo: 'https://res.cloudinary.com/zd7lhykz/image/upload/v1790873173/IMG_20260927_133151.jpg',
    links: {
      github: 'https://github.com/yashguptacodes',
      codeforces: 'https://codeforces.com/profile/yashndcodes',
      linkedin: 'https://www.linkedin.com/in/yash-gupta-54178137a/',
    },
  },
  {
    id: 'MF-08',
    name: 'Yash Mittal',
    role: 'App developer',
    tier: 4,
    team: 'Infrastructure',
    teamId: 'infrastructure',
    wing: 'Technical',
    photo: 'https://res.cloudinary.com/zd7lhykz/image/upload/v1790880303/WhatsApp_Image_2026-10-02_at_12.10.24_AM.jpg',
    links: {
      github: 'https://github.com/y-a-s-h-mittal',
      linkedin: 'https://www.linkedin.com/in/yash-mittal06/',
    },
  },
  {
    id: 'MF-09',
    name: 'Aman Pokharia',
    role: 'AI engineer',
    tier: 4,
    team: 'Infrastructure',
    teamId: 'infrastructure',
    wing: 'Technical',
    photo: 'https://res.cloudinary.com/zd7lhykz/image/upload/v1790873111/IMG_20260927_124014.png',
    links: {
      github: 'https://github.com/siddharthrao',
      codeforces: 'https://codeforces.com/profile/pokhariaaman',
      linkedin: 'https://www.linkedin.com/in/aman-pokharia-059199385/'
    },
  },

  // ─── Technical Wing: Competitive Programming (CP) ──────────────────────────
  {
    id: 'MF-10',
    name: 'Yugal Redhu',
    role: 'Competitive programming lead',
    tier: 3,
    team: 'Competitive programming',
    teamId: 'cp',
    wing: 'Technical',
    isHead: true,
    photo: 'https://res.cloudinary.com/zd7lhykz/image/upload/v1793360663/Gemini_Generated_Image_xrvy5gxrvy5gxrvy_-_Yugal_Redhu.png',
    links: {
      linkedin: 'https://www.linkedin.com/in/yugal-a8ab82385/',
      codeforces: 'https://codeforces.com/profile/Yugal.',
    },
  },
  {
    id: 'MF-11',
    name: 'Tushar Sharma',
    role: 'CP Mentor',
    tier: 4,
    team: 'Competitive programming',
    teamId: 'cp',
    wing: 'Technical',
    photo: 'https://res.cloudinary.com/zd7lhykz/image/upload/v1793360662/file_000000008f108246a8393842412d7841_-_BLUE_FF.png',
    links: {
      github: 'https://github.com/priyabansal',
      linkedin: 'https://www.linkedin.com/in/tushar-sharma-702069305/',
    },
  },
  {
    id: 'MF-12',
    name: 'Sachin Maurya',
    role: 'CP Mentor',
    tier: 4,
    team: 'Competitive programming',
    teamId: 'cp',
    wing: 'Technical',
    photo: 'https://res.cloudinary.com/zd7lhykz/image/upload/v1790873121/IMG_20260927_130806.jpg',
    links: {
      linkedin: 'https://www.linkedin.com/in/sachin-maurya-247639429/',
      codeforces: 'https://codeforces.com/profile/Borachii',
    },
  },
  {
    id: 'MF-13',
    name: 'Shivansh Baweja',
    role: 'CP Mentor',
    tier: 4,
    team: 'Competitive Programming',
    teamId: 'cp',
    wing: 'Technical',
    photo: 'https://res.cloudinary.com/zd7lhykz/image/upload/v1793360661/WhatsApp_Image_2026-10-24_at_11.09.59_AM_-_Shivansh_Baweja.jpg',
    links: {
      linkedin: 'https://www.linkedin.com/in/shivansh-baweja-751a6a385/',
      codeforces: 'https://codeforces.com/profile/shivansh_2007',
    },
  },

  // ─── Technical Wing: DSA ───────────────────────────────────────────────────
  {
    id: 'MF-14',
    name: 'Prajjwal Hedaoo',
    role: 'Data structures lead',
    tier: 3,
    team: 'Data structures & algorithms',
    teamId: 'dsa',
    wing: 'Technical',
    isHead: true,
    photo: 'https://res.cloudinary.com/zd7lhykz/image/upload/v1790873109/IMG_20260927_105905.png',
    links: {
      linkedin: 'https://www.linkedin.com/in/prajjwal-hedaoo-737717384/',
      codeforces: 'https://codeforces.com/profile/prajjval29',
    },
  },
  {
    id: 'MF-15',
    name: 'Prakhar Srivastava',
    role: 'DSA Mentor',
    tier: 4,
    team: 'Data structures & algorithms',
    teamId: 'dsa',
    wing: 'Technical',
    photo: 'https://res.cloudinary.com/zd7lhykz/image/upload/v1790873118/IMG_20260927_125618.jpg',
    links: {
      linkedin: 'https://www.linkedin.com/in/prakhar-srivastava-aa7498368/',
      codeforces: 'https://codeforces.com/profile/Prakharsrivcodes',
    },
  },
  {
    id: 'MF-16',
    name: 'Saksham Saharan',
    role: 'DSA Mentor',
    tier: 4,
    team: 'Data structures & algorithms',
    teamId: 'dsa',
    wing: 'Technical',
    photo: 'https://res.cloudinary.com/zd7lhykz/image/upload/v1790881449/IMG_20260927_132002.jpg',
    links: {
      linkedin: 'https://www.linkedin.com/in/saksham-saharan-504122392/',
    },
  },
  {
    id: 'MF-17',
    name: 'Harsh Khare',
    role: 'DSA Mentor',
    tier: 4,
    team: 'Data structures & algorithms',
    teamId: 'dsa',
    wing: 'Technical',
    photo: 'https://res.cloudinary.com/zd7lhykz/image/upload/v1790875133/f89804b9-0a18-41b8-b7bc-f44ff9b2f6c7_-_Harsh_Khare.png',
    links: {
      codeforces: 'https://codeforces.com/profile/code_wow',
      linkedin: 'https://www.linkedin.com/in/harsh-khare-79486332a/',
    },
  },
  {
    id: 'MF-18',
    name: 'Tanuj Goyat',
    role: 'DSA Mentor',
    tier: 4,
    team: 'Data structures & algorithms',
    teamId: 'dsa',
    wing: 'Technical',
    photo: 'https://mlpnk72yciwc.i.optimole.com/cqhiHLc.IIZS~2ef73/w:auto/h:auto/q:75/https://bleedingcool.com/wp-content/uploads/2021/06/Pikachu-color-model-publicity-cel.jpg',
    links: {
      github: 'https://github.com/ritikamishra',
      linkedin: 'https://linkedin.com/in/ritikamishra',
    },
  },

  // ─── Executive Wing: Media & Creative ──────────────────────────────────────
  {
    id: 'MF-19',
    name: 'Vanshika Kukreti',
    role: 'Media & Creative lead',
    tier: 3,
    team: 'Media & creative',
    teamId: 'media&creative',
    wing: 'Executive',
    isHead: true,
    photo: 'https://res.cloudinary.com/zd7lhykz/image/upload/v1790873108/IMG_20260927_105536.jpg',
    links: {
      codeforces: 'https://codeforces.com/profile/vanshika_kukreti',
      linkedin: 'https://www.linkedin.com/in/vanshika-kukreti-1b1a92382/',
    },
  },
  {
    id: 'MF-20',
    name: 'Jayash Arora',
    role: 'Brand designer',
    tier: 4,
    team: 'Media & creative',
    teamId: 'media&creative',
    wing: 'Executive',
    photo: 'https://res.cloudinary.com/zd7lhykz/image/upload/v1793362816/0D2A0289.jpg.jpg',
    links: {
      linkedin: 'https://www.linkedin.com/in/jayash-arora-325a58310/',
    },
  },
  {
    id: 'MF-21',
    name: 'Pratyush Singh',
    role: 'Social Media',
    tier: 4,
    team: 'Media & creative',
    teamId: 'media&creative',
    wing: 'Executive',
    photo: 'https://res.cloudinary.com/zd7lhykz/image/upload/v1790873117/1790497275372.jpg',
    links: {
      linkedin: 'https://www.linkedin.com/in/pratyushsingh2600/',
      codeforces: 'https://codeforces.com/profile/Pratyush2600',
    },
  },
  {
    id: 'MF-22',
    name: 'Kartik Sharma',
    role: 'Video editor',
    tier: 4,
    team: 'Media & creative',
    teamId: 'media&creative',
    wing: 'Executive',
    photo: 'https://res.cloudinary.com/zd7lhykz/image/upload/v1790873107/IMG_20260927_105442.jpg',
    links: {
      codeforces: 'https://codeforces.com/profile/Pratyush2600',
      linkedin: 'https://linkedin.com/in/tarungoyal',
    },
  },
    {
    id: 'MF-23',
    name: 'Aishika Chadha',
    role: 'Creative artist',
    tier: 4,
    team: 'Media & creative',
    teamId: 'media&creative',
    wing: 'Executive',
    photo: 'https://res.cloudinary.com/zd7lhykz/image/upload/v1790873116/IMG_20260927_125307.jpg',
    links: {
      github: 'https://github.com/tarungoyal',
      linkedin: 'https://www.linkedin.com/in/aishikachadha',
    },
  },

  // ─── Executive Wing: Public Relations ────────────────────────────────
  {
    id: 'MF-24',
    name: 'Dhruv Gupta',
    role: 'PR lead',
    tier: 3,
    team: 'Public Relations',
    teamId: 'publicrelations',
    wing: 'Executive',
    isHead: true,
    photo: 'https://res.cloudinary.com/zd7lhykz/image/upload/v1790873120/IMG_20260927_130455.jpg',
    links: {
      codeforces: 'https://codeforces.com/profile/Aishika_',
      linkedin: 'https://linkedin.com/in/vikramsinghania',
    },
  },
  {
    id: 'MF-25',
    name: 'Hiya Sankhla',
    role: 'Public Speaker',
    tier: 4,
    team: 'Public Relations',
    teamId: 'publicrelations',
    wing: 'Executive',
    photo: 'https://res.cloudinary.com/zd7lhykz/image/upload/v1790873119/IMG_20260927_130026.jpg',
    links: {
      linkedin: 'https://www.linkedin.com/in/hiya-sankhla-095bbb392/',
    },
  },
  {
    id: 'MF-26',
    name: 'Anshika Gupta',
    role: 'Public Speaker',
    tier: 4,
    team: 'Public Relations',
    teamId: 'publicrelations',
    wing: 'Executive',
    photo: 'https://res.cloudinary.com/zd7lhykz/image/upload/v1790873110/IMG_20260927_123443.png',
    links: {
      linkedin: 'https://www.linkedin.com/in/anshika-gupta-63a452381/',
    },
  },
  {
    id: 'MF-27',
    name: 'Amar Gupta',
    role: 'Outreach coordinator',
    tier: 4,
    team: 'Public Relations',
    teamId: 'publicrelations',
    wing: 'Executive',
    photo: 'https://res.cloudinary.com/zd7lhykz/image/upload/v1790873167/IMG_20260927_131420.png',
    links: {
      codeforces: 'https://codeforces.com/profile/amar28032007',
      linkedin: 'https://www.linkedin.com/in/amar-gupta-06636a374/',
    },
  },
  {
    id: 'MF-28',
    name: 'Devesh Kumar',
    role: 'Sponsorship coordinator',
    tier: 4,
    team: 'Public Relations',
    teamId: 'publicrelations',
    wing: 'Executive',
    photo: 'https://res.cloudinary.com/zd7lhykz/image/upload/v1793360663/9231E863-72AF-4464-AD92-F382D8E05221_-_devesh_kumar.png',
    links: {
    },
  },

  // ─── Executive Wing: Event Management ─────────────────────────────────────
  {
    id: 'MF-29',
    name: 'Abhinav Dixit',
    role: 'Event management lead',
    tier: 3,
    team: 'Event management',
    teamId: 'eventmanagement',
    wing: 'Executive',
    isHead: true,
    photo: 'https://res.cloudinary.com/zd7lhykz/image/upload/v1790875376/IMG_20260927_124244.png',
    links: {
      github: 'https://github.com/Abhinavjs903',
      linkedin: 'https://www.linkedin.com/in/abhinavdixit93/',
    },
  },
  {
    id: 'MF-30',
    name: 'Ayush Mahapatra',
    role: 'Event strategist',
    tier: 4,
    team: 'Event management',
    teamId: 'eventmanagement',
    wing: 'Executive',
    photo: 'https://res.cloudinary.com/zd7lhykz/image/upload/v1790873135/IMG_20260927_131244.jpg',
    links: {
      linkedin: 'https://www.linkedin.com/in/ayush-mahapatra/',
    },
  },
  {
    id: 'MF-31',
    name: 'Garima',
    role: 'Operations associate',
    tier: 4,
    team: 'Event management',
    teamId: 'eventmanagement',
    wing: 'Executive',
    photo: 'https://res.cloudinary.com/zd7lhykz/image/upload/v1790873166/IMG_20260927_131325.jpg',
    links: {
      linkedin: 'www.linkedin.com/in/garima781780',
    },
  },
  {
    id: 'MF-32',
    name: 'Garv Goyal',
    role: 'Operations associate',
    tier: 4,
    team: 'Event management',
    teamId: 'eventmanagement',
    wing: 'Executive',
    photo: 'https://res.cloudinary.com/zd7lhykz/image/upload/v1793360672/Garv_Goyal_Event_Management.png',
    links: {
      linkedin: 'https://www.linkedin.com/in/garv-goyal-0433b7380/',
    },
  },
    {
    id: 'MF-33',
    name: 'Parth Aggarwal',
    role: 'Operations associate',
    tier: 4,
    team: 'Event management',
    teamId: 'eventmanagement',
    wing: 'Executive',
    photo: 'https://res.cloudinary.com/zd7lhykz/image/upload/v1793360662/file_000000001d508211907312467548e8d6_-_Aggarwal_Parth.png',
    links: {
      linkedin: 'https://www.linkedin.com/in/parth-aggarwal-526626384/',
    },
  },
];

// ─── Helper Functions & Queries ─────────────────────────────────────────────

/** Total team count */
export const getTotalTeamCount = (): number => teamMembers.length;

/** General Secretary (Left side of Council) */
export const getGeneralSecretary = (): Person => {
  const person = teamMembers.find((p) => p.isGeneralSecretary || p.role.toLowerCase().includes('general secretary'));
  if (!person) throw new Error('General Secretary not found');
  return person;
};

/** President of the Council */
export const getPresident = (): Person => {
  const person = teamMembers.find((p) => p.isPresident);
  if (!person) throw new Error('President not found');
  return person;
};

/** Vice President of the Council */
export const getVicePresident = (): Person => {
  const person = teamMembers.find((p) => p.isVicePresident);
  if (!person) throw new Error('Vice President not found');
  return person;
};

/** Executive (Middle-left of Council) */
export const getExecutive = (): Person => {
  const person = teamMembers.find(
    (p) => (p.isExecutive || p.role.toLowerCase() === 'executive' || p.role.toLowerCase().includes('executive head')) && p.teamId === 'council'
  );
  if (!person) throw new Error('Executive not found');
  return person;
};

/** Technical Head (Middle-right of Council) */
export const getTechnicalHead = (): Person => {
  const person = teamMembers.find(
    (p) => (p.isTechnicalHead || p.role.toLowerCase().includes('technical head')) && p.teamId === 'council'
  );
  if (!person) throw new Error('Technical Head not found');
  return person;
};

/** Head of Operations (Right side of Council) */
export const getHeadOfOperations = (): Person => {
  const person = teamMembers.find(
    (p) => (p.isOperationalHead || p.role.toLowerCase().includes('operations') || p.role.toLowerCase().includes('operational')) && p.teamId === 'council'
  );
  if (!person) throw new Error('Head of Operations not found');
  return person;
};

/** Backward-compatibility alias */
export const getOperationalHead = getHeadOfOperations;
export const getExecutiveHead = getExecutive;

/** All 4 Council Members in explicit order */
export const getCouncilMembers = (): {
  generalSecretary: Person;
  executive: Person;
  technicalHead: Person;
  headOfOperations: Person;
} => {
  return {
    generalSecretary: getGeneralSecretary(),
    executive: getExecutive(),
    technicalHead: getTechnicalHead(),
    headOfOperations: getHeadOfOperations(),
  };
};

export interface TeamSectionData {
  id: TeamId;
  name: string;
  wing: Wing;
  head: Person | null;
  members: Person[];
  totalCount: number;
}

/**
 * Returns structured team section data for accordions
 */
export const getTeamSections = (): TeamSectionData[] => {
  const sections: { id: TeamId; name: string; wing: Wing }[] = [
    { id: 'infrastructure', name: 'Infrastructure', wing: 'Technical' },
    { id: 'cp', name: 'Competitive programming', wing: 'Technical' },
    { id: 'dsa', name: 'Data structures & algorithms', wing: 'Technical' },
    { id: 'media&creative', name: 'Media & creative', wing: 'Executive' },
    { id: 'publicrelations', name: 'Public Relations', wing: 'Executive' },
    { id: 'eventmanagement', name: 'Event management', wing: 'Executive' },
  ];

  return sections.map((sec) => {
    const teamPeople = teamMembers.filter((p) => p.teamId === sec.id);
    const head = teamPeople.find((p) => p.isHead) || null;
    const members = teamPeople.filter((p) => p.id !== head?.id);

    return {
      id: sec.id,
      name: sec.name,
      wing: sec.wing,
      head,
      members,
      totalCount: teamPeople.length,
    };
  });
};
