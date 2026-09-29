import { Search } from "lucide-react";

interface TeamFilterBarProps {
  searchQuery: string;
  onSearchChange: (value: string) => void;
  selectedWing: string;
  onWingChange: (value: string) => void;
  sheetWings: string[];
  memberCount: number;
  showFilters: boolean;
}

export function TeamFilterBar({
  searchQuery,
  onSearchChange,
  selectedWing,
  onWingChange,
  sheetWings,
  memberCount,
  showFilters,
}: TeamFilterBarProps) {
  if (!showFilters) return null;

  return (
    <div className="lx-toolbar">
      <div className="lx-toolbar-row">
        <label className="lx-search">
          <Search size={18} aria-hidden="true" />
          <input
            type="search"
            placeholder="Search by name, role or branch"
            value={searchQuery}
            onChange={(e) => onSearchChange(e.target.value)}
            aria-label="Search team members"
          />
        </label>
      </div>
      <div>
        <div className="lx-tags-head">
          <span>Filter by wing</span>
          <span>
            {memberCount} {memberCount === 1 ? "member" : "members"}
          </span>
        </div>
        <div className="lx-tags" role="group" aria-label="Filter by wing">
          {["all", ...sheetWings].map((wing) => (
            <button
              key={wing}
              type="button"
              className={`lx-tag${selectedWing === wing ? " is-on" : ""}`}
              aria-pressed={selectedWing === wing}
              onClick={() => onWingChange(wing)}
            >
              {wing === "all" ? "All wings" : wing}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
