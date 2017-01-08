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
                        <div  class={"activity-image col-xs-12 col-sm-3 "}>
                            <div>
                                <Link to={this.props.route} >
                                    <InlineSVG src={require(`./../../resources/${this.props.resource}.svg`)}/>
                                </Link>
                            </div>
                        </div>
                        <div class="activity-info col-xs-12 col-sm-9 ">
                            <p>
                                Some text about this thing. Should not be long. There
                                should be enough here for someone to want to click the link.
                                Four or five sentences is fine.
                            </p>
                        </div>
                    </div>
                </div>
            </div>
        );
    }
}
