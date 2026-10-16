import {
  ArrowRightIcon,
  BellOffIcon,
  BookOpenIcon,
  CheckSquareIcon,
  ClipboardCheckIcon,
  Clock3Icon,
  FileTextIcon,
  FocusIcon,
  GlobeIcon,
  OrbitIcon,
  PlusIcon,
  QuoteIcon,
  TrendingUpIcon,
  UploadIcon,
} from "lucide-react";

import { AppBody } from "@/components/app-body";
import { Badge } from "@/components/ui/badge";
import { PageHeading } from "@/components/page-heading";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardAction,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  productivityGoals,
  productivityNotes,
  productivityProjects,
  productivitySummary,
} from "@/mocks/dashboard-productivity.mock";

import { ProductivityCalendar } from "./components/productivity-calendar";
import { ProductivityTasks } from "./components/productivity-tasks";

const summaryIcons = [Clock3Icon, TrendingUpIcon, FocusIcon];
const projectIcons = [OrbitIcon, GlobeIcon, ClipboardCheckIcon];
const quickActions = [
  { label: "New Note", icon: FileTextIcon },
  { label: "New Task", icon: CheckSquareIcon },
  { label: "New Project", icon: OrbitIcon },
  { label: "New Goal", icon: FocusIcon },
  { label: "Upload", icon: UploadIcon },
];
const projectFilters = [
  { value: "active", label: "Active" },
  { value: "planning", label: "Planning" },
  { value: "completed", label: "Completed" },
];

function SummaryCards() {
  return (
    <div className="grid gap-4 md:grid-cols-3">
      {productivitySummary.map((item, index) => {
        const Icon = summaryIcons[index];
        return (
          <Card key={item.title} className="shadow-xs">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-sm text-muted-foreground">
                <span className="grid size-7 place-items-center rounded-lg border bg-muted">
                  {Icon && <Icon className="size-4" />}
                </span>
                {item.title}
              </CardTitle>
            </CardHeader>
            <CardContent className="flex flex-col gap-2">
              <div className="text-2xl leading-none tracking-tight">
                {item.value}
              </div>
              <div className="flex items-center justify-between gap-2 text-muted-foreground">
                <p className="leading-none">{item.description}</p>
                <ArrowRightIcon className="size-4 shrink-0" />
              </div>
            </CardContent>
          </Card>
        );
      })}
    </div>
  );
}

function ProjectsSection() {
  return (
    <section className="flex flex-col gap-2">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <h2 className="text-xl tracking-tight">Projects</h2>
        <div className="flex items-center gap-2">
          <Select defaultValue="active" items={projectFilters}>
            <SelectTrigger className="w-28" aria-label="Project filter">
              <SelectValue placeholder="Active" />
            </SelectTrigger>
            <SelectContent>
              <SelectGroup>
                {projectFilters.map((filter) => (
                  <SelectItem key={filter.value} value={filter.value}>
                    {filter.label}
                  </SelectItem>
                ))}
              </SelectGroup>
            </SelectContent>
          </Select>
          <Button variant="outline">
            <PlusIcon data-icon="inline-start" />
            New
          </Button>
        </div>
      </div>
      <div className="grid gap-4 md:grid-cols-3">
        {productivityProjects.map((project, index) => {
          const Icon = projectIcons[index];
          return (
            <Card key={project.title} className="shadow-xs">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  {Icon && <Icon className="size-4 text-muted-foreground" />}
                  <span>{project.title}</span>
                </CardTitle>
                <CardAction>
                  <Badge variant="outline">{project.status}</Badge>
                </CardAction>
              </CardHeader>
              <CardContent className="flex flex-col gap-2">
                <p className="text-sm">{project.description}</p>
                <div className="flex items-center gap-3">
                  <Progress
                    value={project.progress}
                    className="h-2"
                    aria-label={project.title + " progress"}
                  />
                  <span className="shrink-0 text-sm">{project.progress}%</span>
                </div>
              </CardContent>
              <CardFooter className="py-2.5 text-muted-foreground">
                {project.due}
              </CardFooter>
            </Card>
          );
        })}
      </div>
    </section>
  );
}

function QuickActions() {
  return (
    <section className="flex flex-col gap-2">
      <h2 className="text-xl tracking-tight">Quick Actions</h2>
      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-5">
        {quickActions.map((action) => (
          <Button
            key={action.label}
            variant="outline"
            className="justify-start"
          >
            <action.icon data-icon="inline-start" />
            {action.label}
          </Button>
        ))}
      </div>
    </section>
  );
}

function FocusCard() {
  return (
    <Card className="shadow-xs">
      <CardHeader>
        <CardTitle>Focus</CardTitle>
      </CardHeader>
      <CardContent className="flex flex-col gap-2">
        <div className="flex items-center justify-between gap-4">
          <span className="text-3xl tracking-tight tabular-nums">90:00</span>
          <Button className="min-w-24">Start</Button>
        </div>
        <div className="flex items-center gap-2 text-xs text-muted-foreground">
          <BellOffIcon className="size-3" />
          <span>No notifications · Full focus</span>
        </div>
      </CardContent>
    </Card>
  );
}

function RecentNotesCard() {
  return (
    <Card className="shadow-xs">
      <CardHeader>
        <CardTitle>Recent Notes</CardTitle>
        <CardAction>
          <Button variant="ghost" size="sm">
            View all
          </Button>
        </CardAction>
      </CardHeader>
      <CardContent className="flex flex-col gap-4">
        {productivityNotes.map((note, index) => {
          const Icon =
            index === productivityNotes.length - 1
              ? BookOpenIcon
              : FileTextIcon;
          return (
            <div key={note.title} className="flex items-start gap-4">
              <Icon className="size-5 text-muted-foreground" />
              <div className="min-w-0">
                <div className="truncate text-sm font-medium">{note.title}</div>
                <div className="text-xs text-muted-foreground">{note.date}</div>
              </div>
            </div>
          );
        })}
      </CardContent>
    </Card>
  );
}

function WeeklySummaryCard() {
  return (
    <Card className="shadow-xs">
      <CardHeader>
        <CardTitle>This Week</CardTitle>
        <CardAction>
          <Button variant="ghost" size="sm">
            View all
          </Button>
        </CardAction>
      </CardHeader>
      <CardContent className="flex flex-col gap-4">
        <p className="text-muted-foreground">
          You’re doing great. Keep the momentum going.
        </p>
        <div className="flex flex-col gap-2">
          <div className="font-medium">
            {productivityGoals.completed} of {productivityGoals.total} goals
            completed
          </div>
          <Progress
            value={
              (productivityGoals.completed / productivityGoals.total) * 100
            }
            className="h-2"
            aria-label="Weekly goals completed"
          />
        </div>
      </CardContent>
    </Card>
  );
}

export function ProductivityDashboardPage() {
  return (
    <AppBody>
      <PageHeading
        title="Good morning, Banu."
        currentPage="Productivity"
        parents={[{ label: "Dashboard", href: "/dashboard" }]}
        titleClassName="text-3xl leading-none tracking-tight"
      />
      <div className="grid gap-6 lg:grid-cols-[minmax(0,1fr)_minmax(15rem,18rem)]">
        <section className="flex min-w-0 flex-col gap-6">
          <SummaryCards />
          <ProductivityTasks />
          <ProjectsSection />
          <QuickActions />
          <Card className="shadow-xs">
            <CardContent className="flex items-start gap-4">
              <QuoteIcon className="size-6 shrink-0 text-muted-foreground" />
              <div className="flex flex-col gap-1">
                <p className="text-xl leading-none tracking-tight">
                  Small, consistent actions lead to big results.
                </p>
                <p className="text-muted-foreground">
                  Keep showing up. You&apos;ve got this.
                </p>
              </div>
            </CardContent>
          </Card>
        </section>
        <aside className="flex min-w-0 flex-col gap-6">
          <ProductivityCalendar />
          <FocusCard />
          <RecentNotesCard />
          <WeeklySummaryCard />
        </aside>
      </div>
    </AppBody>
  );
}
