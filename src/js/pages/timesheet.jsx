import React from "react";
import InlineSVG from 'svg-inline-react';
import { IndexLink, Link, browserHistory, hashHistory } from "react-router";

import Calendar from "./../modules/timesheet.js";

export default class Timesheet extends React.Component {
    constructor() {
        super();
    }


    componentDidMount(){
        let cal = new Calendar("calendar");
    }

    render() {
        return(
            <div id="calendar"></div>
        );
    }
}
