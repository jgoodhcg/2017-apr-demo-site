import React from "react";
import InlineSVG from 'svg-inline-react';
import { IndexLink, Link, browserHistory, hashHistory } from "react-router";

export default class Nav extends React.Component {
    constructor() {
        super();

       this.state = {collapsed: true};
    }

    hamburgerClick(e){
        this.setState({
           collapsed: !this.state.collapsed
        });
    }

    // function straight copy pasta from http://stackoverflow.com/a/30810322
    copyTextToClipboard(text) {
        var gmailaddr = document.createElement("textarea");

        //
        // *** This styling is an extra step which is likely not required. ***
        //
        // Why is it here? To ensure:
        // 1. the element is able to have focus and selection.
        // 2. if element was to flash render it has minimal visual impact.
        // 3. less flakyness with selection and copying which **might** occur if
        //    the textarea element is not visible.
        //
        // The likelihood is the element won't even render, not even a flash,
        // so some of these are just precautions. However in IE the element
        // is visible whilst the popup box asking the user for permission for
        // the web page to copy to the clipboard.
        //

        // Place in top-left corner of screen regardless of scroll position.
        gmailaddr.style.position = 'fixed';
        gmailaddr.style.top = 0;
        gmailaddr.style.left = 0;

        // Ensure it has a small width and height. Setting to 1px / 1em
        // doesn't work as this gives a negative w/h on some browsers.
        gmailaddr.style.width = '2em';
        gmailaddr.style.height = '2em';

        // We don't need padding, reducing the size if it does flash render.
        gmailaddr.style.padding = 0;

        // Clean up any borders.
        gmailaddr.style.border = 'none';
        gmailaddr.style.outline = 'none';
        gmailaddr.style.boxShadow = 'none';

        // Avoid flash of white box if rendered for any reason.
        gmailaddr.style.background = 'transparent';


        gmailaddr.value = text;

        document.body.appendChild(gmailaddr);

        gmailaddr.select();

        try {
            var successful = document.execCommand('copy');
            var msg = successful ? 'successful' : 'unsuccessful';
            console.log('Copying text command was ' + msg);
        } catch (err) {
            console.log('Oops, unable to copy');
        }

        window.alert("email copied to clipboard!");
        document.body.removeChild(gmailaddr);
    }

    goHome(){
       hashHistory.push("/");
    }

    render(){
        return (
            <div id="top-bar" class="card-2">
                <div id="name">
                    <div id="name-text" onClick={this.goHome}>Justin Good</div>
                </div>
                <div id="links" class={this.state.collapsed ? "collapsed" : "expanded"}>
                    <div id="hamburger" onClick={this.hamburgerClick.bind(this)}>
                        <InlineSVG src={require("./../../resources/hamburger.svg")}/>
                    </div>
                    <div id="gmail"
                         onClick={(() => { this.copyTextToClipboard("jgoodhcg@gmail.com"); }).bind(this)}>
                        <InlineSVG src={require("./../../resources/gmail.svg")}/>
                    </div>
                    <div id="twitter">
                        <a href="https://twitter.com/jgoodhcg">
                            <InlineSVG src={require("./../../resources/twitter.svg")}/>
                        </a>
                    </div>
                    <div id="linkedin">
                        <a href="https://www.linkedin.com/in/jgoodhcg">
                            <InlineSVG src={require("./../../resources/linked-in.svg")}/>
                        </a>
                    </div>
                    <div id="github">
                        <a href="https://github.com/jgoodhcg">
                            <InlineSVG src={require("./../../resources/github.svg")}/>
                        </a>
                    </div>
                </div>
            </div>
        );
    }
}
