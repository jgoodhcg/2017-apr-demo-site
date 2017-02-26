import React from "react";
import InlineSVG from 'svg-inline-react';
import { IndexLink, Link, browserHistory, hashHistory } from "react-router";

import Calendar from "./../modules/timesheet.js";
import { timesheet_data } from "./../modules/timesheet_real.js";
import DateRange from "./../components/daterange.jsx";
import _ from "lodash";
import * as d3 from "d3";
import * as chroma from "d3-scale-chromatic";

export default class Timesheet extends React.Component {
    constructor() {
        super();

        this.colors = {
           "Dev Skills"    : this.generateColor(0),
           "Demo Website"  : this.generateColor(1),
           "Onestop"       : this.generateColor(2),
           "Sketchbook"    : this.generateColor(3),
           "Music Lessons" : this.generateColor(4),
           "Meditation"    : this.generateColor(5),
           "Ta-done"       : this.generateColor(6),
           "Art"           : this.generateColor(7)
        };

        this.globalMax = d3.max(timesheet_data, (entry)=>{
            return entry.start;});
        this.globalMin = d3.min(timesheet_data, (entry)=>{
            return entry.end;});

        let data = this.formatTimesheetData(timesheet_data);

        let opacity_scale = this.opacityScale(data);

        this.state = {
            start: new Date(0),
            end: new Date(),
            intervalError: false,
            projects: new Set(Object.keys(this.colors)),
            tags: new Set(),
            opacityScale: opacity_scale,
            selected: null,
            data
        };
    }

    generateColor(index){
        return chroma.schemeDark2[index];
    }

    changeState(keyval){
        let newState = Object.assign({}, this.state, keyval);
        this.setState(newState);
        console.log(newState);
    }

    alphaFormatStep(timesheet_data){
        return _(timesheet_data)
            .map((entry) => {
                let s_tmp = new Date(entry.start),
                    s = new Date(s_tmp.setHours(s_tmp.getHours() + 4)); // time zone hand wavy stuff
                let e_tmp = new Date(entry.end),
                    e = new Date(e_tmp.setHours(e_tmp.getHours() + 4));

                let const_part = {project: entry.project,
                                  tags: entry.tags,
                                  color: this.colors[entry.project],
                                  description: entry.description};

                return [Object.assign({start: s, end: e}, const_part)];})
            .flattenDeep()
            .value();
    }
    betaFormatStep(timesheet_data){
        let getMonthPrependZero = (date)=>{
            let tmp_num = (date.getMonth()+1).toString(),
                month_num = (tmp_num.length == 1? "0"+tmp_num : ""+tmp_num);
            return month_num;};

        let formatted_data = _(timesheet_data)
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

        // start of filling in any blank months
        // this whole thing is ugly and smells terrible
        // eventually I will redo this entire project
        // this is not an example of my best coding practices
        // this is an example of me trying to finish something
        // as quickly as possible with little regard for
        // code simplicity and readability
        let year_month_keys = _(formatted_data)
            .map((year_month)=>{
                return _.keys(year_month)[0];})
            .value();

        let min_year_month_tmp = d3
            .min(year_month_keys, (mk)=>{
                return parseInt(mk.split("-").join(""));})
            .toString();
        let max_year_month_tmp = d3
            .max(year_month_keys, (mk)=>{
                return parseInt(mk.split("-").join(""));})
            .toString();
        let min_year_month = min_year_month_tmp.slice(0, 4)
                          + "/" + min_year_month_tmp.slice(4);
        let max_year_month = max_year_month_tmp.slice(0, 4)
                          + "/" + max_year_month_tmp.slice(4);

        let year_month_all = d3.timeMonths(
            new Date(min_year_month+"/1"),
            new Date(max_year_month+"/1")
        ).map((date)=>{
            let key = date.getFullYear() + "-" + getMonthPrependZero(date);
            let obj = {};
            obj[key] = {};
            return obj;
        });

        let missing_year_months = _(year_month_all)
            .filter((ym_obj)=>{
                let key = _.keys(ym_obj)[0];
                let index = _.findIndex(formatted_data, (fd_ym_obj)=>{
                    let fd_key = _.keys(fd_ym_obj)[0];
                    return fd_key == key;});
                return index == -1;
            })
            .value();

        return _(formatted_data.concat(missing_year_months))
            .sortBy((year_month_obj)=>{
                return _.keys(year_month_obj)[0];})
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

    getMinMax(data){
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

        return {min: min_global_task_time_ms, max: max_global_task_time_ms};
    }

    opacityScale(data){
        let minMax = this.getMinMax(data);
        let opacityScale = d3.scaleLinear()
                             .domain([
                                 minMax.min,
                                 minMax.max])
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

        return {data: new_data, opacityScale: new_opacity_scale, selected: null};
    }
    setStart(s_date){
        let end = (this.state.end instanceof Date? this.state.end : new Date()),
            n = this.filterData(s_date, end, this.state.projects);

        this.changeState(
            Object.assign({start: s_date, intervalError: false}, n));
    }

    setEnd(e_date){
        let start = (this.state.start instanceof Date? this.state.start : new Date()),
            n = this.filterData(start, e_date, this.state.projects);

        this.changeState(
            Object.assign({end: e_date, intervalError: false}, n));
    }

    addProject(project){
        this.state.projects.add(project);
        let n = this.filterData(
            this.state.start,
            this.state.end,
            this.state.projects);

        this.changeState(
            Object.assign({projects: this.state.projects}, n));
    }

    removeProject(project){
        this.state.projects.delete(project);
        let n = this.filterData(
            this.state.start,
            this.state.end,
            this.state.projects);

        this.changeState(
            Object.assign({projects: this.state.projects}, n));
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
                if(date.valueOf() < this.state.end.valueOf()){
                    this.setStart(date);
                }else{
                    this.changeState({intervalError: true});
                }
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
                   border: "0.25em "+color+" solid"
            },
            styleObj = selected ?
                       Object.assign(tmp, {backgroundColor: color,
                                           color: "white"}) : tmp;

        return (
            <input
                key={i}
                type="button"
                class="project-button"
                style={styleObj}
                value={project}
                onClick={selected?
                         (e)=>{this.removeProject(project);}
                    :
                             (e)=>{this.addProject(project);}}>
            </input>
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

        /* let sizing_class = "col-xs-12 " +
         *                    (this.state.data.length > 1 ? "col-sm-6 " : "") +
         *                    (this.state.data.length > 2 ? "col-md-4 " : "") +
         *                    (this.state.data.length > 5 ? "col-lg-2 " : "");
         */

        let sizing_class = "col-xs-12 col-sm-6 col-md-4 col-lg-2";

        return (
            <div class={sizing_class}
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
    selectedDay(){
        let kebab_day = this.state.selected,
            date_obj = new Date(kebab_day.replace(/-/g,"/")),
            tmp = kebab_day.split("-"),
            month_key = tmp.splice(0,2).join("-"),
            month = _(this.state.data)
                .find((month)=>{return Object.keys(month)[0] == month_key;}),
            tasks = _.orderBy(month[month_key][kebab_day], ["end", "start"]),
            task_fn = (task, i) => {
                return this.task(task, i, tasks, 100, 100, kebab_day);},
            tasks_rendered = tasks.map(task_fn);

        console.log(tasks);

        return (
            <div class="col-xs-12">
                <div class="row">
                    <div class="col-xs-12">
                        <div class="month-title">
                            {date_obj.toString().split(" ").splice(0,4).join(" ")}
                        </div>
                    </div>
                </div>
                <div class="row">
                    <div class="col-xs-12 col-sm-4">
                        <svg
                            width="100%"
                            viewBox="0 0 100 100">
                            {tasks_rendered}
                        </svg>
                        <span>click on any task to go back!</span>
                    </div>
                    <div class="col-xs-12 col-sm-8">
                        {tasks.map(this.taskInfo.bind(this))}
                    </div>
                </div>
            </div>
        );
    }
    taskInfo(task, i){
        let header_style = {
            backgroundColor: task.color,
            color: "white",
            textAlign: "center"
        },
            interval_string =
                task.start.toTimeString().split(" ").splice(0,1).join(" ")+" - "+
                task.end.toTimeString().split(" ").splice(0,1).join(" ");

        return (
            <div key={i}>
                <div style={header_style}>
                    {task.project}
                </div>
                <p>{interval_string}</p>
                <p>{task.description}</p>
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
                    return this.task(task, i, tasks, width, height, kebab_day);},
                tasks_rendered = has_tasks? tasks.map(task_fn)
                               : function(){return(<g></g>);}();

            return(
                <g class="day"
                   transform={"translate("+x+","+y+")"}
                   key={kebab_day}>
                    <rect
                        class="day-bg"
                        width={width}
                        height={height}>
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

    task(the_task, the_index, day_tasks, width, height, kebab_day){

        let day_time_ms = this.tasksTime(day_tasks),
            task_time_ms = the_task.end.valueOf() - the_task.start.valueOf(),
            the_task_ratio = task_time_ms/day_time_ms,
            prev_tasks = this.prevTasks(the_task, day_tasks),
            comb_ratios = this.combPrevTasksRatios(prev_tasks, day_time_ms),
            this_height = the_task_ratio * height,
            y = comb_ratios * height,
            opacity = (this.state.selected == null?
                       this.state.opacityScale(day_time_ms) :
                       1);

        return (
            <rect
                class="task"
                key={the_index}
                width={width}
                height={this_height}
                opacity={opacity}
                y={y}
                onClick={(e)=>{
                        if(this.state.selected == kebab_day){
                            this.changeState({selected: null});
                        }else{
                            this.changeState({selected: kebab_day});
                        }
                    }}
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

    renderAllOrSelected(){
        if(this.state.selected == null){
            return _.map(this.state.data, this.month.bind(this));
        }else{
            return this.selectedDay();
        }
    }

    render() {
        return(
            <div id="timesheet-page" class="container-fluid">
                <div class="row around-xs">
                    <div class="col-xs-12 card card-1">
                        <div class="project-buttons">
                            {this.listAllProjects().map(
                                 this.projectButton.bind(this))}
                        </div>
                        <div class="date-range-container">
                            <DateRange
                                idprefix="date-range"
                                range="#68DADA" inactive="#989A9B"
                                min={this.globalMin} max={this.globalMax}
                                startUpdate={this.setStart.bind(this)}
                                endUpdate={this.setEnd.bind(this)}
                            />
                        </div>
                    </div>
                </div>
                <div class="row">
                    <div class="col-xs-12 card card-1">
                        <div class="row">
                            {this.renderAllOrSelected()}
                        </div>
                    </div>
                </div>
            </div>
        );
    }
}
