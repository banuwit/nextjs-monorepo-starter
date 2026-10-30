import { CheckIcon } from "lucide-react";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableRow } from "@/components/ui/table";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import type { Product } from "../types/product";
import { PRODUCT_SHIPPING_NOTES } from "../utils/product";
import { ProductRating } from "./product-rating";

function ProductCheckList({ items }: { items: string[] }) {
  return (
    <ul className="flex flex-col gap-2 text-sm">
      {items.map((item) => (
        <li key={item} className="flex items-start gap-2">
          <CheckIcon aria-hidden="true" className="mt-0.5 size-4 shrink-0" />
          {item}
        </li>
      ))}
    </ul>
  );
}

export function ProductDetailTabs({ product }: { product: Product }) {
  return (
    <Card>
      <Tabs defaultValue="description" className="gap-4">
        <CardHeader className="border-b [.border-b]:pb-0">
          <div className="overflow-x-auto pb-px">
            <TabsList variant="line" className="w-full justify-start">
              <TabsTrigger value="description">Description</TabsTrigger>
              <TabsTrigger value="specs">Specs</TabsTrigger>
              <TabsTrigger value="shipping">Shipping & Returns</TabsTrigger>
              <TabsTrigger value="reviews">
                Reviews ({product.reviews.length})
              </TabsTrigger>
            </TabsList>
          </div>
        </CardHeader>
        <CardContent className="flex flex-col gap-4">
          <TabsContent value="description" className="flex flex-col gap-4">
            <p className="max-w-prose text-sm">{product.description}</p>
            <ProductCheckList items={product.highlights} />
          </TabsContent>
          <TabsContent value="specs">
            <Table className="max-w-xl">
              <TableBody>
                {product.specs.map((spec) => (
                  <TableRow key={spec.label}>
                    <TableCell className="text-muted-foreground">
                      {spec.label}
                    </TableCell>
                    <TableCell>{spec.value}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TabsContent>
          <TabsContent value="shipping">
            <ProductCheckList items={PRODUCT_SHIPPING_NOTES} />
          </TabsContent>
          <TabsContent
            value="reviews"
            className="grid gap-6 @3xl/main:grid-cols-[14rem_minmax(0,1fr)] @3xl/main:gap-8"
          >
            <div className="flex flex-col items-center justify-center gap-2 text-center">
              <p className="text-5xl font-semibold tabular-nums">
                {product.rating.toFixed(1)}
              </p>
              <ProductRating rating={product.rating} showValue={false} />
              <p className="text-sm text-muted-foreground tabular-nums">
                Based on {product.reviewCount.toLocaleString("en-US")} reviews
              </p>
            </div>
            <ul className="flex flex-col gap-4 border-t border-border pt-6 @3xl/main:border-t-0 @3xl/main:border-l @3xl/main:pt-0 @3xl/main:pl-8">
              {product.reviews.map((review) => (
                <li key={review.id} className="flex flex-col gap-1 text-sm">
                  <div className="flex flex-wrap items-center gap-2">
                    <span className="font-medium">{review.author}</span>
                    <ProductRating rating={review.rating} />
                  </div>
                  <p className="max-w-prose text-muted-foreground">
                    {review.body}
                  </p>
                </li>
              ))}
            </ul>
          </TabsContent>
        </CardContent>
      </Tabs>
    </Card>
  );
}
