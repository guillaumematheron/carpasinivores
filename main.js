//Global counter for the frames elapsed since the game was started
var frame=0;
var starttime;

//Date when the last update was launched
var lastUpdateTime;

//Used by the raycast engine to keep a single list of all colored elements
var colorDots=new LinkedList();

function time() {
  return (new Date().getTime())/1000.0;
}

function stop() {
  stopped=true;
  document.getElementById('retry').style.display="";
  document.getElementById('stop').style.display="none";
}

//TODO Unused/obsolete ?
function getElementsByClass(searchClass, domNode, tagName) {
  if (domNode == null) domNode = document;
  if (tagName == null) tagName = '*';
  var el = new Array();
  var tags = domNode.getElementsByTagName(tagName);
  var tcl = " "+searchClass+" ";
  for(i=0,j=0; i<tags.length; i++) { 
    var test = " " + tags[i].className + " ";
    if (test.indexOf(tcl) != -1) 
      el[j++] = tags[i];
  } 
  return el;
} 

//Changes an element's position so that its image is centered on its coordonnates
function positionElement(element, x, y, w, h) {
  element.position(x+(w/2.0),y+(h/2.0));
}

//Entry point
function startClicked() {
  width=40*document.getElementById('width').value;
  height=40*document.getElementById('height').value;
  rainFactor=document.getElementById('rain').value;
  killFactor=document.getElementById('kill').value;
  eatFactor=document.getElementById('eat').value;
  drinkFactor=document.getElementById('drink').value;
  initialGreen=document.getElementById('green').value;
  initialRed=document.getElementById('red').value;
  initialWater=document.getElementById('water').value;
  g_init(width,height,30,Array('gray.png','red.png','water.png','green.png','eye.png'),init,updateWide);
}

function backtrace() {
  console.trace('Starting backtrace');
}

//Called by graphics abstraction layer on every frame
function updateWide() {
  if (stopped) return;
  deltaTime=time()-lastUpdateTime;
  lastUpdateTime=time();
  deltaTime*=1; //DEBUG Can be used to accelerate/slow down the game
  //Limit the 'visible' framerate to 10 so that the objects won't 'jump' too quickly when the framerate is very low
  if (deltaTime>0.1) deltaTime=0.1;
  frame++;
  //Update the game model
  updateGod(deltaTime);
}

//Called by the graphics abstraction layer when the resources are loaded
function init() {
  document.getElementById('stop').style.display="";

  //Init IA
  ia_init();

  //Hide code panel
  var e1=document.getElementById('code');
  var e2=document.getElementById('start')
  e1.parentNode.removeChild(e1);
  e2.parentNode.removeChild(e2);

  //Create initial population
  for (var i=0; i<initialWater; i++) {
    var w=new Water();
    w.element.move(Math.random()*width,Math.random()*height);
   // w.element.move(200,100);
  }
  for (var i=0; i<initialGreen; i++) {
    var e=new Green();
    e.element.move(Math.random()*width,Math.random()*height);
    e.element.rotate(Math.random()*360);
 //   e.element.move(200,200);
 //   e.element.rotate(5);
  }
  for (var i=0; i<initialRed; i++) {
    var r=new Red();
    r.element.move(Math.random()*width,Math.random()*height);
  }

  //Initialize game mechanics
  initGod();

  //Run updater once to ensure everything is going on properly
  lastUpdateTime=time();
  updateWide();
}

function dumpObjects() {
  debug ('Dumping objects');
  for (var dot=colorDots.first; dot!=null; dot=dot.next) {
    debug ('Color dot '+dot.x+' '+dot.y+' '+dot.color);
  }
  debug('');
}

//Describes an element (plain dot)
function Element(parent,w,h,image) {
  this.type='element';
  this.x=0;
  this.y=0;
  this.parent=parent;
  this.w=w;
  this.h=h;
  this.radius=this.w/2;
  this.image=image;
  //Creates the sprite using the graphics abstraction layer
  this.element=new GSprite(this.x,this.y,this.w,this.h,this.image);

  //Updates the position after the properties have been changed
  this.update=function() {
    if (this.x>=width) this.x-=width;
    if (this.x<0) this.x+=width;
    if (this.y>=height) this.y-=height;
    if (this.y<0) this.y+=height;
    this.element.position(this.x-this.w/2,this.y-this.h/2);
  }

  //Moves the element on screen (WILL avoid collisions, so avoid big leaps)
  this.move=function(x,y) {
    var bakx=this.x;
    var baky=this.y;
    safeMove(this,this.x+x,this.y+y);
    this.update();
    //We cannot just use this.x-x because this would cause trouble at the edges of the map
    //We need to do this after the update, so that the object is not out of the game area when its position is registered in the matrix
    //Update the objects matrix in case we changed our current cell
    objectPositionChanged(this.parent,bakx,baky,this.x,this.y);
  }

  this.destroy=function() {
    this.element.destroy();
  }

  this.setRadius=function(r) {
    var tmp=this.radius;
    this.radius=r;
    this.w=2*this.radius;
    this.h=2*this.radius;
    var f=this.radius/tmp;
    this.element.sprite.scale(f,f);
  }

  this.forward=function(distance) {
    var angle_rad=(this.rotation-90)*(Math.PI/180.0);
    var dx=Math.cos(angle_rad)*distance;
    var dy=Math.sin(angle_rad)*distance;
    this.move(dx,dy)
  } 
}

//Same as Element but this time the image has en 'eye' to indicate the direction
function EyedElement(parent,w,h,image) {
  this.type='element';
  this.rotation=0;
  this.x=0;
  this.y=0;
  this.w=w;
  this.h=h;
  this.parent=parent;
  this.radius=this.w/2;
  this.image=image;
  this.element=new GSprite(this.x,this.y,this.w,this.h,this.image)
  this.eye=new GSprite(this.x,this.y,9,9,"eye.png")
  this.update=function() {
    if (this.x>=width) this.x-=width;
    if (this.x<0) this.x+=width;
    if (this.y>=height) this.y-=height;
    if (this.y<0) this.y+=height;
    this.element.position(this.x-this.w/2,this.y-this.h/2);
    this.eye.position(this.element.x+this.eye.relx,this.element.y+this.eye.rely);
    return;
  }
  this.move=function(x,y) {
    var bakx=this.x;
    var baky=this.y;
    safeMove(this,this.x+x,this.y+y);
    this.update();
    //We cannot just use this.x-x because this would cause trouble at the edges of the map
    //We need to do this after the update, so that the object is not out of the game area when its position is registered in the matrix
    objectPositionChanged(this.parent,bakx,baky,this.x,this.y);
  }
  this.rotate=function(angle_deg) {
    this.rotation+=angle_deg;
    var angle_rad=(this.rotation-90)*(Math.PI/180.0);
    var c=5;  //Center of rotation
    var s=5;  //Radius of rotation
    var x=c+Math.cos(angle_rad)*s;
    var y=c+Math.sin(angle_rad)*s;
    this.eye.relx=x;
    this.eye.rely=y;
    this.eye.position(this.element.x+this.eye.relx,this.element.y+this.eye.rely);
  }
  this.forward=function(distance) {
    var angle_rad=(this.rotation-90)*(Math.PI/180.0);
    var dx=Math.cos(angle_rad)*distance;
    var dy=Math.sin(angle_rad)*distance;
    this.move(dx,dy);
  }
  this.changeImage=function(image) {
    this.image=image;
    this.element.changeImage(this.image);
  }
  this.destroy=function() {
    this.element.destroy();
  }
}

//All the motion member functions of Green and Red take values in pixels/sec or in degrees/sec
function Green() {
  this.element=new EyedElement(this,20,20,'green.png');
  this.type='green';
  //Speed at which moving is not tiring
  equilibrumSpeed=10;
  this.selected=true;
  //Updates somesthetic sensors such as hunder and fatigue
  this.update=function(deltaTime) {
    this.element.update();
    if (this.selected) {
      document.getElementById('fatigueSensor').innerHTML=Math.round(this.getFatigue()*1000)/1000;
      document.getElementById('hungerSensor').innerHTML=Math.round(this.getHunger()*1000)/1000;
      var color=this.getColor();
      document.getElementById('colorSensor').innerHTML='('+color.r+';'+color.g+';'+color.b+')';
      document.getElementById('colorSensorVisual').style.background='rgb('+Math.floor(color.r*255.0)+','+Math.floor(color.g*255.0)+','+Math.floor(color.b*255.0)+')';
      if (this.contact!=null) {
        var smell=new Color((this.contact.element.color==2)?1:0,(this.contact.element.color==1)?1:0,(this.contact.element.color==3)?1:0);
      }
      else var smell=new Color(0,0,0);
      document.getElementById('smellSensor').innerHTML='('+smell.r+';'+smell.g+';'+smell.b+')';
      document.getElementById('smellSensorVisual').style.background='rgb('+Math.floor(smell.r*255.0)+','+Math.floor(smell.g*255.0)+','+Math.floor(smell.b*255.0)+')';
    }
    if (this.cumulatedFatigueDistance<equilibrumSpeed*deltaTime) this.cumulatedFatigueDistance=0
    else this.cumulatedFatigueDistance-=equilibrumSpeed*deltaTime;

    this.hunger+=0.02*deltaTime;
  }
  this.forward=function (d) {
    this.element.forward(d*gDeltaTime);
    //Add the distance to the running count of distance
    this.cumulatedFatigueDistance+=d*deltaTime;
  }
  this.die=function() {
    this.element.changeImage('gray.png');
    this.element.eye.hide();
    this.color=4;
    this.type='cadaver';
  }
  this.decompose=function() {
    this.element.destroy();
  }
  this.element.color=1;

  //Add the object to the array of color dots (used by the raycast engine)
  //We store a reference to the container object of the Green inside the Green itself so we can
  //perform deletions with a O(1) performance.
  this.element.colorDotsContainer=colorDots.pushBack(this.element);
  this.hunger=0;
  this.cumulatedFatigueDistance=0;
  this.pain=0;
  this.lust=0;
  this.smell=0;
  this.rayCastCacheDate=-1;
  //Somesthesic sensors
  this.getHunger=function() {return (this.hunger);}
  this.getFatigue=function() {return Math.min(1.035-Math.exp((-this.cumulatedFatigueDistance+300*Math.log(1.035))/300.0),1);}
  this.getPain=function() {return (this.pain);}
  this.getLust=function() {return (this.lust);}
  this.smellAttenuation=function(distance) {
    //f(0)=1
    //f(40)=0.5
    //f(1000)=0
    return (10000/((distance+100)*(distance+100))-0.0093);
  }
  this.getSmell=function() {
    //TODO Do smellmap
  }
  this.getColor=function() {
    //We store a cached copy of what the green element 'sees'. The cache lifetime is one frame
    if (this.rayCastCacheDate!=frame) {
      this.rayCastCache=rayCast(this.element);
      this.rayCastCacheDate=frame;
    }
    return (this.rayCastCache);
  }
  this.rotate=function(r) {
    this.element.rotate(r*gDeltaTime);
  }

  //Register this green element in the table of green elements held by god.js and that is used to iterate over all green elements
  registerGreen(this);
}

//All the motion member functions of Green and Red take values in pixels/sec or in degrees/sec
//Very similar to class 'Green', refer to it for comments
function Red() {
  //Red objects have no fatigue and no lust
  this.element=new EyedElement(this,20,20,'red.png');
  this.type='red';
  this.hunger=0.2;
  this.smellAttenuation=function(distance) {
    //f(0)=1
    //f(40)=0.5
    //f(1000)=0
    return (10000/((distance+100)*(distance+100))-0.0093);
  }
  this.getSmell=function() {
    //TODO do smell map
  }
  this.getHunger=function() {return (this.hunger);}
  this.getColor=function() {return (rayCast(this.element));}
  this.update=function(deltaTime) {
    this.element.update();
    this.hunger+=0.05*deltaTime;
  }
  this.forward=function (d) {
    this.element.forward(d*gDeltaTime);
  }
  this.die=function() {
    this.element.changeImage('gray.png');
    this.element.eye.hide();
    this.color=4;
  }
  this.decompose=function() {
    this.element.destroy();
  }
  this.rotate=function(angle) {
    this.element.rotate(angle*gDeltaTime);
  }
  this.element.color=2;
  this.element.colorDotsContainer=colorDots.pushBack(this.element);
  registerRed(this);
}

function Water() {
  this.element=new Element(this,40,40,'water.png');
  this.type='water';
  this.update=function() {
    this.element.update();
  }
  this.changeRadius=function(dr) {
    if (this.element.radius<-dr) dr=-this.element.radius;
    this.element.setRadius(this.element.radius+dr);
  }
  this.destroy=function() {
    this.element.destroy();
  }
  this.element.color=3;

  //See comments in class 'Green'
  this.element.colorDotsContainer=colorDots.pushBack(this.element);
  registerWater(this);
}

//TODO Obsolete/unused ?
function debug(log) {
  document.getElementById('debug').innerHTML=log+'\n';
}

//This very high-frequency function computes the distance between a ray and a point (squared)
function distanceToRay2(rayOrigin, rayTarget, ray) {
  gm=new Vector();
  gm.x=rayTarget.x-rayOrigin.x;
  gm.y=rayTarget.y-rayOrigin.y;
  gm2=gm.x*gm.x+gm.y*gm.y;
  gm_ray=ray.x*gm.x+ray.y*gm.y;
  //TESTME
  if (gm_ray<0)  //Wrong direction
    return (999999);  //Infinity
  gm_ray2=gm_ray*gm_ray;
  ray2=ray.x*ray.x+ray.y*ray.y;
  r2=gm2-(gm_ray2/ray2);
  return (r2);
}

//Moves an object to a new position but makes it 'slide' away if it collides with another object
function safeMove(mobile,x,y) {
  //console.log('safeMove '+x+' '+y);
  var oldPosition=new Vector();
  oldPosition.x=mobile.x;
  oldPosition.y=mobile.y;
  mobile.x=x;
  mobile.y=y;
  mobile.parent.contact=null;

  ret=getNearestObject(mobile.parent);
  if (ret.distance<0) {
    if (ret.nearestObject.element.x==mobile.x && ret.nearestObject.element.y==mobile.y) return;
    //console.log('Found an object with intersection '+ret.distance+'. Its position is ('+ret.nearestObject.element.x+';'+ret.nearestObject.element.y+'). Our position is ('+x+';'+y+')');
    //The 'ghost' is colliding with something
    /*var m=new Vector(); //m for motion (normalized)
    m.x=x-oldPosition.x;
    m.y=y-oldPosition.y;
    m.normalize();
    var a=new Vector(); //Corresponds to the vector AB that goes from the current object to the other object
    a.x=ret.nearestObject.element.x-mobile.x;
    a.y=ret.nearestObject.element.y-mobile.y;
    var am=a.dot(m);
    var am2=am*am;
    var rt=mobile.radius+ret.nearestObject.element.radius;
    var rt2=rt*rt;
    var a2=a.dot(a);
    var delta=4*am2+4*(rt2-a2);
    var sqrdelta=Math.sqrt(delta);
    var k=(-2*am+sqrdelta)/2;
    //Test if k<0
    m.multiply(-k);
    mobile.x+=m.x;
    mobile.y+=m.y;*/

    var a=new Vector(); //Corresponds to the vector AB that goes from the current object to the other object
    a.x=ret.nearestObject.element.x-mobile.x;
    a.y=ret.nearestObject.element.y-mobile.y;
    a.normalize();
    a.multiply(ret.distance);
    mobile.x+=a.x;
    mobile.y+=a.y;

    mobile.parent.contact=ret.nearestObject;
  }
}

function Vector() {
  this.x=0;
  this.y=0;
  this.normalize=function() {
    var m=this.magnitude();
    this.x/=m;
    this.y/=m;
  }
  this.magnitude2=function() {
    return (this.x*this.x+this.y*this.y);
  }
  this.magnitude=function() {
    return Math.sqrt(this.magnitude2());
  }
  this.dot=function(vec) {
    return (this.x*vec.x+this.y*vec.y);
  }
  this.multiply=function(k) {
    this.x*=k;
    this.y*=k;
  }
}

function rad(deg) {
  return (deg*Math.PI/180.0);
}

function distance2(a,b) {
  return ((a.x-b.x)*(a.x-b.x)+(a.y-b.y)*(a.y-b.y));
}

function distance(a,b) {
  return (Math.sqrt(distance2(a,b)));
}

//Performs a narrow-phase raycast on a specific pair of objects
//TODO take as a parameter the shift to operate
function rayCastNarrowPhase(casterDot,receiverDot,ray) {
  var iterations=1;
  var minDist2=999999;
  move=function(x,y) {
    var bakx=receiverDot.x;
    var baky=receiverDot.y;
    receiverDot.x+=x;
    receiverDot.y+=y;
    var d2=distanceToRay2(casterDot,receiverDot,ray);
    receiverDot.x=bakx;
    receiverDot.y=baky;
    return (d2);
  }
  var minIX, minIY;
  var minPos=new function() {this.x=0; this.y=0;};
  //Shift the scene several time to be able to detect an object that is on the other side of an edge
  for (var ix=-iterations; ix<=iterations; ix++) {
    for (var iy=-iterations; iy<=iterations; iy++) {
      var d2=move(ix*width,iy*height);
      if (d2<minDist2) {
        minDist2=d2;
        minIX=ix;
        minIY=iy;
        minPos.x=receiverDot.x+width*ix;
        minPos.y=receiverDot.y+height*iy;
      }
    }
  }
  var dist2=minDist2;
  var isOnRay=false;
  var distanceOnRay2=999999;
  if (dist2<=receiverDot.radius*receiverDot.radius) {
    distanceOnRay2=distance2(casterDot,minPos);
    isOnRay=true;
  }
  else if (distance2(casterDot.element,receiverDot.element)<Math.pow(receiverDot.radius+casterDot.radius,2)) {
    distanceOnRay2=0;
    isOnRay=true;
  }

  return new function() {this.isOnRay=isOnRay; this.distance2=distanceOnRay2;};
}

//New broadphase algorithm for the raycast. Has worse performances than the old one so unused
function rayCastBroadPhase_new(caster, ray, x, y) {
  var miny;
  var maxy;

  var color=-1;
  var minZBuffer2=999999;

  if (ray.angle>360) ray.angle-=360;
  else if (ray.angle<0) ray.angle+=360;

  //Already tested : works fine
  if (ray.angle>315 || ray.angle<45) {
    swapx=-1; swapy=-1;
  }
  else if (ray.angle>=45 && ray.angle<135) {
    swapx=1; swapy=1;
  }
  else if (ray.angle>=135 && ray.angle<225) {
    swapx=1; swapy=-1;
  }
  else if (ray.angle>=225 && ray.angle<315) {
    swapx=-1; swapy=1;
  }
  else console.log(ray.angle);

  var alreadyChecked=Array();
  for (var i=-10; i<10; i++) {
    alreadyChecked[i]=Array();
    for (var j=-10; j<10; j++)
      alreadyChecked[i][j]=false;
  }
  
  var zBuffer2=999999;
  var drawLine=false;
  //TODO maxdist
  //TODO we could make this quicker by not exploring nearby cells that were already explored
  //TODO pass shift to narrow phase
  for (var nx=-1; nx<=5; nx++) {
    //We can't write directly to x because x and y may be swapped several times in the sub-loop
    var ox=nx*swapx;
    var max=(x<2)?2*nx+5:9;
    for (var j=0; j<=max; j++) {
      var ny=(j%2==0)?j/2:-(j+1)/2;
      if (swapy==-1) {
        var y=ox;
        var x=swapx*ny;
      }
      else {
        var y=ny;
        var x=ox;
      }
      //console.log('exploring cell at '+caster.x+' '+caster.y+' '+x+' '+y);
      var cell=getMatrixCellShifted(caster.x,caster.y,x,y);
      alreadyChecked[x][y]=true;
      if (cell.length!=0) {
        for (var dot=cell.first; dot!=null; dot=dot.next) {
          if (caster!=dot.data.element) {
            drawLine=true;
            //console.log('narrow');
            var ret=rayCastNarrowPhase(caster,dot.data.element,ray);
            qcount++;
            gNarrowPhases++;
            if (ret.isOnRay==true && ret.distance2<Math.pow(5*matrixCellSize,2)) {  //TODO (5*matricCellSize)^2 is constant, hard-code it
              gNarrowPhases_++;
              qsum++;
              zBuffer2=ret.distance2;
              color=dot.data.element.color;
              //Explore nearby cells too
              for (var x2=-1; x2<=1; x2++) {
                for (var y2=-1; y2<=1; y2++) {
                  if (!(x2==0 && y2==0)) {
                    var x3=x+x2;
                    var y3=y+y2;
                    if (alreadyChecked[x3][y3]==false) {
                      //TODO with swap : if (x3<=5 && x3>=-1 && y3>=-4 && y3<=4) {
                        var cell2=getMatrixCellShifted(caster.x,caster.y,x3,y3);
                        if (cell.length!=0) {
                          for (var dot2=cell.first; dot2!=null; dot2=dot2.next) {
                            gNarrowPhases2++;
                            var ret2=rayCastNarrowPhase(caster,dot2.data.element,ray);
                            if (ret2.isOnRay==true) {
                              gNarrowPhases2_++;
                              var zBufferTemp2=ret2.distance2;
                              if (zBufferTemp2<zBuffer2) {
                                zBuffer2=zBufferTemp2;
                                color=dot2.data.element.color;
                              }
                            }
                          }
                        }
                    //}
                    }
                  }
                }
              }
              return (color);
            }
          }
        }
      }
    }
  }
  return (color);
}
  


//Variable to get statistics about the performance of the broad phase
var qsum=0;
var qcount=0;
//TODO Solve two problems with this implementation : 
// UNSOLVABLE? -> 1- The definition of the broadphase mask makes it impossible to test the nearest cells first and then not test the farthest cells if something
//    was found before (we still need to test one more row in case a big circle would be inside. With a "X" division instead of a "+" division, 
//    we could easily iterate over these cells in that precise order. However I'm not sure it's worth it : I sould caculate that...
// 2- The broad phase does not tell the narrow phase how to shift the object's position in order to put it in front of the object (if the ray exits the screen
//    the broad phase will detect it but the narrow phase will have to 'guess' with 9 iterations where the object should be.
function rayCastBroadPhase(caster, ray) {
  //Current algorithm : the vision is limited to a quarter of plane and distance 5 in worst-case-scenario
  var miny;
  var maxy;

  var color=-1;
  minZBuffer2=999999;

  //Look in a cell (with a delta) and act if there is something there
  l=function(x,y,minZBuffer2,color,ray,caster,swapx,swapy) {
    var bakx=x, baky=y;
    x+=Math.floor(caster.x/matrixCellSize);
    y+=Math.floor(caster.y/matrixCellSize);
    if (x<0) x+=matrixW;
    if (y<0) y+=matrixH;
    if (x>=matrixW) x-=matrixW;
    if (y>=matrixH) y-=matrixH;
    var cell=getMatrixCell(x*matrixCellSize,y*matrixCellSize);
    for (dot=cell.first; dot!=null; dot=dot.next) {
      if (caster!=dot.data.element) { //FIXME
        gNarrowPhases++;
        var ret=rayCastNarrowPhase(caster,dot.data.element,ray);  //FIXME
        qcount++;
        if (ret.isOnRay==true) {
          gNarrowPhases_++;
          qsum++;
          if (ret.distance2<minZBuffer2) {
            minZBuffer2=ret.distance2;
            color=dot.data.element.color;
          }
        }
      }
    }
    return (new function() {this.minZBuffer2=minZBuffer2; this.color=color;});
  };

  if (ray.angle>360) ray.angle-=360;
  else if (ray.angle<0) ray.angle+=360;

  //Already tested : works fine
  if (ray.angle>=0 && ray.angle<90) {
    rotatedl=function(x,y,minZBuffer,color,ray,caster) {return l(-x,y,minZBuffer,color,ray,caster,-1,1);};
  }
  else if (ray.angle>=90 && ray.angle<180) {
    rotatedl=function(x,y,minZBuffer,color,ray,caster) {return l(-x,-y,minZBuffer,color,ray,caster,-1,-1);};
  }
  else if (ray.angle>=180 && ray.angle<270) {
    rotatedl=function(x,y,minZBuffer,color,ray,caster) {return l(x,-y,minZBuffer,color,ray,caster,1,-1);};
  }
  else if (ray.angle>=270 && ray.angle<360) {
    rotatedl=function(x,y,minZBuffer,color,ray,caster) {return l(x,y,minZBuffer,color,ray,caster,1,1);};
  }
  else console.log(ray.angle);

  for (var x=-5; x<=1; x++) {
    if (x==1) maxy=0; else maxy=1;
    if (x>=-3) miny=-5;
    else if (x==-4) miny=-4;
    else if (x==-5) miny=-3;
    for (var y=miny; y<=maxy; y++) {
      var ret=rotatedl(x,y,minZBuffer2,color,ray,caster);
      minZBuffer2=ret.minZBuffer2;
      color=ret.color;
    }
  }

  var maxDist=width;
  if (minZBuffer2<=maxDist*maxDist) //TODO hard-code maxDist^2
    return (new function() {this.color=color; this.distance2=minZBuffer2});
  else
    return (new function() {this.color=-1; this.distance2=999999});
}

function Color(r,g,b) {
  this.r=r;
  this.g=g;
  this.b=b;
  this.setSaturation=function(sat) {
    if (sat<0) sat=0;
    this.r*=sat;
    this.g*=sat;
    this.b*=sat;
  }
}

//Calculates the ray direction and calls the broadphase
function rayCast(casterDot) {
  var timeBefore=time();  //performance benchmark (DELETEME in final version)
  var ray=new Vector();
  //We add 270 each time because in our engine 0° means north but for trig functions, 0° means east
  ray.x=Math.cos(rad(casterDot.rotation+270));  //TODO tabulate these functions
  ray.y=Math.sin(rad(casterDot.rotation+270));
  //We also need to pass the angle to the raycast broadphase
  ray.angle=(casterDot.rotation)%360; //0=up, 90=left

  var ret=rayCastBroadPhase(casterDot,ray);
  var color=ret.color;
  var rgbColor=new Color((color==2)?1:0,(color==1)?1:0,(color==3)?1:0);

  rgbColor.setSaturation(1-Math.sqrt(ret.distance2)/200);

  return (rgbColor);
}
 
