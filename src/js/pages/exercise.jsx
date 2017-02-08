import React from "react";
import InlineSVG from 'svg-inline-react';
import { IndexLink, Link, browserHistory, hashHistory } from "react-router";

import DateRange from "./../components/daterange.jsx";
import { exercise_data } from "./../modules/exercise_real.js";
import _ from "lodash";
import * as d3 from "d3";


export default class Exercise extends React.Component {
    constructor() {
        super();

        this.min = d3.min(exercise_data, (day)=>{return day.start;});
        this.max = d3.max(exercise_data, (day)=>{return day.stop;});

        console.log(exercise_data);
    }

    render(){
        let min = new Date(2013, 1, 1);
        return (
            <div>
                <DateRange
                    idprefix="date-range"
                    range="#68DADA" inactive="#989A9B"
                    min={this.min} max={this.max}
                    startUpdate={(t)=>{console.log("start is: "+t);}}
                    endUpdate={(t)=>{console.log("end is: "+t);}}
                />
            </div>
        );
    }
}
