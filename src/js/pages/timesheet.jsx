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
            /* "meditation" : '#85DA09'*/
           "meditation" : '#9B7335'
        };

        this.state = {
            start: "",
            end: "",
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
        this.changeState({end: e_date});
    }

    addProject(project){
        let current_projects = this.state.projects;
        this.changeState({projects: new Set([...current_projects, project])});
    }

    removeProject(project){
        this.state.projects.delete(project);
        this.changeState({projects: this.state.projeccts});
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

    render() {
        return(
            <div id="timesheet-page" class="container-fluid">
                <div class="row">
                    <div class="col-xs-12">
                        <div class="card card-1">
                            <div class="row">
                                <div id="interval" class="col-xs-12 col-sm-6">
                                    <input id="start" type="date"></input>
                                </div>
                                <div class="col-xs-12 col-sm-6">
                                    <input id="end" type="date"></input>
                                </div>
                            </div>
                            <div class="row">
                                <div class="col-xs-12">
                                    {this.listAllProjects().map((p,i) => {
                                         return (
                                             <input type="button" key={i} value={p}></input>);
                                     })}
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
