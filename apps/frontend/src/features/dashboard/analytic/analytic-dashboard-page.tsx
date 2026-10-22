import { AppBody } from "@/components/app-body";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

import { AnalyticsKpiStrip } from "./components/analytics-kpi-strip";
import { AnalyticsToolbar } from "./components/analytics-toolbar";
import { RealtimeVisitors } from "./components/realtime-visitors";
import { TopPages } from "./components/top-pages";
import { TopTrafficSources } from "./components/top-traffic-sources";
import { TrafficQuality } from "./components/traffic-quality";

const pendingTabs = ["Audience", "Acquisition", "Engagement", "Conversions"];

export function AnalyticDashboardPage() {
  return (
    <AppBody>
      <div className="space-y-1">
        <h1 className="text-3xl tracking-tight">Hello, Aiy</h1>
        <p className="text-sm text-muted-foreground">
          Monitor traffic, engagement, and conversion performance in one view.{" "}
          <span className="ml-2 text-xs">Data contoh</span>
        </p>
      </div>

      <Tabs defaultValue="overview" className="flex flex-col gap-4">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div className="max-w-full overflow-x-auto">
            <TabsList className="gap-1">
              <TabsTrigger value="overview">Overview</TabsTrigger>
              {pendingTabs.map((tab) => (
                <TabsTrigger key={tab} value={tab.toLowerCase()}>
                  {tab}
                </TabsTrigger>
              ))}
            </TabsList>
          </div>
          <AnalyticsToolbar />
        </div>

        <TabsContent value="overview" className="flex flex-col gap-4">
          <AnalyticsKpiStrip />
          <div className="grid grid-cols-1 items-stretch gap-4 xl:grid-cols-12">
            <div className="min-w-0 xl:col-span-7">
              <TrafficQuality />
            </div>
            <div className="min-w-0 xl:col-span-5">
              <RealtimeVisitors />
            </div>
          </div>
          <div className="grid grid-cols-1 items-stretch gap-4 xl:grid-cols-12">
            <div className="min-w-0 xl:col-span-7">
              <TopPages />
            </div>
            <div className="min-w-0 xl:col-span-5">
              <TopTrafficSources />
            </div>
          </div>
        </TabsContent>

        {pendingTabs.map((tab) => (
          <TabsContent key={tab} value={tab.toLowerCase()}>
            <div className="flex h-64 items-center justify-center rounded-xl border border-dashed border-border text-muted-foreground">
              {tab} view coming soon.
            </div>
          </TabsContent>
        ))}
      </Tabs>
    </AppBody>
  );
}
