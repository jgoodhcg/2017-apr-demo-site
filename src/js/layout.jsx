import React from "react";
import InlineSVG from 'svg-inline-react';
import { IndexLink, Link, browserHistory, hashHistory } from "react-router";

import Nav from "./components/nav.jsx";

export default class Layout extends React.Component {
    constructor() {
        super();
    }

    render() {
        return (
            <div id="app-container">
                <Nav/>
                {this.props.children}
            </div>
        );

    }
}
