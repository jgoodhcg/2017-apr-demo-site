import React from "react";
import InlineSVG from 'svg-inline-react';
import { IndexLink, Link, browserHistory, hashHistory } from "react-router";

export default class Activity extends React.Component {
    constructor() {
        super();
    }

    render() {
        return (
            <div class="col-xs-12 col-md-6">
                <div id={this.props.id} class="activity-container card card-1" >
                    <div class="row middle-xs"
                        onClick={this.props.click}>
                        <div class="activity-cover-container">
                            <div class={"activity-cover card " +
                                (this.props.closed ? "" : "open")}>
                                <InlineSVG src={require(`./../../resources/${this.props.resource}-cover.svg`)} />
                            </div>
                        </div>
                        <div class="col-xs-12 col-sm-3">
                            <div class={"activity-image card " +
                                (this.props.closed ? "" : "open")}>
                                <InlineSVG src={require(`./../../resources/${this.props.resource}.svg`)} />
                            </div>
                        </div>
                        <div class="activity-info col-xs-12 col-sm-9 ">
                            <h2 class="hidden-sm-up">{this.props.id}</h2>
                            <p>{this.props.description}</p>
                        </div>


                    </div>
                    <div class={"row activity-links " +
                        (this.props.closed ? " closed" : "")}>
                        {this.props.links.map((link, i) => {
                            return (
                                <div key={"activity-link-" + i}
                                    class={"activity-link col-xs-6 " +
                                        (i % 2 === 0 ? " left" : " right")}>
                                    <a href={link.href}>{link.name}</a>
                                </div>);
                        })}
                    </div>
                </div>
            </div >
        );
    }
}
