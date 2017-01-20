import React from "react";
import InlineSVG from 'svg-inline-react';
import { IndexLink, Link, browserHistory, hashHistory } from "react-router";

import Calendar from "./../modules/timesheet.js";
import { timesheet_data } from "./../modules/timesheet_mock.js";
import _ from "lodash";
import * as d3 from "d3";

export default class Timesheet extends React.Component {
    constructor() {
        super();

        this.colors = {
           "timetracker": '#0D1B41',
           "demo_site"  : '#9B351E',
           "yoga"       : '#0D308E',
           "dev_skills" : '#3D5B11',
           "meditation" : '#9B7335'
        };

        /*
         * {mm-yyyy: {
         *     dd: [{start: Date,
         *           end: Date,
         *           project: Str,
         *           tags: [Str],
         *           color: Str}]}}
         */

        let data = _(timesheet_data)
                    .map((entry) => {
                        let s = new Date(parseInt(entry.start*1000));
                        let ms_in_day = 24 * 60 * 60 * 1000;
                        let random_duration =
                            Math.random() * (ms_in_day - 60000)
                            + 60000; // between 1 minute and 24 hours
                        let e = new Date(s.valueOf() + random_duration);

                        let const_part = {project: entry.project,
                                          tags: entry.tags,
                                          color: this.colors[entry.project]};

                        // split the entry if it spans 2 days
                        if(s.getDate() != e.getDate()){
                            return [
                                Object.assign(
                                    {start: s,
                                     end: new Date(new Date(s).setHours(23, 59, 59, 999))},
                                    const_part),
                                Object.assign(
                                    {start: new Date(new Date(e).setHours(0,0,0,0)),
                                     end: e},
                                    const_part)
                            ];
                        }else{
                            return [Object.assign({start: s, end: e}, const_part)];}})
                    .flattenDeep()
                    .groupBy((entry)=>{
                        return entry.end.getFullYear()+"-"+(entry.end.getMonth()+1);})
                    .mapValues((month)=>{
                        return _.groupBy(month, (entry)=>{
                            return entry.start.getFullYear()+
                                   "-"+(entry.start.getMonth()+1)+
                                   "-"+entry.start.getDate();});
                    })
                    .value();

        console.log(data);

        this.state = {
            start: null,
            end: null,
            intervalError: false,
            projects: new Set(),
            tags: new Set(),
            data
        };
    }

    changeState(keyval){
        let newState = Object.assign({}, this.state, keyval); // immutable because why not
        this.setState(newState);
        console.log(newState);
    }

    setStart(s_date){
        this.changeState({start: s_date});
    }

    setEnd(e_date){
        this.state.calendar.setInterval(this.state.start, e_date);
        this.changeState({end: e_date, intervalError: false});
    }

    addProject(project){
        this.state.projects.add(project);
        this.changeState({projects: this.state.projects});
    }

    removeProject(project){
        this.state.projects.delete(project);
        this.changeState({projects: this.state.projects});
    }

    addTag(tag){
        let current_tags = this.state.tags;
        this.changeState({tags: [...current_tags, tag]});
    }

    removeTag(tag){
        this.state.tags.delete(tag);
        this.changeState({tags: this.state.projeccts});
    }

    listAllProjects(){
        let projects = new Set(timesheet_data.map( // gets all unique projects
            (entry) => {return entry.project;}));
        return [...projects]; // returns an array that is map-able
    }

    componentDidMount(){
    }

    componentDidUpdate(){
        // DO NOT CHANGE STATE HERE
    }

    intervalChange(e){
        // TODO error control here
        // make sure to swap "-" for "/" when comparing Dates
        let date = new Date(e.target.value.replace(/-/g, "/"));
        switch(e.target.id){
            case "start":
                this.setStart(date);
                break;
            case "end":
                if(this.state.start.valueOf() < date.valueOf()){
                    this.setEnd(date);
                }else{
                    this.changeState({intervalError: true});
                }
                break;
        }
    }

    projectButton(project, i){
        let selected = this.state.projects.has(project),
            color = this.colors[project],
            tmp = {backgroundColor: color,
                   opacity: "0.45",
                   color: "white"},
            styleObj = selected ?
                       Object.assign(tmp, {opacity: "1"}) : tmp;

        return (
            <div class="col-xs-12 col-sm-6 col-md-3 col-lg-2"
                 key={i}>
                <input
                    type="button"
                    class={(selected? "active" : "")+" button"}
                    style={styleObj}
                    value={project}
                    onClick={selected?
                             (e)=>{this.removeProject(project);}
                        :
                                 (e)=>{this.addProject(project);}}>
                </input>
            </div>
        );
    }

    month(month_obj, year_month_key){
        let date_arr = year_month_key
            .split("-")
            .map((str)=>{return parseInt(str);});
        let months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun",
                      "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
        let day_fn = (n,i)=>{return this.day(year_month_key, n);};

        return (
            <div class="col-xs-12 col-sm-6 col-md-3 col-lg-1"
                 key={year_month_key}>
                {date_arr[0]+" "+months[date_arr[1]]}
                <svg
                    class="month"
                    viewBox="0 0 100 100"
                    width="100%">
                    <rect
                        class="month-bg"
                        width="100"
                        height="100"
                        fill="steelblue">
                    </rect>
                    <g class="days">
                        {d3.range(0,42).map(day_fn)}
                    </g>
                </svg>
            </div>
        );
    }

    day(year_month_key, day){

        let width = 100/7,
            height = 100/6;

        let kebab_day = year_month_key+"-"+day,
            date_obj = new Date(kebab_day.replace(/-/g,"/")),
            valid_date = !isNaN(date_obj.valueOf()),
            tasks = this.state.data[year_month_key][kebab_day];

        if(valid_date){
            let x = date_obj.getDay() * width,
                y = this.weekOfMonth(date_obj) * height;

            return(
                <g class="day"
                   transform={"translate("+x+","+y+")"}
                   key={kebab_day}>
                    <rect
                        class="day-bg"
                        width={width}
                        height={height}
                        fill="red"
                        stroke="white">
                    </rect>
                    {/* {tasks.map((this.task.bind(this)))} */}
                </g>
            );
        }else{
            return(<g key={kebab_day}></g>);
        }
    }

    weekOfMonth(d){
            let firstOfMonth =
                    new Date(d.getFullYear(), d.getMonth(), 1);
            // array of start of each week this month
            // d3.timeWeeks is exclusive on the second date
            let weekStarts = d3.timeWeeks(
                firstOfMonth,
                // first day of next month
                new Date(d.getFullYear(), d.getMonth() + 1, 1));

            let thisWeekStart = d3.timeWeek(d);

            // index of weekStarts is the zero based week of month num
            // -1 means the first week but this month started
            // after sunday
            let weekOfMonth = weekStarts.findIndex(
                function(ws){
                    return ws.getDate() == this.getDate();},
                thisWeekStart) + 1;

            if(firstOfMonth.getDay() == 0){
                // shift the rows for months that start on sunday
                weekOfMonth = weekOfMonth - 1;
            }

            return weekOfMonth;
        }

    render() {
        return(
            <div id="timesheet-page" class="container-fluid">
                <div class="row">
                    <div class="col-xs-12">
                        <div class="card card-1">
                            <div class="row">
                                <div class="interval col-xs-12 col-sm-6">
                                    <input
                                        id="start"
                                        type="date"
                                        onChange={this.intervalChange.bind(this)}
                                        class={this.state.intervalError? "error" : ""}
                                    ></input>
                                </div>
                                <div class="interval col-xs-12 col-sm-6">
                                    <input
                                        id="end"
                                        type="date"
                                        onChange={this.intervalChange.bind(this)}
                                        class={this.state.intervalError? "error" : ""}
                                    ></input>
                                </div>
                            </div>
                            <div class="row">
                                <div class="col-xs-12">
                                    <div class="row">
                                        {this.listAllProjects().map(
                                             this.projectButton.bind(this))}
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
                <div class="row">
                    <div class="col-xs-12">
                        <div class="card card-1">
                            <div class="row">
                                {_.map(this.state.data, this.month.bind(this))}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        );
    }
}
