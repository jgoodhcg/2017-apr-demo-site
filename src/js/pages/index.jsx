import React from "react";
import InlineSVG from 'svg-inline-react';
import { IndexLink, Link, browserHistory, hashHistory } from "react-router";

import Activities from "../components/activities.jsx";
import Title from "../components/title.jsx";

export default class Index extends React.Component {
    constructor() {
        super();

        this.state = {
            collapsed: false,
            linking: false
        };
    }

    render() {
        return (
            <div id="index-container" class="">
                <Title/>
                <Activities/>
            </div>
        );
    }
}
