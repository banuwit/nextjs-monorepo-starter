/** Five-number summary of one distribution, plus optional mean/outliers. */
export type BoxStats = {
  min: number;
  q1: number;
  median: number;
  q3: number;
  max: number;
  mean?: number;
  /** Samples beyond the whisker fences; empty when whiskers span min→max. */
  outliers?: number[];
};

/** One category with a single distribution. */
export type BoxPlotRow = {
  label: string;
  box: BoxStats;
};

/** One category comparing two distributions side by side. */
export type BoxPlotGroupedRow = {
  label: string;
  current: BoxStats;
  previous: BoxStats;
};

/** A box series the tooltip can read from a row, e.g. `row.box`. */
export type BoxPlotSeries = {
  key: string;
  label: string;
  color: string;
};

/** Flattened outlier sample for a Scatter overlay. */
export type BoxPlotOutlierPoint = {
  label: string;
  value: number;
};
