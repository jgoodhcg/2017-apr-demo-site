import * as d3 from "d3";

export default class d3Chart{
    constructor(el, props, state){
        let svg = d3.select(el).append('svg')
                .attr('class', 'd3')
                .attr('width', props.width)
                .attr('height', props.height);

        svg.append('g')
            .attr('class', 'd3-points');

        this.update(el, state);
    }

    update(el, state) {
        // Re-compute the scales, and render the data points
        let scales = {x: d3.scaleQuantize()
                      .domain([0, 100])
                      .range([0, 100]),
                      y: d3.scaleQuantize()
                      .domain([0, 100])
                      .range([0, 100]),
                      z: d3.scaleQuantize()
                      .domain([0, 100])
                      .range([0, 100])};
        this.drawPoints(el, scales, state.data);
    }

    destroy(el) {
        // Any clean-up would go here
        // in this example there is nothing to do
    }

    drawPoints(el, scales, data) {
        let g = d3.select(el).selectAll('.d3-points');

        let point = g.selectAll('.d3-point')
                .data(data.data, function(d) {
                    console.log(d);
                    return d.id; });

        // ENTER
        point.enter().append('circle')
            .attr('class', 'd3-point');

        // ENTER & UPDATE
        point.attr('cx', function(d) {
            return scales.x(d.x); })
            .attr('cy', function(d) { return scales.y(d.y); })
            .attr('r', function(d) { return scales.z(d.z); });

        // EXIT
        point.exit()
            .remove();
    }
}
