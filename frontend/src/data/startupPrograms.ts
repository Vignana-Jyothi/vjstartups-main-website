// The programs themselves are site content (see siteContent.ts): stored in the database and
// edited at /manage. This file holds their shape and the labels the pages use.
export interface StartupProgram {
  id: string;
  title: string;
  subtitle: string;
  duration: string;
  status: 'active' | 'planned' | 'completed';
  edition?: number | null; // How many times conducted
  category: 'challenge' | 'internship' | 'learning' | 'networking' | 'training' | 'event' | 'initiative';
  /** Listed under "Support you can get" on the home page. */
  onHomePage?: boolean;
  shortDescription: string;
  overview: string;
  howToParticipate?: string[];
  support?: string[];
  benefits?: string[];
  eligibility?: string[];
  timeline?: string[];
  resources?: {
    title: string;
    description: string;
    link?: string;
  }[];
  mentors?: {
    name: string;
    designation: string;
    expertise?: string[];
    department?: string;
    email?: string;
    availability?: string;
    location?: string;
    contact?: string;
    whatsappNumber?: string;
    note?: string;
    resumeLink?: string;
  }[];
  contact?: {
    email?: string;
    coordinator?: string;
  };
}

export const PROGRAM_CATEGORIES: Record<StartupProgram["category"], string> = {
  challenge: "Challenges & Competitions",
  internship: "Internships & Mentorship",
  learning: "Learning & Development",
  networking: "Networking & Community",
  training: "Technical Training",
  event: "Events & Workshops",
  initiative: "Campus Initiatives",
};

export const PROGRAM_STATUS: Record<StartupProgram["status"], string> = {
  active: "Running",
  completed: "Completed",
  planned: "Planned",
};
