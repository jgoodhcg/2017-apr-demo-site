import React from "react";
import InlineSVG from 'svg-inline-react';
import { IndexLink, Link, browserHistory, hashHistory } from "react-router";

export default class Activities extends React.Component {
    constructor() {
        super();
    }

    render() {
        return (
            <div class="row">
                <div id="title" class="col-xs-12">
                    <div class="card card-1">
                        <div class="row around-xs middle-sm main-title-row">
                            <div id="portrait" class="col-xs-12 col-sm-3">
                                <InlineSVG src={require("./../../resources/justin.svg")} />
                            </div>
                            <div id="info" class="col-xs-12 col-sm-9">
                                <h1 id="info-title" >Hi, I'm Justin</h1>
                                <p id="bio" >
                                    Programmer, life quantifiying nut, and wannabe artist.
                                    Recent obsessions have been data visualization and functional reactive programming.
                                    This site is a demonstration of my full stack software skills, design and visualization abilities.
                                </p>
                                <div class="resume-link">
                                    <a href="#/experience">experience</a>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        );
    }
}

