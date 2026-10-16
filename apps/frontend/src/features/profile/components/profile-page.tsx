import { Fragment } from "react";

import {
  BadgeCheckIcon,
  CalendarDaysIcon,
  CircleCheckIcon,
  Clock3Icon,
  DownloadIcon,
  EllipsisIcon,
  EyeIcon,
  FileTextIcon,
  LockKeyholeIcon,
  MailIcon,
  PencilIcon,
  UserRoundXIcon,
  UsersIcon,
} from "lucide-react";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import { Button, buttonVariants } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Separator } from "@/components/ui/separator";
import { Table, TableBody, TableCaption, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { profile } from "@/mocks/profile.mock";

type Field = { readonly label: string; readonly value: string };
type Section = {
  readonly title: string;
  readonly private?: boolean;
  readonly columns: ReadonlyArray<ReadonlyArray<Field>>;
};

function FieldGrid({ columns }: { columns: Section["columns"] }) {
  return (
    <dl className="grid gap-8 sm:grid-cols-2 xl:grid-cols-3 xl:gap-12">
      {columns.map((column, index) => (
        <div className="flex flex-col gap-5" key={index}>
          {column.map(({ label, value }) => (
            <div className="flex flex-col gap-1" key={label}>
              <dt className="text-xs text-muted-foreground">{label}</dt>
              <dd className="text-sm">{value}</dd>
            </div>
          ))}
        </div>
      ))}
    </dl>
  );
}

function FieldSections({ sections }: { sections: ReadonlyArray<Section> }) {
  return sections.map((section, index) => (
    <div key={section.title}>
      {index > 0 && <Separator className="my-4" />}
      <section className="flex flex-col gap-2" aria-label={section.title}>
        <div className="flex items-center gap-2">
          <h2 className="text-base font-medium">{section.title}</h2>
          {section.private && (
            <Badge className="rounded-sm" variant="outline">
              <LockKeyholeIcon data-icon="inline-start" /> Private
            </Badge>
          )}
        </div>
        <FieldGrid columns={section.columns} />
      </section>
    </div>
  ));
}

function ProfileHeader() {
  return (
    <div className="flex flex-col gap-5 px-4 lg:flex-row lg:items-end lg:justify-between">
      <div className="flex min-w-0 items-center gap-4">
        <div className="grid size-18 shrink-0 place-items-center sm:size-23">
          <span className="sr-only">Profile 92% complete</span>
          <svg aria-hidden="true" className="col-start-1 row-start-1 size-full -rotate-90" viewBox="0 0 100 100">
            <circle cx="50" cy="50" r="46" pathLength="100" strokeDasharray="92 100" strokeLinecap="round" strokeWidth="2.5" className="fill-none stroke-green-500 dark:stroke-green-600" />
          </svg>
          <Avatar className="col-start-1 row-start-1 size-16 after:border-0 sm:size-20">
            <AvatarImage alt={profile.name} src={profile.avatar} />
            <AvatarFallback>{profile.initials}</AvatarFallback>
          </Avatar>
        </div>
        <div className="flex min-w-0 flex-col gap-2">
          <div>
            <h1 className="truncate text-xl font-semibold tracking-tight sm:text-2xl">{profile.name}</h1>
            <p className="truncate text-sm text-muted-foreground">{profile.workEmail} · {profile.jobTitle}</p>
          </div>
          <div className="flex flex-wrap gap-2">
            <Badge className="rounded-sm border-amber-600/20 bg-amber-500/10 text-amber-700 dark:text-amber-300" variant="secondary">92% Complete</Badge>
            <Badge className="rounded-sm bg-green-600 text-white"><BadgeCheckIcon data-icon="inline-start" />Verified</Badge>
            <Badge className="rounded-sm" variant="outline">{profile.employmentType}</Badge>
            <Badge className="rounded-sm" variant="outline">{profile.workplace}</Badge>
            <Badge className="rounded-sm" variant="outline">{profile.timeZone}</Badge>
          </div>
        </div>
      </div>
      <div className="flex items-center gap-2">
        <a className={buttonVariants({ size: "sm", variant: "outline" })} href={`mailto:${profile.workEmail}`}>
          <MailIcon className="size-3.5" /> Email
        </a>
        <Button size="sm"><PencilIcon data-icon="inline-start" />Edit profile</Button>
        <DropdownMenu>
          <DropdownMenuTrigger render={<Button aria-label="More profile actions" size="icon-sm" variant="outline" />}>
            <EllipsisIcon />
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-48">
            <DropdownMenuItem><EyeIcon />View as employee</DropdownMenuItem>
            <DropdownMenuItem variant="destructive"><UserRoundXIcon />Deactivate profile</DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </div>
  );
}

function Overview() {
  return (
    <div className="grid lg:grid-cols-[minmax(0,1fr)_auto_18rem]">
      <div className="py-4 lg:pr-6">
        <section className="flex flex-col gap-2">
          <h2 className="text-base font-medium">About</h2>
          <p className="text-sm text-muted-foreground">{profile.bio}</p>
        </section>
        <Separator className="my-4" />
        <section className="flex flex-col gap-2">
          <h2 className="text-base font-medium">Work details</h2>
          <FieldGrid columns={profile.overview} />
        </section>
        <Separator className="my-4" />
        <section className="flex flex-col gap-2">
          <div className="flex items-center justify-between gap-4">
            <div>
              <h2 className="text-base font-medium">Reporting line</h2>
              <p className="text-sm text-muted-foreground">Direct manager</p>
            </div>
            <Button size="sm" variant="outline"><UsersIcon data-icon="inline-start" />Org chart</Button>
          </div>
          <div className="flex items-center gap-3 py-3">
            <Avatar size="lg"><AvatarFallback>{profile.manager.initials}</AvatarFallback></Avatar>
            <div>
              <p className="text-sm font-medium">{profile.manager.name}</p>
              <p className="text-xs text-muted-foreground">{profile.manager.role}</p>
            </div>
          </div>
        </section>
      </div>
      <Separator className="hidden lg:block" orientation="vertical" />
      <aside className="py-4 lg:pl-6">
        <h2 className="text-sm font-medium">Record status</h2>
        <div className="mt-4 flex items-start gap-2">
          <CircleCheckIcon aria-hidden="true" className="mt-0.5 size-4 text-muted-foreground" />
          <div>
            <p className="text-sm font-medium">Active contractor</p>
            <p className="text-xs text-muted-foreground">Contract and access active</p>
          </div>
        </div>
        <p className="mt-4 text-xs text-muted-foreground">Updated {profile.updatedAt} by {profile.name}</p>
        <Separator className="my-4" />
        <h2 className="text-sm font-medium">Upcoming events</h2>
        <div className="flex items-start gap-3 py-2.5">
          <CalendarDaysIcon aria-hidden="true" className="mt-0.5 size-4 text-muted-foreground" />
          <div><p className="text-sm font-medium">Time off</p><p className="text-xs text-muted-foreground">{profile.nextLeave}</p></div>
        </div>
        <Separator />
        <div className="flex items-start gap-3 py-2.5">
          <Clock3Icon aria-hidden="true" className="mt-0.5 size-4 text-muted-foreground" />
          <div><p className="text-sm font-medium">Last working day</p><p className="text-xs text-muted-foreground">{profile.lastWorkingDay}</p></div>
        </div>
      </aside>
    </div>
  );
}

function Documents() {
  return (
    <section className="flex flex-col gap-4">
      <div className="flex items-center justify-between gap-4">
        <h2 className="text-base font-medium">Documents</h2>
        <Button size="sm"><FileTextIcon data-icon="inline-start" />Add document</Button>
      </div>
      <div className="overflow-x-auto">
        <Table className="min-w-2xl border-y">
          <TableCaption className="sr-only">Documents attached to this contractor profile</TableCaption>
          <TableHeader>
            <TableRow>
              <TableHead className="w-2/5"><span className="sr-only">Document</span></TableHead>
              <TableHead>Category</TableHead><TableHead>Updated</TableHead><TableHead>Status</TableHead><TableHead className="text-right">Access</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {profile.documents.map((document) => (
              <TableRow key={document.name}>
                <TableCell className="font-medium">{document.name}</TableCell>
                <TableCell className="text-muted-foreground">{document.category}</TableCell>
                <TableCell className="text-muted-foreground">{document.updatedAt}</TableCell>
                <TableCell><Badge className="rounded-sm" variant="outline">{document.status}</Badge></TableCell>
                <TableCell className="text-right">
                  {document.restricted ? (
                    <span className="inline-flex items-center gap-1.5 text-xs text-muted-foreground"><LockKeyholeIcon aria-hidden="true" className="size-3.5" />Restricted</span>
                  ) : (
                    <Button aria-label={`Download ${document.name}`} size="icon-sm" variant="ghost"><DownloadIcon /></Button>
                  )}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </section>
  );
}

export function ProfilePage() {
  return (
    <div className="flex flex-col gap-4 py-4">
      <Breadcrumb className="px-4">
        <BreadcrumbList>
          {["Dashboard", "People", "Employee directory", profile.name].map((label) => (
            <Fragment key={label}>
              <BreadcrumbItem>{label}</BreadcrumbItem>
              <BreadcrumbSeparator />
            </Fragment>
          ))}
          <BreadcrumbItem><BreadcrumbPage>Profile details</BreadcrumbPage></BreadcrumbItem>
        </BreadcrumbList>
      </Breadcrumb>
      <ProfileHeader />
      <Tabs className="min-h-0 flex-1 gap-0" defaultValue="overview">
        <div className="touch-pan-x overflow-x-auto overscroll-x-contain border-y">
          <TabsList className="w-max min-w-full justify-start gap-4 px-4 *:data-[slot=tabs-trigger]:flex-none" variant="line">
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="personal">Personal</TabsTrigger>
            <TabsTrigger value="employment">Employment</TabsTrigger>
            <TabsTrigger value="compensation">Compensation</TabsTrigger>
            <TabsTrigger value="time-off">Time off</TabsTrigger>
            <TabsTrigger value="documents">Documents</TabsTrigger>
          </TabsList>
        </div>
        <div className="px-4 md:px-6">
          <TabsContent value="overview"><Overview /></TabsContent>
          <TabsContent className="py-4" value="personal"><FieldSections sections={profile.personal} /></TabsContent>
          <TabsContent className="py-4" value="employment"><FieldSections sections={profile.employment} /></TabsContent>
          <TabsContent className="py-4" value="compensation">
            <div className="flex items-start gap-3">
              <LockKeyholeIcon aria-hidden="true" className="size-4 text-muted-foreground" />
              <div><p className="text-sm font-medium">Restricted information</p><p className="mt-0.5 text-sm text-muted-foreground">Visible to people administrators and authorized finance roles.</p></div>
            </div>
          </TabsContent>
          <TabsContent className="py-4" value="time-off"><FieldSections sections={profile.timeOff} /></TabsContent>
          <TabsContent className="py-4" value="documents"><Documents /></TabsContent>
        </div>
      </Tabs>
    </div>
  );
}
