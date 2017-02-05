import React from "react";
import InlineSVG from 'svg-inline-react';
import { IndexLink, Link, browserHistory, hashHistory } from "react-router";

export default class DateRange extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            id: this.props.idprefix,
            inactive: this.props.inactive,
            range: this.props.range,
            min: this.props.min,
            max: this.props.max,
            startUpdate: this.props.startUpdate,
            endUpdate: this.props.endUpdate,
            start: 10, end: 30,
            prevMouse: null
        };
    }

    translateX(clientX){
        let screen_width = window.screen.width;


    }

    updateCircle(e){
        let tmp = e.target.id.split("-"),
            id = tmp[tmp.length - 1],
            prevMouse =
                (this.state.prevMouse !== null? this.state.prevMouse : e),
            movementX = e.screenX - prevMouse.screenX;

        console.log("moving");
        console.log(movementX);

        this.state[id] += movementX;
        this.setState(this.state);

        this.state.prevMouse = e;
    }

    componentDidMount(){
        let start = document.getElementById(this.state.id+"-start");
        let end   = document.getElementById(this.state.id+"-end");

        start.addEventListener('mousedown', (e)=>{
            console.log("down");
            console.log(e);
            start.addEventListener('mousemove',
                                   this.updateCircle.bind(this));
        });

        start.addEventListener('mouseup', (e)=>{
            console.log("up");
            console.log(e);
            start.removeEventListener('mousemove',
                                      this.updateCircle.bind(this));
            this.state.prevMouse = null;
        });

    }

    render() {

        return(
            <svg class="skill" width="100%" height="100%" viewBox="-10 0 120 10">
                <line
                    id={this.state.id + "-inactive"}
                    strokeLinecap="round"
                    x1="0" x2="100" y1="5" y2="5"
                    stroke={this.state.inactive} strokeWidth="1"/>

                <line
                    id={this.state.id + "-active"}
                    strokeLinecap="round"
                    x1="10"  x2="30" y1="5" y2="5"
                    stroke={this.state.range} strokeWidth="1"/>

                <circle
                    id={this.state.id + "-start"}
                    cx={this.state.start}
                    cy="5" r="2.5" fill={this.state.range}/>
                <circle
                    id={this.state.id + "-end"}
                    cx={this.state.end}
                    cy="5" r="2.5" fill={this.state.range}/>
            </svg>
        );
    }
}
