"use client";

import { useMemo, useState } from "react";
import { FunnelIcon, MapPinIcon } from "lucide-react";

import { AppBody } from "@/components/app-body";
import { PageHeading } from "@/components/page-heading";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";
import { Spinner } from "@/components/ui/spinner";
import { themeBasemap, type BasemapStyle } from "@/lib/maplibre";
import { locationCustomers } from "@/mocks/map-location.mock";
import { usePreferences } from "@/providers/preferences-provider";
import { useCustomerLocations } from "../hooks/use-customer-locations";
import { EMPTY_FILTER_STATE, type FilterState, type MapOverlays } from "../types/map-location";
import { activeFilterCount, hasCoordinates, labelsFor } from "../utils/map-location";
import {
  CustomerLocationActiveFilters,
  CustomerLocationFilters,
} from "./customer-location-filters";
import { CustomerLocationMap } from "./customer-location-map";
import { CustomerProfilePanel } from "./customer-profile-panel";

export function MapLocationPage() {
  const { values } = usePreferences();
  const [filters, setFilters] = useState<FilterState>(EMPTY_FILTER_STATE);
  const [filtersOpen, setFiltersOpen] = useState(false);
  const [selectedCustomerId, setSelectedCustomerId] = useState<string | null>(null);
  const [basemap, setBasemap] = useState<BasemapStyle>(() => themeBasemap(values.themeMode === "dark"));
  const [overlays, setOverlays] = useState<MapOverlays>({ location: true, heat: false });

  const { data, isLoading, isError } = useCustomerLocations(filters);
  const customers = useMemo(() => data ?? [], [data]);
  const plotted = useMemo(() => customers.filter(hasCoordinates).length, [customers]);
  const labels = useMemo(() => labelsFor(locationCustomers), []);
  const activeCount = activeFilterCount(filters);

  return (
    <AppBody>
      <Collapsible open={filtersOpen} onOpenChange={setFiltersOpen} className="flex min-w-0 flex-col gap-4">
        <PageHeading
          title="Map Location"
          currentPage="Map Location"
          description="Customer distribution across the sales territory"
        >
          <Badge variant="secondary" className="h-8 gap-1.5 px-3 font-normal">
            <MapPinIcon />
            {isLoading ? (
              <Spinner className="size-3" />
            ) : (
              <span className="tabular-nums">
                {plotted.toLocaleString("id-ID")} of {customers.length.toLocaleString("id-ID")} mapped
              </span>
            )}
          </Badge>
          <CollapsibleTrigger
            render={
              <Button
                variant={filtersOpen || activeCount > 0 ? "secondary" : "outline"}
                aria-label={filtersOpen ? "Hide dimension filters" : "Show dimension filters"}
              />
            }
          >
            <FunnelIcon />
            Filters
            {activeCount > 0 && (
              <span className="flex size-5 min-w-5 items-center justify-center rounded-full bg-primary px-1 text-[0.625rem] font-semibold tabular-nums text-primary-foreground">
                {activeCount}
              </span>
            )}
          </CollapsibleTrigger>
        </PageHeading>

        {(filtersOpen || activeCount > 0) && (
          <Card>
            <CardContent className="flex flex-col gap-3">
              <CollapsibleContent className="overflow-hidden">
                <CustomerLocationFilters customers={locationCustomers} value={filters} onChange={setFilters} />
              </CollapsibleContent>
              <CustomerLocationActiveFilters value={filters} onChange={setFilters} labels={labels} />
            </CardContent>
          </Card>
        )}
      </Collapsible>

      <Card className="min-w-0 overflow-hidden py-0">
        <CardContent className="flex flex-col p-0 lg:h-[calc(100svh-16rem)] lg:min-h-[26rem] lg:flex-row">
          <div className="relative h-[26rem] min-w-0 flex-1 lg:h-auto">
            <CustomerLocationMap
              data={customers}
              basemap={basemap}
              overlays={overlays}
              onBasemapChange={setBasemap}
              onOverlaysChange={setOverlays}
              onSelectCustomer={setSelectedCustomerId}
            />

            {/* Overlay instead of swapping the map out, so panning/zoom survives a refetch. */}
            {isLoading && (
              <div className="pointer-events-none absolute inset-0 z-10 flex items-center justify-center bg-background/50">
                <span className="flex items-center gap-2 rounded-md border border-border bg-popover px-3 py-2 text-sm text-popover-foreground shadow-sm">
                  <Spinner className="size-4" /> Loading customer locations…
                </span>
              </div>
            )}
            {!isLoading && isError && (
              <div className="absolute inset-0 z-10 flex items-center justify-center bg-background/70">
                <span className="rounded-md border border-dashed px-3 py-2 text-sm text-destructive">Failed to load data</span>
              </div>
            )}
            {!isLoading && !isError && plotted === 0 && (
              <div className="pointer-events-none absolute inset-0 z-10 flex items-center justify-center">
                <span className="rounded-md border border-dashed bg-background/90 px-3 py-2 text-sm text-muted-foreground">
                  No location data available
                </span>
              </div>
            )}
          </div>

          {/* Docked profile beside the map; stacks under it on narrow screens. */}
          {selectedCustomerId && (
            <CustomerProfilePanel
              customerId={selectedCustomerId}
              onClose={() => setSelectedCustomerId(null)}
            />
          )}
        </CardContent>
      </Card>
    </AppBody>
  );
}
