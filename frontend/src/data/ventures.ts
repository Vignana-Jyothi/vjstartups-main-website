// Funded ventures from the VJ Startups portfolio, as listed on the live site. The homepage's
// Proof section and the Startups page both read this list, so they can't contradict each other.
export type FundedVenture = {
  name: string;
  sector: string;
  description: string;
  /** Homepage photo slot for this venture (see src/assets/photos/README.md). */
  photo: "energy" | "health" | "iot";
};

export const FUNDED_VENTURES: readonly FundedVenture[] = [
  {
    name: "ATLAST Hydrogen Solutions",
    sector: "Clean Energy",
    description: "Hydrogen fuel-cell technology transforming automotive and energy applications.",
    photo: "energy",
  },
  {
    name: "Salcit AI Health",
    sector: "HealthTech",
    description: "AI-powered cough analysis for respiratory screening and remote monitoring.",
    photo: "health",
  },
  {
    name: "Alltronics IoT Solutions",
    sector: "Industrial IoT",
    description: "Smart IoT and AI-enabled electronic testing, EV battery monitoring, and industrial automation.",
    photo: "iot",
  },
];
