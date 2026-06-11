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
        imageUrl: '/src/assets/veda_nampally.png',
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
        url: '/src/assets/veda_team.png',
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
  },
  {
    id: 'innovation-internship-batch-1-smart-irrigation',
    programId: 'innovation-internship-1',
    season: 'Batch 1',
    title: 'Smart Irrigation System for Water Conservation',
    subtitle: 'Agriculture IoT solution developed through structured TRL progression',
    date: '2024-06-30',
    participants: [
      {
        name: 'Kiran Kumar',
        branch: 'Electronics & Communication',
        year: '4th Year',
        role: 'Hardware Lead',
        linkedinUrl: 'https://linkedin.com/in/kiran-kumar-vnrvjiet'
      },
      {
        name: 'Deepika Rao',
        branch: 'Computer Science',
        year: '3rd Year',
        role: 'Software Developer'
      }
    ],
    contentType: 'hybrid',
    overview: `Kiran and Deepika developed an IoT-based smart irrigation system that reduces water usage by 40% while improving crop yield. Their solution progressed through all TRL levels and is now being piloted in 5 local farms.`,
    outcomes: [
      {
        title: 'Water Conservation',
        description: 'Achieved 40% reduction in water usage through sensor-based automation',
        metrics: '40% water savings'
      },
      {
        title: 'Crop Yield Improvement',
        description: 'Optimized watering schedule led to 25% increase in crop yield',
        metrics: '25% yield increase'
      },
      {
        title: 'Commercial Validation',
        description: 'Secured pilots with 5 local farms and 2 potential customers',
        metrics: '₹2,50,000 potential revenue pipeline'
      }
    ],
    pdfUrl: '/documents/success-stories/smart-irrigation-detailed-report.pdf',
    pdfDescription: 'Comprehensive 25-page report including technical specifications, TRL progression documentation, market analysis, and pilot results with farmer testimonials.',
    tags: ['iot', 'agriculture', 'water-conservation', 'sensors'],
    featured: true,
    achievements: [
      'TRL 1-3 Completion in 2 Months',
      '40% Water Usage Reduction',
      '5 Farm Pilots Secured',
      'Patent Application Filed'
    ]
  },
  {
    id: 'problem-hunt-season-2-mental-health',
    programId: 'problem-hunt-2',
    season: 'Season 2',
    title: 'Mental Health Support System Design',
    subtitle: 'Community-driven problem identification leading to solution development',
    date: '2024-09-15',
    participants: [
      {
        name: 'Ananya Singh',
        branch: 'Psychology',
        year: '3rd Year',
        role: 'Problem Researcher'
      },
      {
        name: 'Rahul Mehta',
        branch: 'Computer Science',
        year: '4th Year',
        role: 'Solution Architect'
      }
    ],
    contentType: 'pdf',
    overview: `During Problem Hunt Season 2, Ananya identified mental health support as the most upvoted problem. This led to a comprehensive research and solution design that's now being developed as a campus mental health platform.`,
    pdfUrl: '/documents/success-stories/mental-health-problem-to-solution.pdf',
    pdfDescription: 'Complete journey from problem identification to solution design, including research methodology, community feedback analysis, solution architecture, and implementation roadmap.',
    tags: ['mental-health', 'community-research', 'problem-identification'],
    featured: false,
    achievements: [
      'Most Upvoted Problem (250+ votes)',
      'Comprehensive Research Report',
      'Solution Design Approved',
      'Development Grant Secured'
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
