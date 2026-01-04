"use client";

import { Search } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

interface BlogFiltersProps {
  searchQuery: string;
  onSearchChange: (value: string) => void;
  filterPublished: string;
  onFilterChange: (status: string) => void;
}

export function BlogFilters({
  searchQuery,
  onSearchChange,
  filterPublished,
  onFilterChange,
}: BlogFiltersProps) {
  return (
    <div className="flex flex-col gap-3 sm:gap-4 sm:flex-row sm:items-center sm:justify-between">
      <div className="relative flex-1 max-w-full sm:max-w-sm">
        <Search className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
        <Input
          placeholder="Search posts..."
          value={searchQuery}
          onChange={(e) => onSearchChange(e.target.value)}
          className="pl-9 w-full"
        />
      </div>
      <div className="flex gap-2 flex-wrap">
        <Button
          variant={filterPublished === "all" ? "default" : "outline"}
          size="sm"
          onClick={() => onFilterChange("all")}
        >
          All
        </Button>
        <Button
          variant={filterPublished === "true" ? "default" : "outline"}
          size="sm"
          onClick={() => onFilterChange("true")}
        >
          Published
        </Button>
        <Button
          variant={filterPublished === "false" ? "default" : "outline"}
          size="sm"
          onClick={() => onFilterChange("false")}
        >
          Drafts
        </Button>
      </div>
    </div>
  );
}

