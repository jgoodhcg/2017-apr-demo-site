import React from "react";
import InlineSVG from 'svg-inline-react';
import { IndexLink, Link, browserHistory, hashHistory } from "react-router";

import Activity from "./activity.jsx";
import _ from "lodash";

export default class Activities extends React.Component {
    constructor() {
        super();

        this.state = {
            activities: [
                {id: "chorechart", resource: "chorechart", closed: true,
                 description: `Chorechart is a SPA for logging chores, meant as a learning 
                                project that could still be useful personally.  
                                The stack is clojure(script), reframe, luminus, and postgres. 
                                It is still in an early stage of development, 
                                and has a very vanilla bootstrap style.`,
                links: [{name: "repo", href: "https://github.com/jgoodhcg/chorechart"},
                        {name: "app", href: "http://chorechart.jgoodhcg.com/signup"}]
                },

                {id: "timesheet", resource: "timesheet", closed: true,
                 description: `Timesheets visualization, this was an attempt at moving from 
                                d3 to an entirely react based rendering. A few lessons were 
                                learned from this project. Some d3 libraries were used, mostly 
                                for scaling.`,
                 links: [{name: "repo", href: "https://github.com/jgoodhcg/demo-site/blob/master/src/js/pages/timesheet.jsx"},
                         {name: "timesheets", href: "#/timesheet"}]
                },  

                {id: "workouts", resource: "workouts", closed: true,
                 description: `2016 workout spreadsheet visualized with svg based graphs. This 
                                was the second attempt at react based data rendering and capitalized 
                                on some of the lessons learned from timesheets.`,
                 links: [{name: "repo", href: "https://github.com/jgoodhcg/demo-site/blob/master/src/js/pages/workouts.jsx"},
                         {name: "workouts", href: "#/workouts"}]
                },

                {id: "clicky", resource: "clicky", closed: true,
                 description: `Clicky is an older project. It was an attempt at making something fun 
                                and interactive with webgl wrapper PIXI.js.`,
                 links: [{name: "repo", href: "https://github.com/jgoodhcg/demo-site/blob/master/src/js/modules/clicky.js"},
                         {name: "clicky", href: "#/clicky"}]
                },
           ]};
    }

    toggle(id){
        let index = _.findIndex(this.state.activities, (activity)=>{
            return activity.id === id;});

        this.state.activities[index].closed =
           ! this.state.activities[index].closed;
        this.setState(this.state);
    }

    render(){
        return (
            <div id="activities" class="row" >
                {this.state.activities.map((activity, i, activities) => {
                     return (
                         <Activity id={activity.id}
                                   key={i}
                                   links={activity.links}
                                   resource={activity.resource}
                                   description={activity.description}
                                   closed={activity.closed}
                                   click={(e)=>{
                                           this.toggle(activity.id);}}
                         >
                         </Activity>);})}
            </div>
        );
    }
}

