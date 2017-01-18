import React from "react";
import InlineSVG from 'svg-inline-react';
import { IndexLink, Link, browserHistory, hashHistory } from "react-router";

import Calendar from "./../modules/timesheet.js";
import { timesheet_data } from "./../modules/timesheet_mock.js";

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

        this.state = {
            start: null,
            end: null,
            intervalError: false,
            projects: new Set(),
            tags: new Set(),
            calendar_width: 0,
            calendar: null,
            data: null
        };

        window.addEventListener("resize", (e) => {
            let calendar_width = this.calcCalendarWidth();
            this.changeState({
                calendar_width,
                calendar: new Calendar(
                    "calendar", this.state.data, calendar_width)});});
    }

    calcCalendarWidth(){
        let viewport_width =
            Math.min(document.documentElement.clientWidth,
                     window.innerWidth || 0);
        let calendar_container_width = viewport_width - 40;
        let calendar_per_row = 6;

        if(viewport_width <= 1200){calendar_per_row = 4;}
        if(viewport_width <= 1024){calendar_per_row = 2;}
        if(viewport_width <= 768){calendar_per_row = 1;}

        let calendar_width = Math.floor(calendar_container_width/calendar_per_row);
        return calendar_width;
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
        let data = timesheet_data.map(
            (d) => {
                let s = new Date(parseInt(d.start*1000));
                let random = Math.floor((Math.random() * 3600000) + 60000);
                let e = new Date(s.valueOf() + random);
                return(
                    {start: s,
                     end: e,
                     project: d.project,
                     tags: d.tags,
                     color: this.colors[d.project]});});

        let calendar_width = this.calcCalendarWidth();

        this.changeState({
            data,
            calendar_width,
            calendar: new Calendar(
                "calendar", data, calendar_width)});
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
                        <div id="calendar" class="card card-1"></div>
                    </div>
                </div>
            </div>
        );
    }
}
