"use client";

import { Search, X } from "lucide-react";

import { Input } from "@/components/ui/input";
import { useUi } from "@/store/ui";

export function SearchBar() {
  const query = useUi((s) => s.searchQuery);
  const setQuery = useUi((s) => s.setSearchQuery);

  return (
    <div className="relative">
      <Search className="pointer-events-none absolute left-4 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
      <Input
        type="search"
        inputMode="search"
        autoComplete="off"
        placeholder="搜索菜品、口味、标签 …"
        aria-label="搜索菜品"
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        className="pl-11 pr-10"
      />
      {query && (
        <button
          aria-label="清空搜索"
          onClick={() => setQuery("")}
          className="absolute right-3 top-1/2 -translate-y-1/2 rounded-full p-1 text-muted-foreground transition-colors hover:bg-secondary hover:text-foreground"
        >
          <X className="size-4" />
        </button>
      )}
    </div>
  );
}
