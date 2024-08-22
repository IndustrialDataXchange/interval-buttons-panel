export type IntervalUnit = 'minute' | 'hour' | 'day' | 'month';

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
  autoRefreshActive: boolean
}
