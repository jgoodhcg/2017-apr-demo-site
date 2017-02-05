import React from "react";
import InlineSVG from 'svg-inline-react';
import { IndexLink, Link, browserHistory, hashHistory } from "react-router";

export default class DateRange extends React.Component {
    constructor() {
        super();
    }

    render() {
       return(
            <svg class="skill" width="100%" height="100%" viewBox="0 0 100 10">
                <line strokeLinecap="round"
                      x1="10" y1="5" x2="90" y2="5"
                      stroke="blue" strokeWidth="2.5"/>

                <line strokeLinecap="round"
                      x1="10" y1="5" x2="30" y2="5"
                      stroke="green" strokeWidth="2.5"/>

                <circle cx="10" cy="5" r="5" fill="red"/>
                <circle cx="30" cy="5" r="5" fill="red"/>
            </svg>
        );
    }
}
