export interface StartupHelp {
  importance: string;
  terminology?: Record<string, string>;
  examples?: string[];
  tips?: string[];
}

export const startupHelpContent: Record<string, StartupHelp> = {
  // Basic Information
  "startupName": {
    importance: "Your startup name is your brand identity. It should be memorable, easy to pronounce, and reflect your company's mission or values.",
    tips: [
      "Keep it short and memorable (2-3 words ideal)",
      "Ensure domain availability for website",
      "Check for trademark conflicts",
      "Make sure it's easy to spell and pronounce"
    ],
    examples: [
      "Tech: Google, Apple, Meta",
      "Descriptive: PayPal, LinkedIn, Instagram",
      "Made-up: Kodak, Xerox, Spotify"
    ]
  },

  "tagline": {
    importance: "A tagline is a brief, memorable phrase that captures your startup's essence and value proposition. It's often the first thing people remember about your company.",
    terminology: {
      "Tagline": "A short phrase that summarizes what your company does or stands for",
      "Value proposition": "The unique benefit you provide to customers"
    },
    examples: [
      "Nike: 'Just Do It'",
      "Apple: 'Think Different'",
      "McDonald's: 'I'm Lovin' It'",
      "Startup example: 'AI-powered healthcare for everyone'"
    ],
    tips: [
      "Keep it under 10 words",
      "Focus on benefits, not features",
      "Make it memorable and unique",
      "Test it with your target audience"
    ]
  },

  "description": {
    importance: "Your startup description explains what your company does, how it solves problems, and why it matters. This is crucial for investor pitches and customer understanding.",
    tips: [
      "Start with the problem you're solving",
      "Explain your solution clearly",
      "Highlight what makes you different",
      "Use simple, non-technical language",
      "Keep it concise but comprehensive (2-3 paragraphs)"
    ]
  },

  // Team Information
  "founders": {
    importance: "Founder information establishes credibility and shows the leadership behind the startup. Highlight relevant skills, academic background or achievements.",
    tips: [
      "List all founders with their roles and key qualifications",
      "Include year of study and department for students",
      "Mention relevant coursework, projects, or internships",
      "For faculty: Include teaching/research areas and achievements",
      "Highlight complementary skills across the founding team",
      "Include any previous startup experience or leadership roles"
    ],
    examples: [
      "Rahul Sharma (B.Tech CSE, 3rd year) - Technical Lead with web dev experience",
      "Dr. Priya Menon (Assistant Professor, ECE) - Industry advisor with 8 years R&D experience", 
      "Ananya Reddy (MBA 2nd year) - Business development, former marketing intern at Flipkart",
      "Multiple founders: Separate each founder with their background and role"
    ],
    terminology: {
      "Founding team": "All students/faculty who started the venture together",
      "Technical founder": "Responsible for product development and technology",
      "Business founder": "Handles strategy, marketing, and operations",
      "Academic advisor": "Faculty member providing guidance and mentorship"
    }
  },

  "teamSize": {
    importance: "Team size indicates your startup's scale and capability. For college startups, this shows how many committed students and faculty are actively involved.",
    terminology: {
      "Core team": "Students/faculty working regularly on the startup (10+ hours/week)",
      "Extended team": "Contributors working part-time or on specific projects",
      "Academic mentors": "Faculty advisors providing guidance (count separately)",
      "Student contributors": "Active students from different years/departments"
    },
    tips: [
      "Count only highly committed team members",
      "Include founders, active students, and key faculty advisors",
      "Don't count casual contributors or one-time helpers",
      "Consider academic commitments - part-time involvement is normal",
      "Mention if team size varies by semester",
      "Include diverse skill sets across the team"
    ],
    examples: [
      "5 members: 3 B.Tech students + 1 MBA student + 1 faculty advisor",
      "8 members: 4 core students + 2 part-time contributors + 2 faculty mentors",
      "3 members: 2 final year students + 1 assistant professor"
    ]
  },

  // Business Information
  "stage": {
    importance: "Your development stage helps investors and partners understand where you are in your journey and what support you need.",
    terminology: {
      "Idea (1-2)": "Concept stage with basic validation",
      "Research (3)": "Deep market and technical research phase",
      "Prototype (4-5)": "Building and testing initial versions",
      "Product (6-7)": "Refined product ready for market",
      "Scale (8-9)": "Growing user base and revenue"
    },
    tips: [
      "Be honest about your current stage",
      "Having paying customers indicates later stages",
      "Prototype means you have something functional to show",
      "Don't inflate your stage - it affects expectations"
    ]
  },

  "fundingStatus": {
    importance: "Funding status shows your financial position and what type of investors might be interested in your startup.",
    terminology: {
      "Bootstrapped": "Self-funded, no external investment",
      "Seeking funding": "Actively looking for investors",
      "Pre-seed": "$50K-$500K, very early stage",
      "Seed": "$500K-$2M, product development",
      "Series A": "$2M-$15M, scaling business"
    },
    tips: [
      "Match your stage with appropriate funding level",
      "Bootstrapped shows financial discipline",
      "Seeking funding means you should have a clear plan",
      "Don't claim higher rounds without proof"
    ]
  },

  "revenue": {
    importance: "Revenue demonstrates market validation and business viability. It's one of the strongest indicators of startup success.",
    terminology: {
      "MRR": "Monthly Recurring Revenue",
      "ARR": "Annual Recurring Revenue",
      "GMV": "Gross Merchandise Value (for marketplaces)"
    },
    tips: [
      "Use actual revenue, not projected",
      "Specify the time period (monthly/annual)",
      "Include revenue model (subscription, one-time, etc.)",
      "Be prepared to verify with financial statements"
    ],
    examples: [
      "₹50,000 MRR (SaaS subscription)",
      "₹2,00,000 annual revenue (service business)",
      "₹10,00,000 GMV (marketplace platform)"
    ]
  },

  "customers": {
    importance: "Customer numbers show market traction and validate demand for your product or service.",
    terminology: {
      "Paying customers": "Users who have paid for your product/service",
      "Active users": "Users who regularly engage with your product",
      "Registered users": "Total users who have signed up"
    },
    tips: [
      "Specify what type of customers (paying/active/registered)",
      "Use actual numbers, not estimates",
      "Include growth rate if impressive",
      "Quality over quantity - 100 paying customers > 10,000 free users"
    ],
    examples: [
      "150 paying customers",
      "2,500 active monthly users",
      "500 registered users, 100 paying"
    ]
  },

  // Business Model
  "businessModel": {
    importance: "Your business model explains how you make money and create value for customers. It's essential for investor evaluation.",
    terminology: {
      "B2B": "Business to Business - selling to companies",
      "B2C": "Business to Consumer - selling to individuals",
      "SaaS": "Software as a Service - subscription software",
      "Marketplace": "Platform connecting buyers and sellers",
      "Freemium": "Free basic version, paid premium features"
    },
    examples: [
      "SaaS subscription model - $99/month per user",
      "Marketplace with 3% transaction fee",
      "E-commerce with direct product sales",
      "Freemium with premium features at $19/month"
    ],
    tips: [
      "Explain how you make money clearly",
      "Include pricing structure",
      "Show scalability potential",
      "Compare with successful similar companies"
    ]
  },

  // Market Analysis
  "marketSize": {
    importance: "Market size shows the potential opportunity for your startup. Investors need to see a large enough market to generate significant returns.",
    terminology: {
      "TAM": "Total Addressable Market - entire market demand",
      "SAM": "Serviceable Addressable Market - market you can reach",
      "SOM": "Serviceable Obtainable Market - market you can realistically capture"
    },
    tips: [
      "Use credible sources (research reports, government data)",
      "Be realistic - avoid inflated numbers",
      "Focus on your specific segment",
      "Include currency (₹ for Indian market, $ for global)"
    ],
    examples: [
      "₹50,000 crore (Indian ed-tech market)",
      "$500B (global healthcare IT market)",
      "₹15,000 crore (Indian fintech market)"
    ]
  },

  "marketGrowthRate": {
    importance: "Market growth rate indicates whether you're entering a growing or declining market. High growth markets offer more opportunities.",
    terminology: {
      "CAGR": "Compound Annual Growth Rate",
      "YoY": "Year over Year growth",
      "Market trends": "Direction the market is moving"
    },
    tips: [
      "Use industry reports for accurate data",
      "Mention the time period (5-year CAGR)",
      "Compare with other markets if favorable",
      "Include source of data"
    ],
    examples: [
      "25% CAGR (next 5 years)",
      "15% annual growth",
      "35% YoY growth in 2024"
    ]
  },

  "targetUsers": {
    importance: "Target users define your specific customer segment. This helps in product development, marketing, and investor understanding.",
    tips: [
      "Be specific about demographics",
      "Include psychographics (behavior, interests)",
      "Mention where you can reach them",
      "Estimate the number in your target segment"
    ],
    examples: [
      "Small business owners (1-50 employees) in tier-1 cities",
      "College students aged 18-24 in engineering",
      "Working professionals earning ₹8-15 LPA in tech"
    ]
  },

  // Progress & Recognition
  "supportPrograms": {
    importance: "Support programs and recognition add credibility and show external validation of your startup's potential.",
    examples: [
      "Government: Startup India, BIRAC, DST grants",
      "Incubators: T-Hub, NASSCOM, university incubators",
      "Accelerators: Techstars, Y Combinator, local accelerators",
      "Recognition: Awards, competitions, media coverage"
    ],
    tips: [
      "Include application status (selected/applied/considering)",
      "Mention any funding or benefits received",
      "Add credible competitions and awards",
      "Include mentorship programs"
    ]
  },

  "milestones": {
    importance: "Milestones show your progress and planning ability. They help investors understand your timeline and key achievements.",
    terminology: {
      "MVP": "Minimum Viable Product",
      "Product-Market Fit": "When your product satisfies market demand",
      "Break-even": "When revenue equals expenses"
    },
    tips: [
      "Include both completed and planned milestones",
      "Set realistic and specific deadlines",
      "Focus on business milestones, not just technical ones",
      "Include metrics where possible"
    ],
    examples: [
      "MVP launch - March 2024 (Completed)",
      "First 100 customers - June 2024",
      "Break-even - December 2024",
      "Series A funding - Q2 2025"
    ]
  },

  // Documents & Media
  "pitchDeck": {
    importance: "A pitch deck is essential for investor meetings. It should tell your startup's story in 10-15 slides.",
    tips: [
      "Include: Problem, Solution, Market, Business Model, Traction, Team, Financials, Ask",
      "Keep slides visual and concise",
      "Tell a compelling story",
      "Practice your presentation",
      "Update regularly with latest metrics"
    ]
  },

  "onePager": {
    importance: "A one-pager is a concise summary of your startup that investors can quickly review and share internally.",
    tips: [
      "Include all key information on one page",
      "Use clear, professional design",
      "Include contact information",
      "Make it easy to scan quickly",
      "Update with latest achievements"
    ]
  }
};