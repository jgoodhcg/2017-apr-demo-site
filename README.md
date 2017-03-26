# Justin Good Demo Site

## About
This project was an experiment with react and d3. They don't blend very well together so it 
is mostly react with some d3 libraries sprinkled in. Code quality took a back seat to a running 
_finished_ project. It was a trade off I intended for this project, I have other projects that 
put code quality above everything else.

## Lessons Learned
- don't model data structures after view hierarchy  

Most of this project started out as sketches of what the end result would look like. Those sketches and an impulse to turn everything into components (not a bad thing generally) led me to structure the state objects in the timesheets visualization in a (weird way)[https://github.com/jgoodhcg/demo-site/blob/master/src/js/pages/timesheet.jsx#L155].  

Since I intend to work mostly from a visual idea of the end result, it is super important to build the data structures to be complaint with the functions that manipulate and report on them and not just to the functions that render them.  


## Dev Setup
- use [docker](https://www.docker.com/) and (docker-compose)[https://docs.docker.com/compose/] 
to run `$ docker-compse up --build` at the root of this project.

## Production Setup
- attach to docker container with `docker exec -i container-name /bin/bash`
- set node environment to production so webpack optimizes js bundle `export NODE_ENV=production`
- compile project with `root:/app/src$ webpack` and scp the static files from docker container to vps' nginx public directory
- docker container file location `/wwwroot`
- [docker cp](https://docs.docker.com/engine/reference/commandline/cp/)

## Todo 
### refactor
- [x] alter docker-compose and get running
- [x] strip out all uneccessary stuff
- [x] folder hiearchy
- [x] refactor to look like sketches
  - [x] bio card
  - [x] activities
  - [x] nav
- [x] import d3
- [ ] new project pages
  - [x] timesheets
    - [x] display calendar with grid
    - [x] pretty up margin so that there is a space for info row at top of calendar
    - [x] display stacked intervals as a ratio of the total time spent in the day
    - [x] day opacity scaled to all other days cumulative time spent
    - [x] pretty up and alternate color of month headers
    - [x] true responsivenes (figure out why navigating changes sizes derived)
    - [x] interval selection
    - [x] filter projects
    - [x] day selection
    - [x] parse csv into JSON
  - [x] date selection component
    - [x] create basic svg design
    - [x] sliding interaction with bounds
      - [x] mouse events
      - [x] touch events
    - [x] bind dates to x positions
    - [x] add date selection component to timesheets
    - [x] responsive sizing
  - [x] excercise data
    - [x] parse csv into JSON
      - [x] basic bar chart
        - [x] x-axis
          - [x] render bar
          - [x] render ticks
          - [x] add d3 scales
          - [x] re-orient labels
          - [x] tie date range selector to x axis
          - [x] push last tick (get max on range)
        - [x] y-axis
          - [x] render bar
          - [x] render ticks
    - [x] bar graph non runs
      - [x] shows bar space for each day in selection
      - [x] stacks bars for all excercises
      - [x] fix width on bars
    - [x] bar graph runs
      - [x] duplicate x axis
      - [x] runs sepcific y axis (distance)
      - [x] render bars
    - [x] body heat map
      - [x] body svg
      - [x] group exercises
      - [x] total reps per exercise in date range
      - [x] chroma scale each body segment by total reps
    - [x] global stats near top
    - [x] style with cards
    - [x] card for process
  - [x] fix bugs date range component
  - [ ] chorechart to alpha_v003
- [x] card alignment issues with grid system
- [x] activity/project component animation slide icon (see sketchbook)
  - [x] js toggle close class on click
- [x] images for projects
- [x] color scheme 
- [x] timesheet
  - [x] stats
    - [x] total time
    - [x] number of tasks
    - [x] longest task
    - [x] shortest task
  - [x] fix problem of not rendering last task
  - [x] card for process
- [x] resume page
- [x] make resume more apparently clickable
- [x] full body bio image
- [x] Name pointer change
- [x] google analytics
- [x] project descriptions and bio
  - [x] source ccode link 
  - [x] buttons on projects
- [ ] favicon
- [ ] update readme

### eventually
- [ ] refactor timesheet to reduce complexity
- [ ] display tags
- [ ] filter tags
- [ ] better deployment (use create-react app template)
- [ ] day selection on exercise bar chart(s)
