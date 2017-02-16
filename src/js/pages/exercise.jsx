import React from "react";
import InlineSVG from 'svg-inline-react';
import { IndexLink, Link, browserHistory, hashHistory } from "react-router";

import DateRange from "./../components/daterange.jsx";
import ExerciseBar from "./../components/exerciseBar.jsx";

import { exercise_data } from "./../modules/exercise_real.js";
import _ from "lodash";
import * as d3 from "d3";
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
            .map((entry)=>{
                return Object.keys(entry.data.exercises)
                             .concat(Object.keys(entry.data.runs));})
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
                       .domain([this.roundDown(this.min),
                                this.roundDown(this.max)])
                       .range([0,100]),
            width: 100/d3.timeDays(min_date, max_date).length
        };

        console.log(exercise_data);
    }

    roundDown(day){
        // takes anything that can be given to Date()
        // returns timestamp
        var d = new Date(day);
        d.setHours(0);
        d.setMinutes(0);
        d.setSeconds(0);
        d.setMilliseconds(0);

        return d.valueOf();
    }

    color(name){
        let index = this.workout_names.indexOf(name),
            interpolate_index = index/(this.workout_names.length - 1);

        return chroma.interpolateSpectral(interpolate_index);
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

    changeState(keyval){
        let new_state = Object.assign({}, this.state, keyval),
            days_in_new_range = d3.timeDays(new_state.start, new_state.end);

        new_state.scale_x.domain([
            this.roundDown(new_state.start.valueOf()),
            this.roundDown(new_state.end.valueOf())]);

        new_state.width = 100/days_in_new_range.length;

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

    dateString(d){
        return parseInt((d.getFullYear()+"-"
              +(d.getMonth()+1)+"-"
              +d.getDate()).split("-").join(""));
    }

    render(){
        return (
            <div>
                <DateRange
                    idprefix="date-range"
                    range="#68DADA" inactive="#989A9B"
                    min={this.min} max={this.max}
                    startUpdate={this.updateStart.bind(this)}
                    endUpdate={this.updateEnd.bind(this)}
                />
                <ExerciseBar
                    parent={this}
                />
           </div>
        );
    }
}
