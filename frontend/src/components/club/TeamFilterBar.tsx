import { Search, Users } from "lucide-react";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

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
    <div className="rounded-vj-large border border-vj-border bg-vj-surface p-4 shadow-[var(--vj-shadow-subtle)] md:p-6">
      <div className="mb-4 flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex items-center gap-2">
          <Users className="h-5 w-5 text-vj-accent" aria-hidden="true" />
          <h2 className="text-lg font-semibold text-vj-primary md:text-xl">Team Directory</h2>
        </div>
        <p className="text-sm text-vj-muted">
          {memberCount} {memberCount === 1 ? "member" : "members"} found
        </p>
      </div>

      <div className="flex flex-col gap-3 md:flex-row md:items-center">
        <div className="relative flex-1">
          <Search
            className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-vj-muted"
            aria-hidden="true"
          />
          <Input
            type="search"
            placeholder="Search by name, role, or branch..."
            value={searchQuery}
            onChange={(e) => onSearchChange(e.target.value)}
            className="min-h-[44px] rounded-vj-button border-vj-border pl-10"
            aria-label="Search team members"
          />
        </div>

        <div className="flex items-center gap-3">
          {/* Segmented control for medium+ screens */}
          <div className="hidden md:flex items-center gap-2 overflow-x-auto px-1">
            <button
              onClick={() => onWingChange('all')}
              className={
                `min-h-[44px] rounded-vj-button px-4 py-2 text-sm transition-all duration-150 ${
                  selectedWing === 'all'
                    ? 'bg-[hsl(var(--vj-accent))] text-[hsl(var(--vj-accent-foreground))] shadow-[var(--vj-shadow-subtle)]'
                    : 'bg-transparent border border-vj-border text-[hsl(var(--text-muted))] hover:bg-[hsl(var(--card))/0.04]'
                }`
              }
            >
              All
            </button>

            {sheetWings.map((wing) => (
              <button
                key={wing}
                onClick={() => onWingChange(wing)}
                className={
                  `min-h-[44px] rounded-vj-button px-4 py-2 text-sm transition-all duration-150 ${
                    selectedWing === wing
                      ? 'bg-[hsl(var(--vj-accent))] text-[hsl(var(--vj-accent-foreground))] shadow-[var(--vj-shadow-subtle)]'
                      : 'bg-transparent border border-vj-border text-[hsl(var(--text-muted))] hover:bg-[hsl(var(--card))/0.04]'
                  }`
                }
              >
                {wing}
              </button>
            ))}
          </div>

          {/* Fallback select for small screens */}
          <div className="md:hidden w-full">
            <Select value={selectedWing} onValueChange={onWingChange}>
              <SelectTrigger className="min-h-[44px] w-full rounded-vj-button" aria-label="Filter by wing">
                <SelectValue placeholder="Filter by wing" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Members</SelectItem>
                {sheetWings.map((wing) => (
                  <SelectItem key={wing} value={wing}>
                    {wing}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>
      </div>
    </div>
  );
}
