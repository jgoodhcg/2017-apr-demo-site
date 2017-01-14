import React from "react";
import InlineSVG from 'svg-inline-react';
import { IndexLink, Link, browserHistory, hashHistory } from "react-router";

import Calendar from "./../modules/timesheet.js";
import { timesheet_data } from "./../modules/timesheet_mock.js";

export default class Timesheet extends React.Component {
    constructor() {
        super();

        this.colors = {
           "timetracker": '#ff0000',
           "demo_site"  : '#00ff00',
           "yoga"       : '#0000ff',
           "dev_skills" : '#f0000f',
           "meditation" : '#0f00f0'
        };

        this.state = {
            start: "",
            end: "",
            projects: new Set(),
            tags: new Set()
        };
    }

    changeState(keyval){
        this.setState(Object.assign(this.state, keyval));
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
                    {
                        start: s,
                        end: e,
                        project: d.project,
                        tags: d.tags,
                        color: this.colors[d.project]
                    }
                );
            });

        let cal = new Calendar("calendar", data);
    }

    render() {
        return(
            <div class="container-fluid">
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
