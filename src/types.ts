export type IntervalUnit = 'second' | 'minute' | 'hour' | 'day' | 'month' | 'year';

export interface CustomInterval {
  interval: number;
  intervalUnit: IntervalUnit;
}

export interface IntervalOptions {
  intervals?: CustomInterval[],
  showMultiplier: boolean,
  enableAutoRefresh: boolean,
  autoRefreshTime: number
}

export interface StateData {
  selectedTimeRange: CustomInterval,
  selectedButtonIndex: number,
  multiplier: number,
  autoRefreshActive: boolean,
}
