import { SelectableValue, StandardEditorProps } from "@grafana/data"
import { Button, Input, Select } from "@grafana/ui";
import React, { useState, ChangeEvent } from "react"
import { CustomTimeRange, TimeRangeType } from "types";
import './style.css';

type Props = StandardEditorProps<CustomTimeRange[]>;

export const CustomTimeRangeEditor = ({value, onChange}: Props) => {
    const timeRangeOptions: TimeRangeType[] = ['minute', 'hour', 'day', 'month'];
    const [timeRange, setTimeRange] = useState<CustomTimeRange>({
        interval: 0,
        timeRangeType: "day"
    })    

    const handleIntervalChange = (event: ChangeEvent<HTMLInputElement>) => {
        setTimeRange({
            ...timeRange,
            interval: parseInt(event.target.value, 10)
        })
    }

    const handleTimeRangeTypeChange = (value: SelectableValue<string>) => {
        setTimeRange({
            ...timeRange,
            timeRangeType: value.value as TimeRangeType
        })
    }

    const handleAdd = () => {
        let newValues: CustomTimeRange[] = [];  
        let exists = false;              

        if(value){
            value.forEach(x => {
                if(x.interval === timeRange.interval && x.timeRangeType === timeRange.timeRangeType){
                    //this item already exists - no need to change anything
                    exists = true;
                }
                newValues.push(x);
            })
        }        

        if(exists){
            return;
        }

        newValues.push(timeRange)    
        onChange(newValues)
    }    

    const handleDelete = (index: number) => {
        let newValues: CustomTimeRange[] = []
                         
        value?.map((x,i) => {
            if(index !== i){
                newValues.push(x);
            }                    
        })
        
        onChange(newValues)
    }

    const options = (): Array<SelectableValue<string>> => {
        let opts: Array<SelectableValue<string>> = []
        timeRangeOptions.map(x => {
            opts.push({
                label: x,
                value: x
            })
        })        
        return opts;
    }    

    const opts = options();

    return (<div>                                    
            <div className="row pt-10 pb-10">
            <div className="col-6 pr-10">
                <Input width={20} label="Interval" placeholder="Interval" onChange={handleIntervalChange} type="number"></Input>
            </div>           
            <div className="col-6 pr-10">
                <Select width={20} options={opts} placeholder="Interval Type" defaultValue={'hours'} onChange={handleTimeRangeTypeChange}/>
            </div>
            </div>
            <div className="row pb-10">
                <Button onClick={handleAdd}>Add</Button>
            </div>
            {value?.map((x, index) => {
                return <div key={index} className="row pb-10"> 
                        <div className="col-4 pr-10">
                            <Input disabled width={20} label="Interval" placeholder="Interval" type="number" value={x.interval}></Input>
                        </div>           
                        <div className="col-4 pr-10">
                            <Select value={x.timeRangeType} disabled width={20} options={opts} placeholder="Interval Type" defaultValue={'hours'} onChange={handleTimeRangeTypeChange}/>
                        </div>
                        <div className="col-4 pr-10">
                            <Button data-testid={"remove-time-range-" + index} onClick={() => handleDelete(index)} className="deleteButton">X</Button>
                        </div>
                    </div>
                })
            }
        </div>
    )
}
