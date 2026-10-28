// Presentational sample data for the box plot chart variants. Raw samples
// come from a seeded PRNG so server and client compute identical quartiles.

/** mulberry32: small deterministic PRNG. */
function createRandom(seed: number) {
  let state = seed >>> 0;
  return () => {
    state = (state + 0x6d2b79f5) >>> 0;
    let t = state;
    t = Math.imul(t ^ (t >>> 15), t | 1);
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

/**
 * Right-skewed samples around `center` (sum of uniforms, squared tail), the
 * typical shape of latencies and durations.
 */
function generateSamples(
  seed: number,
  {
    count = 60,
    center,
    spread,
  }: { count?: number; center: number; spread: number },
) {
  const random = createRandom(seed);
  return Array.from({ length: count }, () => {
    const noise = (random() + random() + random()) / 3 - 0.5;
    const tail = random() ** 3 * spread;
    return Math.round(Math.max(1, center + noise * spread * 2 + tail));
  });
}

type SampleGroup = { label: string; samples: number[] };

/** API response time per endpoint, in milliseconds. */
export const endpointLatency: SampleGroup[] = [
  { label: "/auth", samples: generateSamples(11, { center: 120, spread: 60 }) },
  {
    label: "/users",
    samples: generateSamples(12, { center: 180, spread: 90 }),
  },
  {
    label: "/orders",
    samples: generateSamples(13, { center: 260, spread: 140 }),
  },
  {
    label: "/search",
    samples: generateSamples(14, { center: 340, spread: 180 }),
  },
  {
    label: "/reports",
    samples: generateSamples(15, { center: 220, spread: 220 }),
  },
  {
    label: "/files",
    samples: generateSamples(16, { center: 150, spread: 80 }),
  },
];

/** Order delivery time per region, in days. */
export const deliveryDays: SampleGroup[] = [
  {
    label: "Jakarta Metro",
    samples: generateSamples(21, { center: 2, spread: 2 }),
  },
  {
    label: "West Java",
    samples: generateSamples(22, { center: 3, spread: 2 }),
  },
  {
    label: "Central Java",
    samples: generateSamples(23, { center: 4, spread: 3 }),
  },
  {
    label: "East Java",
    samples: generateSamples(24, { center: 4, spread: 3 }),
  },
  { label: "Sumatra", samples: generateSamples(25, { center: 6, spread: 4 }) },
  {
    label: "Eastern Islands",
    samples: generateSamples(26, { center: 8, spread: 6 }),
  },
];

/** CI build duration per pipeline, in minutes, with a few stuck runs. */
export const buildMinutes: SampleGroup[] = [
  {
    label: "Web",
    samples: [...generateSamples(31, { center: 12, spread: 4 }), 31, 34],
  },
  {
    label: "API",
    samples: [...generateSamples(32, { center: 9, spread: 3 }), 22],
  },
  {
    label: "Mobile",
    samples: [...generateSamples(33, { center: 18, spread: 6 }), 41, 3],
  },
  { label: "Docs", samples: generateSamples(34, { center: 5, spread: 2 }) },
  {
    label: "E2E",
    samples: [...generateSamples(35, { center: 24, spread: 7 }), 52, 49],
  },
];

/** Page load time (ms) per page, this release against the previous one. */
export const pageLoadByRelease: {
  label: string;
  current: number[];
  previous: number[];
}[] = [
  {
    label: "Home",
    current: generateSamples(41, { center: 900, spread: 300 }),
    previous: generateSamples(51, { center: 1150, spread: 380 }),
  },
  {
    label: "Search",
    current: generateSamples(42, { center: 1300, spread: 420 }),
    previous: generateSamples(52, { center: 1400, spread: 460 }),
  },
  {
    label: "Product",
    current: generateSamples(43, { center: 1100, spread: 360 }),
    previous: generateSamples(53, { center: 1500, spread: 520 }),
  },
  {
    label: "Checkout",
    current: generateSamples(44, { center: 1600, spread: 480 }),
    previous: generateSamples(54, { center: 1550, spread: 440 }),
  },
];

/** Order value per sales channel, in dollars. */
export const orderValueByChannel: SampleGroup[] = [
  { label: "Web", samples: generateSamples(61, { center: 84, spread: 40 }) },
  { label: "Mobile", samples: generateSamples(62, { center: 62, spread: 30 }) },
  {
    label: "Retail",
    samples: generateSamples(63, { center: 118, spread: 60 }),
  },
  {
    label: "Partner",
    samples: generateSamples(64, { center: 146, spread: 90 }),
  },
  {
    label: "Wholesale",
    samples: generateSamples(65, { center: 210, spread: 120 }),
  },
];
