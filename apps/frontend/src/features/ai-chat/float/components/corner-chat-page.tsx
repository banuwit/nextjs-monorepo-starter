"use client";

import { MessageCircleIcon, SparklesIcon } from "lucide-react";

import { AppBody } from "@/components/app-body";
import { PageHeading } from "@/components/page-heading";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { cornerPageSource } from "@/mocks/ai-chat.mock";
import { useCornerChat } from "../hooks/use-corner-chat";
import { CornerChatWindow } from "./corner-chat-window";

// Konten halaman contoh yang menjadi konteks asisten.
const kpis = [
  { label: "Pendapatan", value: "Rp 1,28 M", change: "+12,4%" },
  { label: "Pesanan", value: "3.420", change: "+8,1%" },
  { label: "Konversi", value: "2,9%", change: "−0,3 poin" },
  { label: "Nilai pesanan rata-rata", value: "Rp 374 rb", change: "+3,9%" },
];

const products = [
  { name: "Paket Pro Tahunan", share: "31%", growth: "+9%" },
  { name: "Paket Team Bulanan", share: "22%", growth: "+6%" },
  { name: "Add-on Analytics", share: "14%", growth: "+38%" },
  { name: "Paket Starter", share: "11%", growth: "+2%" },
  { name: "Add-on Storage", share: "7%", growth: "−4%" },
];

export function CornerChatPage() {
  const chat = useCornerChat();
  const windowVisible = chat.open && !chat.minimized;

  return (
    <AppBody>
      <PageHeading title="AI Chat" currentPage="Float" />
      <p className="text-sm text-muted-foreground">
        Asisten dibuka dari tombol di pojok kanan bawah. Jendelanya tidak
        menghalangi halaman, dapat diperbesar, diminimalkan, dan menyimpan
        riwayat percakapan.
      </p>

      <h2 className="text-lg font-semibold">{cornerPageSource.title}</h2>
      <div className="grid gap-4 @xl/main:grid-cols-2 @5xl/main:grid-cols-4">
        {kpis.map((kpi) => (
          <Card key={kpi.label} size="sm">
            <CardHeader>
              <CardDescription>{kpi.label}</CardDescription>
              <CardTitle className="text-2xl tabular-nums">
                {kpi.value}
              </CardTitle>
            </CardHeader>
            <CardContent className="text-xs text-muted-foreground">
              {kpi.change} dari September
            </CardContent>
          </Card>
        ))}
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Produk teratas</CardTitle>
          <CardDescription>Kontribusi pendapatan Oktober</CardDescription>
        </CardHeader>
        <CardContent>
          <ul className="divide-y divide-border text-sm">
            {products.map((product) => (
              <li key={product.name} className="flex items-center gap-3 py-2">
                <span className="min-w-0 flex-1 truncate">{product.name}</span>
                <span className="tabular-nums text-muted-foreground">
                  {product.share}
                </span>
                <Badge variant="outline" className="tabular-nums">
                  {product.growth}
                </Badge>
              </li>
            ))}
          </ul>
        </CardContent>
      </Card>

      {windowVisible && <CornerChatWindow chat={chat} />}

      {chat.open && chat.minimized && (
        <button
          type="button"
          onClick={chat.restore}
          className="fixed right-4 bottom-4 z-50 flex items-center gap-2 rounded-full border border-border bg-card py-1.5 pr-4 pl-1.5 text-sm font-medium text-card-foreground shadow-lg outline-none hover:bg-muted focus-visible:ring-3 focus-visible:ring-ring/50"
        >
          <span className="flex size-8 items-center justify-center rounded-full bg-primary text-primary-foreground">
            <SparklesIcon className="size-4" aria-hidden="true" />
          </span>
          Asisten
          {chat.hasNewReply && <Badge>Balasan baru</Badge>}
        </button>
      )}

      {!chat.open && (
        <Button
          size="icon-lg"
          className="fixed right-4 bottom-4 z-50 size-12 rounded-full shadow-lg"
          aria-label="Buka asisten"
          onClick={chat.launch}
        >
          <MessageCircleIcon className="size-5" />
        </Button>
      )}
    </AppBody>
  );
}
