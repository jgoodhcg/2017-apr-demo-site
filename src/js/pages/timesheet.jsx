import React from "react";
import InlineSVG from 'svg-inline-react';
import { IndexLink, Link, browserHistory, hashHistory } from "react-router";

import Calendar from "./../modules/timesheet.js";
require("./../modules/timesheet_mock.js");

export default class Timesheet extends React.Component {
    constructor() {
        super();
    }


    componentDidMount(){
        let timesheet_data = window.timesheet_data.map(
            (d) => {
                let s = new Date(parseInt(d.start*1000));
                let random = Math.floor((Math.random() * 3600000) + 60000);
                return(
                    {
                        start: s,
                        end: new Date(s.valueOf() + random),
                        project: d.project,
                        tags: d.tags
                    }
                );
            });
        let cal = new Calendar("calendar", timesheet_data);
    }

    render() {
        return(
            <div id="calendar"></div>
        );
    }
}
