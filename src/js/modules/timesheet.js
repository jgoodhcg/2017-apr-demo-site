import * as d3 from "d3";

export default class Calendar {
    constructor(div_id, timesheet_data) {
        var width = 400,
            cellSize = 400/7,
            height = cellSize * 6;

        var percent = d3.format(".1%"),
            format = d3.timeFormat("%Y/%m/%d");

        var color = d3.scaleQuantize()
                .domain([0, 1])
                .range(d3.range(11).map(function(d) { return "q" + d + "-11"; }));

        var max_epoch = d3.max(timesheet_data, (d)=>{ return d.end.valueOf();});
        var min_epoch = d3.min(timesheet_data, (d)=>{ return d.end.valueOf();});

        var svg = d3.select("#"+div_id).selectAll("svg")
                .data(d3.timeMonths(new Date(min_epoch), new Date(max_epoch)))
                .enter().append("svg")
                .attr("width", width)
                .attr("height", height)
                .attr("class", "RdYlGn")
                .append("g")
                .attr("transform", "translate(" + ((width - cellSize * 7) / 2) + "," + (height - cellSize * 5 - 1) + ")");

        svg.append("text")
            .attr("x", 0)
            .attr("y", 0)
            .text(function(d) { return (d.getMonth()+1) + " - " + d.getFullYear(); });

        var rect = svg.selectAll(".day")
                .data(function(d) {
                    return d3.timeDays(new Date(d.getFullYear(),
                                                d.getMonth(), 1),
                                       new Date(d.getFullYear(),
                                                d.getMonth() + 1, 1)); })
                .enter().append("rect")
                .attr("class", (d) => { return "day "+d.toString();})
                .attr("width", cellSize)
                .attr("height", cellSize)
                .attr("x", function(d) {
                    return  d.getDay() * cellSize; })
                .attr("y", function(d) {
                    let weekStarts = d3.timeWeeks(
                        new Date(d.getFullYear(), d.getMonth(), 1), // first day of month
                        new Date(d.getFullYear(), d.getMonth() + 1, 0)); // last day of month
                    let thisWeekStart = d3.timeWeek(d); // [] of start of each week this month
                    let weekOfMonth = weekStarts.findIndex(
                        function(ws){return ws.getDate() == this.getDate();}, thisWeekStart);

                    return  weekOfMonth * cellSize; })
                .datum(format);

        // rect.append("title")
        //     .text(function(d) { return d; });

        // svg.selectAll(".month")
        //     .data(function(d) { return d3.timeMonths(new Date(d, 0, 1), new Date(d + 1, 0, 1)); })
        //     .enter().append("path")
        //     .attr("class", "month")
        //     .attr("d", monthPath);

        // rect.filter((d) => {
        //     let day = new Date(d);
        //     let tasks_on_day = timesheet_data.filter((task)=>{
        //         task.start.setHours(0,0,0,0);
        //         task.end.setHours(0,0,0,0);
        //         day.setHours(0,0,0,0)
        //         return( task.start.valueOf() <= day.valueOf() &&
        //                 day.valueOf() <= task.end.valueOf());
        //     });
        //     return (tasks_on_day.length > 0);
        // })
        //     .attr("class", function(d) { return "day " + color(0.7); });

        function monthPath(t0) {
            var t1 = new Date(t0.getFullYear(), t0.getMonth() + 1, 0),
                d0 = t0.getDay(), w0 = d3.timeWeek.count(d3.timeYear(t0), t0),
                d1 = t1.getDay(), w1 = d3.timeWeek.count(d3.timeYear(t1), t1);
            return "M" + (w0 + 1) * cellSize + "," + d0 * cellSize
                + "H" + w0 * cellSize + "V" + 7 * cellSize
                + "H" + w1 * cellSize + "V" + (d1 + 1) * cellSize
                + "H" + (w1 + 1) * cellSize + "V" + 0
                + "H" + (w0 + 1) * cellSize + "Z";
        }
    }
}
