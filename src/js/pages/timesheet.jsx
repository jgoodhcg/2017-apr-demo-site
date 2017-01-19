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

        let data = _.groupBy(
            timesheet_data.map(
                (d) => {
                    let s = new Date(parseInt(d.start*1000));
                    let random = Math.floor((Math.random() * 3600000) + 60000);
                    let e = new Date(s.valueOf() + random);
                    return(
                        {start: s,
                         end: e,
                         project: d.project,
                         tags: d.tags,
                         color: this.colors[d.project]});}),
            (entry)=>{
                return entry.end.getMonth()+"-"+entry.end.getFullYear();}
        );

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

    month(tasks, month_year){
        let date_arr = month_year
            .split("-")
            .map((str)=>{return parseInt(str);});

        return (
            <div class="col-xs-12 col-sm-6 col-md-3 col-lg-1"
                 key={month_year}>
                <svg
                    class="month"
                    viewBox="0 0 100 100"
                    width="100%">
                    <rect
                        width="100%"
                        height="100%"
                        fill="steelblue"
                        opacity="0.5">
                    </rect>
                    <g class="month-days">
                    </g>
                </svg>
            </div>
        );
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
