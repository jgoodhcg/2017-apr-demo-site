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

        let data = this.formatTimesheetData(timesheet_data);

        let opacity_scale = this.opacityScale(data);

        this.state = {
            start: new Date(0),
            end: new Date(),
            intervalError: false,
            projects: new Set(),
            tags: new Set(),
            opacityScale: opacity_scale,
            data
        };
    }

    changeState(keyval){
        let newState = Object.assign({}, this.state, keyval); // immutable because why not
        this.setState(newState);
        console.log(newState);
    }

    alphaFormatStep(timesheet_data){
        return _(timesheet_data)
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
            .value();
    }
    betaFormatStep(timesheet_data){
        let getMonthPrependZero = (date)=>{
            let tmp_num = (date.getMonth()+1).toString(),
                month_num = (tmp_num.length == 1? "0"+tmp_num : ""+tmp_num);
            return month_num;};

        return _(timesheet_data)
            .groupBy((entry)=>{
                return entry.end.getFullYear()+"-"+
                       getMonthPrependZero(entry.end);})
            .mapValues((month)=>{
                return _.groupBy(month, (entry)=>{
                    return entry.start.getFullYear()+
                           "-"+getMonthPrependZero(entry.start)+
                           "-"+entry.start.getDate();});
            })
            .map((days, month_key)=>{
                let obj = {};
                obj[month_key] = days;
                return obj;
            })
            .sortBy(([(month_obj)=>{
                return Object.keys(month_obj)[0];
            }]))
            .value();
    }
    formatTimesheetData(timesheet_data){
        /*
         * an array of objects keyed by year-month value of an array of objects
         * keyed by year-month-day value of an array of task objects
         * [{
         *     yyyy-mm: {
         *         yyyy-mm-dd: [{
         *           start: Date,
         *           end: Date,
         *           project: Str,
         *           tags: [Str],
         *           color: Str}]}}]
         */

        // TODO chaining for the format steps
        return this
            .betaFormatStep(this
            .alphaFormatStep(timesheet_data));
    }

    opacityScale(data){
        let max_global_task_time_ms =
            d3.max(data, (month)=>{
                let m_key = Object.keys(month)[0],
                    month_arr = _.map(month[m_key], (days, key)=>{
                        let obj = {};
                        obj[key] = days;
                        return obj;
                    });
                return d3.max(month_arr,(day)=>{
                    let d_key = Object.keys(day)[0],
                        day_arr = day[d_key];
                    return this.tasksTime(day_arr);});}),

            min_global_task_time_ms =
                d3.min(data, (month)=>{
                    let m_key = Object.keys(month)[0],
                        month_arr = _.map(month[m_key], (days, key)=>{
                            let obj = {};
                            obj[key] = days;
                            return obj;
                        });
                    return d3.min(month_arr,(day)=>{
                        let d_key = Object.keys(day)[0],
                            day_arr = day[d_key];
                        return this.tasksTime(day_arr);});});

        let opacityScale = d3.scaleLinear()
                                .domain([
                                    min_global_task_time_ms,
                                    max_global_task_time_ms])
                                .range([0, 1]);

        return opacityScale;
    }

    filterData(start, end, projects){
         let new_data = this.betaFormatStep(
                this.alphaFormatStep(timesheet_data)
                    .filter((task)=>{
                        return projects.has(task.project) &&
                               task.start.valueOf() > start.valueOf() &&
                               task.end.valueOf() < end.valueOf();
                    })),
             new_opacity_scale = this.opacityScale(new_data);

        return {data: new_data, opacityScale: new_opacity_scale};
    }
    setStart(s_date){
        let end = (this.state.end instanceof Date? this.state.end : new Date()),
            n = this.filterData(s_date, end, this.state.projects);

        this.changeState({start: s_date, intervalError: false,
                          data: n.data, opacityScale: n.opacityScale});
    }

    setEnd(e_date){
        let start = (this.state.start instanceof Date? this.state.start : new Date()),
            n = this.filterData(start, e_date, this.state.projects);

        this.changeState({end: e_date, intervalError: false,
                          data: n.data, opacityScale: n.opacityScale});
    }

    addProject(project){
        this.state.projects.add(project);
        let n = this.filterData(
            this.state.start,
            this.state.end,
            this.state.projects);

        this.changeState({projects: this.state.projects,
                          data: n.data, opacityScale: n.opacityScale});
    }

    removeProject(project){
        this.state.projects.delete(project);
        let n = this.filterData(
            this.state.start,
            this.state.end,
            this.state.projects);

        this.changeState({projects: this.state.projects,
                          data: n.data, opacityScale: n.opacityScale});
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
            tmp = {backgroundColor: "white",
                   color: "black",
                   boxSizing: "border-box",
                   border: "0.25em "+color+" solid"
            },
            styleObj = selected ?
                       Object.assign(tmp, {backgroundColor: color,
                                           color: "white",
                                           border: "none"}) : tmp;

        return (
            <div class="project-button-container"
                 key={i}>
                <input
                    type="button"
                    class={(selected? "active" : "")+" project-button"}
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

    month(month_obj){
        let year_month_key = Object.keys(month_obj)[0],
            date_arr = year_month_key
            .split("-")
            .map((str)=>{return parseInt(str);});
        let months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun",
                      "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
        let day_fn = (n,i)=>{return this.day(month_obj, year_month_key, n);};

        return (
            <div class="col-xs-12 col-sm-6 col-md-4 col-lg-3"
                 key={year_month_key}>
                <div class="month-title">
                    {date_arr[0]+" "+months[date_arr[1]-1]}
                </div>
                <svg
                    class="month"
                    viewBox="0 0 100 100"
                    width="100%">
                    <rect
                        class="month-bg"
                        width="100"
                        height="100"
                        rx="2"
                        ry="2">
                    </rect>
                    <g class="days">
                        {
                            // use d3 and some maps to return an array
                            // of valid date day numbers for each month
                            // ex:
                            // [1, ... ,28]
                            // [1, ... ,29]
                            // [1, ... ,30]
                            // [1, ... ,31]
                            d3.timeDays(
                                new Date(date_arr[0], date_arr[1]-1, 1),
                                new Date(date_arr[0], date_arr[1], 1))
                              .map((val,i)=>{return i+1;})
                              .map(day_fn)
                        }
                    </g>
                </svg>
            </div>
        );
    }

    day(month_obj, year_month_key, day){

        let width = 100/7,
            height = 100/6;

        let kebab_day = year_month_key+"-"+day,
            date_obj = new Date(kebab_day.replace(/-/g,"/")),
            valid_date = !isNaN(date_obj.valueOf()),
            tasks = month_obj[year_month_key][kebab_day],
            has_tasks = typeof tasks !== "undefined";

        if(valid_date){
            let x = date_obj.getDay() * width,
                y = this.weekOfMonth(date_obj) * height,
                task_fn = (task, i) => {
                    return this.task(task, i, tasks, width, height);},
                tasks_rendered = has_tasks? tasks.map(task_fn)
                               : function(){return(<g></g>);}();

            return(
                <g class="day"
                   transform={"translate("+x+","+y+")"}
                   key={kebab_day}>
                    <rect
                        class="day-bg"
                        width={width}
                        height={height}
                    >
                    </rect>
                    <g class="tasks">
                        {tasks_rendered}
                    </g>
                </g>
            );
        }else{
            return(<g key={kebab_day}></g>);
        }
    }

    task(the_task, the_index, day_tasks, width, height){

        let day_time_ms = this.tasksTime(day_tasks),
            task_time_ms = the_task.end.valueOf() - the_task.start.valueOf(),
            the_task_ratio = task_time_ms/day_time_ms,
            prev_tasks = this.prevTasks(the_task, day_tasks),
            comb_ratios = this.combPrevTasksRatios(prev_tasks, day_time_ms),
            this_height = the_task_ratio * height,
            y = comb_ratios * height;

        return (
            <rect
                class="task"
                key={the_index}
                width={width}
                height={this_height}
                opacity={this.state.opacityScale(day_time_ms)}
                y={y}
                fill={this.colors[the_task.project]}>
            </rect>
        );
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
    tasksTime(tasks){
        return tasks.reduce((a, b) => {
            let a_time_ms = a instanceof Date ?
                    a.end.valueOf() - a.start.valueOf() : a;
            let b_time_ms = b.end.valueOf() - b.start.valueOf();

            return a_time_ms + b_time_ms;
        }, 0);
    }
    prevTasks(a_task, all_tasks){
        return all_tasks.filter((t,i)=>{
            let t_end = t.end.valueOf(),
                t_start = t.start.valueOf(),
                a_end = a_task.end.valueOf(),
                a_start = a_task.start.valueOf();

            if( t_end != a_end ){
                return t_end < a_end;
            }else{
                return t_start < a_start;}});
    }
    combPrevTasksRatios(prev_tasks, tasks_total_time_ms){
        return prev_tasks.reduce((a,b)=>{
            let b_task_time_ms = b.end.valueOf() - b.start.valueOf();
            let b_ratio = b_task_time_ms/tasks_total_time_ms;

            if(a instanceof Object ){
                let a_task_time_ms = a.end.valueOf() - a.start.valueOf();
                let a_ratio = a_task_time_ms/tasks_total_time_ms;
                return a_ratio + b_ratio;
            }else{
                return a + b_ratio;
            }
        }, 0);
    }

    render() {
        return(
            <div id="timesheet-page" class="container-fluid">
                <div class="row">
                    <div class="col-xs-12">
                        <div class="card card-1">
                            <div class="row buttons">
                                <div class="col-xs-12">
                                    {this.listAllProjects().map(
                                         this.projectButton.bind(this))}
                                </div>
                            </div>
                            <div class="row intervals">
                                <div class="interval col-xs-12 col-sm-6">
                                    <input
                                        id="start" type="date"
                                        onChange={this.intervalChange.bind(this)}
                                        class={this.state.intervalError? "error" : ""}>
                                    </input>
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
