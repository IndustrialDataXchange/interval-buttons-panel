import React, {useState} from 'react';
import { AbsoluteTimeRange, DateTime, DurationUnit, PanelProps, dateTime } from '@grafana/data';
import { PredefinedIntervalOptions, IntervalUnit, StateData} from 'types';
import { Button, DateTimePicker } from '@grafana/ui';
import './style.css';

interface Props extends PanelProps<PredefinedIntervalOptions> {}

export const IntervalHandler: React.FC<Props> = (props) => {   
  const { options, data, width, height, onChangeTimeRange } = props
  const [stateData, setStateData] = useState<StateData>({
    selectedTimeRange: {
      interval: 0,
      intervalUnit: 'hour'
    },
    selectedButtonIndex: -1,
    multiplier: 1
  })

  const { selectedTimeRange, selectedButtonIndex, multiplier } = stateData;
  const { interval, intervalUnit } = selectedTimeRange;  

  const setTimeInterval = (interval: number, durationUnit: DurationUnit, buttonIndex: number) => {            
    let from = dateTime(data.timeRange.from)            
    let to = dateTime(from).add(interval * multiplier, durationUnit);        
    
    changeDate(from, to);

    setStateData({      
      ...stateData,
      selectedTimeRange: {
        interval: interval,
        intervalUnit: durationUnit as IntervalUnit
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

  const incrementDecrementIntervalRangeByInterval = (increment: boolean) => {    
    if(interval === 0) {
      return;
    }    

    let multipliedInterval = interval * multiplier;

    let durationUnit = ((multipliedInterval > 1) ? intervalUnit + "s" : intervalUnit) as DurationUnit 

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
    let to = dateTime(from).add(interval * value, intervalUnit);

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
      { (options.intervals && options.intervals.length > 0) ?      
      <>
        <div className='row center pb-20' data-testid="time-ranges">
          <div className='col-6 pr-20'>
            <DateTimePicker label="From: " date={data.timeRange.from} onChange={(v) => setTime(v, true)}></DateTimePicker>
          </div>
          <div className='col-6'>
            <DateTimePicker label="To: " date={data.timeRange.to} onChange={(v) => setTime(v, false)}></DateTimePicker>          
          </div>
        </div>
        <div className='row center'>
          <div className='col-4 padding'>
            <Button onClick={() => incrementDecrementIntervalRangeByInterval(false)}> {"<"} </Button>           
          </div>
          { options.intervals.map((interval, index) => {
            return <div key={index}>
                    <div className='col-4 padding pb-10'>
                      <Button className={(index === selectedButtonIndex) ? 'selectedButton' : ''} onClick={() => setTimeInterval(interval.interval, interval.intervalUnit, index)}>{interval.interval} {capitalizeFirstLetter(interval.intervalUnit)}{(interval.interval > 1) ? "s" : null}</Button>           
                    </div>            
                </div>
            })          
          }        
          <div className='col-4 padding'>
            <Button onClick={() => incrementDecrementIntervalRangeByInterval(true)}>{">"}</Button>           
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
        <div className='row center' data-testid="no-data">Please add intervals in the panel options</div>
      }
    </div>
  );
};
