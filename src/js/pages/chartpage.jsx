import React from "react";

import Chart from "./../components/chart.jsx";

export default class ChartPage extends React.Component {
    constructor() {
        super();
        this.state = {
        data: [{id: '5fbmzmtc', x: 7, y: 41, z: 6},
            {id: 's4f8phwm', x: 11, y: 45, z: 9}],
            domain: {x: [0, 30], y: [0, 100]}
        };
   }


    render() {
        return(
            <div class="chart-container">
                <Chart
                    data={this.state.data}
                    domain={this.state.domain} />
            </div>);
    }
}
