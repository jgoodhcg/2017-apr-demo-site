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
                <DateRange/>
            </div>
        );
    }
}
