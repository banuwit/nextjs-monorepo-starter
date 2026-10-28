"use client";

import { EyeIcon, MinusIcon, PlusIcon, TicketIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import { ButtonGroup } from "@/components/ui/button-group";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { MAX_SEATS_PER_ORDER } from "../schemas/stadium.schema";
import type { Fixture, Sector, Tier } from "../types/stadium";
import { formatMoney, orderTotal, tierById } from "../utils/stadium";

type SelectionPanelProps = {
  fixture: Fixture;
  tiers: Tier[];
  sector: Sector | null;
  seats: number;
  onSeatsChange: (seats: number) => void;
  onPreview: () => void;
  onCheckout: () => void;
};

export function SelectionPanel({
  fixture,
  tiers,
  sector,
  seats,
  onSeatsChange,
  onPreview,
  onCheckout,
}: SelectionPanelProps) {
  const tier = sector ? tierById(tiers, sector.tier) : null;
  const totals = orderTotal(sector, seats, fixture.bookingFee);
  const maxSeats = sector
    ? Math.min(MAX_SEATS_PER_ORDER, sector.seatsLeft)
    : MAX_SEATS_PER_ORDER;

  return (
    <Card className="gap-4">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <TicketIcon className="size-4 text-muted-foreground" aria-hidden />
          Your selection
        </CardTitle>
        <CardDescription>
          {sector && tier
            ? `Sector ${sector.label} · ${tier.label}`
            : "Pick an open sector in the scene, plan, or price timeline."}
        </CardDescription>
      </CardHeader>
      <CardContent className="flex flex-col gap-4">
        <div className="flex items-center justify-between gap-3">
          <div className="flex flex-col">
            <span className="text-sm font-medium">Seats</span>
            <span className="text-xs text-muted-foreground">
              Up to {maxSeats} per order
            </span>
          </div>
          <ButtonGroup aria-label="Seat count">
            <Button
              variant="outline"
              size="icon-sm"
              aria-label="Fewer seats"
              disabled={!sector || seats <= 1}
              onClick={() => onSeatsChange(seats - 1)}
            >
              <MinusIcon />
            </Button>
            <Button variant="outline" size="sm" className="w-10 tabular-nums" aria-live="polite" disabled>
              {seats}
            </Button>
            <Button
              variant="outline"
              size="icon-sm"
              aria-label="More seats"
              disabled={!sector || seats >= maxSeats}
              onClick={() => onSeatsChange(seats + 1)}
            >
              <PlusIcon />
            </Button>
          </ButtonGroup>
        </div>

        <Separator />

        <dl className="grid grid-cols-[1fr_auto] gap-y-1.5 text-sm">
          <dt className="text-muted-foreground">Best available</dt>
          <dd className="text-right tabular-nums">
            {sector ? formatMoney(sector.bestPrice, fixture.currency) : "—"}
          </dd>
          <dt className="text-muted-foreground">Seats × {seats}</dt>
          <dd className="text-right tabular-nums">
            {sector ? formatMoney(totals.subtotal, fixture.currency) : "—"}
          </dd>
          <dt className="text-muted-foreground">
            Booking fee ({formatMoney(fixture.bookingFee, fixture.currency)}
            /seat)
          </dt>
          <dd className="text-right tabular-nums">
            {sector ? formatMoney(totals.fees, fixture.currency) : "—"}
          </dd>
          <dt className="pt-1 font-medium">Total</dt>
          <dd className="pt-1 text-right text-base font-semibold tabular-nums">
            {sector ? formatMoney(totals.total, fixture.currency) : "—"}
          </dd>
        </dl>

        <div className="flex flex-col gap-2">
          <Button onClick={onCheckout} disabled={!sector}>
            Hold seats and checkout
          </Button>
          <Button variant="outline" onClick={onPreview} disabled={!sector}>
            <EyeIcon data-icon="inline-start" />
            Preview seat view
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
