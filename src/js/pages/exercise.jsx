import React from "react";
import InlineSVG from 'svg-inline-react';
import { IndexLink, Link, browserHistory, hashHistory } from "react-router";

import DateRange from "./../components/daterange.jsx";
import _ from "lodash";
import * as d3 from "d3";


export default class Exercise extends React.Component {
    constructor() {
        super();
    }

    render(){
        return (
            <div>
                hello world
                <DateRange
                    idprefix="date-range"
                    range="#68DADA" inactive="#989A9B"
                    min={new Date(2013, 1, 1)} max={Date.now()}
                    startUpdate={(t)=>{console.log("start is: "+t);}}
                    endUpdate={(t)=>{console.log("start is: "+t);}}
                />
            </div>
        );
    }
}
