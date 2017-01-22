# Justin Good Demo Site

## Dev Setup
- use **docker** and **docker-compose** `$ docker-compse up --build`

## Production Setup
- compile project with `webpack` and scp the static files from docker container to vps

## Todo 
#### refactor
- [x] alter docker-compose and get running
- [x] strip out all uneccessary stuff
- [x] folder hiearchy
- [x] refactor to look like sketches
  - [x] bio card
  - [x] activities
  - [x] nav
- [x] import d3
- [ ] new project pages
  - [ ] timesheets
    - [x] display calendar with grid
    - [x] pretty up margin so that there is a space for info row at top of calendar
    - [x] display stacked intervals as a ratio of the total time spent in the day
    - [x] day opacity scaled to all other days cumulative time spent
    - [x] pretty up and alternate color of month headers
    - [x] true responsivenes (figure out why navigating changes sizes derived)
    - [x] interval selection
    - [x] filter projects
    - [x] day selection
    - [ ] parse csv into JSON
    - [ ] refactor timesheet to reduce complexity
    - [ ] display tags
    - [ ] filter tags
  - [ ] excercise data
  - [ ] chorechart
  - [ ] clicky
    - [ ] restyle close button on instructions
- [ ] redo project icons in kursgesagt style/colors
  - [ ] add animation to hover/click on Name + pointer change
- [ ] google analytics
- [ ] project descriptions and bio
- [ ] favicon
- [ ] better deployment (use create-react app template)

