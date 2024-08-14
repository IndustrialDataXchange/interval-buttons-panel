export type TimeRangeType = 'minute' | 'hour' | 'day' | 'month';

export interface CustomTimeRange {
  interval: number;
  timeRangeType: TimeRangeType;
}

export interface CustomTimeRangeOptions {
  ranges: CustomTimeRange[],
  showMultiplier: boolean
}

export interface StateData {
  selectedTimeRange: CustomTimeRange,
  selectedButtonIndex: number,
  multiplier: number
}