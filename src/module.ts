import { PanelPlugin } from '@grafana/data';
import { IntervalOptions, CustomInterval } from './types';
import { IntervalHandler } from './components/IntervalHandler';
import { IntervalButtonsEditor } from 'components/IntervalButtonsEditor';

const defaultIntervals: CustomInterval[] = [
  {
    interval: 1,
    intervalUnit: 'hour'
  },
  {
    interval: 8,
    intervalUnit: 'hour'
  },
  {
    interval: 1,
    intervalUnit: 'day'
  },
  {
    interval: 7,
    intervalUnit: 'day'
  },
  {
    interval: 1,
    intervalUnit: 'month'
  }
]    

export const plugin = new PanelPlugin<IntervalOptions>(IntervalHandler).setPanelOptions((builder) => {  
  return builder    
    .addBooleanSwitch({
      path: 'showMultiplier',
      name: 'Show Multiplier',
      description: 'The multiplier can be used to multiply the selected interval by the selected factor.',
      defaultValue: true
    })
    .addCustomEditor({
      id: 'ctr',
      path: 'intervals',
      name: 'Custom Intervals',
      editor: IntervalButtonsEditor,
      defaultValue: defaultIntervals 
    })
    .addBooleanSwitch({
      path: 'enableAutoRefresh',
      name: 'Enable auto refresh',
      description: 'Will continuously update the "To" time by the auto refresh value.',
      defaultValue: false
    })
    .addNumberInput({
      path: 'autoRefreshTime',
      name: 'Auto Refresh Value',
      description: 'The time in seconds before the "To" value should be updated.',
      showIf: (config: IntervalOptions) => config.enableAutoRefresh,
      defaultValue: 60
    });
});
