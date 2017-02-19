import React from "react";
import InlineSVG from 'svg-inline-react';
import * as chroma from "d3-scale-chromatic";
import * as d3 from "d3";
import _ from "lodash";

export default class Heatmap extends React.Component {
    constructor() {
        super();

        this.associations = {
            Deltoids:   ["perfect-pushup-BW","bench-incline",
                         "iso-lateral-super-incline-press","shoulder-fly",
                         "standing-military-press","overhead-resistance-press",
                         "Dumbell-military-press"],
            Biceps:     ["pullup-BW","cable-curls","curl","dumbbell-curl",
                         "Cable-standing-superman-curls",
                         "Cable-standing-pull-ups","Preacher-curls"],
            Pectorals:  ["perfect-pushup-BW", "pushup-BW", "bench",
                         "bench-incline","iso-lateral-super-incline-press",
                         "dumbell-press","Cable-standing-pull-downs",
                         "Cable-standing-pull-ups","diamond-pushup"],
            Obliques:   ["in-outs-BW"],
            Abs:        ["in-outs-BW","l-sit-foot-supported"],
            Quads:      ["pistol-squat-with-chair-BW", "wall-sit-BW",
                         "leg-press","smith-press-squat","deep-body-squat"],
            Adductors:  ["deep-body-squat"],

            Trapezius:  ["pullup-BW","iso-lateral-high-row","shoulder-fly",
                         "one-arm-dumbbell-row","Dumbell-military-press",
                         "horizontal-row"],
            Lats:       ["pullup-BW","iso-lateral-high-row","pulley-row",
                         "one-arm-dumbbell-row","bench-bar-row","vertical-row",
                         "horizontal-row"],
            Triceps:    ["pulley-tricep-pulldown","Cable-standing-pull-downs",
                         "dips-floor-raised-leg"],
            Forearms:   ["forearm-rope-curl"],
            Glutes:     ["squat","smith-press-squat","deep-body-squat",
                         "Deadlift"],
            Hamstrings: ["squat","smith-press-squat","deep-body-squat",
                         "Deadlift"],
            Calves:     ["squat","smith-press-squat","deep-body-squat"]
        };
    }

    getTotalRepsForPart(body_part, totals, associations){
        let exercises_on_part = totals
            .filter((exercise)=>{
                return associations[body_part]
                    .indexOf(exercise.name) !== -1;}),

            total_reps_on_part = _(exercises_on_part)
                .reduce((total, exercise)=>{
                    return total + exercise.reps;
                }, 0);

        return total_reps_on_part;
    }

    colorParts(parent, associations){
        let absolute_totals = parent.heatmap_totals,
            totals = parent.totalForWorkoutNames(),
            body_parts = Object.keys(associations),
            max_reps_for_a_part = d3
                .max(_(body_parts)
                    .map((body_part)=>{
                        return this.getTotalRepsForPart(
                            body_part,
                            absolute_totals,
                            associations);})
                    .value());

        console.log(max_reps_for_a_part);

        body_parts.forEach((body_part)=>{
            let workouts = associations[body_part],
                total_reps = this.getTotalRepsForPart(
                    body_part,
                    totals,
                    associations),
                interpolate_index = total_reps/max_reps_for_a_part;

            console.log(body_part);
            console.log(total_reps);
            console.log(interpolate_index);

            let children = []
                .slice
                .call(window.document
                            .getElementById(body_part)
                            .children);

            children.forEach((path)=>{
                path.style.fill = chroma
                    .interpolateYlOrRd(interpolate_index);
            });
        });
    }

    componentDidMount(){
        let parent = this.props.parent;

        this.colorParts(parent, this.associations);
    }

    render(){
        /*
           SVG artwork copied from
           https://codepen.io/baublet/pen/PzjmpL
        */

        return (
            <InlineSVG src={require(`./../../resources/body.svg`)}/>
        );
    }
}

