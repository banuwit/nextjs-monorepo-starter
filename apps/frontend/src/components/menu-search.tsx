"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { SearchIcon } from "lucide-react";

import {
  type NavigationItem,
  useAppNavigation,
} from "@/components/app-navigation";
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

type MenuPage = {
  title: string;
  url: string;
  icon: NavigationItem["icon"];
};

function getMenuPages(
  items: NavigationItem[],
  parents: string[] = [],
): MenuPage[] {
  return items.flatMap((item) =>
    item.items?.length
      ? getMenuPages(item.items, [...parents, item.title])
      : item.url.startsWith("/")
        ? [
            {
              title: [...parents, item.title].join(" / "),
              url: item.url,
              icon: item.icon,
            },
          ]
        : [],
  );
}

export function MenuSearch() {
  const navigation = useAppNavigation();
  const menuGroups = navigation
    .map((section) => ({
      title: section.title,
      pages: getMenuPages(section.items),
    }))
    .filter((section) => section.pages.length > 0);

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
        aria-label="Search menu"
        className="px-0! font-normal text-muted-foreground hover:no-underline"
        onClick={() => setOpen(true)}
      >
        <SearchIcon data-icon="inline-start" />
        Search menu...
        <Kbd className="border px-1.5 text-[10px]">
          <span className="text-xs">⌘</span>J
        </Kbd>
      </Button>
      <CommandDialog open={open} onOpenChange={setOpen}>
        <Command>
          <CommandInput placeholder="Search pages..." />
          <CommandList>
            <CommandEmpty>No menus found.</CommandEmpty>
            {menuGroups.map((group) => (
              <CommandGroup key={group.title} heading={group.title}>
                {group.pages.map((page) => (
                  <CommandItem
                    key={page.url}
                    value={`${group.title} ${page.title}`}
                    onSelect={() => {
                      setOpen(false);
                      router.push(page.url);
                    }}
                  >
                    {page.icon}
                    <span>{page.title}</span>
                  </CommandItem>
                ))}
              </CommandGroup>
            ))}
          </CommandList>
        </Command>
      </CommandDialog>
    </>
  );
}
