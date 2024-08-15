import { PanelPlugin } from '@grafana/data';
import { PredefinedIntervalOptions, CustomInterval } from './types';
import { PredefinedIntervalHandler } from './components/PredefinedIntervalHandler';
import { PredefinedInervalButtonsEditor } from 'components/PredefinedIntervalButtonsEditor';

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

export const plugin = new PanelPlugin<PredefinedIntervalOptions>(PredefinedIntervalHandler).setPanelOptions((builder) => {  
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
      editor: PredefinedInervalButtonsEditor,
      defaultValue: defaultIntervals 
    });
});
