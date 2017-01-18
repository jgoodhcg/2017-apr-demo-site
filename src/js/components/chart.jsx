import React from "react";
import ReactDOM from "react-dom";
import d3Chart from "./../modules/d3Chart.js";

export default class Chart extends React.Component {
    constructor(data, domain){
        super();
        this.state = {
            data,
            domain
        };
    }
    componentDidMount() {
        let el = ReactDOM.findDOMNode(this);
        this.d3Chart = new d3Chart(el, {
            width: '300',
            height: '300'
        }, this.getChartState());
    }

    componentDidUpdate() {
        let el = ReactDOM.findDOMNode(this);
        this.d3Chart.update(el, this.getChartState());
    }

    getChartState() {
        return {
            data: this.state.data,
            domain: this.state.domain
        };
    }

    componentWillUnmount() {
        let el = ReactDOM.findDOMNode(this);
        this.d3Chart.destroy(el);
    }

    render() {
        return (<div className="Chart"></div>);
    }
}
