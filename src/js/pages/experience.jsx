import React from "react";
import InlineSVG from 'svg-inline-react';
import { IndexLink, Link, browserHistory, hashHistory } from "react-router";

import Skill from "../components/skill.jsx";

export default class Experience extends React.Component {
    constructor() {
        super();
    }

    render() {
        return (
            <div id="experience" class="container-fluid">
                <div class="row">
                    <div class="col-xs-12 col-md-9">
                        <div class="row">
                            <div id="exp-skills" class="col-xs-12">
                               <div class="card card-1 ">
                                <h2>preferred skills</h2>
                                <h3>languages</h3>
                                <p>javascript, clojure(script), bash, sass, sql</p>
                                <h3>frameworks & libraries</h3>
                                <p>react, reagent, reframe, redux, d3, luminus</p>
                                <h3>platforms & tools</h3>
                                <p>node, lein, webpack, docker, vagrant, git, nginx, postgres</p>
                                </div>
                            </div>
                        </div>
                        <div class="row">
                            <div id="exp-employment" class="col-xs-12">
                                <div class="card card-1 ">
                                <h2>employment</h2>
                                <h3>onestop feb 2016 – present</h3>
                                <p>maintained/extended legacy e-commerce site and supporting applications</p>
                                <ul>
                                    <li>diagnosed and solved problems with code base, business workflows, 
                                        black box dependencies</li>
                                    <li>created an automated deployment system for entire platform with 
                                        <span style={{fontStyle: "italic"}}> successfull</span> documentation</li>
                                    <li>extended functionality to meet changing business requirements within the 
                                        limitations of the legacy systems in place.
                                    </li>
                                    <li>developed version control and deployment workflow that allowed 
                                        collaboration with several developers on many features 
                                        and bug fixes simultaneously
                                    </li>
                                </ul>
                                <p>php, python, javascript, bash, sql, css, sass</p>
                                <p>zend, jquery</p>
                                <p>apache, git, mercurial, vagrant, postgres</p>

                                <h3>city of wyoming may 2015 – nov 2015</h3>
                                <p>developed internal crud application for public works department</p>
                                <ul>
                                    <li>designed, and coordinated homegrown solution for data capturing needs</li>
                                    <li>learned tech stack <span style={{fontStyle: "italic"}}> on the job</span></li>
                                    <li>regularly held meetings to discuss progress and changing requirments</li>
                                </ul>
                                <p>php, javascript, sql, sass</p>
                                <p>jquery, moment</p>
                                <p>iis, git, microsoft sql server</p>
                                </div>
                            </div>
                        </div>
                        <div class="row">
                            <div id="exp-education" class="col-xs-12">
                                <div class="card card-1 ">
                                <h2>education</h2>
                                <p>gvsu b.s. computer science with minor anthropology 2012 – 2015</p>
                                <p>kcc general education and illustration 2011</p>
                                <p>grcc general education and film & video 2010 – 2011</p>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div class="col-xs-12 col-md-3">
                        <div class="card card-1">
                        <h2>skill ratings</h2>
                        <hr/>
                        <h3>languages</h3>
                        <p> javascript, php </p>
                        <Skill score="5"></Skill>
                        <p> sass, clojure(script) </p>
                        <Skill score="3"></Skill>
                        <p> sql, bash, python </p>
                        <Skill score="2"></Skill>
                        <hr/>
                        <h3>frameworks/libraries</h3>
                        <p>react, reagent, reframe</p>
                        <Skill score="4"></Skill>
                        <p>luminus, d3</p>
                        <Skill score="3"></Skill>
                        <p>redux, pixi</p>
                        <Skill score="2"></Skill>
                        <hr/>
                        <h3>platforms/tools</h3>
                        <p>vagrant, svg</p>
                        <Skill score="5"></Skill>
                        <p>lein, webpack, postgres, git</p>
                        <Skill score="3"></Skill>
                        <p>node, npm, docker, canvas, webgl</p>
                        <Skill score="2"></Skill>
                        <p>nginx, apache</p>
                        <Skill score="1"></Skill>
                        </div>
                    </div>
                </div>
            </div>
        );
    }
}
