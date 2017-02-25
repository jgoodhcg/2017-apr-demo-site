import React from "react";
import InlineSVG from 'svg-inline-react';
import { IndexLink, Link, browserHistory, hashHistory } from "react-router";

export default class Activity extends React.Component {
    constructor() {
        super();
    }

    render(){
        return (
            <div class="col-xs-12 col-sm-6">
                <div id={this.props.id} class="activity-container card card-1" >
                    <div class="row middle-xs">
                        <div class="activity-cover-container">
                            <div class="activity-cover card">
                                <InlineSVG src={require(`./../../resources/activity-bg.svg`)}/>
                            </div>
                        </div>
                        <div  class="col-xs-12 col-sm-3">
                            <div class="activity-image card">
                                 {!this.props.ext ?
                                  <Link to={this.props.route} >
                                      {/* <InlineSVG src={require(`./../../resources/${this.props.resource}.svg`)}/> */}
                                  </Link>
                                  :
                                  <a href={this.props.route}>
                                      {/* <InlineSVG src={require(`./../../resources/${this.props.resource}.svg`)}/> */}
                                  </a>
                                 }
                            </div>
                        </div>
                        <div class="activity-info col-xs-12 col-sm-9 ">
                            <p>{this.props.description}</p>
                        </div>
                    </div>
                </div>
            </div>
        );
    }
}
