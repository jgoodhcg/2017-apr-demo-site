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
        var min_epoch = d3.min(timesheet_data, (d)=>{ return d.start.valueOf();});

        var max_task_time_in_day = d3.max(
            d3.timeDays(new Date(min_epoch), new Date(max_epoch)),
            (d)=>{
                let tasks_on_day = tasksOnDay(d);
                let total_time_ms = 0;
                tasks_on_day.forEach((t)=>{
                    let milliseconds = t.end.valueOf() - t.start.valueOf();
                    total_time_ms += milliseconds;});
                return total_time_ms;});
        var min_task_time_in_day = 0;

        var taskDayScale = d3.scaleLinear()
                .domain([min_task_time_in_day, max_task_time_in_day])
                .range([0, cellSize]);

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

        // calendar background
        calendar.append("rect")
            .attr("width", width)
            .attr("height", height)
            .attr("class", "cal-bg");

        // inactive/background days
        calendar.selectAll(".day-bg")
            .data(d3.range(0, 42))
            .enter().append("rect")
            .attr("class", "day-bg")
            .attr("width", cellSize)
            .attr("height", cellSize)
            .attr("x", function(d){return (d%7)*cellSize;})
            .attr("y", function(d){return (d%6)*cellSize;});

        // active days
        var active = calendar.selectAll(".day-group")
                .data(function(d) {
                    return d3.timeDays(
                        new Date(d.getFullYear(), d.getMonth(), 1),
                        new Date(d.getFullYear(), d.getMonth() + 1, 1)); })
                .enter().append("g")
                .attr("transform", (d) => {
                    let x = d.getDay() * cellSize;
                    let y = weekOfMonth(d) * cellSize;
                    return "translate(" +(x + "," +y + ")");
                });

        // render active
        active.selectAll(".day")
            .data((d) => {
                return [new Date(d)];})
            .enter().append("rect")
            .attr("class", (d) => {
                return "day "+d.toString();})
            .attr("width", cellSize)
            .attr("height", cellSize)
            .attr("x", 0)
            .attr("y", 0);

        // render task intervals over active days
        active.selectAll(".task")
            .data((d)=>{return tasksOnDay(d);})
            .enter().append("rect")
            .attr("class", "task")
            .attr("fill", (task)=>{return task.color;})
            .attr("width", cellSize)
            .attr("height", (task)=>{
                let val = task.end.valueOf() - task.start.valueOf();
                let height = taskDayScale(val);
                return height;})
            .attr("x", 0)
            .attr("y", function(task){
                let day = new Date(d3.select(this.parentNode).datum()),
                    all_tasks = tasksOnDay(day),
                    prev_tasks = previousTasks(all_tasks, task),
                    prev_tasks_total_time = cumulativeTasksTime(prev_tasks);

                return taskDayScale(prev_tasks_total_time);
            });

        function cumulativeTasksTime(tasks){
            return tasks
                .map((task) => {
                    return task.end.valueOf() - task.start.valueOf();})
                .reduce((this_time, next_time)=>{
                    return this_time + next_time;}, 0);
        }

        function previousTasks(day_tasks, task){
            return day_tasks.filter((t) => {
                return t.end.valueOf() < task.start.valueOf();});
        }

        function tasksOnDay(day){
            let tasks = timesheet_data.filter((task)=>{
                let start = new Date(task.start);
                let end = new Date(task.end);
                let day_copy = new Date(day);
                start.setHours(0,0,0,0);
                end.setHours(0,0,0,0);
                day_copy.setHours(0,0,0,0);
                return( start.valueOf() <= day_copy.valueOf() &&
                        day_copy.valueOf() <= end.valueOf());
            });

            return tasks;
        }

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
