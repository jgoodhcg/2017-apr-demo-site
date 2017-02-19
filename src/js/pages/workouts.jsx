import React from "react";
import InlineSVG from 'svg-inline-react';
import { IndexLink, Link, browserHistory, hashHistory } from "react-router";

import DateRange from "./../components/daterange.jsx";
import ExerciseBar from "./../components/exercise.jsx";
import RunsBar from "./../components/runs.jsx";
import Heatmap from "./../components/heatmap.jsx";

import { exercise_data } from "./../modules/exercise_real.js";
import _ from "lodash";
import * as d3 from "d3";
import * as chroma from "d3-scale-chromatic";


export default class Workouts extends React.Component {
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

        this.max_distance = d3.max(exercise_data, (entry)=>{
            return this.getTotalDistanceDay(entry).distance});
        this.scale_y_runs = d3.scaleLinear()
                              .domain([0, this.max_distance])
                              .range([62.5, 0]);

        this.data = exercise_data;

        this.workout_names = this.getAllExercises(exercise_data);

        this.non_run_names = _(exercise_data)
            .map((entry)=>{
                return Object.keys(entry.data.exercises);})
            .flatten()
            .uniq()
            .value();

        // state is only for things that change
        this.state = {
            start: min_date,
            end: max_date,
            range: exercise_data,
            scale_x: d3.scaleLinear()
                       .domain([this.roundDown(this.min),
                                this.roundDown(this.max)])
                       .range([0,100]),
            width: 100/d3.timeDays(min_date, max_date).length,
            selected: null
        };

        this.heatmap_totals = this.totalForWorkoutNames();
        this.max_reps_workout = d3.max(
            this.heatmap_totals,
            (total_for_name)=>{
                return total_for_name.reps;});
    }

    getAllExercises(range){
        return _(range)
            .map((entry)=>{
                return Object.keys(entry.data.exercises)
                             .concat(Object.keys(entry.data.runs));})
            .flatten()
            .uniq()
            .value()
    }

    totalForName(name){
        return _(this.state.range)
            .filter((entry)=>{
                return Object.keys(entry.data.exercises)
                             .indexOf(name) !== -1;})
            .map((entry)=>{
                let exercises  = entry.data.exercises,
                    srw_arr    = exercises[name],
                    total_reps = 0;

                srw_arr.forEach((srw)=>{
                    let sets = parseInt(srw.sets),
                        reps = parseInt(srw.reps);

                    total_reps += (sets * reps);});

                return total_reps;})
            .reduce((total, reps)=>{return total + reps;}, 0);
    }

    totalForWorkoutNames(){
        return this.non_run_names.map((name)=>{
            return {
                name: name,
                reps: this.totalForName(name)};});
    }

    roundDown(day){
        // takes anything that can be given to Date()
        // returns timestamp of that day at 0 h,m,s,ms
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

    getTotalDistanceDay(day){
        let runs = Object.keys(day.data.runs),
            workout = day.data.runs,
            total_distance = 0,
            date = new Date(day.start);

        runs.forEach((e)=>{
            let dtw_arr = workout[e];

            dtw_arr.forEach((dtw)=>{
                let distance = parseFloat(dtw.sets);

                total_distance += distance;
            })
        });

        return {date: date, distance: total_distance}
    }

    totalMiles(range){
        return _(range)
            .map((entry)=>{
                return this.getTotalDistanceDay(entry).distance;})
            .reduce((total, miles)=>{
                return total + miles;})
            .toFixed(2);
    }

    changeState(keyval){
        let new_state = Object.assign({}, this.state, keyval),
            days_in_new_range = d3.timeDays(new_state.start, new_state.end);

        new_state.scale_x.domain([
            this.roundDown(new_state.start.valueOf()),
            this.roundDown(new_state.end.valueOf())]);

        new_state.width = 100/days_in_new_range.length;

        this.setState(new_state);
        console.log(new_state);
    }

    calcRange(s,e){
        // s,e (start,stop) are a js Date
        let new_range = this.data
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

    presentDate(timestamp){
        let d = new Date(timestamp);

        return (d.getFullYear()+"-"
              +(d.getMonth()+1)+"-"
              +d.getDate());
    }

    renderExerciseListItems(exercise){
        return (
            <span key={exercise}>
                {exercise}
            </span>
        );
    }

    renderSelected(selected){
        if (selected !== null){
            return (
                <span>
                    date: {selected.date}
                    name: {selected.name}
                </span>
            );
        }else{
            return (<span>none</span>);
        }
    }

    render(){
        return (
            <div>
                <div id="global-stats">
                    <h4>Start Date: {this.presentDate(this.state.start)}</h4>
                    <h4>End Date: {this.presentDate(this.state.end)}</h4>
                    <h4>Miles Ran: {this.totalMiles(this.state.range)}</h4>
                    <h4>
                        Exercises: {this.getAllExercises(
                                this.state.range).length}
                    </h4>
                    <h4>
                        Selected: {this.renderSelected(this.state.selected)}
                    </h4>
                </div>
                <DateRange
                    idprefix="date-range"
                    range="#68DADA" inactive="#989A9B"
                    min={this.min} max={this.max}
                    startUpdate={this.updateStart.bind(this)}
                    endUpdate={this.updateEnd.bind(this)}/>

                <ExerciseBar parent={this}/>
                <RunsBar parent={this}/>
                <Heatmap parent={this}/>
           </div>
        );
    }
}
