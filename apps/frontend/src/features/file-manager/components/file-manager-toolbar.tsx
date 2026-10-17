"use client";
import type { FileFilters } from "../file-manager-model";
import { ArrowUpDown, Search, SlidersHorizontal } from "lucide-react";

import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuLabel,
  DropdownMenuRadioGroup,
  DropdownMenuRadioItem,
  DropdownMenuSeparator,
  DropdownMenuSub,
  DropdownMenuSubContent,
  DropdownMenuSubTrigger,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  InputGroup,
  InputGroupAddon,
  InputGroupInput,
} from "@/components/ui/input-group";

export function FileManagerToolbar({
  filters,
  onChange,
}: {
  filters: FileFilters;
  onChange: (filters: FileFilters) => void;
}) {
  return (
    <div className="flex flex-col gap-3 xl:flex-row xl:items-center">
      <InputGroup className="md:max-w-lg">
        <InputGroupInput
          value={filters.search ?? ""}
          onChange={(event) =>
            onChange({ ...filters, search: event.target.value })
          }
          placeholder="Search files and folders..."
          aria-label="Search files and folders"
        />
        <InputGroupAddon>
          <Search />
        </InputGroupAddon>
      </InputGroup>
      <div className="flex flex-1 flex-wrap items-center gap-2 xl:justify-end">
        <DropdownMenu>
          <DropdownMenuTrigger render={<Button variant="outline" size="sm" />}>
            <SlidersHorizontal data-icon="inline-start" />
            Filter & sort
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-48">
            <DropdownMenuGroup>
              <DropdownMenuLabel>Show</DropdownMenuLabel>
              <DropdownMenuRadioGroup
                value={filters.show ?? "all"}
                onValueChange={(value) =>
                  onChange({ ...filters, show: value as FileFilters["show"] })
                }
              >
                <DropdownMenuRadioItem value="all">
                  All files
                </DropdownMenuRadioItem>
                <DropdownMenuRadioItem value="starred">
                  Starred
                </DropdownMenuRadioItem>
                <DropdownMenuRadioItem value="shared">
                  Shared
                </DropdownMenuRadioItem>
              </DropdownMenuRadioGroup>
            </DropdownMenuGroup>
            <DropdownMenuSeparator />
            <DropdownMenuGroup>
              <DropdownMenuSub>
                <DropdownMenuSubTrigger>
                  <SlidersHorizontal />
                  File type
                </DropdownMenuSubTrigger>
                <DropdownMenuSubContent sideOffset={8}>
                  <DropdownMenuGroup>
                    <DropdownMenuRadioGroup
                      value={filters.kind ?? "all"}
                      onValueChange={(value) =>
                        onChange({
                          ...filters,
                          kind: value as FileFilters["kind"],
                        })
                      }
                    >
                      <DropdownMenuRadioItem value="all">
                        All types
                      </DropdownMenuRadioItem>
                      <DropdownMenuRadioItem value="archive">
                        Archive
                      </DropdownMenuRadioItem>
                      <DropdownMenuRadioItem value="design">
                        Design
                      </DropdownMenuRadioItem>
                      <DropdownMenuRadioItem value="document">
                        Document
                      </DropdownMenuRadioItem>
                      <DropdownMenuRadioItem value="other">
                        Other
                      </DropdownMenuRadioItem>
                      <DropdownMenuRadioItem value="pdf">
                        PDF
                      </DropdownMenuRadioItem>
                      <DropdownMenuRadioItem value="spreadsheet">
                        Spreadsheet
                      </DropdownMenuRadioItem>
                    </DropdownMenuRadioGroup>
                  </DropdownMenuGroup>
                </DropdownMenuSubContent>
              </DropdownMenuSub>
              <DropdownMenuSub>
                <DropdownMenuSubTrigger>
                  <ArrowUpDown />
                  Sort by
                </DropdownMenuSubTrigger>
                <DropdownMenuSubContent sideOffset={8}>
                  <DropdownMenuGroup>
                    <DropdownMenuRadioGroup
                      value={filters.sort ?? "modified"}
                      onValueChange={(value) =>
                        onChange({
                          ...filters,
                          sort: value as FileFilters["sort"],
                        })
                      }
                    >
                      <DropdownMenuRadioItem value="modified">
                        Last modified
                      </DropdownMenuRadioItem>
                      <DropdownMenuRadioItem value="name">
                        Name
                      </DropdownMenuRadioItem>
                      <DropdownMenuRadioItem value="size">
                        File size
                      </DropdownMenuRadioItem>
                    </DropdownMenuRadioGroup>
                  </DropdownMenuGroup>
                </DropdownMenuSubContent>
              </DropdownMenuSub>
            </DropdownMenuGroup>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </div>
  );
}
