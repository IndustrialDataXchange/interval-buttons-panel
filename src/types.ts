export type IntervalUnit = 'minute' | 'hour' | 'day' | 'month';

export interface CustomInterval {
  interval: number;
  intervalUnit: IntervalUnit;
}

export interface PredefinedIntervalOptions {
  intervals?: CustomInterval[],
  showMultiplier: boolean
}

export interface StateData {
  selectedTimeRange: CustomInterval,
  selectedButtonIndex: number,
  multiplier: number
}
