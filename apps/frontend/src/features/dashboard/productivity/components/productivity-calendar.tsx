"use client";

import { useState } from "react";
import { enGB } from "date-fns/locale";

import { Calendar } from "@/components/ui/calendar";
import { Card, CardContent } from "@/components/ui/card";

export function ProductivityCalendar({ today }: { today: string }) {
  const [date, setDate] = useState<Date | undefined>(() => {
    const value = new Date(today);
    return new Date(value.getUTCFullYear(), value.getUTCMonth(), value.getUTCDate());
  });

  return (
    <Card size="sm" className="min-w-0">
      <CardContent>
        <Calendar
          mode="single"
          selected={date}
          onSelect={setDate}
          defaultMonth={date}
          fixedWeeks
          locale={enGB}
          className="w-full p-0"
        />
      </CardContent>
    </Card>
  );
}
