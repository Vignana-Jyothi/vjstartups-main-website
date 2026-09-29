/**
 * Normalized team member shape used by the Club Page Team Directory tab.
 * The `wing` field comes from the sheet's "Wing Name" column, or else the worksheet/tab name.
 * The sheet's email and phone columns are deliberately not read: they are members' personal
 * contacts and the directory is public.
 */
export interface SheetTeamMember {
  name: string;
  role: string;
  wing: string;
  branch: string;
  year: string;
  linkedinUrl: string;
  instagramUrl: string;
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
