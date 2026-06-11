export interface StartupListItem {
  _id: string;
  startupName: string;
  tagline?: string;
  description: string;
  stage: number;
  fundingStatus: string;
  upvotes: number;
  views?: number;
  coverImage?: string;
  logo?: string;
  website?: string;
  createdAt?: string;
  createdBy?: string | { name?: string; email?: string };
}

export type StartupSortOption = "newest" | "upvotes" | "stage";
export type StartupFundingFilter = "all" | string;
