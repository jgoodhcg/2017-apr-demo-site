import * as d3 from "d3";

export default class Calendar {
    constructor(div_id, timesheet_data) {
        var margin = {
            top: 20,
            bottom: 10,
            left: 10,
            right: 10,
            header: 40
        };

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
                .attr("width", width + (margin.left + margin.right))
                .attr("height", height + (margin.top + margin.bottom + margin.header))
                .attr("class", "RdYlGn");

        svg.append("rect")
                .attr("width", width + (margin.left + margin.right))
                .attr("height", height + (margin.top + margin.bottom + margin.header))
                .attr("class", "svg-bg");

        // picture text like bottom left origin
        // that grows downward its font-size
        svg.append("g")
            .append("text")
            .attr("transform",
                  "translate(" +
                  (margin.left + "," +
                   (margin.top) + ")"))
            .attr("x", 0)
            .attr("y", 18)
            .attr("font-size", "18")
            .text(function(d) { return (d.getMonth()+1) + " - " + d.getFullYear(); });

        var calendar = svg.append("g")
                .attr("transform",
                      "translate(" +
                      (margin.left + "," +
                       (margin.top + margin.header) + ")"));

        calendar.append("rect")
            .attr("width", width)
            .attr("height", height)
            .attr("class", "cal-bg");

        calendar.selectAll(".day-bg")
            .data(d3.range(0, 42))
            .enter().append("rect")
            .attr("class", "day-bg")
            .attr("width", cellSize)
            .attr("height", cellSize)
            .attr("x", function(d){return (d%7)*cellSize;})
            .attr("y", function(d){return (d%6)*cellSize;});

        var rect = calendar.selectAll(".day")
                .data(function(d) {
                    return d3.timeDays(
                        new Date(d.getFullYear(), d.getMonth(), 1),
                        new Date(d.getFullYear(), d.getMonth() + 1, 1)); })
                .enter().append("rect")
                .attr("class", (d) => { return "day "+d.toString();})
                .attr("width", cellSize)
                .attr("height", cellSize)
                .attr("x", function(d) {
                    return  d.getDay() * cellSize; })
                .attr("y", function(d) {
                    let wom = weekOfMonth(d);
                    return  wom * cellSize; })
                .datum(format);

        // rect.append("title")
        //     .text(function(d) { return d; });

        rect.filter((d) => {
            let day = new Date(d);
            let tasks_on_day = timesheet_data.filter((task)=>{
                task.start.setHours(0,0,0,0);
                task.end.setHours(0,0,0,0);
                day.setHours(0,0,0,0);
                return( task.start.valueOf() <= day.valueOf() &&
                        day.valueOf() <= task.end.valueOf());
            });
            return (tasks_on_day.length > 0);
        })
            .attr("class", function(d) { return "day " + color(0.7); });

        function weekOfMonth(d){
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
                thisWeekStart) + 1;

            if(firstOfMonth.getDay() == 0){
                // shift the rows for months that start on sunday
                weekOfMonth = weekOfMonth - 1;
            }

            return weekOfMonth;
        }

    }
}
