require("./../sass/app.scss");

import React from "react";
import ReactDOM from "react-dom";
import { Router, Route, IndexRoute, browserHistory, hashHistory } from "react-router";
import * as ReactGA from "react-ga";

ReactGA.initialize('UA-74205906-1');

import Layout from "./layout.jsx";
import Index from "./pages/index.jsx";
import Experience from "./pages/experience.jsx";
import Clicky from "./pages/clicky-thing.jsx";
import Timesheet from "./pages/timesheet.jsx";
import Workouts from "./pages/workouts.jsx";

var metaTag=document.createElement('meta');
metaTag.name = "viewport";
metaTag.content = "width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=0";
var link = document.createElement('link');
    link.rel = 'stylesheet';
    link.href = "https://fonts.googleapis.com/css?family=Arimo";
    document.head.appendChild(link);

document.getElementsByTagName('head')[0].appendChild(metaTag);

let app_element = document.createElement("div");
app_element.setAttribute("id", "app");
document.body.appendChild(app_element);

const app = document.getElementById("app");

function logPageView() {
  ReactGA.set({ page: window.location.pathname });
  ReactGA.pageview(window.location.pathname);
}

ReactDOM.render(
    <Router history={hashHistory} onUpdate={logPageView}>
        <Route path="/" component={Layout}>
            <IndexRoute component={Index}></IndexRoute>
            <Route path="experience" name="experience" component={Experience}></Route>
            <Route path="clicky" name="clicky" component={Clicky}></Route>
            <Route path="timesheet" name="timesheet" component={Timesheet}></Route>
            <Route path="workouts" name="workouts" component={Workouts}></Route>
        </Route>
    </Router>, app);

