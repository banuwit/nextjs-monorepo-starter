"use client";

import { useEffect, useState } from "react";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  type CarouselApi,
} from "@/components/ui/carousel";
import { cn } from "@/lib/utils";
import type { Product, ProductColor } from "../types/product";
import { PRODUCT_ART_VIEWS, ProductArt } from "./product-art";

export function ProductGallery({
  product,
  color,
}: {
  product: Product;
  color: ProductColor;
}) {
  const [api, setApi] = useState<CarouselApi>();
  const [selected, setSelected] = useState(0);

  useEffect(() => {
    if (!api) return;
    const sync = () => setSelected(api.selectedScrollSnap());
    api.on("select", sync);
    return () => {
      api.off("select", sync);
    };
  }, [api]);

  return (
    <div className="flex min-w-0 flex-col-reverse gap-3 @2xl/main:flex-row">
      <div className="flex gap-2 @2xl/main:w-16 @2xl/main:flex-col">
        {PRODUCT_ART_VIEWS.map((view, index) => (
          <button
            key={view.label}
            type="button"
            aria-label={`Show ${view.label.toLowerCase()} view`}
            aria-current={index === selected}
            className={cn(
              "w-16 overflow-hidden rounded-lg border-2 border-transparent outline-none focus-visible:ring-3 focus-visible:ring-ring/50",
              index === selected && "border-foreground",
            )}
            onClick={() => api?.scrollTo(index)}
          >
            <ProductArt
              illustration={product.illustration}
              color={color}
              view={index}
              className="aspect-square"
            />
          </button>
        ))}
      </div>
      <Carousel setApi={setApi} className="min-w-0 flex-1">
        <CarouselContent>
          {PRODUCT_ART_VIEWS.map((view, index) => (
            <CarouselItem key={view.label}>
              <ProductArt
                illustration={product.illustration}
                color={color}
                label={`${product.name} in ${color.name}, ${view.label.toLowerCase()} view`}
                view={index}
                className="aspect-4/3 rounded-lg @2xl/main:aspect-square"
              />
            </CarouselItem>
          ))}
        </CarouselContent>
      </Carousel>
    </div>
  );
}
