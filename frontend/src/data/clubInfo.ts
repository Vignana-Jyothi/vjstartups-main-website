export interface TeamMember {
  name: string;
  role: string;
  branch?: string;
  year?: string;
  email?: string;
  phone?: string;
  linkedinUrl?: string;
  imageUrl?: string;
  responsibilities?: string[];
}

export interface SubWing {
  id: string;
  name: string;
  description: string;
  purpose: string;
  status: 'active' | 'planned' | 'completed';
  edition?: number; // How many times conducted
  teamLead: TeamMember;
  team: TeamMember[];
  achievements?: string[];
  currentActivity?: string;
  contactEmail: string;
}

export interface Wing {
  id: string;
  name: string;
  description: string;
  purpose: string;
  focusAreas: string[];
  wingMaster: TeamMember;
  coreTeam: TeamMember[];
  subWings?: SubWing[]; // Added for Ignition Wing
  achievements?: string[];
  currentProjects?: string[];
  contactEmail: string;
}

export interface ClubInfo {
  name: string;
  tagline: string;
  description: string;
  mission: string;
  vision: string;
  foundedYear: string;
  outReach: string;
  totalMembers: number;
  totalStartups: number;
  totalFunding: string;
}

export const clubInfo: ClubInfo = {
  name: "VJ Startups Club",
  tagline: "Empowering Startup Ecosystem at VNRVJIET",
  description: "VJ Startups is a Student Community to empower Startup ecosystem at VNRVJIET. We have a very clear mission to bring out 5 startups every year through awareness creation, running programs, and enabling AI to automate processes.",
  mission: "To bring out 5 startups every year by creating awareness, running comprehensive programs, and enabling AI-powered automation to support the entrepreneurial journey.",
  vision: "To establish VNRVJIET as a leading institution in startup ecosystem development, producing successful entrepreneurs who make significant impact in the industry.",
  foundedYear: "2020",
  outReach: "2000+",
  totalMembers: 200,
  totalStartups: 15,
  totalFunding: "₹2.5 Crores"
};

export const wings: Wing[] = [
  {
    id: "vision-wing",
    name: "Vision Wing 🪽",
    description: "Strategic Leadership that plans the work, reviews performance, and makes strategic decisions",
    purpose: "To provide strategic direction and leadership for the entire VJ Startups ecosystem",
    focusAreas: [
      "Strategic Planning & Vision Setting",
      "Performance Review & Analysis",
      "Decision Making & Policy Formation",
      "Stakeholder Management",
      "Impact Assessment & Improvement"
    ],
    wingMaster: {
      name: "Mr. Pavan Kumar",
      role: "Wing Master - Vision & Strategy",
      email: "22071a1206@vnrvjiet.in",
      phone: "+91 9876543210",
      linkedinUrl: "https://linkedin.com/in/dr-anil-krishnan",
      responsibilities: [
        "Overall strategic planning",
        "Performance monitoring",
        "Strategic decision making"
      ]
    },
    coreTeam: [
      {
        name: "Priya Sharma",
        role: "Strategic Planning Lead",
        branch: "Computer Science",
        year: "4th Year",
        email: "priya.sharma@student.vnrvjiet.in"
      },
      {
        name: "Manoj Kumar Lakkala",
        role: "Performance Analysis Coordinator",
        branch: "Information Technology",
        year: "2nd Year",
        email: "24071a12f4@vnrvjiet.in"
      },
      {
        name: "To be hired",
        role: "To be decided",
      },
      {
        name: "To be hired",
        role: "To be decided",
      },
      {
        name: "To be hired",
        role: "To be decided",
      },
      {
        name: "To be hired",
        role: "To be decided",
      },
      {
        name: "To be hired",
        role: "To be decided",
      },
      {
        name: "To be hired",
        role: "To be decided",
      },
      {
        name: "To be hired",
        role: "To be decided",
      }
    ],
    achievements: [
      "Established 5-startup annual target",
      "Developed strategic roadmap 2024-2026",
      "Implemented performance tracking system"
    ],
    currentProjects: [
      "Annual Strategic Planning Review",
      "Impact Measurement Framework",
      "Stakeholder Engagement Strategy"
    ],
    contactEmail: "vision@vjstartups.vnrvjiet.in"
  },
  {
    id: "ignition-wing",
    name: "Ignition Wing 🪽",
    description: "Program Execution Wing that organizes different programs to give hands-on startup experience",
    purpose: "To execute comprehensive programs that provide practical startup experience to participants",
    focusAreas: [
      "Startup Challenge Programs",
      "Innovation Internships",
      "Evening Focus Groups",
      "Monthly Connect Sessions",
      "Tech Training & Workshops"
    ],
    wingMaster: {
      name: " Sri Kruthi",
      role: "Wing Master - Program Execution",
      email: "meera.patel@vnrvjiet.in",
      phone: "+91 9876543211",
      linkedinUrl: "https://linkedin.com/in/prof-meera-patel",
      responsibilities: [
        "Program design and execution",
        "Workshop coordination",
        "Participant engagement"
      ]
    },
    coreTeam: [
      {
        name: "Veda Nampally",
        role: "Program Coordinator",
        branch: "Computer Science - CSBS",
        year: "2nd Year",
        email: "veda.nampally@student.vnrvjiet.in"
      },
      {
        name: "Kiran Kumar",
        role: "Workshop Manager",
        branch: "Electronics & Communication",
        year: "4th Year",
        email: "kiran.kumar@student.vnrvjiet.in"
      }
      ,{ name: "To be hired", role: "To be decided", }
      ,{ name: "To be hired", role: "To be decided", }
      ,{ name: "To be hired", role: "To be decided", }
      ,{ name: "To be hired", role: "To be decided", }
      ,{ name: "To be hired", role: "To be decided", }
      ,{ name: "To be hired", role: "To be decided", }
      ,{ name: "To be hired", role: "To be decided", }
      ,{ name: "To be hired", role: "To be decided", }
      ,{ name: "To be hired", role: "To be decided", }
      ,{ name: "To be hired", role: "To be decided", }
      ,{ name: "To be hired", role: "To be decided", }
      ,{ name: "To be hired", role: "To be decided", }
      ,{ name: "To be hired", role: "To be decided", }
      ,{ name: "To be hired", role: "To be decided", }
      ,{ name: "To be hired", role: "To be decided", }
      ,{ name: "To be hired", role: "To be decided", }
      ,{ name: "To be hired", role: "To be decided", }
      ,{ name: "To be hired", role: "To be decided", }
      ,{ name: "To be hired", role: "To be decided", }
      ,{ name: "To be hired", role: "To be decided", }
      ,{ name: "To be hired", role: "To be decided", }
      ,{ name: "To be hired", role: "To be decided", }
      ,{ name: "To be hired", role: "To be decided", }
      ,{ name: "To be hired", role: "To be decided", }
      ,{ name: "To be hired", role: "To be decided", }
      ,{ name: "To be hired", role: "To be decided", }
      ,{ name: "To be hired", role: "To be decided", }
      ,{ name: "To be hired", role: "To be decided", }
      ,{ name: "To be hired", role: "To be decided", }
      ,{ name: "To be hired", role: "To be decided", }
      ,{ name: "To be hired", role: "To be decided", }
      ,{ name: "To be hired", role: "To be decided", }
      ,{ name: "To be hired", role: "To be decided", }
      ,{ name: "To be hired", role: "To be decided", }
      ,{ name: "To be hired", role: "To be decided", }
      ,{ name: "To be hired", role: "To be decided", }
      ,{ name: "To be hired", role: "To be decided", }
      ,{ name: "To be hired", role: "To be decided", }
      ,{ name: "To be hired", role: "To be decided", }
      ,{ name: "To be hired", role: "To be decided", }
      ,{ name: "To be hired", role: "To be decided", }
      ,{ name: "To be hired", role: "To be decided", }
      ,{ name: "To be hired", role: "To be decided", }
      ,{ name: "To be hired", role: "To be decided", }
      ,{ name: "To be hired", role: "To be decided", }
      ,{ name: "To be hired", role: "To be decided", }
      ,{ name: "To be hired", role: "To be decided", }
      ,{ name: "To be hired", role: "To be decided", }
    ],
    subWings: [
      {
        id: "startup-challenge",
        name: "Startup Challenge Sub-Wing",
        description: "₹1000 seed money challenge to grow money in 10-15 days with mentorship",
        purpose: "To provide hands-on entrepreneurial experience with real money and mentor support",
        status: "active",
        edition: 2,
        teamLead: {
          name: "Arjun Sharma",
          role: "Startup Challenge Lead",
          branch: "Computer Science",
          year: "3rd Year",
          email: "arjun.sharma@student.vnrvjiet.in",
          responsibilities: [
            "Challenge design and coordination",
            "Mentor assignment and tracking",
            "Progress monitoring and evaluation"
          ]
        },
        team: [
          {
            name: "Priya Reddy",
            role: "Finance Coordinator",
            branch: "MBA",
            year: "2nd Year",
            email: "priya.reddy@student.vnrvjiet.in"
          },
          {
            name: "Kiran Kumar",
            role: "Mentor Coordinator",
            branch: "Information Technology",
            year: "4th Year",
            email: "kiran.kumar@student.vnrvjiet.in"
          },
          {
            name: "Sneha Patel",
            role: "Documentation Manager",
            branch: "Electronics & Communication",
            year: "2nd Year",
            email: "sneha.patel@student.vnrvjiet.in"
          },
          {
            name: "Ravi Kumar",
            role: "Evaluation Coordinator",
            branch: "Mechanical Engineering",
            year: "3rd Year",
            email: "ravi.kumar@student.vnrvjiet.in"
          }
        ],
        achievements: [
          "Successfully conducted 2 seasons",
          "100+ participants across all seasons",
          "₹50,000+ total money distributed"
        ],
        currentActivity: "Planning Season 3 with enhanced mentorship program",
        contactEmail: "startup.challenge@vjstartups.vnrvjiet.in"
      },
      {
        id: "innovation-internship",
        name: "Innovation Internship Sub-Wing",
        description: "1-2 month structured TRL progression program for student problems",
        purpose: "To guide students through Technology Readiness Levels for scheme eligibility",
        status: "active",
        edition: 1,
        teamLead: {
          name: "Deepika Rao",
          role: "Innovation Internship Lead",
          branch: "Computer Science",
          year: "4th Year",
          email: "deepika.rao@student.vnrvjiet.in",
          responsibilities: [
            "TRL framework implementation",
            "Student project guidance",
            "Scheme application support"
          ]
        },
        team: [
          {
            name: "Manoj Reddy",
            role: "TRL1 Coordinator (Problem Clarity)",
            branch: "Information Technology",
            year: "3rd Year",
            email: "manoj.reddy@student.vnrvjiet.in"
          },
          {
            name: "Kavya Sharma",
            role: "TRL2 Coordinator (Solution Clarity)",
            branch: "Computer Science",
            year: "4th Year",
            email: "kavya.sharma@student.vnrvjiet.in"
          },
          {
            name: "Arun Kumar",
            role: "TRL3 Coordinator (Proof of Concept)",
            branch: "Electronics & Communication",
            year: "3rd Year",
            email: "arun.kumar@student.vnrvjiet.in"
          },
          {
            name: "Sita Rani",
            role: "Documentation & Tracking",
            branch: "MBA",
            year: "2nd Year",
            email: "sita.rani@student.vnrvjiet.in"
          }
        ],
        achievements: [
          "10+ students completed TRL progression",
          "5 projects made scheme-eligible",
          "Structured TRL framework established"
        ],
        currentActivity: "Running Batch 2 with 15 participants",
        contactEmail: "innovation.internship@vjstartups.vnrvjiet.in"
      },
      {
        id: "evening-focus-groups",
        name: "Evening Focus Groups Sub-Wing",
        description: "Evening learning sessions for idea development and prototyping",
        purpose: "To provide dedicated time and space for students to work on ideas and build prototypes",
        status: "active",
        edition: 1,
        teamLead: {
          name: "Vikram Patel",
          role: "Evening Focus Groups Lead",
          branch: "Computer Science",
          year: "3rd Year",
          email: "vikram.patel@student.vnrvjiet.in",
          responsibilities: [
            "Session planning and coordination",
            "Resource arrangement",
            "Progress tracking"
          ]
        },
        team: [
          {
            name: "Anita Sharma",
            role: "Learning Coordinator",
            branch: "Information Technology",
            year: "2nd Year",
            email: "anita.sharma@student.vnrvjiet.in"
          },
          {
            name: "Rajesh Kumar",
            role: "Prototype Support",
            branch: "Electronics & Communication",
            year: "4th Year",
            email: "rajesh.kumar@student.vnrvjiet.in"
          },
          {
            name: "Pooja Reddy",
            role: "Resource Manager",
            branch: "Mechanical Engineering",
            year: "3rd Year",
            email: "pooja.reddy@student.vnrvjiet.in"
          },
          {
            name: "Suresh Babu",
            role: "Technical Support",
            branch: "Computer Science",
            year: "4th Year",
            email: "suresh.babu@student.vnrvjiet.in"
          }
        ],
        achievements: [
          "Weekly sessions established",
          "20+ active participants",
          "5 prototypes developed"
        ],
        currentActivity: "Running weekly sessions with focus on AI/ML projects",
        contactEmail: "evening.focus@vjstartups.vnrvjiet.in"
      },
      {
        id: "monthly-connect",
        name: "Monthly Connect Sub-Wing",
        description: "Monthly startup sharing sessions focusing on progress, failures, and learnings",
        purpose: "To create a platform for startups to share experiences and learn from each other",
        status: "active",
        edition: 4,
        teamLead: {
          name: "Lakshmi Devi",
          role: "Monthly Connect Lead",
          branch: "MBA",
          year: "2nd Year",
          email: "lakshmi.devi@student.vnrvjiet.in",
          responsibilities: [
            "Session organization and moderation",
            "Startup coordination",
            "Knowledge documentation"
          ]
        },
        team: [
          {
            name: "Krishna Murthy",
            role: "Event Coordinator",
            branch: "Information Technology",
            year: "3rd Year",
            email: "krishna.murthy@student.vnrvjiet.in"
          },
          {
            name: "Divya Rani",
            role: "Documentation Manager",
            branch: "Computer Science",
            year: "2nd Year",
            email: "divya.rani@student.vnrvjiet.in"
          },
          {
            name: "Harish Kumar",
            role: "Startup Liaison",
            branch: "Electronics & Communication",
            year: "4th Year",
            email: "harish.kumar@student.vnrvjiet.in"
          },
          {
            name: "Nisha Sharma",
            role: "Learning Facilitator",
            branch: "Mechanical Engineering",
            year: "3rd Year",
            email: "nisha.sharma@student.vnrvjiet.in"
          }
        ],
        achievements: [
          "Successfully completed 4 sessions",
          "15+ startups have presented",
          "Knowledge base of learnings created"
        ],
        currentActivity: "Preparing for 5th session with focus on funding challenges",
        contactEmail: "monthly.connect@vjstartups.vnrvjiet.in"
      },
      {
        id: "peer-reviews",
        name: "Peer Reviews Sub-Wing",
        description: "Pitch deck practice and feedback sessions among teams",
        purpose: "To provide early feedback and improve presentation skills through peer reviews",
        status: "planned",
        teamLead: {
          name: "Amit Reddy",
          role: "Peer Reviews Lead",
          branch: "Computer Science",
          year: "3rd Year",
          email: "amit.reddy@student.vnrvjiet.in",
          responsibilities: [
            "Review session coordination",
            "Feedback framework development",
            "Team matching and scheduling"
          ]
        },
        team: [
          {
            name: "Priya Patel",
            role: "Feedback Coordinator",
            branch: "MBA",
            year: "2nd Year",
            email: "priya.patel@student.vnrvjiet.in"
          },
          {
            name: "Karthik Kumar",
            role: "Presentation Support",
            branch: "Information Technology",
            year: "4th Year",
            email: "karthik.kumar@student.vnrvjiet.in"
          },
          {
            name: "Sai Krishna",
            role: "Scheduling Coordinator",
            branch: "Electronics & Communication",
            year: "3rd Year",
            email: "sai.krishna@student.vnrvjiet.in"
          },
          {
            name: "Meera Rao",
            role: "Documentation Manager",
            branch: "Computer Science",
            year: "2nd Year",
            email: "meera.rao@student.vnrvjiet.in"
          }
        ],
        currentActivity: "Developing peer review framework and guidelines",
        contactEmail: "peer.reviews@vjstartups.vnrvjiet.in"
      },
      {
        id: "tech-trainings",
        name: "Tech Trainings Sub-Wing",
        description: "Organizes technical training sessions based on community needs",
        purpose: "To provide relevant technical skills training through targeted workshops",
        status: "active",
        edition: 4,
        teamLead: {
          name: "Sanjay Gupta",
          role: "Tech Trainings Lead",
          branch: "Computer Science",
          year: "4th Year",
          email: "sanjay.gupta@student.vnrvjiet.in",
          responsibilities: [
            "Training needs assessment",
            "Workshop organization",
            "Expert coordination"
          ]
        },
        team: [
          {
            name: "Rohit Sharma",
            role: "Tech Bytes Coordinator",
            branch: "Information Technology",
            year: "3rd Year",
            email: "rohit.sharma@student.vnrvjiet.in"
          },
          {
            name: "Neha Reddy",
            role: "AI Immersion Lead",
            branch: "Computer Science",
            year: "4th Year",
            email: "neha.reddy@student.vnrvjiet.in"
          },
          {
            name: "Arjun Patel",
            role: "Codelabs Coordinator",
            branch: "Electronics & Communication",
            year: "3rd Year",
            email: "arjun.patel@student.vnrvjiet.in"
          },
          {
            name: "Kavitha Rani",
            role: "Training Coordinator",
            branch: "Information Technology",
            year: "2nd Year",
            email: "kavitha.rani@student.vnrvjiet.in"
          }
        ],
        achievements: [
          "Conducted 15+ tech training sessions",
          "500+ participants trained",
          "3 major workshop series completed"
        ],
        currentActivity: "Planning AI Immersion intensive workshop series",
        contactEmail: "tech.trainings@vjstartups.vnrvjiet.in"
      },
      {
        id: "problem-hunt",
        name: "Problem Hunt Sub-Wing",
        description: "Event organization for problem collection, upvoting, and reward allocation",
        purpose: "To systematically collect and validate real-world problems for startup development",
        status: "active",
        edition: 2,
        teamLead: {
          name: "Ravi Teja",
          role: "Problem Hunt Lead",
          branch: "Computer Science",
          year: "3rd Year",
          email: "ravi.teja@student.vnrvjiet.in",
          responsibilities: [
            "Event planning and execution",
            "Problem validation process",
            "Reward system management"
          ]
        },
        team: [
          {
            name: "Swathi Reddy",
            role: "Event Coordinator",
            branch: "MBA",
            year: "2nd Year",
            email: "swathi.reddy@student.vnrvjiet.in"
          },
          {
            name: "Naveen Kumar",
            role: "Problem Validation Lead",
            branch: "Information Technology",
            year: "4th Year",
            email: "naveen.kumar@student.vnrvjiet.in"
          },
          {
            name: "Geetha Rani",
            role: "Community Engagement",
            branch: "Electronics & Communication",
            year: "3rd Year",
            email: "geetha.rani@student.vnrvjiet.in"
          },
          {
            name: "Sunil Reddy",
            role: "Reward Coordinator",
            branch: "Mechanical Engineering",
            year: "2nd Year",
            email: "sunil.reddy@student.vnrvjiet.in"
          }
        ],
        achievements: [
          "Successfully conducted 2 problem hunt events",
          "200+ problems collected",
          "50+ problems validated and upvoted"
        ],
        currentActivity: "Organizing Problem Hunt Season 3 with focus on sustainability",
        contactEmail: "problem.hunt@vjstartups.vnrvjiet.in"
      },
      {
        id: "idea-jammings",
        name: "Idea Jammings Sub-Wing",
        description: "Collaborative solution brainstorming and team formation sessions",
        purpose: "To facilitate collaborative ideation and form teams for solution development",
        status: "planned",
        teamLead: {
          name: "Madhavi Sharma",
          role: "Idea Jammings Lead",
          branch: "Computer Science",
          year: "3rd Year",
          email: "madhavi.sharma@student.vnrvjiet.in",
          responsibilities: [
            "Ideation session facilitation",
            "Team formation process",
            "Solution validation support"
          ]
        },
        team: [
          {
            name: "Venkat Reddy",
            role: "Facilitation Coordinator",
            branch: "Information Technology",
            year: "4th Year",
            email: "venkat.reddy@student.vnrvjiet.in"
          },
          {
            name: "Aparna Rao",
            role: "Team Formation Lead",
            branch: "Computer Science",
            year: "2nd Year",
            email: "aparna.rao@student.vnrvjiet.in"
          },
          {
            name: "Satish Kumar",
            role: "Solution Tracking",
            branch: "Electronics & Communication",
            year: "3rd Year",
            email: "satish.kumar@student.vnrvjiet.in"
          },
          {
            name: "Jyothi Reddy",
            role: "Documentation Manager",
            branch: "MBA",
            year: "2nd Year",
            email: "jyothi.reddy@student.vnrvjiet.in"
          }
        ],
        currentActivity: "Developing ideation framework and team formation guidelines",
        contactEmail: "idea.jammings@vjstartups.vnrvjiet.in"
      },
      {
        id: "campus-digitisation",
        name: "Campus Digitisation Sub-Wing",
        description: "Identifies manual activities and promotes digital solutions development",
        purpose: "To digitize campus processes and provide opportunities for student product development",
        status: "active",
        teamLead: {
          name: "Prasad Reddy",
          role: "Campus Digitisation Lead",
          branch: "Computer Science",
          year: "4th Year",
          email: "prasad.reddy@student.vnrvjiet.in",
          responsibilities: [
            "Manual process identification",
            "Digitisation project coordination",
            "Student team management"
          ]
        },
        team: [
          {
            name: "Ramya Devi",
            role: "Process Analysis Lead",
            branch: "Information Technology",
            year: "3rd Year",
            email: "ramya.devi@student.vnrvjiet.in"
          },
          {
            name: "Srikanth Kumar",
            role: "Development Coordinator",
            branch: "Computer Science",
            year: "4th Year",
            email: "srikanth.kumar@student.vnrvjiet.in"
          },
          {
            name: "Latha Rani",
            role: "Data Centralisation Lead",
            branch: "Information Technology",
            year: "2nd Year",
            email: "latha.rani@student.vnrvjiet.in"
          },
          {
            name: "Mohan Reddy",
            role: "Implementation Support",
            branch: "Electronics & Communication",
            year: "3rd Year",
            email: "mohan.reddy@student.vnrvjiet.in"
          }
        ],
        achievements: [
          "10+ manual processes identified",
          "5 digitisation projects initiated",
          "Data centralisation framework developed"
        ],
        currentActivity: "Working on library management system digitisation",
        contactEmail: "campus.digitisation@vjstartups.vnrvjiet.in"
      }
    ],
    achievements: [
      "Conducted 5+ Startup Challenges",
      "Organized 15+ Tech Training sessions",
      "Managed 100+ program participants"
    ],
    currentProjects: [
      "Startup Challenge Season 3",
      "Innovation Internship Batch 2",
      "AI Immersion Workshop Series"
    ],
    contactEmail: "ignition@vjstartups.vnrvjiet.in"
  },
  {
    id: "echo-wing",
    name: "Echo Wing 🪽",
    description: "Media & Outreach wing that prepares media content and circulates to wider audience",
    purpose: "To amplify VJ Startups' reach through strategic media and outreach initiatives",
    focusAreas: [
      "Content Creation & Design",
      "Social Media Management",
      "WhatsApp & Email Campaigns",
      "Video & Podcast Production",
      "PR & Class-to-Class Promotions"
    ],
    wingMaster: {
      name: "Mr. Sriramcharan Gurvindapalli",
      role: "Wing Master - Media & Outreach",
      email: "24071a6691@vnrvjiet.in",
      phone: "+91 97034 49569",
      linkedinUrl: "https://linkedin.com/in/prof-sanjay-gupta",
      responsibilities: [
        "Media strategy planning",
        "Content oversight",
        "Outreach coordination"
      ]
    },
    coreTeam: [
      {
        name: "Ananya Singh",
        role: "Content Creation Lead",
        branch: "Psychology",
        year: "3rd Year",
        email: "ananya.singh@student.vnrvjiet.in"
      },
      {
        name: "Deepika Rao",
        role: "Social Media Manager",
        branch: "Computer Science",
        year: "3rd Year",
        email: "deepika.rao@student.vnrvjiet.in"
      }
      ,{ name: "To be hired", role: "To be decided", }
      ,{ name: "To be hired", role: "To be decided", }
      ,{ name: "To be hired", role: "To be decided", }
      ,{ name: "To be hired", role: "To be decided", }
      ,{ name: "To be hired", role: "To be decided", }
      ,{ name: "To be hired", role: "To be decided", }
      ,{ name: "To be hired", role: "To be decided", }
      ,{ name: "To be hired", role: "To be decided", }
      ,{ name: "To be hired", role: "To be decided", }
      ,{ name: "To be hired", role: "To be decided", }
      ,{ name: "To be hired", role: "To be decided", }
      ,{ name: "To be hired", role: "To be decided", }
    ],
    achievements: [
      "10K+ social media reach",
      "50+ promotional campaigns",
      "15+ YouTube videos produced"
    ],
    currentProjects: [
      "Campus-wide Awareness Campaign",
      "Success Stories Video Series",
      "Weekly Podcast Production"
    ],
    contactEmail: "echo@vjstartups.vnrvjiet.in"
  },
  {
    id: "talent-wing",
    name: "Talent Wing 🪽",
    description: "Prepares formal internships for eligible members with faculty coordination",
    purpose: "To provide structured internship opportunities and professional development for startup enthusiasts",
    focusAreas: [
      "Internship Program Design",
      "Offer Letter Management",
      "Weekly Progress Tracking",
      "Faculty Coordination",
      "Attendance & Credit Management"
    ],
    wingMaster: {
      name: "Dr. Rajesh Kumar",
      role: "Wing Master - Talent Development",
      email: "rajesh.kumar@vnrvjiet.in",
      phone: "+91 9876543213",
      linkedinUrl: "https://linkedin.com/in/dr-rajesh-kumar",
      responsibilities: [
        "Internship program oversight",
        "Faculty coordination",
        "Student progress monitoring"
      ]
    },
    coreTeam: [
      {
        name: "Sneha Rao",
        role: "Internship Coordinator",
        branch: "Information Technology",
        year: "3rd Year",
        email: "sneha.rao@student.vnrvjiet.in"
      },
      {
        name: "Rahul Mehta",
        role: "Progress Tracking Lead",
        branch: "Mechanical Engineering",
        year: "4th Year",
        email: "rahul.mehta@student.vnrvjiet.in"
      } 
      ,{ name: "To be hired", role: "To be decided", }
      ,{ name: "To be hired", role: "To be decided", }
      ,{ name: "To be hired", role: "To be decided", }
      ,{ name: "To be hired", role: "To be decided", }
      ,{ name: "To be hired", role: "To be decided", }
      ,{ name: "To be hired", role: "To be decided", }
    ],
    achievements: [
      "50+ formal internships provided",
      "All department faculty onboarded",
      "95% internship completion rate"
    ],
    currentProjects: [
      "Half-day Internship Program",
      "Full-day Startup Internships",
      "Faculty Mentorship Network"
    ],
    contactEmail: "talent@vjstartups.vnrvjiet.in"
  },
  {
    id: "fuel-wing",
    name: "Fuel Wing 🪽",
    description: "Understands financial support needs and helps through available schemes and grants",
    purpose: "To provide financial guidance and connect startups with funding opportunities",
    focusAreas: [
      "Funding Scheme Research",
      "Grant Application Support",
      "Financial Planning Guidance",
      "Investor Connect Programs",
      "Government Scheme Navigation"
    ],
    wingMaster: {
      name: "Prof. Lakshmi Devi",
      role: "Wing Master - Financial Support",
      email: "lakshmi.devi@vnrvjiet.in",
      phone: "+91 9876543214",
      linkedinUrl: "https://linkedin.com/in/prof-lakshmi-devi",
      responsibilities: [
        "Funding strategy development",
        "Grant application oversight",
        "Financial mentorship"
      ]
    },
    coreTeam: [
      {
        name: "Vikram Reddy",
        role: "Funding Research Lead",
        branch: "MBA",
        year: "2nd Year",
        email: "vikram.reddy@student.vnrvjiet.in"
      },
      {
        name: "Pooja Sharma",
        role: "Grant Application Coordinator",
        branch: "Computer Science",
        year: "4th Year",
        email: "pooja.sharma@student.vnrvjiet.in"
      }
      ,{ name: "To be hired", role: "To be decided", }
      ,{ name: "To be hired", role: "To be decided", }
      ,{ name: "To be hired", role: "To be decided", }
      ,{ name: "To be hired", role: "To be decided", }
      ,{ name: "To be hired", role: "To be decided", }
      ,{ name: "To be hired", role: "To be decided", }
      ,{ name: "To be hired", role: "To be decided", }
      ,{ name: "To be hired", role: "To be decided", }
      ,{ name: "To be hired", role: "To be decided", }
    ],
    achievements: [
      "₹25 lakhs funding secured for startups",
      "15+ grant applications submitted",
      "10+ schemes identified and documented"
    ],
    currentProjects: [
      "Government Scheme Database",
      "Investor Pitch Training",
      "Funding Application Workshop Series"
    ],
    contactEmail: "fuel@vjstartups.vnrvjiet.in"
  },
  {
    id: "core-wing",
    name: "Core Wing 🪽",
    description: "Handles college infrastructure to deploy servers and ensures all apps are working properly",
    purpose: "To provide technical infrastructure support for all VJ Startups digital initiatives",
    focusAreas: [
      "Server Deployment & Management",
      "Application Monitoring",
      "Infrastructure Maintenance",
      "Security & Backup Management",
      "Technical Support Services"
    ],
    wingMaster: {
      name: "Prof. Krishna Murthy",
      role: "Wing Master - Core Infrastructure",
      email: "krishna.murthy@vnrvjiet.in",
      phone: "+91 9876543215",
      linkedinUrl: "https://linkedin.com/in/prof-krishna-murthy",
      responsibilities: [
        "Infrastructure planning",
        "Technical oversight",
        "System maintenance"
      ]
    },
    coreTeam: [
      {
        name: "Ravi Kumar",
        role: "Infrastructure Lead",
        branch: "Computer Science",
        year: "4th Year",
        email: "ravi.kumar@student.vnrvjiet.in"
      },
      {
        name: "Sita Rani",
        role: "Application Monitor",
        branch: "Information Technology",
        year: "3rd Year",
        email: "sita.rani@student.vnrvjiet.in"
      }
      ,{ name: "To be hired", role: "To be decided", }
      ,{ name: "To be hired", role: "To be decided", }
      ,{ name: "To be hired", role: "To be decided", }
      ,{ name: "To be hired", role: "To be decided", }
    ],
    achievements: [
      "99.9% server uptime maintained",
      "10+ applications deployed",
      "Zero major security incidents"
    ],
    currentProjects: [
      "Campus Cloud Infrastructure",
      "Application Performance Optimization",
      "Backup & Disaster Recovery Setup"
    ],
    contactEmail: "core@vjstartups.vnrvjiet.in"
  },
  {
    id: "digital-wing",
    name: "Digital Wing 🪽",
    description: "Works on enabling digitisation at campus and streamlines applications for startup activities",
    purpose: "To digitize campus processes and create digital solutions for startup ecosystem management",
    focusAreas: [
      "Campus Digitization Projects",
      "Student Data Management",
      "Faculty Portal Development",
      "Alumni Network Platform",
      "Startup Activity Automation"
    ],
    wingMaster: {
      name: "Dr. Priya Reddy",
      role: "Wing Master - Digital Transformation",
      email: "priya.reddy@vnrvjiet.in",
      phone: "+91 9876543216",
      linkedinUrl: "https://linkedin.com/in/dr-priya-reddy",
      responsibilities: [
        "Digital strategy planning",
        "Platform development oversight",
        "Data management coordination"
      ]
    },
    coreTeam: [
      {
        name: "Manoj Kumar",
        role: "Digital Solutions Lead",
        branch: "Computer Science",
        year: "4th Year",
        email: "manoj.kumar@student.vnrvjiet.in"
      },
      {
        name: "Kavya Reddy",
        role: "Data Management Coordinator",
        branch: "Information Technology",
        year: "3rd Year",
        email: "kavya.reddy@student.vnrvjiet.in"
      }
      ,{ name: "To be hired", role: "To be decided", }
      ,{ name: "To be hired", role: "To be decided", }
      ,{ name: "To be hired", role: "To be decided", }
      ,{ name: "To be hired", role: "To be decided", }
      ,{ name: "To be hired", role: "To be decided", }
      ,{ name: "To be hired", role: "To be decided", }
      ,{ name: "To be hired", role: "To be decided", }
    ],
    achievements: [
      "15+ manual processes digitized",
      "Integrated student-faculty-alumni data",
      "Automated startup activity tracking"
    ],
    currentProjects: [
      "Complete Campus Digital Ecosystem",
      "AI-powered Startup Matching",
      "Centralized Data Platform"
    ],
    contactEmail: "digital@vjstartups.vnrvjiet.in"
  },
  {
    id: "flying-wing",
    name: "Flying Wing 🪽",
    description: "Builds actual applications and digital solutions for the startup ecosystem",
    purpose: "To develop and maintain all software applications required for VJ Startups operations",
    focusAreas: [
      "Web Application Development",
      "Mobile App Development",
      "AI & ML Solutions",
      "Database Management",
      "System Integration"
    ],
    wingMaster: {
      name: "Prof. Suresh Babu",
      role: "Wing Master - Application Development",
      email: "suresh.babu@vnrvjiet.in",
      phone: "+91 9876543217",
      linkedinUrl: "https://linkedin.com/in/prof-suresh-babu",
      responsibilities: [
        "Development team coordination",
        "Technical architecture decisions",
        "Code quality oversight"
      ]
    },
    coreTeam: [
      {
        name: "Arun Reddy",
        role: "Full Stack Development Lead",
        branch: "Computer Science",
        year: "4th Year",
        email: "arun.reddy@student.vnrvjiet.in"
      },
      {
        name: "Divya Sharma",
        role: "Mobile App Development Lead",
        branch: "Information Technology",
        year: "3rd Year",
        email: "divya.sharma@student.vnrvjiet.in"
      },
      {
        name: "Karthik Kumar",
        role: "AI/ML Development Lead",
        branch: "Computer Science",
        year: "4th Year",
        email: "karthik.kumar@student.vnrvjiet.in"
      }
    ],
    achievements: [
      "20+ applications developed",
      "100+ active developers",
      "AI-powered automation implemented"
    ],
    currentProjects: [
      "VJ Hub Platform Enhancement",
      "Mobile App for Startup Tracking",
      "AI Assistant for Entrepreneurs"
    ],
    contactEmail: "flying@vjstartups.vnrvjiet.in"
  }
];

// Helper functions
export const getWingById = (id: string): Wing | undefined => {
  return wings.find(wing => wing.id === id);
};

export const getWingByName = (name: string): Wing | undefined => {
  return wings.find(wing => wing.name.toLowerCase().includes(name.toLowerCase()));
};

export const getAllWingMasters = (): TeamMember[] => {
  return wings.map(wing => wing.wingMaster);
};

export const getAllTeamMembers = (): TeamMember[] => {
  const allMembers: TeamMember[] = [];
  wings.forEach(wing => {
    allMembers.push(wing.wingMaster);
    allMembers.push(...wing.coreTeam);
  });
  return allMembers;
};
