import React from "react";
import _ from "lodash";
import * as d3 from "d3";
import * as chroma from "d3-scale-chromatic";


export default class ExcerciseBar extends React.Component {

    constructor() {
        super();
    }

    renderSegment(name, label, x, y, height, parent){
        return(
            <rect
                key={label+"-"+name}
                x={x - (parent.state.width/2)}
                y={y}
                width={parent.state.width}
                height={height}
                fill={parent.color(name)}
                strokeWidth="0"
            >
            </rect>
        );
    }

    renderBar(entry, parent){
        let workout = entry.data.exercises,
            names   = Object.keys(entry.data.exercises),
            x       = parent.state.scale_x(parent.roundDown(entry.start.valueOf())),
            stacker = 62.5,
            label   = entry.start +"-"+ entry.stop;

        return (
            <g key={label}
               class="bar">
                {names.map((name)=>{
                     let srw_array = workout[name],
                         seg_reps  =  _(srw_array)
                             .reduce((total, srw)=>{
                                 let sets = parseInt(srw.sets),
                                     reps = parseInt(srw.reps);

                                 return total + (sets * reps);}, 0),
                         height    = (62.5 - parent.scale_y(seg_reps)),
                         y         = stacker - height;

                     stacker = y;

                     return this.renderSegment(name, label, x, y, height, parent);})}
            </g>);
    }

    xTicks(data, parent){
        // return at most twenty dates to use as ticks
        // bundled with the increment along x axis to render at

        let days = d3.timeDays(parent.state.start, parent.state.end),
            max = 7,
            num = (days.length > max? max : days.length),
            mod = Math.ceil(days.length/num),
            end = parent.state.end,

            values = _(days)
                .filter((v,i)=>{return i % mod === 0;})
                .map((day)=>{return {
                    value: day.getFullYear()+"-"
                          +(day.getMonth()+1)+"-"
                          +day.getDate(),
                    x: parent.state.scale_x(parent.roundDown(day.valueOf()))
                };})
                .value();

        let end_str = parent.dateString(end);
        // end cap
        values.push({
            value: end_str,
            x: parent.state.scale_x(end_str)
        });

        return values;
    }

    renderXTick(x_t, index){
        // expects x_t to be obj {value: val, increment: inc}
        let x = x_t.x,
            y = 65;
        return (
            <g key={x_t.value+"-y"}>
                <line x1={x} x2={x}
                      y1={63.5} y2={62.5}
                      class="x-axis-tick"
                      stroke="black" strokeWidth="0.1"
                />
                <text x={x} y={y}
                      fontFamily="Verdana" fontSize="1.5"
                      transform={"rotate(45,"+x+","+y+")"}>
                    {x_t.value}
                </text>
            </g>
        );
    }

    render(){
        let parent = this.props.parent;

        return(
            <svg width="100%" height="100%" viewBox="-10 -10 120 82.6">

                {parent.state.range.map((entry)=>{
                     return this.renderBar(entry, parent);})}

                <line
                    class="x-axis"
                    strokeLinecap="round"
                    x1="-0.25" x2="100.25" y1="62.5" y2="62.5"
                    stroke="black" strokeWidth="0.25"/>

                {this.xTicks(parent.state.range, parent)
                     .map(this.renderXTick)}
            </svg>
        );
    }
}
