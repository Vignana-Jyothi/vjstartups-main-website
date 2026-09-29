import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { fetchTeamMembersFromGoogleSheet } from "@/services/googleSheetsService";
import { CLUB_TEAM } from "@/data/clubTeam";
import { SheetTeamMember, TeamDirectoryGroup } from "@/types/sheetTeamMember";
import { extractSpreadsheetId } from "@/utils/spreadsheetUtils";
import {
  filterGroupsByWing,
  getAvailableWings,
  groupMembersByWing,
} from "@/utils/teamMemberTransforms";

const REFRESH_INTERVAL_MS = 30_000;

// The team comes from the bundled 2026-27 list (data/clubTeam.ts). Setting VITE_TEAM_SHEET_ID
// to a Google Sheet (id or link) switches the page to that sheet, re-read every 30s, so the club
// can edit it live. That sheet must be viewable by link, which exposes every column to anyone,
// so it must not hold emails or phone numbers. The older VITE_GOOGLE_SPREADSHEET_ID still points
// at the 2025 sheet and is deliberately not used here.
const TEAM_SHEET = import.meta.env.VITE_TEAM_SHEET_ID?.trim();

interface UseTeamMembersFromSheetOptions {
  selectedWing?: string;
}

interface UseTeamMembersFromSheetResult {
  groups: TeamDirectoryGroup[];
  allGroups: TeamDirectoryGroup[];
  wings: string[];
  isLoading: boolean;
  error: string | null;
  isEmpty: boolean;
  refetch: () => Promise<void>;
}

export function useTeamMembersFromSheet(
  options: UseTeamMembersFromSheetOptions = {}
): UseTeamMembersFromSheetResult {
  const { selectedWing = "all" } = options;
  const [members, setMembers] = useState<SheetTeamMember[]>(() => (TEAM_SHEET ? [] : CLUB_TEAM));
  const [isLoading, setIsLoading] = useState(Boolean(TEAM_SHEET));
  const [error, setError] = useState<string | null>(null);
  const isInitialLoad = useRef(true);

  const loadMembers = useCallback(async () => {
    try {
      if (isInitialLoad.current) {
        setIsLoading(true);
      }

      if (!TEAM_SHEET) {
        setMembers(CLUB_TEAM);
        setError(null);
        return;
      }
      const data = await fetchTeamMembersFromGoogleSheet(extractSpreadsheetId(TEAM_SHEET));
      setMembers(data);
      setError(null);
    } catch (loadError) {
      const message =
        loadError instanceof Error
          ? loadError.message
          : "Failed to load team directory from Google Sheet.";

      console.error("[useTeamMembersFromSheet] Fetch failed:", loadError);
      setError(message);
    } finally {
      if (isInitialLoad.current) {
        setIsLoading(false);
        isInitialLoad.current = false;
      }
    }
  }, []);

  useEffect(() => {
    if (!TEAM_SHEET) return;
    loadMembers();

    const intervalId = window.setInterval(() => {
      loadMembers();
    }, REFRESH_INTERVAL_MS);

    return () => {
      window.clearInterval(intervalId);
    };
  }, [loadMembers]);

  const wings = useMemo(() => getAvailableWings(members), [members]);

  const allGroups = useMemo(() => groupMembersByWing(members), [members]);

  const groups = useMemo(
    () => filterGroupsByWing(allGroups, selectedWing),
    [allGroups, selectedWing]
  );

  return {
    groups,
    allGroups,
    wings,
    isLoading,
    error,
    isEmpty: !isLoading && !error && groups.length === 0,
    refetch: loadMembers,
  };
}
