import React from "react";

export default class DateRange extends React.Component {
    constructor(props) {
        super(props);

        this.radius = 4;
        this.stroke = 1.75;
        this.cushion = 3 * this.radius;

        this.min = props.min;
        let duration = props.max - props.min;
        this.tick_val = duration/100;

        this.startUpdate = props.startUpdate;
        this.endUpdate = props.endUpdate;

        this.state = {
            id: this.props.idprefix,
            inactive: this.props.inactive,
            range: this.props.range,
            start: 0, end: 100,
            prevEvent: null,
            selected: null
        };
    }

    getStartTime(){return new Date(this.min + (this.state.start * this.tick_val));}
    getEndTime(){return new Date(this.min + (this.state.end * this.tick_val));}

    updateCircle(e){
        let e_type = e.type,
            prevEvent =
                (this.state.prevEvent !== null? this.state.prevEvent : e),
            // handles detecting mouse/touch events
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
                        this.startUpdate(this.getStartTime());
                    }
                break;

            case "end":
                let translated_e = this.state.end + translation;
                if (translated_e > this.state.start + this.cushion &&
                    translated_e < 100)
                    {
                        this.setState(Object.assign(
                            this.state, {end: translated_e}));
                        this.endUpdate(this.getEndTime());
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
        /* svg.addEventListener('mouseleave', (e)=>{
         *     svg.removeEventListener('mousemove', this.updateCircle.bind(this));
         *     this.state.selected = null;
         *     this.state.prevEvent = null;});*/
        svg.addEventListener('touchend', (e)=>{
            svg.removeEventListener('touchmove', this.updateCircle.bind(this));
            this.state.selected = null;
            this.state.prevEvent = null;});
    }

    componentDidUpdate(){
        // rescales when the component resizes
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
                    x1="0" x2="100" y1="6" y2="6"
                    stroke={this.state.inactive} strokeWidth={this.stroke}/>

                <line
                    id={this.state.id + "-active"}
                    strokeLinecap="round"
                    x1={this.state.start}  x2={this.state.end}
                    y1="6" y2="6"
                    stroke={this.state.range} strokeWidth={this.stroke}/>

                <circle
                    id={this.state.id + "-start"}
                    cx={this.state.start}
                    cy="6" r={this.radius} fill={this.state.range}/>
                <circle
                    id={this.state.id + "-end"}
                    cx={this.state.end}
                    cy="6" r={this.radius} fill={this.state.range}/>
            </svg>
        );
    }
}
