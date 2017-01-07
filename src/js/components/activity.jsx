import React from "react";
import InlineSVG from 'svg-inline-react';
import { IndexLink, Link, browserHistory, hashHistory } from "react-router";

export default class Activity extends React.Component {
    constructor() {
        super();
    }

    render(){
        return (
            <div id={this.props.id} class="activity-container card card-1" >
                <div class="">
                    <div  class={"activity-image col-4 " + this.props.color}>
                        <Link to={this.props.route} >
                            <InlineSVG src={require(`./../../resources/${this.props.resource}.svg`)}/>
                        </Link>
                    </div>
                    <div class="activity-info">
                        <p>
                            Some text about this thing. Should not be long. There
                            should be enough here for someone to want to click the link.
                            Four or five sentences is fine.
                        </p>
                    </div>

                </div>
            </div>
        );
    }
}
