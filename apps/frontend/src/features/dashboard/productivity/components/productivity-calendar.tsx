"use client";

import { useState } from "react";
import { startOfMonth, startOfToday } from "date-fns";
import { enGB } from "date-fns/locale";

import { Calendar } from "@/components/ui/calendar";
import { Card, CardContent } from "@/components/ui/card";

export function ProductivityCalendar() {
  const [date, setDate] = useState<Date | undefined>(() => startOfToday());
  const [month, setMonth] = useState(() => startOfMonth(startOfToday()));

  return (
    <Card size="sm">
      <CardContent>
        <Calendar
          mode="single"
          selected={date}
          onSelect={setDate}
          month={month}
          onMonthChange={setMonth}
          fixedWeeks
          locale={enGB}
          className="w-full p-0"
        />
      </CardContent>
    </Card>
  );
}
