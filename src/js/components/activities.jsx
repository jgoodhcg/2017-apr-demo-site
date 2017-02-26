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
                 route: "http://chorechart.jgoodhcg.com/signup",
                 closed: true,
                 description: "Some text about this thing. Should not be long. There should be enough here for someone to want to click the link. Four or five sentences is fine."
                },

                {id: "timesheet", resource: "timesheet", ext: false,
                 route: "/timesheet",
                 closed: true,
                 description: "Some other text. This project is slightly different. Text is shorter on this one."
                },

                {id: "workouts", resource: "workouts", ext: false,
                 route: "/workouts",
                 closed: true,
                 description: "The description is lengthy on this one. Have to cover all sizing contingencies. Why is CSS so tedious. There must be a better way to do this. Flex box was ok, but there should be even better ways to position stuff around a page."
                },

                {id: "clicky", resource: "clicky", ext: false,
                 route: "/clicky",
                 closed: true,
                 description: "stuff here"
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
                                   ext={activity.ext}
                                   route={activity.route}
                                   resource={activity.resource}
                                   description={activity.description}
                                   closed={activity.closed}
                                   click={(e)=>{
                                           this.open(activity.id);
                                           console.log("clicked!");}}>
                         </Activity>);})}
            </div>
        );
    }
}

