import React from "react";
import InlineSVG from 'svg-inline-react';
import { IndexLink, Link, browserHistory, hashHistory } from "react-router";

import DateRange from "./../components/daterange.jsx";
import { exercise_data } from "./../modules/exercise_real.js";
import _ from "lodash";
import * as d3 from "d3"
import * as chroma from "d3-scale-chromatic";


export default class Exercise extends React.Component {
    constructor() {
        super();

        // global min max for DateRange component
        this.min = d3.min(exercise_data, (day)=>{return day.start;});
        this.max = d3.max(exercise_data, (day)=>{return day.stop;});

        let min_date = new Date(this.min),
            max_date = new Date(this.max);

        // all instance properties are for unchanging things
        this.max_reps = d3.max(exercise_data,(entry)=>{
            return this.getTotalRepsDay(entry).reps;});
        this.scale_y = d3.scaleLinear()
                         .domain([0, this.max_reps])
                         .range([62.5, 0]);

        this.workout_names = _(exercise_data)
            .map((entry)=>{return Object.keys(entry.data.exercises);})
            .flatten()
            .uniq()
            .value();

        // state is only for things that change
        this.state = {
            data: exercise_data,
            start: min_date,
            end: max_date,
            range: exercise_data,
            scale_x: d3.scaleLinear()
                       .domain([this.min, this.max])
                       .range([0,100]),
            width: 100/exercise_data.length
        };

        console.log(exercise_data);
    }

    color(name){
        let index = this.workout_names.indexOf(name),
            interpolate_index = index/(this.workout_names.length - 1);

        return chroma.interpolateSpectral(interpolate_index);
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
            let srw_arr = workout[e];

            srw_arr.forEach((srw)=>{
                let sets = parseInt(srw.sets),
                    reps = parseInt(srw.reps);

                total_reps += (sets * reps);
            });
        });

        return {date: date, reps: total_reps};
    }

    yTicks(){
        let ticks = _(
            _.range(0, this.max_reps,
                    Math.ceil(this.max_reps/7)))
            .map((rep)=>{ return {rep: rep, y: this.scale_y(rep)};})
            .value();

        ticks.push({rep: this.max_reps,
                    y: this.scale_y(this.max_reps)});

        return ticks;
    }

    renderXTick(x_t, index){
        // expects x_t to be obj {value: val, increment: inc}
        let x = x_t.x,
            y = 65;
        return (
            <g key={x_t.value+"-y"}>
                <line x1={x} x2={x}
                      y1={63.5} y2={62.5}
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
        // expects y_t to be obj {rep: rep_number, y: position}
        let x = 0,
            y = y_t.y;

        return (
            <g key={y_t.rep}>
                <line x1={x - 1} x2={x}
                      y1={y} y2={y}
                      class="x-axis-tick"
                      stroke="black" strokeWidth="0.1"
                />
                <text x={x - (3 * 1.5)} y={y}
                      fontFamily="Verdana" fontSize="1.5">
                    {y_t.rep}
                </text>
            </g>
        );
    }

    changeState(keyval){
        let new_state = Object.assign({}, this.state, keyval);

        new_state.scale_x.domain([
            new_state.start.valueOf(),
             new_state.end.valueOf()]);

        new_state.width = 100/new_state.range.length;

        this.setState(new_state);
        /* console.log(new_state);*/
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

    renderSegment(srw, label, x, y){
        let total_reps_for_day = 0;
        return(
            <rect
                key={label}
                x={x}
                y={this.scale_y(total_reps_for_day)}
                width={this.state.width}
                height={62.5 - this.scale_y(total_reps_for_day)}
            >
            </rect>
        );
    }

    renderBar(entry){
        let workout = entry.data.exercises,
            names   = Object.keys(entry.data.exercises),
            x       = this.state.scale_x(entry.start.valueOf()),
            y       = 62.5,
            label   = entry.start +"-"+ entry.stop;

        return (
            <g key={label}
               class="bar">
            </g>
        );
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

                    {this.xTicks(this.state.range)
                         .map(this.renderXTick.bind(this))}

                    <line
                        class="y-axis"
                        strokeLinecap="round"
                        x1="0"  x2="0" y1="0" y2="62.5"
                        stroke="black" strokeWidth="0.25"/>

                    {this.yTicks(this.state.range)
                         .map(this.renderYTick.bind(this))}

                    {/* {this.state.range.map(this.renderBar.bind(this))} */}

                </svg>
            </div>
        );
    }
}
