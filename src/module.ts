import { PanelPlugin } from '@grafana/data';
import { CustomTimeRangeOptions, CustomTimeRange } from './types';
import { CustomTimeSelector } from './components/CustomTimeSelector';
import { CustomTimeRangeEditor } from 'components/CustomTimeRangeEditor';

const defaultTimeRanges: CustomTimeRange[] = [
  {
    interval: 1,
    timeRangeType: 'hour'
  },
  {
    interval: 8,
    timeRangeType: 'hour'
  },
  {
    interval: 1,
    timeRangeType: 'day'
  },
  {
    interval: 7,
    timeRangeType: 'day'
  },
  {
    interval: 1,
    timeRangeType: 'month'
  }
]    

export const plugin = new PanelPlugin<CustomTimeRangeOptions>(CustomTimeSelector).setPanelOptions((builder) => {
  return builder    
    .addBooleanSwitch({
      path: 'showMultiplier',
      name: 'Show Multiplier',
      description: 'The multiplier can be used to multiply the selected time range by the selected factor.',
      defaultValue: true
    })
    .addCustomEditor({
      id: 'ctr',
      path: 'ranges',
      name: 'Custom Time Ranges',
      editor: CustomTimeRangeEditor,
      defaultValue: defaultTimeRanges 
    });
});
