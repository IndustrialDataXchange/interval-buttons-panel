import React, {useState} from 'react';
import { AbsoluteTimeRange, DateTime, DurationUnit, PanelProps, dateTime } from '@grafana/data';
import { CustomTimeRangeOptions, TimeRangeType, StateData} from 'types';
import { Button, DateTimePicker } from '@grafana/ui';
import { PanelDataErrorView } from '@grafana/runtime';
import './style.css';

interface Props extends PanelProps<CustomTimeRangeOptions> {}

export const CustomTimeSelector: React.FC<Props> = ({ options, data, width, height, fieldConfig, id, onChangeTimeRange }) => {   
  const [stateData, setStateData] = useState<StateData>({
    selectedTimeRange: {
      interval: 0,
      timeRangeType: 'hour'
    },
    selectedButtonIndex: -1,
    multiplier: 1
  })

  const { selectedTimeRange, selectedButtonIndex, multiplier } = stateData;
  const { interval, timeRangeType } = selectedTimeRange;

  if (data.series.length === 0) {
    return <PanelDataErrorView fieldConfig={fieldConfig} panelId={id} data={data} needsStringField />;
  }  

  const setTimeInterval = (interval: number, durationUnit: DurationUnit, buttonIndex: number) => {            
    let from = dateTime(data.timeRange.from)            
    let to = dateTime(from).add(interval * multiplier, durationUnit);        
    
    changeDate(from, to);

    setStateData({      
      ...stateData,
      selectedTimeRange: {
        interval: interval,
        timeRangeType: durationUnit as TimeRangeType
      },
      selectedButtonIndex: buttonIndex
    })
  }  

  const setTime = (value: DateTime, from: boolean) => {
    let tra: AbsoluteTimeRange = {
      from: value.valueOf(),
      to: value.valueOf(),
    }
    
    onChangeTimeRange(tra);   
  }

  const incrementDecrementTimeRangeByInterval = (increment: boolean) => {    
    if(interval === 0) {
      return;
    }    

    let multipliedInterval = interval * multiplier;

    let durationUnit = ((multipliedInterval > 1) ? timeRangeType + "s" : timeRangeType) as DurationUnit 

    let from = dateTime(data.timeRange.from);    
    let to = dateTime(data.timeRange.from).add(multipliedInterval, durationUnit);

    if(increment) {
      from = from.add(multipliedInterval, durationUnit);
      to = to.add(multipliedInterval, durationUnit);
    }
    else {
      from = from.add(-multipliedInterval, durationUnit);
      to = to.add(-multipliedInterval, durationUnit);
    }

    changeDate(from, to);
  }

  const capitalizeFirstLetter = (input: string) => {
    return input.charAt(0).toUpperCase() + input.slice(1);
  }

  const setMultiplier = (value: number) => {
    let from = dateTime(data.timeRange.from)            
    let to = dateTime(from).add(interval * value, timeRangeType);

    changeDate(from, to)

    setStateData({      
      ...stateData,
      multiplier: value
    })
  }

  const changeDate = (from: DateTime, to: DateTime) => {
    let tra: AbsoluteTimeRange = {
      from: from.valueOf(),
      to: to.valueOf()
    }

    onChangeTimeRange(tra)
  }

  return (
    <div style={{width:width, height: height}}>
      { (options.ranges && options.ranges.length > 0) ?      
      <>
        <div className='row center pb-20' id='time-ranges'>
          <div className='col-6 pr-20'>
            <DateTimePicker label="From: " date={data.timeRange.from} onChange={(v) => setTime(v, true)}></DateTimePicker>
          </div>
          <div className='col-6'>
            <DateTimePicker label="To: " date={data.timeRange.to} onChange={(v) => setTime(v, false)}></DateTimePicker>          
          </div>
        </div>
        <div className='row center'>
          <div className='col-4 padding'>
            <Button onClick={() => incrementDecrementTimeRangeByInterval(false)}> {"<"} </Button>           
          </div>
          { options.ranges.map((range, index) => {
            return <div key={index}>
                    <div className='col-4 padding pb-10'>
                      <Button className={(index === selectedButtonIndex) ? 'selectedButton' : ''} onClick={() => setTimeInterval(range.interval, range.timeRangeType, index)}>{range.interval} {capitalizeFirstLetter(range.timeRangeType)}{(range.interval > 1) ? "s" : null}</Button>           
                    </div>            
                </div>
            })          
          }        
          <div className='col-4 padding'>
            <Button onClick={() => incrementDecrementTimeRangeByInterval(true)}>{">"}</Button>           
          </div>
        </div>
       
        { options.showMultiplier &&
          <>
            <div className='row center pb-10'>
              <div className='multiplierText'>Multiplier</div>
            </div>
            <div className='row center' id='multiplier'>                                              
              <div className='col-4 padding'>
                <Button className={(multiplier === 0.5) ? 'multiplierButtonSelected' : 'multiplierButton'} onClick={() => setMultiplier(0.5)}>
                  1/2
                </Button>
              </div>
              <div className='col-4 padding'>
                <Button className={(multiplier === 1) ? 'multiplierButtonSelected' : 'multiplierButton'} onClick={() => setMultiplier(1)}>
                  1
                </Button>
              </div>
              <div className='col-4 padding'>
                <Button className={(multiplier === 2) ? 'multiplierButtonSelected' : 'multiplierButton'} onClick={() => setMultiplier(2)}>
                  2
                </Button>
              </div>            
            </div>
          </>
         }
        </> 
        : 
        <div className='row center' id="no-data">Please add ranges in the panel options</div>
      }
    </div>
  );
};
