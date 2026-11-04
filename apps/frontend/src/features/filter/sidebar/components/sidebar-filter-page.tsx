import { AppBody } from "@/components/app-body";
import { PageHeading } from "@/components/page-heading";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  catalogBrands,
  catalogCategories,
  catalogColors,
  catalogDepartments,
  catalogMaterials,
  catalogProducts,
  catalogRatings,
  catalogSizes,
  PRICE_MAX,
} from "@/mocks/filter-sidebar.mock";
import { SidebarFilterCatalog } from "./sidebar-filter-catalog";

export function SidebarFilterPage() {
  return (
    <AppBody>
      <PageHeading title="Sidebar Filter" currentPage="Sidebar Filter" />
      <Card className="overflow-visible">
        <CardHeader>
          <CardTitle>Product catalog</CardTitle>
          <CardDescription>
            Sidebar filter faceted mengikuti ReUI filter-sidebar-3: pill
            department, chip yang bisa dihapus, checkbox category/material/brand
            dengan jumlah, slider harga, swatch warna, tombol ukuran, radio
            rating bintang, dan switch stok/diskon. Tombol ikon filter di kiri
            kotak cari membuka panel di kiri grid produk enam kolom; perubahan
            diterapkan saat Apply.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <SidebarFilterCatalog
            products={catalogProducts}
            options={{
              departments: catalogDepartments,
              categories: catalogCategories,
              materials: catalogMaterials,
              brands: catalogBrands,
              colors: catalogColors,
              sizes: catalogSizes,
              ratings: catalogRatings,
              priceMax: PRICE_MAX,
            }}
          />
        </CardContent>
      </Card>
    </AppBody>
  );
}
