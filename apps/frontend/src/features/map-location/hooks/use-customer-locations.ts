"use client";

import { useEffect, useState } from "react";

import { customerProfiles, locationCustomers } from "@/mocks/map-location.mock";
import type { CustomerProfile, FilterState, LocationCustomer } from "../types/map-location";
import { filterCustomers } from "../utils/map-location";

/**
 * Stands in for `POST /report/v2/customer/location-customer`: filters the mock
 * on a short delay so the loading overlay and refetch flow behave like the
 * real page. Replace with a TanStack Query hook over `lib/api/endpoints` later.
 */
export function useCustomerLocations(filters: FilterState) {
  // Stringified so a new filters object with the same content does not refetch.
  const key = JSON.stringify(filters);
  // Loading is derived: the request in flight is the one whose key has not resolved yet.
  const [resolved, setResolved] = useState<{ key: string; data: LocationCustomer[] } | null>(null);

  useEffect(() => {
    const timer = window.setTimeout(() => {
      setResolved({ key, data: filterCustomers(locationCustomers, JSON.parse(key) as FilterState) });
    }, 350);
    return () => window.clearTimeout(timer);
  }, [key]);

  const isLoading = resolved?.key !== key;
  return { data: resolved?.data ?? null, isLoading, isError: false };
}

/** Stands in for `sales-profile-customer`; resolves one customer's profile. */
export function useCustomerProfile(customerId: string | null) {
  const [resolved, setResolved] = useState<{ id: string; data: CustomerProfile | null } | null>(null);

  useEffect(() => {
    if (!customerId) return;
    const timer = window.setTimeout(() => {
      setResolved({ id: customerId, data: customerProfiles.find((item) => item.key === customerId) ?? null });
    }, 500);
    return () => window.clearTimeout(timer);
  }, [customerId]);

  const current = resolved?.id === customerId ? resolved : null;
  return {
    data: current?.data ?? null,
    isLoading: !!customerId && !current,
    isError: !!current && current.data === null,
  };
}
