import React from "react";

export default class DateRange extends React.Component {
    constructor(props) {
        super(props);

        this.radius = 2.5;
        this.cushion = 3 * this.radius;

        this.state = {
            id: this.props.idprefix,
            inactive: this.props.inactive,
            range: this.props.range,
            min: this.props.min,
            max: this.props.max,
            startUpdate: this.props.startUpdate,
            endUpdate: this.props.endUpdate,
            start: 10, end: 30,
            prevEvent: null,
            selected: null
        };
    }

    translateX(clientX){
        let screen_width = window.screen.width;


    }

    updateCircle(e){
        let e_type = e.type,
            prevEvent =
                (this.state.prevEvent !== null? this.state.prevEvent : e),
            cur_clientX = (e_type === 'touchmove'?
                           e.touches[0].clientX : e.clientX),
            last_clientX = (e_type === 'touchmove'?
                           prevEvent.touches[0].clientX : prevEvent.clientX),
            movementX = cur_clientX - last_clientX,
            translation = movementX * this.state.scale;

        switch (this.state.selected){
            case "start":
                let translated_s = this.state.start + translation;
                if (translated_s < this.state.end - this.cushion &&
                    translated_s > 0)
                    {
                        this.setState(Object.assign(
                            this.state, {start: translated_s}));

                        console.log("moved start " + translated_s);
                    }
                break;

            case "end":
                let translated_e = this.state.end + translation;
                if (translated_e > this.state.start + this.cushion &&
                    translated_e < 100)
                    {
                        this.setState(Object.assign(
                            this.state, {end: translated_e}));

                        console.log("moved end " + translated_e);
                    }
                break;
        }

        this.state.prevEvent = e;
    }

    componentDidMount(){
        let svg = document.getElementById(this.state.id+"-svg"),
            start = document.getElementById(this.state.id+"-start"),
            end   = document.getElementById(this.state.id+"-end"),
            scale = 100/svg.clientWidth;

        this.state.scale = scale;

        start.addEventListener('mousedown', (e)=>{
            this.state.selected = "start";
            svg.addEventListener('mousemove', this.updateCircle.bind(this));});

        end.addEventListener('mousedown', (e)=>{
            this.state.selected = "end";
            svg.addEventListener('mousemove',this.updateCircle.bind(this));});

        start.addEventListener('touchstart', (e)=>{
            console.log("start");
            this.state.selected = "start";
            svg.addEventListener('touchmove', this.updateCircle.bind(this));});

        end.addEventListener('touchstart', (e)=>{
            console.log("end");
            this.state.selected = "end";
            svg.addEventListener('touchmove',this.updateCircle.bind(this));});

        // TODO remove on component unmount?
        svg.addEventListener('mouseup', (e)=>{
            svg.removeEventListener('mousemove', this.updateCircle.bind(this));
            this.state.selected = null;
            this.state.prevEvent = null;});
        svg.addEventListener('touchend', (e)=>{
            svg.removeEventListener('touchmove', this.updateCircle.bind(this));
            this.state.selected = null;
            this.state.prevEvent = null;});
    }

    componentDidUpdate(){
        let svg = document.getElementById(this.state.id+"-svg"),
            start = document.getElementById(this.state.id+"-start"),
            end   = document.getElementById(this.state.id+"-end"),
            scale = 100/svg.clientWidth;

        this.state.scale = scale;
    }

    render() {

        return(
            <svg id={this.state.id+"-svg"} width="100%" height="100%" viewBox="-10 0 120 10">
                <line
                    id={this.state.id + "-inactive"}
                    strokeLinecap="round"
                    x1="0" x2="100" y1="5" y2="5"
                    stroke={this.state.inactive} strokeWidth="1"/>

                <line
                    id={this.state.id + "-active"}
                    strokeLinecap="round"
                    x1={this.state.start}  x2={this.state.end}
                    y1="5" y2="5"
                    stroke={this.state.range} strokeWidth="1"/>

                <circle
                    id={this.state.id + "-start"}
                    cx={this.state.start}
                    cy="5" r={this.radius} fill={this.state.range}/>
                <circle
                    id={this.state.id + "-end"}
                    cx={this.state.end}
                    cy="5" r={this.radius} fill={this.state.range}/>
            </svg>
        );
    }
}
