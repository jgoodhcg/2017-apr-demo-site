import React from "react";
import InlineSVG from 'svg-inline-react';
import { IndexLink, Link, browserHistory, hashHistory } from "react-router";

export default class DateRange extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            inactive: this.props.inactive,
            range: this.props.range,
            min: this.props.min,
            max: this.props.max,
            startUpdate: this.props.startUpdate,
            endUpdate: this.props.endUpdate
        };


    }

    render() {
       return(
            <svg class="skill" width="100%" height="100%" viewBox="0 0 100 10">
                <line strokeLinecap="round"
                      x1="10" x2="90" y1="5" y2="5"
                      stroke={this.state.inactive} strokeWidth="2.5"/>

                <line strokeLinecap="round"
                      x1="10"  x2="30" y1="5" y2="5"
                      stroke={this.state.range} strokeWidth="2.5"/>

                <circle cx="10" cy="5" r="5" fill={this.state.range}/>
                <circle cx="30" cy="5" r="5" fill={this.state.range}/>
            </svg>
        );
    }
}
