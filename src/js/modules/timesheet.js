import * as d3 from "d3";

export default class Calendar {
    constructor(div_id, timesheet_data) {
        var width = 400,
            cellSize = width/7,
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
                .attr("transform",
                      "translate(" +
                      (0 + "," +
                       cellSize + ")"));

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
                    let firstOfMonth =
                            new Date(d.getFullYear(), d.getMonth(), 1);
                    // array of start of each week this month
                    // d3.timeWeeks is exclusive on the second date
                    let weekStarts = d3.timeWeeks(
                        firstOfMonth,
                        // first day of next month
                        new Date(d.getFullYear(), d.getMonth() + 1, 1));
                    
                    let thisWeekStart = d3.timeWeek(d);

                    // index of weekStarts is the zero based week of month num
                    // -1 means the first week but this month started
                    // after sunday
                    let weekOfMonth = weekStarts.findIndex(
                        function(ws){
                            return ws.getDate() == this.getDate();},
                        thisWeekStart) + 1; // zero row of calendary is for heading

                    if(firstOfMonth.getDay() == 0){
                        // shift the rows for months that start on sunday
                        weekOfMonth = weekOfMonth - 1;
                    }

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

    }
}
