import { SelectableValue, StandardEditorProps } from "@grafana/data"
import { Button, Input, Select } from "@grafana/ui";
import React, { useState, ChangeEvent } from "react"
import { CustomInterval, IntervalUnit } from "types";
import './style.css';

type Props = StandardEditorProps<CustomInterval[]>;

export const IntervalButtonsEditor = ({value, onChange, context}: Props) => {
    const customIntervalOptions: IntervalUnit[] = ['minute', 'hour', 'day', 'month'];
    const [customInterval, setCustomInterval] = useState<CustomInterval>({
        interval: 0,
        intervalUnit: "day"
    })    

    const handleIntervalChange = (event: ChangeEvent<HTMLInputElement>) => {
        setCustomInterval({
            ...customInterval,
            interval: parseInt(event.target.value, 10)
        })
    }

    const handleIntervalUnitChange = (value: SelectableValue<string>) => {
        setCustomInterval({
            ...customInterval,
            intervalUnit: value.value as IntervalUnit
        })
    }

    const handleAdd = () => {
        let newValues: CustomInterval[] = [];  
        let exists = false;              

        if(value){
            value.forEach(x => {
                if(x.interval === customInterval.interval && x.intervalUnit === customInterval.intervalUnit){
                    //this item already exists - no need to change anything
                    exists = true;
                }
                newValues.push(x);
            })
        }        

        if(exists){
            return;
        }

        newValues.push(customInterval)    
        onChange(newValues)
    }    

    const handleDelete = (index: number) => {
        let newValues: CustomInterval[] = []
                         
        value?.map((x,i) => {
            if(index !== i){
                newValues.push(x);
            }                    
        })
        
        onChange(newValues)
    }

    const options = (): Array<SelectableValue<string>> => {
        let opts: Array<SelectableValue<string>> = []
        customIntervalOptions.map(x => {
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
                        <Select width={20} options={opts} placeholder="Interval Type" defaultValue={'hours'} onChange={handleIntervalUnitChange}/>
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
                            <Select value={x.intervalUnit} disabled width={20} options={opts} placeholder="Interval Type" defaultValue={'hours'} onChange={handleIntervalUnitChange}/>
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
