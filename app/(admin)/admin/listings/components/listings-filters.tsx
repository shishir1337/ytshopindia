"use client";

import { Search } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

interface ListingsFiltersProps {
  searchQuery: string;
  onSearchChange: (value: string) => void;
  filterStatus: string;
  onFilterChange: (status: string) => void;
}

export function ListingsFilters({
  searchQuery,
  onSearchChange,
  filterStatus,
  onFilterChange,
}: ListingsFiltersProps) {
  return (
    <div className="flex flex-col gap-3 sm:gap-4 sm:flex-row sm:items-center sm:justify-between">
      <div className="relative flex-1 max-w-full sm:max-w-sm">
        <Search className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
        <Input
          placeholder="Search listings..."
          value={searchQuery}
          onChange={(e) => onSearchChange(e.target.value)}
          className="pl-9 w-full"
        />
      </div>
      <div className="flex gap-2 flex-wrap">
        <Button
          variant={filterStatus === "all" ? "default" : "outline"}
          size="sm"
          onClick={() => onFilterChange("all")}
        >
          All
        </Button>
        <Button
          variant={filterStatus === "pending" ? "default" : "outline"}
          size="sm"
          onClick={() => onFilterChange("pending")}
        >
          Pending
        </Button>
        <Button
          variant={filterStatus === "approved" ? "default" : "outline"}
          size="sm"
          onClick={() => onFilterChange("approved")}
        >
          Approved
        </Button>
        <Button
          variant={filterStatus === "sold" ? "default" : "outline"}
          size="sm"
          onClick={() => onFilterChange("sold")}
        >
          Sold
        </Button>
      </div>
    </div>
  );
}

