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

        let min_date = new Date(this.min),
            max_date = new Date(this.max);

        this.state = {
            data: exercise_data,
            start: min_date,
            end: max_date,
            range: exercise_data,
            scale: d3.scaleLinear()
                     .domain([this.min, this.max])
                     .range([0,100])
        };
    }

    xTicks(data){
        // return at most twenty dates to use as ticks
        // bundled with the increment along x axis to render at

        let days = d3.timeDays(this.state.start, this.state.end);

        let pre_values = _(days)
            .map((day)=>{
                return day.getFullYear()+"-"
                      +(day.getMonth()+1)+"-"
                      +day.getDate();})
            .value(),

            max = 20,
            num = (pre_values.length > max? max : pre_values.length),
            increment = (num > max? 100/max : 100/num),
            mod = Math.ceil(pre_values.length/num),

            values = _(days)
                .filter((v,i)=>{return i % mod === 0;})
                .map((day)=>{return {
                    value: day.getFullYear()+"-"
                          +(day.getMonth()+1)+"-"
                          +day.getDate(),
                    x: this.state.scale(day.valueOf())
                };})
                .value();

        console.log(pre_values);
        console.log(num,increment,mod);
        console.log(values);

        return values;
    }

    yTicks(data){
        let pre_values = _(data)
            .map((entry)=>{
                let exercises = Object.keys(entry.data.exercises),
                    workout = entry.data.exercises,
                    total_reps = 0,
                    date_tmp = new Date(entry.start),
                    date_str = date_tmp.getFullYear()+"-"+
                               (date_tmp.getMonth()+1)+"-"+
                               date_tmp.getDate(),
                    return_val = {};

                exercises.forEach((e)=>{
                    let sets = parseInt(workout[e].sets),
                        reps = parseInt(workout[e].reps);
                    total_reps += (sets * reps);
                });

                return_val[date_str] = total_reps;
                return return_val;
            })
            .value();
    }

    renderXTick(x_t, index){
        // expects x_t to be obj {value: val, increment: inc}
        let x = x_t.x,
            y = 70;
        return (
            <text x={x} y={y}
                  fontFamily="Verdana" fontSize="1.5"
                  key={x_t.value}
                  transform={"rotate(-45,"+x+","+y+")"}>
                {x_t.value}
            </text>
        );
    }

    changeState(keyval){
        this.state.scale.domain([
            this.state.start.valueOf(),
             this.state.end.valueOf()]);

        let newState = Object.assign({}, this.state, keyval);
        this.setState(newState);
        /* console.log(newState);*/
    }

    calcRange(s,e){
        // s,e (start,stop) are a js Date
        let new_range = this.state.data
                            .filter((entry)=>{
                                return entry.start >= s.valueOf()
                                     && entry.stop <= e.valueOf();});
        return new_range;
    }

    updateStart(t){
        this.state.start = t;
        this.changeState(
            {range: this.calcRange(this.state.start, this.state.end)});
    }

    updateEnd(t){
        this.state.end = t;
        this.changeState(
            {range: this.calcRange(this.state.start, this.state.end)});
    }

    render(){
        this.yTicks(this.state.range);

        return (
            <div>
                <DateRange
                    idprefix="date-range"
                    range="#68DADA" inactive="#989A9B"
                    min={this.min} max={this.max}
                    startUpdate={this.updateStart.bind(this)}
                    endUpdate={this.updateEnd.bind(this)}
                />
                <svg width="100%" height="100%" viewBox="-10 -10 120 82.6">

                    <line
                        class="x-axis"
                        strokeLinecap="round"
                        x1="0" x2="100" y1="62.5" y2="62.5"
                        stroke="black" strokeWidth="0.25"/>

                    {this.xTicks(this.state.range).map(this.renderXTick.bind(this))}

                    <line
                        class="y-axis"
                        strokeLinecap="round"
                        x1="0"  x2="0" y1="0" y2="62.5"
                        stroke="black" strokeWidth="0.25"/>

                    {/* {this.yTicks(this.state.range).map(this.renderYTick.bind(this))} */}

                </svg>
            </div>
        );
    }
}
