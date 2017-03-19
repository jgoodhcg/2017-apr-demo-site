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

        this.workout_names = this.getAllExerciseNames(exercise_data);
        this.non_run_names = this.getNonRunExercisesNames(exercise_data);
        this.run_names = this.getRunNames(exercise_data);

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

    getAllExerciseNames(range){
        return _(range)
            .map((entry)=>{
                return Object.keys(entry.data.exercises)
                             .concat(Object.keys(entry.data.runs));})
            .flatten()
            .uniq()
            .value()
    }

    getNonRunExercisesNames(range){
        return _(range)
            .map((entry)=>{
                return Object.keys(entry.data.exercises);})
            .flatten()
            .uniq()
            .value();
    }

    getRunNames(range){
        return _(range)
            .map((entry)=>{
                return Object.keys(entry.data.runs);})
            .flatten()
            .uniq()
            .value();
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

    colorNonRuns(name){
         let index = this.workout_names.indexOf(name),
            interpolate_index = index/(this.workout_names.length - 1);

        return chroma.interpolateSpectral(interpolate_index);
    }

    colorRuns(name){
        let index = this.run_names.indexOf(name),
            interpolate_index = index/(this.run_names.length -1);

        return chroma.schemeSet1[2*interpolate_index + 1];
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
            });
        });

        return {date: date, distance: total_distance};
    }

    totalMiles(range){
        return _(range)
            .map((entry)=>{return this.getTotalDistanceDay(entry).distance;})
            .reduce((total, miles)=>{return total + miles;})
            .toFixed(2);
    }

    totalTime(range){
        return _(range)
            .map((entry)=>{
                let duration_ms = entry.stop - entry.start;
                return (((duration_ms/1000)/60)/60);
            })
            .reduce((total, time)=>{return total + time;}, 0);
    }

    elapsedDays(range){
        let min  = d3.min(range, (entry)=>{return entry.stop;}),
            max  = d3.max(range, (entry)=>{return entry.stop;}),
            days = d3.timeDays(new Date(min), new Date(max));

        return days.length;
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

    renderSelectedsrw(srw){
        return (
            <div class="selected-srw"
                 key={srw.sets+"-"+srw.reps+"-"+srw.weight}>
                <label>sets: </label>
                <span>{srw.sets}</span>
                <label>reps: </label>
                <span>{srw.reps}</span>
                <label>weight: </label>
                <span>{srw.weight}</span>
            </div>);
    }

    renderSelected(selected){
        console.log(selected);
        if (selected !== null){
            return (
                <div class="selected">
                    <label>date: </label>
                    <span>{selected.date}</span>

                    <label>name: </label>
                    <span>{selected.name}</span>

                    <div class="selected-srws">
                        {selected.srw_array.map(
                             this.renderSelectedsrw.bind(this))}
                    </div>
                </div>
            );
        }else{
            return (<div class="selected"></div>);
        }
    }

    renderStat(label, val){
        return(
            <div class="stat">
                <label>{label}</label>
                <span> {val}</span>
            </div>
        );
    }

    render(){
        return (
            <div id="workouts" class="container-fluid">
                <div class="row">
                    <div class="col-xs-12 col-lg-6 col-lg-offset-3 card card-1">
                        <h1>2016 workout data</h1>
                        <p>
                            This page is a visualization of some spreadsheet data I've kept
                            about all of my workout history over the past year.<a href="https://github.com/jgoodhcg/demo-site/blob/master/src/js/pages/workouts.jsx">The code.</a>
                        </p>
                        <p>
                            Data was captured in a google sheets document. After being exported 
                            to a csv it was parsed with a <a href="https://github.com/jgoodhcg/exercise-data-parser">
                            simple clojure application</a> into a json
                            document. That document is included in the spa bundle of this site. 
                            React components of inline svg, with some d3 libraries, render the 
                            data and provide user interaction. State is managed at the page 
                            level component.
                        </p>
                        <p>
                            The stats area includes a data range selection for limiting all
                            the graphs to a window of time. Any bar in the repititions graph
                            can be selected to view the details of the exercise.
                        </p>
                        <p>
                            As part of a personal data capture goal I plan to make a postgres
                            database with a clojure project api. When that is deployed I will
                            develop some client applications for capturing data. This will remove the need
                            for the google sheets. The next version of this visualization will be
                            using that api project to dynamically get data.
                        </p>
                    </div>
                    <div class="col-xs-12 card card-1">
                        <h2> stats </h2>
                        <div class="stats">
                            {this.renderStat(
                                 "start date", this.presentDate(
                                     this.state.start))}
                            {this.renderStat(
                                 "miles ran", this.totalMiles(
                                     this.state.range))}
                            {this.renderStat(
                                 "exercises", this.getAllExerciseNames(
                                     this.state.range).length)}
                            {this.renderStat(
                                 "elapsed days", this.elapsedDays(
                                     this.state.range))}
                            {this.renderStat(
                                 "total time", this.totalTime(
                                     this.state.range).toFixed(2)+" hours")}
                            {this.renderStat(
                                 "end date", this.presentDate(
                                     this.state.end))}
                        </div>
                        {this.renderSelected(
                             this.state.selected)}
                        <div class="date-range-container">
                            <DateRange
                                idprefix="date-range"
                                range="#68DADA" inactive="#989A9B"
                                min={this.min} max={this.max}
                                startUpdate={this.updateStart.bind(this)}
                                endUpdate={this.updateEnd.bind(this)}/>
                        </div>
                    </div>
                </div>

                <div class="row">
                    <div class="col-xs-12 card card-1">
                        <div class="row around-xs">
                            <div class="col-xs-12 col-md-6" >
                                <div class="row around-xs">
                                    <div class="col-xs-12">
                                        <h2> stacked bar graph of total reps </h2>
                                        <ExerciseBar parent={this}/>
                                    </div>
                                    <div class="col-xs-12">
                                        <h2> miles per run </h2>
                                        <RunsBar parent={this}/>
                                    </div>
                                </div>
                            </div>
                            <div class="col-xs-12 col-md-6 col-lg-3" >
                                <h2> body heat map of non-run exercises </h2>
                                <Heatmap parent={this}/>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        );
    }
}
