import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { fetchTeamMembersFromGoogleSheet } from "@/services/googleSheetsService";
import { SheetTeamMember, TeamDirectoryGroup } from "@/types/sheetTeamMember";
import {
  filterGroupsByWing,
  getAvailableWings,
  groupMembersByWing,
} from "@/utils/teamMemberTransforms";

const REFRESH_INTERVAL_MS = 30_000;

interface UseTeamMembersFromSheetOptions {
  selectedWing?: string;
}

interface UseTeamMembersFromSheetResult {
  groups: TeamDirectoryGroup[];
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
  const [members, setMembers] = useState<SheetTeamMember[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const isInitialLoad = useRef(true);

  const loadMembers = useCallback(async () => {
    try {
      if (isInitialLoad.current) {
        setIsLoading(true);
      }

      const data = await fetchTeamMembersFromGoogleSheet();
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
    loadMembers();

    const intervalId = window.setInterval(() => {
      loadMembers();
    }, REFRESH_INTERVAL_MS);

    return () => {
      window.clearInterval(intervalId);
    };
  }, [loadMembers]);

  const wings = useMemo(() => getAvailableWings(members), [members]);

  const groups = useMemo(() => {
    const grouped = groupMembersByWing(members);
    return filterGroupsByWing(grouped, selectedWing);
  }, [members, selectedWing]);

  return {
    groups,
    wings,
    isLoading,
    error,
    isEmpty: !isLoading && !error && groups.length === 0,
    refetch: loadMembers,
  };
}
