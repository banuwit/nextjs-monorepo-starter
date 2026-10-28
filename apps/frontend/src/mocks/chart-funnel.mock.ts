// Presentational sample data for the funnel chart variants.

export const signupFunnel = [
  { stage: "visits", label: "Visits", users: 12400 },
  { stage: "signups", label: "Sign-ups", users: 5180 },
  { stage: "activated", label: "Activated", users: 3120 },
  { stage: "trial", label: "Trial", users: 1640 },
  { stage: "paid", label: "Paid", users: 820 },
];

export const checkoutFunnel = [
  { stage: "cart", label: "Cart", sessions: 8200 },
  { stage: "shipping", label: "Shipping", sessions: 5900 },
  { stage: "payment", label: "Payment", sessions: 4300 },
  { stage: "review", label: "Review", sessions: 3650 },
  { stage: "order", label: "Order placed", sessions: 3100 },
];

export const funnelComparison = [
  { stage: "Visits", current: 12400, previous: 10800 },
  { stage: "Sign-ups", current: 5180, previous: 4920 },
  { stage: "Activated", current: 3120, previous: 2610 },
  { stage: "Trial", current: 1640, previous: 1480 },
  { stage: "Paid", current: 820, previous: 690 },
];

export const hiringFunnel = [
  { stage: "applied", label: "Applied", candidates: 640 },
  { stage: "screened", label: "Screened", candidates: 312 },
  { stage: "interview", label: "Interview", candidates: 128 },
  { stage: "offer", label: "Offer", candidates: 34 },
  { stage: "hired", label: "Hired", candidates: 26 },
];
