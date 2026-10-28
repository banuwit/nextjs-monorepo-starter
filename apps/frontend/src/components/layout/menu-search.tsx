"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { SearchIcon } from "lucide-react";

import {
  type NavigationItem,
  useAppNavigation,
} from "@/components/layout/app-navigation";
import { filterMenuTree } from "@/components/layout/menu-search-tree";
import { Button } from "@/components/ui/button";
import {
  Command,
  CommandDialog,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
import { Kbd } from "@/components/ui/kbd";

function MenuTree({
  items,
  onSelect,
}: {
  items: NavigationItem[];
  onSelect: (url: string) => void;
}) {
  return items.map((item) =>
    item.items?.length ? (
      <div key={item.title}>
        <div className="flex items-center gap-2 px-2 py-1.5 text-sm font-medium text-foreground [&_svg]:size-4">
          {item.icon}
          <span>{item.title}</span>
        </div>
        <div className="ml-3 border-l border-border pl-2">
          <MenuTree items={item.items} onSelect={onSelect} />
        </div>
      </div>
    ) : (
      <CommandItem
        key={item.url}
        value={item.url}
        onSelect={() => onSelect(item.url)}
      >
        {item.icon}
        <span>{item.title}</span>
      </CommandItem>
    ),
  );
}

export function MenuSearch({ iconOnly = false }: { iconOnly?: boolean }) {
  const navigation = useAppNavigation();
  const [search, setSearch] = useState("");
  const menuGroups = navigation
    .map((section) => ({
      title: section.title,
      items: filterMenuTree(
        section.items,
        search,
        section.title.toLowerCase().includes(search.trim().toLowerCase()),
      ),
    }))
    .filter((section) => section.items.length > 0);

  const [open, setOpen] = useState(false);
  const router = useRouter();

  useEffect(() => {
    function onKeyDown(event: KeyboardEvent) {
      if ((event.metaKey || event.ctrlKey) && event.key.toLowerCase() === "j") {
        event.preventDefault();
        setOpen((current) => !current);
      }
    }

    document.addEventListener("keydown", onKeyDown);
    return () => document.removeEventListener("keydown", onKeyDown);
  }, []);

  return (
    <>
      <Button
        type="button"
        variant="link"
        size={iconOnly ? "icon-xs" : "default"}
        aria-label="Search menu"
        className="px-0! font-normal text-muted-foreground hover:no-underline"
        onClick={() => setOpen(true)}
      >
        <SearchIcon data-icon="inline-start" />
        {!iconOnly && (
          <>
            Search menu...
            <Kbd className="border px-1.5 text-[10px]">
              <span className="text-xs">⌘</span>J
            </Kbd>
          </>
        )}
      </Button>
      <CommandDialog open={open} onOpenChange={setOpen}>
        <Command shouldFilter={false}>
          <CommandInput
            placeholder="Search pages..."
            value={search}
            onValueChange={setSearch}
          />
          <CommandList>
            <CommandEmpty>No menus found.</CommandEmpty>
            {menuGroups.map((group) => (
              <CommandGroup key={group.title} heading={group.title}>
                <MenuTree
                  items={group.items}
                  onSelect={(url) => {
                    setOpen(false);
                    router.push(url);
                  }}
                />
              </CommandGroup>
            ))}
          </CommandList>
        </Command>
      </CommandDialog>
    </>
  );
}
