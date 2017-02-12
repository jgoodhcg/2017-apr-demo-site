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

        // global min max for DateRange component
        this.min = d3.min(exercise_data, (day)=>{return day.start;});
        this.max = d3.max(exercise_data, (day)=>{return day.stop;});

        let min_date = new Date(this.min),
            max_date = new Date(this.max),
            min_reps = d3.min(exercise_data,(entry)=>{
                return this.getTotalRepsDay(entry).reps;}),
            max_reps = d3.max(exercise_data,(entry)=>{
                return this.getTotalRepsDay(entry).reps;});

        this.state = {
            data: exercise_data,
            start: min_date,
            end: max_date,
            range: exercise_data,
            scale_x: d3.scaleLinear()
                       .domain([this.min, this.max])
                       .range([0,100]),
            scale_y: d3.scaleLinear()
                       .domain([min_reps, max_reps])
                       .range([0, 62.5])
        };
    }

    xTicks(data){
        // return at most twenty dates to use as ticks
        // bundled with the increment along x axis to render at

        let days = d3.timeDays(this.state.start, this.state.end),
            max = 7,
            num = (days.length > max? max : days.length),
            mod = Math.ceil(days.length/num),

            values = _(days)
                .filter((v,i)=>{return i % mod === 0;})
                .map((day)=>{return {
                    value: day.getFullYear()+"-"
                          +(day.getMonth()+1)+"-"
                          +day.getDate(),
                    x: this.state.scale_x(day.valueOf())
                };})
                .value();

        return values;
    }

    getTotalRepsDay(day){
        let exercises = Object.keys(day.data.exercises),
            workout = day.data.exercises,
            total_reps = 0,
            date = new Date(day.start);

        exercises.forEach((e)=>{
            let sets = parseInt(workout[e].sets),
                reps = parseInt(workout[e].reps);
            total_reps += (sets * reps);
        });

        return {date: date, reps: total_reps};
    }

    yTicks(data){
        let values = _(data)
            .map((entry)=>{
                let date_and_reps = this.getTotalRepsDay(entry);
                return Object
                    .assign(date_and_reps,
                            {y: this.state.scale_y(date_and_reps.reps)});})
        
            .value();

        return values;
    }

    renderXTick(x_t, index){
        // expects x_t to be obj {value: val, increment: inc}
        let x = x_t.x,
            y = 65;
        return (
            <g key={x_t.value+"-y"}>
                <line x1={x} x2={x}
                      y1={64.5} y2={62.5}
                      class="x-axis-tick"
                      stroke="black" strokeWidth="0.1"
                />
                <text x={x} y={y}
                      fontFamily="Verdana" fontSize="1.5"
                      transform={"rotate(45,"+x+","+y+")"}>
                    {x_t.value}
                </text>
            </g>
        );
    }

    renderYTick(y_t, index){
        // expects y_t to be obj {date: Date, reps: int, y: position}
        let x = 0,
            y = y_t.y,
            day = y_t.date,
            label = day.getFullYear()+"-"
                   +(day.getMonth()+1)+"-"
                   +day.getDate();
        return (
            <g key={label+"-y"}>
                <line x1={x} x2={x - 0.1}
                      y1={y} y2={y}
                      class="x-axis-tick"
                      stroke="black" strokeWidth="0.1"
                />
                <text x={x} y={y}
                      fontFamily="Verdana" fontSize="1.5"
                      transform={"rotate(45,"+x+","+y+")"}>
                    {y_t.value}
                </text>
            </g>
        );
    }

    changeState(keyval){
        this.state.scale_x.domain([
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

                    {this.yTicks(this.state.range).map(this.renderYTick.bind(this))}

                </svg>
            </div>
        );
    }
}
