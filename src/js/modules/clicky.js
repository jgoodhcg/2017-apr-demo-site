import PIXI from "pixi.js" ;

window.bannerModule = (function() {

  function renderBox(box) {

    if(box.inRing){
      if(box.decrement){
        box.sides = box.sides - Math.max(Math.floor(box.sides/4), 1);
        box.decrement = false;
      }
      if(box.sides < 3){
        box.sides = maxSides;
      }
    }else{
      box.color = 0x999999;
    }
    // background
    graphics.lineStyle(0);
    graphics.beginFill(0xffffff);
    graphics.drawRect(box.corner.x, box.corner.y, size, size);
    graphics.endFill();

    // polygon

    // figure points
    var points = [];
    for(var n = 0; n < box.sides; n++){
      points.push((size/2) * Math.cos(2*Math.PI*n/box.sides) +
       box.corner.x + (size/2));
      points.push((size/2) * Math.sin(2*Math.PI*n/box.sides) +
       box.corner.y + (size/2));
    }

    graphics.lineStyle(stroke, box.color);  //(thickness, color)
    graphics.beginFill(box.color, 0.5);
    graphics.drawPolygon(points);
    graphics.endFill();



  }
  function distance(x1, y1, x2, y2){
    return Math.sqrt(Math.pow((x2 - x1),2) + Math.pow((y2 - y1),2));
  }
  function random(min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
  }
  function getRandomColor() {
    var letters = '0123456789ABCDEF'.split('');
    var color = '0x';
    for (var i = 0; i < 6; i++ ) {
      color += letters[Math.floor(Math.random() * 16)];
    }
    return Number(color);
  }
  function ripple(){

    // loop on rings present
    for(var i=0; i<rings.length; i++){
      // loop through each box
      for(var r=0; r<boxes.length; r++){
        for(var c=0; c<boxes[r].length; c++){
          // determine if inside this ring
          var x = boxes[r][c].mid.x,
          y = boxes[r][c].mid.y,
          cx = rings[i].x,
          cy = rings[i].y,
          r1 = rings[i].ir,
          r2 = rings[i].or;
          // condition for outside inner circle of ring && inside outer
          if (Math.pow((x-cx),2) + Math.pow((y-cy),2) > Math.pow(r1,2) &&
          Math.pow((x-cx),2) + Math.pow((y-cy),2) < Math.pow(r2,2)){
            boxes[r][c].encRing = true;
            boxes[r][c].color = rings[i].color;
          }
        }
      }

      // resize redraw ring
      rings[i].ir += rings[i].rIncrement;
      rings[i].or += rings[i].rIncrement;
      if (rings[i].ir > (width/2) + rwidth +
       Math.max(rings[i].x, width-rings[i].x) &&
       rings[i].ir > (height/2) + rwidth +
       Math.max(rings[i].y, height - rings[i].y)){
        // flag ring to be removed
        toRemove.push(i);
      }
    }

    // loop through boxes again and render
    for(var r=0; r<boxes.length; r++){
      for(var c=0; c<boxes[r].length; c++){
        if(boxes[r][c].encRing){
          // encountered a ring
          if(!boxes[r][c].inRing){
            // encountered a NEW ring
            boxes[r][c].decrement = true;
          }
          boxes[r][c].inRing = true;
        }else{
           // made it through all rings w/o encountering
          boxes[r][c].inRing = false;
          boxes[r][c].colors = [];
        }
        boxes[r][c].encRing = false; // reset for next frame
        renderBox(boxes[r][c]);
      }
    }

    // actually remove rings
    for (var i=0; i<toRemove.length; i++){
      rings.splice(toRemove[i],1);
    }
    toRemove = []; // empty to remove
  }
  function draw(width, height){

    // render all Boxes grey
    for(var r=0; r<boxes.length; r++){
      for(var c=0; c<boxes[r].length; c++){
        renderBox(boxes[r][c]);
        }
      }
  }
  function drawShadows(width, height){
     // shadows done with css now...
     // guess I learned bezier curves for nothing...
     
    // var h = size/2,
    // a = 0.50;
    //
    // //top shadow
    // graphics.lineStyle(0);
    // graphics.beginFill(0x121212, a);
    // graphics.moveTo(-(size*4),0);
    // graphics.bezierCurveTo(0, h, width, h, width, 0);
    // graphics.lineTo(-(size*4),0);
    // graphics.endFill();
    //
    // //bottom shadow
    // graphics.lineStyle(0);
    // graphics.beginFill(0x121212, a);
    // graphics.moveTo(-(size*4), height);
    // graphics.bezierCurveTo(0,height-(h), width, height-(h), width, height);
    // graphics.lineTo(-(size*4), height);
    // graphics.endFill();

  }
  function animate(){

    if(contAnim){
      graphics.clear();
      draw(width,height);
      ripple();
      drawShadows(width,height);
      renderer.render(stage);
      if (rings.length < 1){
        console.log("rings empty, stopping animation");
        contAnim = false; // stop the animation if all the ripples are gone
      }
      requestAnimationFrame(animate);
    }
  }
  function tesslateBoxes(width, height){
    //tesselate boxes
    var cNum = width/size,
    rNum = height/size;
    console.log('number of rows: '+rNum+' number of columns: '+cNum);
    for (var r = 0 ; r < rNum; r++){ //rows
      boxes[r] = [];
      for(var c = 0; c < cNum; c++){ //columns
        // make color
        var color = getRandomColor();
        // create box
        boxes[r][c] = obj.create({
          corner: {x: c*size, y: r*size},
          mid:    {x: c*size+(size/2), y: r*size+(size/2)},
          color: 0x999999,
          colors: [],
          sides: 4,
          inRing: false,
          rings: [],
          encRing: false,
          decrement: false
        });

      }
    }
    // set ring center
    ring.x = Math.floor(width/2);
    ring.y = Math.floor(height/2);
  }

  var banner = document.getElementById('banner'),
      width = banner.offsetWidth,
  // height = banner.offsetHeight,
      height = Math.max(document.documentElement.clientHeight, window.innerHeight || 0),
      renderer = PIXI.autoDetectRenderer(width, height, {antialias: false}),
      stage = new PIXI.Container(),
      contAnim = true,
      interaction = new PIXI.interaction.InteractionManager(renderer,
                                                            {autoPreventDefault: false});
    banner.appendChild(renderer.view);

  stage.interactive = true;

  var graphics = new PIXI.Graphics();

  console.log("Width: "+width+" height: "+height);

  // obj type & box type & size of sides
  var size = 25, stroke = 1.5, maxSides = 15;
  var obj = {
    create: function(values) {
      var instance = Object.create(this);
      Object.keys(values).forEach(function(key) {
        instance[key] = values[key];
      });
      return instance;
    }
  };

  // create redraw ring
  var rwidth = 60,
  startrad = 5,
  rIncrement = 6,
  ring = obj.create(
    {
      x: Math.floor(width/2),
      y: Math.floor(height/2),
      ir: startrad,
      or: startrad + rwidth
    }
  ),
  rings = [],
  toRemove = [];

  var boxes = [ ];
  tesslateBoxes(width, height);
  draw(width,height);
  // set stage and start animation loop
  stage.addChild(graphics);
  animate(contAnim);

  return {
    stopAnimation: function(){
      contAnim = false;
    },
    startAnimation: function(){
      contAnim = true;
      animate(contAnim);
    },
    reDraw: function(){
      var banner = document.getElementById('banner'),
      width = banner.offsetWidth,
      height = banner.offsetHeight;
      console.log('width '+width+' height '+height);
      renderer.resize(width, height);
      graphics.clear();
      tesslateBoxes(width, height);
      // re-render without triggering animation
      draw(width, height);
      drawShadows(width, height);
      renderer.render(stage);
    },
    addRipple: function(a,b,d){
      var p = new PIXI.Point();
      if (a === undefined || b === undefined){
        p.x = Math.floor(width/2);
        p.y = Math.floor(height/2);
      }else{
        interaction.mapPositionToPoint(p,a,b);
      }
      var r = Math.max(d/(size*3), 0.9),
      c = getRandomColor();
      console.log('speed: '+r);
      rings.push(ring.create({
        x: p.x,
        y: p.y,
        rIncrement: r,
        color: c
      }));
      if(!contAnim){
        contAnim = true;
        animate(contAnim);
      }

    }

  };
});
