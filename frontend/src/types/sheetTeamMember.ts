/**
 * Normalized team member shape used by the Club Page Team Directory tab.
 * The `wing` field is derived from the Google Sheet worksheet/tab name.
 */
export interface SheetTeamMember {
  name: string;
  role: string;
  wing: string;
  branch: string;
  year: string;
  email: string;
  phone: string;
  linkedinUrl: string;
  imageUrl: string;
  displayOrder: number;
}

export interface TeamDirectoryGroup {
  wing: string;
  wingName: string;
  wingMaster: SheetTeamMember | null;
  coreTeam: SheetTeamMember[];
}

export interface WorksheetInfo {
  title: string;
  sheetId?: number;
}
