import React from "react";
import InlineSVG from 'svg-inline-react';
import { IndexLink, Link, browserHistory, hashHistory } from "react-router";

import DateRange from "./../components/daterange.jsx";
import { exercise_data } from "./../modules/exercise_real.js";
import _ from "lodash";
import * as d3 from "d3";


export default class Exercise extends React.Component {
    constructor() {
        super();

        this.min = d3.min(exercise_data, (day)=>{return day.start;});
        this.max = d3.max(exercise_data, (day)=>{return day.stop;});

        this.state = {
            data: exercise_data
        };

        console.log(this.xTicks(this.state.data));
    }

    xTicks(data){
        // return at most twenty dates to use as ticks
        // bundled with the increment along x axis to render at
        let pre_values = _(data)
            .map((entry)=>{
                let day = new Date(entry.start);
                return day.getFullYear()+"-"
                      +day.getMonth()+"-"
                      +day.getDate();})
            .uniq()
            .value(),

            max = 20,
            num = (pre_values.length > max? max : pre_values.length),
            increment = (num > max? 100/max : 100/num),
            mod = Math.ceil(pre_values.length/num),

            values = _(pre_values)
                .filter((v,i)=>{return i % mod === 0;})
                .map((value)=>{return {value, increment};})
                .value();

        return values;
    }

    renderXTick(x_t, index){
        // expects x_t to be obj {value: val, increment: inc}
        let x = x_t.increment * index;
        return (
            <line class="x-tick"
                  x1={x} x2={x}
                  y1="62.5" y2="61.5"
                  stroke="black"
                  strokeWidth="0.25"
                  key={x_t.value}
            />
        );
    }

    render(){
        return (
            <div>
                <DateRange
                    idprefix="date-range"
                    range="#68DADA" inactive="#989A9B"
                    min={this.min} max={this.max}
                    startUpdate={(t)=>{console.log("start is: "+t);}}
                    endUpdate={(t)=>{console.log("end is: "+t);}}
                />
            <svg width="100%" height="100%" viewBox="-10 -10 120 82.6">
                <line
                    class="x-axis"
                    strokeLinecap="round"
                    x1="0" x2="100" y1="62.5" y2="62.5"
                    stroke="black" strokeWidth="0.25"/>

                {this.xTicks(this.state.data).map(this.renderXTick.bind(this))}

                <line
                    class="y-axis"
                    strokeLinecap="round"
                    x1="0"  x2="0" y1="0" y2="62.5"
                    stroke="black" strokeWidth="0.25"/>

            </svg>
            </div>
        );
    }
}
