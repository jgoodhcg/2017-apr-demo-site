import React from "react";
import InlineSVG from 'svg-inline-react';
import { IndexLink, Link, browserHistory, hashHistory } from "react-router";

export default class Activities extends React.Component {
    constructor() {
        super();
    }

    render(){
        return (
            <div class="row">
                <div id="title" class="col-xs-12">
                    <div class="card card-1">
                        <div class="row around-xs middle-sm main-title-row">
                            <div id="portrait" class="col-xs-12 col-sm-3">
                                <InlineSVG src={require("./../../resources/justin.svg")}/>
                            </div>
                            <div id="info" class="col-xs-12 col-sm-9">
                                <p id="bio" >
                                    Programmer, life quantifiying nut, wannabe artist. Since becoming 
                                    and adult I've attempted to study movie making, illustration, and then 
                                    completed a computer science degree. Recent obsessions have been optimizing 
                                    productivity through data capture, analysis, and quantification. This site 
                                    shows a portion of those efforts in a fun experimental design.     
                                </p>      
                            </div>
                        </div>
                        <div class="row resume-link-container">
                            <div class="resume-link col-xs-12">
                                <a href="#/experience">experience</a>
                            </div>
                        </div>
                    </div>
                </div>

            </div>
        );
    }
}

