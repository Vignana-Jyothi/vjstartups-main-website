export interface Participant {
  name: string;
  branch: string;
  year: string;
  role?: string; // Team lead, Developer, etc.
  linkedinUrl?: string;
  instagramUrl?: string;
  imageUrl?: string;
  socialLinks?: {
    platform: 'linkedin' | 'instagram' | 'twitter' | 'github' | 'portfolio';
    url: string;
    displayName?: string;
  }[];
}

export interface SuccessStory {
  id: string;
  programId: string; // Links to StartupProgram.id
  season: string; // "Season 2", "Batch 1", "Edition 3"
  title: string;
  subtitle: string;
  date: string; // When the program was conducted
  participants: Participant[];
  
  // Content options - choose what fits best for each story
  contentType: 'web' | 'pdf' | 'hybrid';
  
  // For web content
  overview?: string;
  journey?: {
    phase: string;
    description: string;
    achievement?: string;
    imageUrl?: string;
  }[];
  outcomes?: {
    title: string;
    description: string;
    metrics?: string; // "₹15,000 revenue", "500+ users"
  }[];
  quotes?: {
    text: string;
    author: string;
    designation: string;
  }[];
  gallery?: {
    type: 'image' | 'video';
    url: string;
    caption?: string;
  }[];
  
  // For PDF content
  pdfUrl?: string;
  pdfDescription?: string;
  
  // Common metadata
  tags: string[];
  featured: boolean; // Highlight exceptional stories
  achievements: string[]; // Key accomplishments
}

export const successStories: SuccessStory[] = [
  {
    id: 'startup-challenge-season-2-veda-dance',
    programId: 'startup-challenge-2',
    season: 'Season 2',
    title: 'From ₹0 to ₹12,000: Dance Coaching',
    subtitle: 'How Veda trained apartment kids for Ganesh fest dance event.',
    date: 'Aug-2025',
    participants: [
      {
        name: 'Veda Nampally',
        branch: 'Computer Science - CSBS',
        year: '2nd',
        imageUrl: '/success-stories/veda_nampally.webp',
        socialLinks: [
          {
            platform: 'linkedin',
            url: 'https://linkedin.com/in/veda-nampally',
            displayName: 'LinkedIn'
          },
          {
            platform: 'instagram', 
            url: 'https://instagram.com/veda_nampally',
            displayName: 'Instagram'
          }
        ]
      }
    ],
    contentType: 'web',
    overview: `Veda started with zero investment and identified an opportunity to teach dance to kids in her apartment complex for the upcoming Ganesh festival. Through her structured approach to training and community engagement, she successfully earned ₹12,000 while creating a memorable cultural experience for the children and families.`,
    journey: [
      {
        phase: 'Day 1-2: Opportunity Identification',
        description: 'Noticed apartment kids needed dance training for Ganesh festival celebrations',
        achievement: 'Identified 20+ interested kids and confirmed parent interest',
      },
      {
        phase: 'Day 3-5: Program Design',
        description: 'Created structured dance curriculum and practice schedule for different age groups',
        achievement: 'Designed 10-day intensive training program with daily 2-hour sessions'
      },
      {
        phase: 'Day 6-10: Training Delivery',
        description: 'Conducted daily dance training sessions with kids aged 5-15 years',
        achievement: 'Successfully trained 10 kids with 90% attendance rate'
      },
      {
        phase: 'Day 11-15: Event Success',
        description: 'Kids performed at the Ganesh festival celebration with great success',
        achievement: 'Standing ovation performance, ₹12,000 total earnings, requests for future events'
      }
    ],
    outcomes: [
      {
        title: 'Financial Success',
        description: 'Generated ₹12,000 revenue with ₹1,000 initial investment',
        metrics: '1200% ROI in 15 days'
      },
      {
        title: 'Community Impact', 
        description: 'Trained 10 kids and created memorable cultural experience for families',
        metrics: '90+% attendance rate, 100% parent satisfaction'
      },
      {
        title: 'Skill Development',
        description: 'Enhanced teaching, leadership and event management skills',
        metrics: '5 requests for future dance training programs'
      }
    ],
    quotes: [
      {
        text: "I never thought I could turn my passion for dance into a business opportunity. The Startup Challenge pushed me to think creatively and take action. Seeing the kids perform with confidence was the biggest reward.",
        author: 'Veda Nampally',
        designation: 'Dance Instructor & Entrepreneur'
      }
    ],
    gallery: [
      {
        type: 'image',
        url: '/success-stories/veda_team.webp',
        caption: 'Veda with the kids during dance training session'
      },      
      {
        type: 'video',
        url: 'https://youtu.be/zPyqROpLbOY?t=889',
        caption: 'Final presentation at Startup Challenge showcase'
      }
    ],
    tags: ['dance-coaching', 'community-engagement', 'cultural-events', 'teaching'],
    featured: true,
    achievements: [
      '1200% Return on Investment',
      '10 Kids Successfully Trained',
      '100% Parent Satisfaction',
      'Standing Ovation Performance'
    ]
  }
];

// Helper functions
export const getSuccessStoriesByProgram = (programId: string): SuccessStory[] => {
  return successStories.filter(story => story.programId === programId);
};

export const getFeaturedSuccessStories = (): SuccessStory[] => {
  return successStories.filter(story => story.featured);
};

export const getSuccessStoryById = (id: string): SuccessStory | undefined => {
  return successStories.find(story => story.id === id);
};

// Dates are stored either as ISO ("2024-06-30") or as "Aug-2025". new Date() only parses the
// second form in Chrome, so both are formatted here as "June 2024" / "Aug 2025".
export const formatStoryDate = (date: string): string => {
  const iso = /^(\d{4})-(\d{2})(?:-(\d{2}))?$/.exec(date);
  if (!iso) return date.replace(/-/g, " ");
  const parsed = new Date(Number(iso[1]), Number(iso[2]) - 1, Number(iso[3] ?? 1));
  return parsed.toLocaleDateString("en-IN", { month: "long", year: "numeric" });
};
