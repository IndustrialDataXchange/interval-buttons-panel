import React, {useEffect, useState} from 'react';
import { AbsoluteTimeRange, DateTime, DurationUnit, PanelProps, dateTime } from '@grafana/data';
import { IntervalOptions, IntervalUnit, StateData} from 'types';
import { Button, DateTimePicker } from '@grafana/ui';
import { FaClockRotateLeft } from "react-icons/fa6";
import { LuRefreshCcw } from "react-icons/lu";
import './style.css';

interface Props extends PanelProps<IntervalOptions> {}

export const IntervalHandler: React.FC<Props> = (props) => {   
  const { options, data, width, height, onChangeTimeRange } = props
  const [stateData, setStateData] = useState<StateData>({
    selectedTimeRange: {
      interval: 1,
      intervalUnit: 'hour'
    },
    selectedButtonIndex: 0,
    multiplier: 1,
    autoRefreshActive: true,
    autoRefreshInterval: undefined
  })
  const [refreshIntervals, setRefreshIntervals] = useState<NodeJS.Timeout[]>([]);

  const { selectedTimeRange, selectedButtonIndex, multiplier, autoRefreshActive, autoRefreshInterval } = stateData;
  const { interval, intervalUnit } = selectedTimeRange;  

  useEffect(() => {        
    const currentTimeDiff = data.timeRange.to.diff(data.timeRange.from, 'second');             

    if(currentTimeDiff % 60 !== 0) {
      window.clearInterval(autoRefreshInterval);

      const minuteTimeDiff = data.timeRange.to.diff(data.timeRange.from, 'minute');            

      setStateData(prev => ({
        ...prev,
        selectedTimeRange: {
          interval: minuteTimeDiff,
          intervalUnit: 'minute'
        },
        autoRefreshActive: false,
        autoRefreshInterval: undefined,
        selectedButtonIndex: -1
      }))
    }    

  }, [data.timeRange, autoRefreshInterval])

  useEffect(() => {                        
    setTimeInterval(interval, intervalUnit, selectedButtonIndex);    
      
    //This is a hack to clear all intervals when the component is mounted, we need to find a better way to store the interval ids and clear them properly
    for (let i = 1; i < 1000; i++) {
      window.clearInterval(i);
    }
    
    if(autoRefreshActive) {
      const interval = setInterval(() => {
        doAutoRefresh()
      }, options.autoRefreshTime * 1000)      

      setRefreshIntervals([...refreshIntervals, interval]);
      setStateData(prev => ({
        ...prev,
        autoRefreshInterval: interval
      }))      
    }

  return () => {
    clearInterval(autoRefreshInterval);
  }
  }, [interval, multiplier]);// eslint-disable-line react-hooks/exhaustive-deps

  const setTimeInterval = (interval: number, durationUnit: DurationUnit, buttonIndex: number) => {                
    let multipliedInterval = getMultipliedInterval(interval, durationUnit, multiplier, data.timeRange.from);
    let to = dateTime(data.timeRange.to)     
    let from = dateTime(data.timeRange.to).subtract(multipliedInterval, 'minutes');        
    
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

  const setTime = (value: DateTime, isFrom: boolean) => {
    
    let multipliedInterval = getMultipliedInterval(interval, intervalUnit, multiplier, value);
    let to: DateTime = value;
    let from: DateTime = value;

    if(isFrom){
      to = dateTime(value).add(multipliedInterval, 'minutes');
    }
    else{
      from = dateTime(from).subtract(multipliedInterval, 'minutes');
    }    
    
    let tra: AbsoluteTimeRange = {
      from: from.valueOf(),      
      to: to.valueOf()
    }
    
    onChangeTimeRange(tra);   
  }

  const incrementDecrementIntervalRangeByInterval = (increment: boolean) => {    
    if(interval === 0) {
      return;
    }    

    let multipliedInterval = getMultipliedInterval(interval, intervalUnit, multiplier, data.timeRange.from);
   
    let from = dateTime(data.timeRange.from);    
    let to = dateTime(data.timeRange.from).add(multipliedInterval, 'minutes');

    if(increment) {
      from = from.add(multipliedInterval, 'minutes');
      to = to.add(multipliedInterval, 'minutes');
    }
    else {
      from = from.add(-multipliedInterval, 'minutes');
      to = to.add(-multipliedInterval, 'minutes');
    }

    changeDate(from, to);

    disableAutoRefresh();
  }

  const capitalizeFirstLetter = (input: string) => {
    return input.charAt(0).toUpperCase() + input.slice(1);
  }

  const setMultiplier = (value: number) => {
    let to = dateTime(data.timeRange.to)  
    let multipliedInterval = getMultipliedInterval(interval, intervalUnit, value, data.timeRange.to);          
    
    let from = dateTime(to).subtract(multipliedInterval, 'minutes');

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

  const getMultipliedInterval = (interval: number, unit: string, mult: number, from: DateTime) => {
    let multipliedInterval = interval * mult;
   
    let durationUnit = ((multipliedInterval > 1) ? unit + "s" : unit) as DurationUnit 

    if(durationUnit === 'hours' || durationUnit === 'hour'){
      multipliedInterval = multipliedInterval * 60;
    }

    if(durationUnit === 'days' || durationUnit === 'day'){
      multipliedInterval = multipliedInterval * 24 * 60;      
    }

    if(durationUnit === 'month' || durationUnit === 'months'){
      multipliedInterval = multipliedInterval * 24;
      let currentFrom = from.toDate();
      let numDaysInMonth = new Date(currentFrom.getFullYear(), currentFrom.getMonth() + 1, 0).getDate()
      multipliedInterval = multipliedInterval * numDaysInMonth * 60;      
    }

    return multipliedInterval;
  }

  const handleNowClick = () => {
    if(!autoRefreshActive){
      goToNow();
    }

    let autoRefresh = !autoRefreshActive;    

    let interval = undefined;

    if(autoRefresh){
      interval = setInterval(() => {
        doAutoRefresh()
      }, options.autoRefreshTime * 1000)      
    }
    else{
      clearInterval(stateData.autoRefreshInterval);
    }

    setStateData({
      ...stateData,
      autoRefreshActive: autoRefresh,
      autoRefreshInterval: interval
    })
  }

  const goToNow = () => {
    let date = dateTime(Date.now());
    setTime(date, false)
  }

  const toggleAutoRefresh = () => {
    let newValue = !autoRefreshActive;

    setStateData({
      ...stateData,
      autoRefreshActive: newValue
    })    
  }

  const doAutoRefresh = () => {    
      goToNow();     
  }  

  const handleApplyTimeClick = (value: DateTime, isFrom: boolean) => {
    setTime(value, isFrom);
    disableAutoRefresh();
  }

  const disableAutoRefresh = () => {
    clearInterval(stateData.autoRefreshInterval);

    setStateData({
      ...stateData,
      autoRefreshActive: false,
      autoRefreshInterval: undefined
    })
  }

  

  return (    
    <div style={{width:width, height: height}}>
      { (options.intervals && options.intervals.length > 0) ?      
      <>
        <div className='row center pb-20' data-testid="time-ranges">
          <div className='col-3 pr-20'>
            <DateTimePicker label="From: " date={data.timeRange.from} onChange={(v) => handleApplyTimeClick(v, true)}></DateTimePicker>
          </div>
          
          {options.showMultiplier &&
            <div className='col-6 pr-20' style={{display: 'flex', flexDirection: 'row', gap: 10}}>
              <div className='pt-4'>
                <Button style={{height: '25px'}} className={(multiplier === 0.5) ? 'multiplierButtonSelected' : 'multiplierButton'} onClick={() => setMultiplier(0.5)}>
                  1/2
                </Button>
              </div>
              <div className='pt-4'>
                <Button style={{height: '25px'}} className={(multiplier === 1) ? 'multiplierButtonSelected' : 'multiplierButton'} onClick={() => setMultiplier(1)}>
                  1
                </Button>
              </div>
              <div className='pt-4'>
                <Button style={{height: '25px'}} className={(multiplier === 2) ? 'multiplierButtonSelected' : 'multiplierButton'} onClick={() => setMultiplier(2)}>
                  2
                </Button>
              </div>            
            </div>
          }
           
          <div className='col-3 pl-20 pr-20'>
            <DateTimePicker label="To: " date={data.timeRange.to} onChange={(v) => handleApplyTimeClick(v, false)}></DateTimePicker>          
          </div>
          <div className='col-3 pt-4' title='Set "To" To now'>
              <Button style={{height: '25px'}} className={autoRefreshActive ? 'selectedButton' : ''} onClick={() => handleNowClick()}><FaClockRotateLeft size={20} /></Button>
          </div>          
          { options.enableAutoRefresh &&
            <div className='col-3 pt-4' title='Enable auto refresh'>
              <Button className={autoRefreshActive ? 'selectedButton' : ''} onClick={() => toggleAutoRefresh()}><LuRefreshCcw size={20}/></Button>
            </div>          
          }          
        </div>
        <div style={{display: 'flex', flexDirection: 'row', gap: 10}} className='center'>
          <div>
            <Button style={{height: '25px'}} onClick={() => incrementDecrementIntervalRangeByInterval(false)}> {"<"} </Button>           
          </div>
          { options.intervals.map((interval, index) => {
            return <div key={index}>
                    <div className='col-2 pb-10'>
                      <Button style={{height: '25px'}} className={(index === selectedButtonIndex) ? 'selectedButton' : ''} onClick={() => setTimeInterval(interval.interval, interval.intervalUnit, index)}>{interval.interval} {capitalizeFirstLetter(interval.intervalUnit)}{(interval.interval > 1) ? "s" : null}</Button>           
                    </div>            
                </div>
            })          
          }        
          <div>
            <Button style={{height: '25px'}} onClick={() => incrementDecrementIntervalRangeByInterval(true)}>{">"}</Button>           
          </div>
        </div>
              
        </> 
        : 
        <div className='row center' data-testid="no-data">Please add intervals in the panel options</div>
      }
    </div>
  );
};
