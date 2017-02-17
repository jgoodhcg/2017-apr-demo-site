import React from "react";
import _ from "lodash";
import * as d3 from "d3";
import * as chroma from "d3-scale-chromatic";


export default class RunsBar extends React.Component {

    constructor() {
        super();
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

                <line
                    class="y-axis"
                    strokeLinecap="round"
                    x1="0"  x2="0" y1="-0.25" y2="62.75"
                    stroke="black" strokeWidth="0.25"/>

                {this.yTicks(parent)
                     .map(this.renderYTick)}

            </svg>
        );
    }
}
