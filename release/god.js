//These arrays allow to browse all the items in one category rapidly. They are filled within the Green, Red, Water constructors (main.js)
var listOfGreenPeople=new LinkedList();
var listOfRedPeople=new LinkedList();
var listOfWaterSpots=new LinkedList();
var listOfCadavers=new LinkedList();

//For statistics and output
var aliveGreens=0;
var aliveReds=0;

//Constant, must be at least as big as the biggest possible spot
var matrixCellSize=40;

//Allocate matrix
var matrixW, matrixH, matrix;

//Returns the LinkedList associated with a position
function getMatrixCell(x,y) {
  var cx=Math.floor(x/matrixCellSize);
  var cy=Math.floor(y/matrixCellSize);
  if (cx>=0 && cx<matrixW && cy>=0 && cy<matrixH)
    return (matrix[cx][cy]);
  else
    return (null);
}

//Same as getMatrixCell, but shifts the cell. This can be used for instance to retrieve the cell on the left of an object
function getMatrixCellShifted(x,y,dx,dy) {
  var cx=Math.floor(x/matrixCellSize)+dx;
  var cy=Math.floor(y/matrixCellSize)+dy;
  if (cx<0) cx+=matrixW;
  if (cy<0) cy+=matrixH;
  if (cx>=matrixW) cx-=matrixW;
  if (cy>=matrixH) cy-=matrixH;
  return matrix[cx][cy];
}

//Called by the Green, Red, etc... objects (main.js) whenever they change their position
//moves the object from one linked list to another
function objectPositionChanged(object, oldx, oldy, newx, newy) {
  //if (object.matrixed!=true) return;
  if (getMatrixCell(oldx,oldy)==getMatrixCell(newx,newy)) return;
  getMatrixCell(oldx,oldy).remove(object.matrixContainer);
  if (getMatrixCell(newx,newy)==null) {console.log('error. new='+newx+' '+newy); backtrace();}
  object.matrixContainer=getMatrixCell(newx,newy).pushBack(object);
}

//Called by the constructor of Green, adds the element into the matrix
function registerGreen(g) {
  g.matrixed=true;
  g.matrixContainer=getMatrixCell(g.element.x,g.element.y).pushBack(g);
  g.greenPeopleContainer=listOfGreenPeople.pushBack(g);
  aliveGreens++;
}
function registerRed(r) {
  r.matrixed=true;
  r.matrixContainer=getMatrixCell(r.element.x,r.element.y).pushBack(r);
  r.redPeopleContainer=listOfRedPeople.pushBack(r);
  aliveReds++;
}
function registerWater(w) {
  w.matrixed=true;
  w.matrixContainer=getMatrixCell(w.element.x,w.element.y).pushBack(w);
  w.waterSpotsContainer=listOfWaterSpots.pushBack(w);
}

//Deletes the first cadaver on the queue if it has expired, and schedules the next 'cleanup' to 0.1 seconds after the next cadaver expires
//This function should be called whenever a cadaver is created, it is the only one on the scene
function manageCadavers() {
  if (stopped) return;
  if (listOfCadavers.length==0) return;
  if (listOfCadavers.first.data.decompositionDate<=time()) {
    colorDots.remove(listOfCadavers.first.data.element.colorDotsContainer);
    getMatrixCell(listOfCadavers.first.data.element.x,listOfCadavers.first.data.element.y).remove(listOfCadavers.first.data.matrixContainer);
    listOfCadavers.first.data.decompose();
    listOfCadavers.remove(listOfCadavers.first);
  }
  if (listOfCadavers.length==0) return;
  setTimeout(manageCadavers,(listOfCadavers.first.data.decompositionDate-time()+0.1)*1000);
}

//Mainly inits the AIs
//TODO translate 'ia' to 'ai'
function initGod() {
  for (var green=listOfGreenPeople.first; green!=null; green=green.next) {
    ia_green_init(green.data);
  }
  var i=0;
  for (var red=listOfRedPeople.first; red!=null; red=red.next) {
    ia_red_init(red.data);
    i++;
  }
  document.getElementById('debug2').value='';
  return;
}

//Gets the nearest object in terms of surface (the one that collides most)
//This function returns a struct containing the nearest object and its distance
function getNearestObject(object) {
  var minDistance=999999;
  var nearestObject=null;
  for (cellDeltaX=-1; cellDeltaX<=1; cellDeltaX++) {
    for (cellDeltaY=-1; cellDeltaY<=1; cellDeltaY++) {
      //The function returns a struct with two fields : the closest object and its distance
      var ret=getNearestObjectInCell(object,cellDeltaX,cellDeltaY);
      if (ret.distance<minDistance) {
        minDistance=ret.distance;
        nearestObject=ret.nearestObject;
      }
    }
  }
  return (new function() {this.nearestObject=nearestObject; this.distance=minDistance;});
}

//Gets the nearest object to 'object' in the cell in which object is, but shifted of cellDelta (in number of cells, not in pixels)
//TODO see where this is needed, I don't see how this is useful
function getNearestObjectInCell(object,cellDeltaX,cellDeltaY) {
  var list=getMatrixCell(object.element.x+cellDeltaX*matrixCellSize,object.element.y+cellDeltaY*matrixCellSize);
  if (list==null || list==undefined) return (new function() {this.nearestObject=null; this.distance=999999;});
  var minDistance=999999;
  var nearestObject=null;
  for (var obj=list.first; obj!=null; obj=obj.next) {
    if (obj.data==object) {/*console.log('self');*/ continue;}
    d=distance(obj.data.element,object.element)-(obj.data.element.radius+object.element.radius);
    if (d<minDistance) {
      minDistance=d;
      nearestObject=obj.data;
    }
  }
  return (new function() {this.nearestObject=nearestObject; this.distance=minDistance;});
}

//Main update function for the game dynamics
function updateGod(deltaTime) {
  gDeltaTime=deltaTime; //This global variable will be used by the user-functions such as Green.forward
  var updateGodStart=time();
  var greenPeopleUpdateTime=0;
  var greenPeopleCollTime=0;
  var timeStart=0;
  //Update all green spots
  for (var green=listOfGreenPeople.first; green!=null; green=green.next) {
    timeStart=time();
    //TODO send signal to red spot if hit
    green.data.update(deltaTime);
    if (gameMode=='species' || gameMode=='csv') {
      if (ia_green_update_user(green.data)==false) return;
    }
    else if (gameMode=='survival' && green.data.selected==true) {
      if (ia_green_update_user(green.data)==false) return;
    }
    else if (gameMode=='survival' && green.data.selected==false) {
      ia_green_update_auto(green.data);
    }
    else if (gameMode=='qlearning' && green.data.selected==true) {
      ia_green_update_user(green.data);
    }
    else if (gameMode=='qlearning' && green.data.selected==false) {
      ia_green_update_auto(green.data);
    }
    greenPeopleUpdateTime+=time()-timeStart;

    timeStart=time();
    //Test collisions
    //This is legacy, but it pretty much get the contacted object (that was determined during the collision solving)
    //This means that an object can only touch one other object at the time (FIXME/TESTME ?)
    var ret=new function() {this.distance=(green.data.contact==null)?1:-1; this.nearestObject=green.data.contact;};
    //LEGACY var ret=getNearestObject(green.data);
    if (ret.distance<0) {
      //Collision with water -> drink it
      if (ret.nearestObject.type=='water') {
        if (ret.nearestObject.element.radius>0 && green.data.hunger-drinkFactor*deltaTime>0) green.data.hunger-=drinkFactor*deltaTime;
        if (gameMode=='qlearning') green.data.forward((100+200*Math.random())/deltaTime); //DEBUG qLearning
        ret.nearestObject.changeRadius(-5*deltaTime);
        //If the water spot gets really small, delete it (to avoid having many very-small water spots on the scene, because they can't be detected by the eye
        if (ret.nearestObject.element.radius<3) {
          listOfWaterSpots.remove(ret.nearestObject.waterSpotsContainer);
          colorDots.remove(ret.nearestObject.element.colorDotsContainer);
          green.data.contact=null;
          getMatrixCell(ret.nearestObject.element.x,ret.nearestObject.element.y).remove(ret.nearestObject.matrixContainer);
          ret.nearestObject.destroy();
        }
      }
      //Collision with red -> feed it and die (slowly :p)
      else if (ret.nearestObject.type=='red') {
        if (ret.nearestObject.hunger-eatFactor*deltaTime>0) {
          //By managing every collision from the 'green' update loop, we prevent any collision detection that does not involve a green element, but we significantly increase performance
          ret.nearestObject.hunger-=eatFactor*deltaTime;
          green.data.pain+=killFactor*deltaTime;
        }
        else ret.nearestObject.hunger=0;
      }
      //Collision with other green -> make babies
      else if (ret.nearestObject.type=='green') {
        var green1=green.data;
        var green2=ret.nearestObject;
        //TODO we could use this random factor to limit the baby-boom, but for the moment it is pretty good
        if (Math.random()<1 && green1.lust>0.9 && green2.lust>0.9) {
          var green3=new Green();
          //In theory, this big leap will be solved automatically, even if the baby (obviously overlaps the parent)
          //However, the fact that two elements are at the exact same position makes it difficult for the raycast to do its job, so we shift the baby of a few pixels
          //  (but maybe it was only true with the new broadphase algorithm ?)
          green3.element.move(green1.element.x+2,green1.element.y+2);
          green1.lust=0;
          green2.lust=0;
          green3.element.rotate(Math.random()*360);
          green3.hunger=0.5;
          ia_green_init(green3);
        }
      }
    }
    greenPeopleCollTime+=time()-timeStart;  //Benchmark

    //If the green elements is dying of hunger or pain
    if (green.data.getHunger()>1.0 || green.data.getPain()>1.0) {
      aliveGreens--;
      listOfGreenPeople.remove(green);
      //TODO create a queue of dead elements, set a timer to a 0.1s after the front element should be popped
      //colorDots.remove(green.data.element.colorDotsContainer);
      //getMatrixCell(green.data.element.x,green.data.element.y).remove(green.data.matrixContainer);
      green.data.die(); //TODO delete sprite
      if (green.data.selected) {
        if (gameMode=='survival') {
          stop();
        }
        else {
          if (listOfGreenPeople.first!=null) {
            listOfGreenPeople.first.data.selected=true;
            listOfGreenPeople.first.data.element.changeImage('green_selected.png');
          }
        }
      }
      green.data.decompositionDate=time()+decompositionTime;
      listOfCadavers.pushBack(green.data);
      if (listOfCadavers.length==1) {
        setTimeout(manageCadavers,decompositionTime*1000+100);
      }
      continue;
    }
  }
  
  timeStart=time();
  //Update all red spots
  for (var red=listOfRedPeople.first; red!=null; red=red.next) {
    red.data.update(deltaTime);
    ia_red_update(red.data);
  
    //If the red is full, then it will make a baby
    if (red.data.getHunger()<0.03) {
      var red3=new Red();
      red3.element.move(red.data.element.x+1,red.data.element.y+1);
      red.data.hunger+=0.6;
      red3.element.rotate(Math.random()*360);
      red3.hunger=0.6;
      ia_red_init(red3);
    }

    //The red is dying of hunger
    if (red.data.getHunger()>1) {
      aliveReds--;
      listOfRedPeople.remove(red);
      //colorDots.remove(red.data.element.colorDotsContainer);
      //getMatrixCell(red.data.element.x,red.data.element.y).remove(red.data.matrixContainer);
      red.data.die();
      red.data.decompositionDate=time()+decompositionTime;
      listOfCadavers.pushBack(red.data);
      if (listOfCadavers.length==1) {
        setTimeout(manageCadavers,decompositionTime*1000+100);
      }
      continue;
    }
  }
  var redPeopleUpdateTime=time()-timeStart;
  //console.log('greenPeopleUpdateTime='+Math.round(greenPeopleUpdateTime*1000)+' greepPeopleCollTime='+Math.round(greenPeopleCollTime*1000)+' redPeopleUpdateTime='+Math.round(redPeopleUpdateTime*1000)+' updateGodTime='+Math.round((time()-updateGodStart)*1000));

  /* Rain */
  if (rainFactor>=0) {
    if (Math.random()<rainFactor) {
      var w=new Water();
      w.element.move(Math.random()*width,Math.random()*height);
    }
  }
  else {
    if (Math.random()<-rainFactor) {
      if (listOfWaterSpots.length>2) {
        var el=listOfWaterSpots.first.data;
        listOfWaterSpots.remove(el.waterSpotsContainer);
        colorDots.remove(el.element.colorDotsContainer);
        getMatrixCell(el.element.x,el.element.y).remove(el.matrixContainer);
        el.destroy();
      }
    }
  }

  if (frame%10==0) {
    // document.getElementById('info').innerHTML=listOfGreenPeople.length+' greens, '+listOfRedPeople.length+' reds, '+Math.round(1.0/deltaTime)+' fps and '+Math.round(100*colorDots.length/(matrixW*matrixH))/100+' color dots per cell. We got an average q='+Math.round(100*qsum/qcount)/100+'. Performed '+gNarrowPhases+' narrow phases ('+gNarrowPhases_+' successful), plus '+gNarrowPhases2+' ('+gNarrowPhases2_+' successful) after finding a first match, which makes '+(gNarrowPhases+gNarrowPhases2)+' narrow phases in total.';
    document.getElementById('info').innerHTML=listOfGreenPeople.length+' greens, '+listOfRedPeople.length+' reds, '+Math.round(1.0/deltaTime)+' fps and '+Math.round(100*colorDots.length/(matrixW*matrixH))/100+' color dots per cell.';
    document.getElementById('debug2').value+=listOfGreenPeople.length+','+listOfRedPeople.length+','+Math.round(1.0/deltaTime)+','+Math.round(100*colorDots.length/(matrixW*matrixH))/100+','+Math.round(100*qsum/qcount)/100+'\n';
  }

  //Benchmark
  gNarrowPhases=0;
  gNarrowPhases2=0;
  gNarrowPhases_=0;
  gNarrowPhases2_=0;
}
