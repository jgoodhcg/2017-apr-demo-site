# Justin Good Demo Site

## Dev Setup
- use **docker** and **docker-compose** `$ docker-compse up --build`

## Production Setup
- attach to docker container with `docker exec -i container-name /bin/bash`
- compile project with `webpack` and scp the static files from docker container to vps

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
  - [ ] excercise data
    - [x] parse csv into JSON
      - [ ] basic bar chart
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
  - [x] fix bugs date range component
  - [ ] clicky
    - [ ] restyle close button on instructions
  - [ ] chorecchart to alpha_v003
- [ ] card alignment issues with grid system
- [ ] activity/project component animation slide icon (see sketchbook)
- [ ] color scheme decision
- [ ] Name pointer change
- [ ] google analytics
- [ ] project descriptions and bio
- [ ] favicon
- [ ] update readme

### eventually
- [ ] refactor timesheet to reduce complexity
- [ ] display tags
- [ ] filter tags
- [ ] better deployment (use create-react app template)
- [ ] day selection on exercise bar chart(s)
