import React from "react";
import InlineSVG from 'svg-inline-react';
import { IndexLink, Link, browserHistory, hashHistory } from "react-router";

export default class Skill extends React.Component {
    constructor() {
        super();
    }

    render() {
        let rects = [1,2,3,4,5],
            width = 15,
            pad = 4,
            stroke = 0.5;
        rects = rects.map((cv, i, rects) => {
            return (<rect class={(i >= +this.props.score ? "empty" : "filled")}
                     key={i}
                     x={ Math.max(i*(2+((i === 0 ? 0 : 1)*width)+((i === 0 ? 0 : 1)*pad)), 2) } y="4"
                     width={width} height="6"
                     strokeWidth={stroke}
                     rx="2" ry="2"/>);
            // x calculation is complicated, sorry
            // TODO simplify x calc
        });
        return(
            <svg class="skill" width="100%" height="100%" viewBox="0 0 100 16">
                {rects}
            </svg>
        );
    }
}
