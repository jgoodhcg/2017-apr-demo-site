import React from "react";
import InlineSVG from 'svg-inline-react';
import { IndexLink, Link, browserHistory, hashHistory } from "react-router";

export default class Activities extends React.Component {
    constructor() {
        super();
    }

    render(){
        return (
           <div id="title" class="card card-1 ">
               <div id="portrait" class="">
                   <InlineSVG src={require("./../../resources/justin.svg")}/>
               </div>
               <div id="info" class="">
                   <p id="bio" >
                       My bio should be conscise. I don't know if I spelled
                       that correctly. There should be clear definitions of
                       what I work on and how I do it. There should be little
                       use of I. A small amount of humor would be beneficial
                       but it should avoid using self deprecation or sarcasm.
                       Seven sentences is fine.
                   </p>
               </div>
           </div>
        );
    }
}

