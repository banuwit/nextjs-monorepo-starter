import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import { Separator } from "@/components/ui/separator";
import { SidebarTrigger } from "@/components/ui/sidebar";

export function MainDashboardPage() {
  return (
    <>
      <header className="flex h-16 shrink-0 items-center gap-2 transition-[width,height] ease-linear group-has-data-[collapsible=icon]/sidebar-wrapper:h-12">
        <div className="flex items-center gap-2 px-4">
          <SidebarTrigger className="-ml-1" />
          <Separator
            orientation="vertical"
            className="mr-2 data-vertical:h-4 data-vertical:self-auto"
          />
          <Breadcrumb>
            <BreadcrumbList>
              <BreadcrumbItem className="hidden md:block">
                <BreadcrumbLink href="/dashboard">Dashboard</BreadcrumbLink>
              </BreadcrumbItem>
              <BreadcrumbSeparator className="hidden md:block" />
              <BreadcrumbItem>
                <BreadcrumbPage>Main</BreadcrumbPage>
              </BreadcrumbItem>
            </BreadcrumbList>
          </Breadcrumb>
        </div>
      </header>
      <div className="flex flex-1 flex-col gap-6 p-4 pt-0">
        <div>
          <h1 className="text-2xl font-semibold tracking-tight">Dashboard</h1>
          <p className="text-sm text-muted-foreground">
            Ringkasan aplikasi akan tampil di sini setelah data terhubung.
          </p>
        </div>
        <div className="grid gap-4 md:grid-cols-3">
          <Card>
            <CardHeader>
              <CardTitle>Pengguna</CardTitle>
              <CardDescription>Manajemen akun dan akses</CardDescription>
            </CardHeader>
            <CardContent>Belum ada data pengguna yang ditampilkan.</CardContent>
          </Card>
          <Card>
            <CardHeader>
              <CardTitle>Data wilayah</CardTitle>
              <CardDescription>Negara, provinsi, dan kota</CardDescription>
            </CardHeader>
            <CardContent>Ringkasan wilayah belum terhubung.</CardContent>
          </Card>
          <Card>
            <CardHeader>
              <CardTitle>Navigasi</CardTitle>
              <CardDescription>Menu aplikasi</CardDescription>
            </CardHeader>
            <CardContent>Pengaturan menu akan tersedia di sini.</CardContent>
          </Card>
        </div>
      </div>
    </>
  );
}
