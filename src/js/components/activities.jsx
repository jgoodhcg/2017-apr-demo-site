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
                {id: "chorechart", resource: "chorechart", ext: true,
                 closed: true,
                 description: `Chorechart is a SPA for logging chores, meant as a learning 
                                project that could be useful personally.  
                                The stack is clojure(script), reframe, luminus, and postgres. 
                                It is still in an early stage of development, 
                                and has a very vanilla bootstrap style.`,
                links: [{name: "repo", ext: true, href: "https://github.com/jgoodhcg/chorechart"},
                        {name: "app", ext: true, href: "http://chorechart.jgoodhcg.com/signup"}]
                },

                {id: "timesheet", resource: "timesheet", ext: false,
                 closed: true,
                 description: ``,
                 links: [{name: "timesheets", ext: false, href: "/timesheet"}]
                },

                {id: "workouts", resource: "workouts", ext: false,
                 closed: true,
                 description: ``,
                 links: [{name: "workouts", ext: false, href: "/workouts"}]
                },

                {id: "clicky", resource: "clicky", ext: false,
                 closed: true,
                 description: ``,
                 links: [{name: "clicky", ext: false, href: "/clicky"}]
                },
           ]};
    }

    open(id){
        let index = _.findIndex(this.state.activities, (activity)=>{
            return activity.id === id;});

        this.state.activities[index].closed = false;
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
                                           this.open(activity.id);}}>
                         </Activity>);})}
            </div>
        );
    }
}

