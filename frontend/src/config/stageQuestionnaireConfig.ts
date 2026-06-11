export interface StageQuestionnaireConfig {
  stageId: number;
  stageName: string;
  title: string;
  description: string;
  steps: QuestionnaireStep[];
}

export interface QuestionnaireStep {
  id: string;
  title: string;
  description: string;
  icon: string;
  trl?: string;
  questions: QuestionnaireQuestion[];
  acceptanceCriteria?: AcceptanceCriteria[];
}

export interface QuestionnaireQuestion {
  id: string;
  type: 'text' | 'textarea' | 'select' | 'multiselect' | 'scale' | 'checkbox';
  label: string;
  placeholder?: string;
  required: boolean;
  options?: string[];
  validation?: {
    minLength?: number;
    maxLength?: number;
    min?: number;
    max?: number;
  };
}

export interface AcceptanceCriteria {
  id: string;
  text: string;
  completed: boolean;
}

export const stageQuestionnaireConfigs: StageQuestionnaireConfig[] = [
  {
    stageId: 0,
    stageName: "Idea & Concept",
    title: "Idea & Concept to Research & Feasibility Transition",
    description: "Validate your idea's foundation before moving to research phase",
    steps: [
      {
        id: "idea-concept",
        title: "Idea & Concept",
        description: "Define and validate your core concept",
        icon: "Lightbulb",
        trl: "TRL 1-2",
        questions: [
          {
            id: "problemSolving",
            type: "textarea",
            label: "What problem are you solving?",
            placeholder: "Clearly describe the specific problem you're addressing",
            required: true,
            validation: { minLength: 50 }
          },
          {
            id: "customerPersona",
            type: "textarea",
            label: "Who experiences this problem most acutely (customer persona)?",
            placeholder: "Describe your target customer persona in detail",
            required: true,
            validation: { minLength: 5 }
          },
          {
            id: "valueProposition",
            type: "textarea",
            label: "What is your one-line value proposition?",
            placeholder: "Summarize your value proposition in one clear sentence",
            required: true,
            validation: { minLength: 10 }
          },
          {
            id: "marketSize",
            type: "textarea",
            label: "How big is the potential market (rough estimate)?",
            placeholder: "Provide a rough estimate of your market size",
            required: false,
            validation: { minLength: 10 }
          },
          {
            id: "personalMotivation",
            type: "textarea",
            label: "Why are you personally motivated to solve this problem?",
            placeholder: "Explain your personal connection to this problem",
            required: false,
            validation: { minLength: 20 }
          }
        ],
        acceptanceCriteria: [
          {
            id: "problem-statement",
            text: "Clearly articulated problem statement",
            completed: false
          },
          {
            id: "customer-persona",
            text: "Defined customer persona",
            completed: false
          },
          {
            id: "value-proposition",
            text: "Initial value proposition documented",
            completed: false
          }
        ]
      }
    ]
  },
  {
    stageId: 1,
    stageName: "Research & Feasibility",
    title: "Research & Feasibility to Validation Transition",
    description: "Conduct thorough research and feasibility analysis",
    steps: [
      {
        id: "research-feasibility",
        title: "Research & Feasibility",
        description: "Analyze market, competition, and technical feasibility",
        icon: "Search",
        trl: "TRL 2-3",
        questions: [
          {
            id: "existingSolutions",
            type: "textarea",
            label: "What existing solutions or competitors are in the market?",
            placeholder: "List and analyze existing solutions and competitors",
            required: true,
            validation: { minLength: 20 }
          },
          {
            id: "gapsAndDifferentiators",
            type: "textarea",
            label: "What gaps or differentiators exist for your idea?",
            placeholder: "Identify market gaps and your unique differentiators",
            required: true,
            validation: { minLength: 20 }
          },
          {
            id: "technologiesNeeded",
            type: "textarea",
            label: "What technologies/tools are needed to build your solution?",
            placeholder: "List required technologies, tools, and resources",
            required: true,
            validation: { minLength: 10 }
          },
          {
            id: "topRisks",
            type: "textarea",
            label: "What are the top 3 risks you foresee (technical/market/financial)?",
            placeholder: "Identify and describe your top 3 risks",
            required: true,
            validation: { minLength: 10 }
          },
          {
            id: "marketSizing",
            type: "textarea",
            label: "Have you estimated a rough TAM, SAM, SOM?",
            placeholder: "Provide your Total Addressable Market, Serviceable Available Market, and Serviceable Obtainable Market estimates",
            required: false,
            validation: { minLength: 5 }
          }
        ],
        acceptanceCriteria: [
          {
            id: "competitive-analysis",
            text: "Competitive landscape analysis completed",
            completed: false
          },
          {
            id: "feasibility-study",
            text: "Feasibility study (tech + market) documented",
            completed: false
          },
          {
            id: "unique-differentiator",
            text: "At least one unique differentiator identified",
            completed: false
          }
        ]
      }
    ]
  },
  {
    stageId: 2,
    stageName: "Validation",
    title: "Validation to Prototype Transition",
    description: "Validate your concept before building a prototype",
    steps: [
      {
        id: "concept-validation",
        title: "Validation",
        description: "Validate your solution concept with users",
        icon: "CheckCircle",
        trl: "TRL 3-4",
        questions: [
          {
            id: "customerInterviews",
            type: "textarea",
            label: "Have you spoken to potential customers? (How many?)",
            placeholder: "Describe your customer interviews and the number of people you spoke with",
            required: true,
            validation: { minLength:2 }
          },
          {
            id: "problemConfirmation",
            type: "textarea",
            label: "What percentage confirm they face this problem?",
            placeholder: "Provide the percentage and details of problem validation",
            required: true,
            validation: { minLength: 2 }
          },
          {
            id: "willingnessToPay",
            type: "textarea",
            label: "Would they pay for a solution like yours?",
            placeholder: "Describe their willingness to pay and any pricing insights",
            required: true,
            validation: { minLength: 10 }
          },
          {
            id: "uncertainAssumptions",
            type: "textarea",
            label: "What assumptions are you still unsure about?",
            placeholder: "List the key assumptions that need further validation",
            required: true,
            validation: { minLength: 10 }
          },
          {
            id: "lettersOfIntent",
            type: "textarea",
            label: "Do you have any letters of intent (LOIs) or pilot interest?",
            placeholder: "Describe any commitments or strong interest from potential customers",
            required: false,
            validation: { minLength: 10 }
          }
        ],
        acceptanceCriteria: [
          {
            id: "customer-interviews",
            text: "Minimum 20–30 customer interviews completed",
            completed: false
          },
          {
            id: "problem-validation",
            text: "Documented validation that majority confirm problem relevance",
            completed: false
          },
          {
            id: "willingness-to-pay",
            text: "Evidence of early willingness to pay or adopt",
            completed: false
          }
        ]
      }
    ]
  },
  {
    stageId: 3,
    stageName: "Prototype",
    title: "Prototype to MVP Transition",
    description: "Build and test your prototype",
    steps: [
      {
        id: "prototype-development",
        title: "Prototype",
        description: "Develop and test your prototype",
        icon: "Wrench",
        trl: "TRL 4",
        questions: [
          {
            id: "prototypeDemo",
            type: "textarea",
            label: "Do you have a low-fidelity mockup/wireframe or clickable demo?",
            placeholder: "Describe your prototype and its current state",
            required: true,
            validation: { minLength: 10 }
          },
          {
            id: "usabilityTesting",
            type: "textarea",
            label: "Have you tested usability with target users?",
            placeholder: "Describe your usability testing process and participants",
            required: true,
            validation: { minLength: 30 }
          },
          {
            id: "prototypeFeedback",
            type: "textarea",
            label: "What feedback did you collect from prototype testing?",
            placeholder: "Summarize key feedback and insights from testing",
            required: true,
            validation: { minLength: 50 }
          },
          {
            id: "iterationCount",
            type: "textarea",
            label: "How many iterations have you made based on feedback?",
            placeholder: "Describe the iterations and improvements made",
            required: false,
            validation: { minLength: 20 }
          }
        ],
        acceptanceCriteria: [
          {
            id: "prototype-created",
            text: "Prototype/demo created",
            completed: false
          },
          {
            id: "user-testing",
            text: "At least 5–10 target users tested it",
            completed: false
          },
          {
            id: "feedback-documented",
            text: "Documented feedback and improvements identified",
            completed: false
          }
        ]
      }
    ]
  },
  {
    stageId: 4,
    stageName: "MVP",
    title: "MVP to Testing & Iteration Transition",
    description: "Build and deploy your MVP",
    steps: [
      {
        id: "mvp-development",
        title: "MVP",
        description: "Develop and deploy your minimum viable product",
        icon: "Rocket",
        trl: "TRL 5-6",
        questions: [
          {
            id: "coreFeatures",
            type: "textarea",
            label: "Does your MVP include the core feature set?",
            placeholder: "List the core features included in your MVP",
            required: true,
            validation: { minLength: 40 }
          },
          {
            id: "functionalUsability",
            type: "textarea",
            label: "Is it functional and usable by real customers?",
            placeholder: "Describe the functionality and user experience",
            required: true,
            validation: { minLength: 40 }
          },
          {
            id: "analyticsTracking",
            type: "textarea",
            label: "Do you have analytics/tracking in place?",
            placeholder: "Describe your analytics setup and key metrics tracked",
            required: true,
            validation: { minLength: 30 }
          },
          {
            id: "pilotCustomers",
            type: "textarea",
            label: "Who are your first pilot customers?",
            placeholder: "Identify and describe your initial pilot customers",
            required: true,
            validation: { minLength: 5 }
          },
          {
            id: "unitEconomics",
            type: "textarea",
            label: "What is the MVP cost structure and unit economics?",
            placeholder: "Describe your cost structure and unit economics model",
            required: false,
            validation: { minLength: 10 }
          }
        ],
        acceptanceCriteria: [
          {
            id: "mvp-deployed",
            text: "MVP deployed to at least 5+ early adopters",
            completed: false
          },
          {
            id: "core-problem-solved",
            text: "Product solves at least one core pain point",
            completed: false
          },
          {
            id: "positive-feedback",
            text: "Positive feedback indicating repeat usage intent",
            completed: false
          }
        ]
      }
    ]
  },
  {
    stageId: 5,
    stageName: "Testing & Iteration",
    title: "Testing & Iteration to Launch & Early Growth Transition",
    description: "Validate your testing and iteration results before launch",
    steps: [
      {
        id: "testing-iteration",
        title: "Testing & Iteration",
        description: "Validate your testing methodology and iteration process",
        icon: "RefreshCw",
        trl: "TRL 6-7",
        questions: [
          {
            id: "testingMethodology",
            type: "textarea",
            label: "What testing methodology did you use?",
            placeholder: "A/B testing, user testing, beta testing, performance testing approaches",
            required: true,
            validation: { minLength: 50 }
          },
          {
            id: "keyMetrics",
            type: "textarea",
            label: "What key metrics did you track during testing?",
            placeholder: "User engagement, conversion rates, retention, satisfaction scores, performance metrics",
            required: true,
            validation: { minLength: 40 }
          },
          {
            id: "iterationCycles",
            type: "textarea",
            label: "How many iteration cycles have you completed?",
            placeholder: "Describe your iteration cycles and what you learned from each",
            required: true,
            validation: { minLength: 40 }
          },
          {
            id: "userFeedbackIntegration",
            type: "textarea",
            label: "How did you integrate user feedback into iterations?",
            placeholder: "Process for collecting, analyzing, and implementing user feedback",
            required: true,
            validation: { minLength: 40 }
          },
          {
            id: "performanceOptimization",
            type: "textarea",
            label: "What performance optimizations have you made?",
            placeholder: "Speed, reliability, scalability, and user experience improvements",
            required: false,
            validation: { minLength: 30 }
          },
          // Revenue Validation Questions for TRL 6
          {
            id: "revenueModelIdentified",
            type: "select",
            label: "Have you identified and validated your revenue model?",
            placeholder: "Select your revenue model validation status",
            required: true,
            options: [
              "Yes, validated with customers",
              "Identified but not validated", 
              "Still exploring options",
              "No clear model yet"
            ]
          },
          {
            id: "customerWillingnessToPay",
            type: "select",
            label: "Have potential customers expressed willingness to pay for your solution?",
            placeholder: "Select customer payment willingness level",
            required: true,
            options: [
              "Yes, multiple customers confirmed",
              "Yes, few customers confirmed",
              "Mixed feedback received",
              "No clear indication yet"
            ]
          },
          {
            id: "pricingStrategy",
            type: "textarea",
            label: "What pricing strategy have you developed and tested?",
            placeholder: "Pricing models tested, customer price sensitivity research, competitive pricing analysis",
            required: true,
            validation: { minLength: 40 }
          },
          {
            id: "marketValidationScore",
            type: "scale",
            label: "Rate your market validation success (1-5 scale)",
            placeholder: "1 = Poor validation, 5 = Strong market validation",
            required: true,
            validation: { min: 1, max: 5 }
          }
        ],
        acceptanceCriteria: [
          {
            id: "comprehensive-testing",
            text: "Comprehensive testing completed with at least 50+ users",
            completed: false
          },
          {
            id: "iteration-cycles",
            text: "At least 3 iteration cycles completed based on feedback",
            completed: false
          },
          {
            id: "performance-benchmarks",
            text: "Performance benchmarks meet or exceed industry standards",
            completed: false
          },
          {
            id: "revenue-model-validated",
            text: "Revenue model identified and validated with potential customers",
            completed: false
          },
          {
            id: "customer-payment-willingness",
            text: "Evidence of customer willingness to pay for the solution",
            completed: false
          }
        ]
      }
    ]
  },
  {
    stageId: 6,
    stageName: "Launch & Early Growth",
    title: "Launch & Early Growth to Scaling Transition",
    description: "Validate your launch success and early growth metrics",
    steps: [
      {
        id: "launch-early-growth",
        title: "Launch & Early Growth",
        description: "Evaluate launch performance and early growth indicators",
        icon: "Rocket",
        trl: "TRL 7-8",
        questions: [
          {
            id: "launchStrategy",
            type: "textarea",
            label: "What was your launch strategy and execution?",
            placeholder: "Launch channels, timeline, marketing approach, and execution details",
            required: true,
            validation: { minLength: 50 }
          },
          {
            id: "initialTraction",
            type: "textarea",
            label: "What initial traction have you achieved?",
            placeholder: "User acquisition numbers, engagement rates, early revenue, market response",
            required: true,
            validation: { minLength: 40 }
          },
          {
            id: "customerAcquisition",
            type: "textarea",
            label: "What are your customer acquisition costs and channels?",
            placeholder: "CAC by channel, most effective acquisition methods, conversion rates",
            required: true,
            validation: { minLength: 40 }
          },
          {
            id: "productMarketFit",
            type: "textarea",
            label: "What evidence do you have of product-market fit?",
            placeholder: "User retention, organic growth, referrals, customer satisfaction scores",
            required: true,
            validation: { minLength: 40 }
          },
          {
            id: "revenueModel",
            type: "textarea",
            label: "How is your revenue model performing?",
            placeholder: "Revenue streams, pricing validation, unit economics, profitability timeline",
            required: true,
            validation: { minLength: 40 }
          },
          // Enhanced Revenue Generation Questions for TRL 7
          {
            id: "revenueGenerated",
            type: "select",
            label: "Have you generated any revenue from your solution?",
            placeholder: "Select your current revenue status",
            required: true,
            options: [
              "Yes, consistent revenue stream",
              "Yes, initial sales completed",
              "Pre-orders/commitments received",
              "No revenue generated yet"
            ]
          },
          {
            id: "revenueAmount",
            type: "text",
            label: "What is your monthly recurring revenue (MRR) or total revenue to date?",
            placeholder: "e.g., ₹50,000 MRR or ₹2,00,000 total revenue",
            required: false,
            validation: { minLength: 5 }
          },
          {
            id: "customerBase",
            type: "text",
            label: "How many paying customers do you currently have?",
            placeholder: "Number of active paying customers",
            required: true,
            validation: { minLength: 1 }
          },
          {
            id: "fundingNeeds",
            type: "select",
            label: "Do you need external funding to scale your solution?",
            placeholder: "Select your funding requirements",
            required: true,
            options: [
              "Yes, actively seeking funding",
              "Yes, but not immediately",
              "Bootstrapping for now",
              "No funding needed"
            ]
          },
          {
            id: "scalabilityPlan",
            type: "textarea",
            label: "What is your plan for scaling the business?",
            placeholder: "Growth strategy, market expansion, team scaling, operational scaling plans",
            required: true,
            validation: { minLength: 50 }
          }
        ],
        acceptanceCriteria: [
          {
            id: "successful-launch",
            text: "Successful product launch with measurable user adoption",
            completed: false
          },
          {
            id: "early-revenue",
            text: "Revenue generation established with paying customers",
            completed: false
          },
          {
            id: "growth-trajectory",
            text: "Positive growth trajectory established (users/revenue)",
            completed: false
          },
          {
            id: "startup-readiness",
            text: "Business model validated and ready for startup formation",
            completed: false
          },
          {
            id: "scaling-plan",
            text: "Clear scaling plan and market expansion strategy defined",
            completed: false
          }
        ]
      }
    ]
  },
  {
    stageId: 7,
    stageName: "Scaling",
    title: "Scaling to Maturity & Exit Transition",
    description: "Validate your scaling achievements and readiness for maturity",
    steps: [
      {
        id: "scaling",
        title: "Scaling",
        description: "Evaluate scaling performance and operational maturity",
        icon: "TrendingUp",
        trl: "TRL 8-9",
        questions: [
          {
            id: "scalingMetrics",
            type: "textarea",
            label: "What scaling milestones have you achieved?",
            placeholder: "User growth, revenue growth, market expansion, team scaling metrics",
            required: true,
            validation: { minLength: 50 }
          },
          {
            id: "operationalEfficiency",
            type: "textarea",
            label: "How have you improved operational efficiency?",
            placeholder: "Process automation, team productivity, cost optimization, system scalability",
            required: true,
            validation: { minLength: 40 }
          },
          {
            id: "marketExpansion",
            type: "textarea",
            label: "What market expansion have you achieved?",
            placeholder: "New customer segments, geographic expansion, product line extensions",
            required: true,
            validation: { minLength: 40 }
          },
          {
            id: "competitivePosition",
            type: "textarea",
            label: "What is your competitive position in the market?",
            placeholder: "Market share, competitive advantages, brand recognition, barriers to entry",
            required: true,
            validation: { minLength: 40 }
          },
          {
            id: "sustainableGrowth",
            type: "textarea",
            label: "Is your growth sustainable and profitable?",
            placeholder: "Profitability metrics, cash flow, unit economics, growth sustainability",
            required: true,
            validation: { minLength: 40 }
          }
        ],
        acceptanceCriteria: [
          {
            id: "significant-scale",
            text: "Achieved significant scale (10x+ growth from launch)",
            completed: false
          },
          {
            id: "profitable-operations",
            text: "Profitable operations with positive unit economics",
            completed: false
          },
          {
            id: "market-leadership",
            text: "Established market leadership or strong competitive position",
            completed: false
          }
        ]
      }
    ]
  },
  {
    stageId: 8,
    stageName: "Maturity & Exit",
    title: "Maturity & Exit Evaluation",
    description: "Evaluate maturity achievements and exit opportunities",
    steps: [
      {
        id: "maturity-exit",
        title: "Maturity & Exit",
        description: "Assess business maturity and strategic exit options",
        icon: "Award",
        trl: "TRL 9",
        questions: [
          {
            id: "businessMaturity",
            type: "textarea",
            label: "What indicators show your business has reached maturity?",
            placeholder: "Market dominance, stable revenue, established operations, industry recognition",
            required: true,
            validation: { minLength: 50 }
          },
          {
            id: "financialPerformance",
            type: "textarea",
            label: "What is your current financial performance?",
            placeholder: "Revenue, profitability, cash flow, valuation, financial stability metrics",
            required: true,
            validation: { minLength: 40 }
          },
          {
            id: "exitOpportunities",
            type: "textarea",
            label: "What exit opportunities are available?",
            placeholder: "Acquisition interest, IPO potential, merger opportunities, strategic partnerships",
            required: true,
            validation: { minLength: 40 }
          },
          {
            id: "strategicOptions",
            type: "textarea",
            label: "What are your strategic options moving forward?",
            placeholder: "Continue growth, seek acquisition, go public, pivot to new markets, maintain status quo",
            required: true,
            validation: { minLength: 40 }
          },
          {
            id: "legacyImpact",
            type: "textarea",
            label: "What impact has your startup made?",
            placeholder: "Market transformation, customer value created, industry influence, social impact",
            required: false,
            validation: { minLength: 40 }
          }
        ],
        acceptanceCriteria: [
          {
            id: "market-maturity",
            text: "Achieved market maturity with stable, profitable operations",
            completed: false
          },
          {
            id: "exit-readiness",
            text: "Business is exit-ready with clear valuation and options",
            completed: false
          },
          {
            id: "strategic-clarity",
            text: "Clear strategic direction for next phase identified",
            completed: false
          }
        ]
      }
    ]
  }
];

export const getQuestionnaireForStage = (fromStage: number): StageQuestionnaireConfig | null => {
  // Convert from 1-based stage numbers to 0-based stageId
  const stageId = fromStage - 1;
  return stageQuestionnaireConfigs.find(config => config.stageId === stageId) || null;
};

export const getStageTransitionTitle = (fromStage: number, toStage: number, stageLabels: string[]): string => {
  if (fromStage >= 0 && fromStage < stageLabels.length && toStage >= 0 && toStage < stageLabels.length) {
    return `${stageLabels[fromStage]} → ${stageLabels[toStage]} Validation`;
  }
  return "Stage Transition Validation";
};
