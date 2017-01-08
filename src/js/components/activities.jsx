import React from "react";
import InlineSVG from 'svg-inline-react';
import { IndexLink, Link, browserHistory, hashHistory } from "react-router";

import Activity from "./activity.jsx";

export default class Activities extends React.Component {
    constructor() {
        super();

        this.state = {
            activities: [
                {id: "clicky", resource: "clicky", name: "clicky",
                  route: "/clicky"},

                {id: "clicky2", resource: "clicky", name: "clicky",
                  route: "/clicky"},

                {id: "clicky3", resource: "clicky", name: "clicky",
                  route: "/clicky"},

                {id: "clicky4", resource: "clicky", name: "clicky",
                  route: "/clicky"},
           ]};
    }

    expansion(e){
        this.setState(Object.assign(
            this.state, {expanded: e.target.getAttribute("data-activity")}));
        console.log(this.state);
    }

    render(){
        return (
            <div id="activities" class="row" >
                {this.state.activities.map((activity, i, activities) => {
                     return (
                         <Activity id={activity.id}
                                   key={i}
                                   route={activity.route}
                                   resource={activity.resource}
                                   name={activity.name}>
                         </Activity>
                     );
                 })}
            </div>
        );
    }
}

