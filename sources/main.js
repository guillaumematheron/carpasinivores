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

function getCookie(c_name) {
  var i,x,y,ARRcookies=document.cookie.split(";");
  for (i=0;i<ARRcookies.length;i++) {
    x=ARRcookies[i].substr(0,ARRcookies[i].indexOf("="));
    y=ARRcookies[i].substr(ARRcookies[i].indexOf("=")+1);
    x=x.replace(/^\s+|\s+$/g,"");
    if (x==c_name) {
      return unescape(y);
    }
  }
}

function setCookie(c_name,value,exdays) {
  var exdate=new Date();
  exdate.setDate(exdate.getDate() + exdays);
  var c_value=escape(value) + ((exdays==null) ? "" : "; expires="+exdate.toUTCString());
  document.cookie=c_name + "=" + c_value;
}

function stop() {
  stopped=true;
  document.getElementById('retry').style.display="";
  document.getElementById('restart').style.display='';
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

function getUrlParameters() {
  var ret={};
  var loc=String(window.location);
  var splitted=loc.split('#');
  console.log(splitted);
  if (splitted.length>1) {
    var args=splitted[splitted.length-1].split('&');
    for (i in args) {
      console.log(args[i].split('=')[0]+' -> '+args[i].split('=')[1]);
      ret[args[i].split('=')[0]]=args[i].split('=')[1];
    }
    return ret;
  }
  return null;
}

//Generates a cookie containing the paraters
//  disableForm -> disable the params form
//  hashParametersMode -> use '=' instead of ','
function getParamsCookie(disableForm,hashParametersMode) {
  var cookie=''
  var formNode=document.getElementById('paramsForm');
  var fields=formNode.getElementsByTagName('input');
  var fields2=formNode.getElementsByTagName('select');
  for (i in fields) {
    if (fields[i].id==undefined || fields[i].value=='' || fields[i].type!="text") continue;
    cookie+=fields[i].id+((hashParametersMode===true)?'=':',')+fields[i].value+'&';
    if (disableForm===true) fields[i].disabled=true;
  }
  for (i in fields2) {
    if (fields2[i].id==undefined) continue;
    cookie+=fields2[i].id+((hashParametersMode===true)?'=':',')+fields2[i].value+'&';
    if (disableForm===true) fields2[i].disabled=true;
  }
  return (cookie);
}

function showLink() {
  var link=String(window.location).split('#')[0]+'#'+getParamsCookie(false,true);
  window.alert('Use the following link to show your configuration to your friend/teacher : '+link);
}

function getMobile() {
  isMobile={
    Android: function() {
      return navigator.userAgent.match(/Android/i) ? true : false;
    },
    BlackBerry: function() {
      return navigator.userAgent.match(/BlackBerry/i) ? true : false;
    },
    iOS: function() {
      return navigator.userAgent.match(/iPhone|iPad|iPod/i) ? true : false;
    },
    Windows: function() {
      return navigator.userAgent.match(/IEMobile/i) ? true : false;
    },
    WebOS: function() {
      return navigator.userAgent.match(/webOS/i) ? true : false;
    },
    Symbian: function() {
      return navigator.userAgent.match(/SymbianOS/i) ? true : false;
    },
    any: function() {
      return (isMobile.Android() || isMobile.BlackBerry() || isMobile.iOS() || isMobile.Windows() || isMobile.WebOS() || isMobile.Symbian() );
    }
  };
  return (isMobile);
}

//Entry point
function loaded() {
  console.log('mobile : '+getMobile().any());
  var argParams='';
  var args=getUrlParameters();
  if (args!=null) { //TODO
    argParams=window.location.hash.substr(1);
    window.location='#';
  }
  else {
  }

  var code=getCookie('code');
  if (code!=null && code!='')
    document.getElementById('code').innerHTML=code;
  else
    resetCode();
  
  if (argParams=='')
    var cookie=getCookie('params');
  else
    var cookie=argParams.replace(/=/g,',');  //We cheat a little since the arg params have the same syntax as the cookie

  console.log(cookie);

  if (cookie!=null && cookie!='') {
    var fields=cookie.split('&');
    for (i in fields) {
      if (fields[i]=='') continue;
      if (fields[i].split(',')[0]==null || fields[i].split(',')[0]=='') continue;
      var el=document.getElementById(fields[i].split(',')[0]);
      if (el!=null)
        el.value=fields[i].split(',')[1];
    }
  }

  buildQTable();

  if (argParams!='' && argParams.search('autoStart')!=-1) {
    document.getElementById('ckoica').style.display='';
    startClicked();
  }

  upMode=function(element) {document.getElementById('code').disabled=(document.getElementById('gameMode').value=='qlearning');
    document.getElementById('qLHelp').style.display=(document.getElementById('gameMode').value==='qlearning')?'':'none';
  };
  document.getElementById('gameMode').onchange=upMode;
  upMode();

  if (getMobile().any()==true) {
    document.getElementById('code').cols='30';
    document.getElementById('shareConfig').style.display='none';
  }

  if (argParams.search('startInStoppedState')!=-1) skipToStoppedState();
}

function resetCode() {
  var defaultCode="//var1 : sees water";
  defaultCode+="\n//var2 : direction";
  defaultCode+="\n//var3 : last hunger";
  defaultCode+="\n\nif (me.getSmell().r>0) me.forward(500);";
  defaultCode+="\nif (me.getColor().r>0.6) {";
  defaultCode+="\n  me.rotate(-4000);";
  defaultCode+="\n}";
  defaultCode+="\nelse {";
  defaultCode+="\n  if (me.getSmell().b>0) {";
  defaultCode+="\n    me.forward(20);";
  defaultCode+="\n  }";
  defaultCode+="\n  else {";
  defaultCode+="\n    if (me.age==0) {me.var1=false; me.var2=1; me.var3=me.getHunger();}";
  defaultCode+="\n    if (me.getColor().b>0 && !me.var1) {me.var1=true;}";
  defaultCode+="\n    if (me.getColor().b==0 && me.var1) {";
  defaultCode+="\n     if (me.getColor().g>0) {";
  defaultCode+="\n     }";
  defaultCode+="\n     else me.var1=false; me.var2*=-1;}";
  defaultCode+="\n    me.rotate(me.var2*30);";
  defaultCode+="\n    me.forward(20);";
  defaultCode+="\n    me.var3=me.getHunger();";
  defaultCode+="\n  }";
  defaultCode+="\n}";
  document.getElementById('code').value=defaultCode;
}

function startClicked() {
  gameMode=document.getElementById('gameMode').value;
  width=40*document.getElementById('width').value;
  height=40*document.getElementById('height').value;
  rainFactor=document.getElementById('rain').value;
  killFactor=document.getElementById('kill').value;
  eatFactor=document.getElementById('eat').value;
  drinkFactor=document.getElementById('drink').value;
  initialGreen=document.getElementById('green').value;
  initialRed=document.getElementById('red').value;
  initialWater=document.getElementById('water').value;
  hungerEvolution=document.getElementById('hunger').value;
  lustEvolution=document.getElementById('lust').value;
  g_init(width,height,30,Array('green_selected.png','gray.png','red.png','water.png','green.png','eye.png'),init,updateWide);
  document.getElementById('stop').style.display="";
  document.getElementById('resetCode').style.display="none";
  document.getElementById('resetParams').style.display="none";


  var cookie=getParamsCookie(true,false);
  console.log('setting cookie '+cookie);
  setCookie('params',cookie,3650);
  setCookie('code',document.getElementById('code').value,3650);

  //Allocate matrix
  matrixW=width/matrixCellSize;
  matrixH=height/matrixCellSize;
  matrix=new Array(matrixW);
  for (var i=0; i<matrixW; i++) {
    matrix[i]=new Array(matrixH);
    for (var j=0; j<matrixH; j++) {
      matrix[i][j]=new LinkedList();
    }
  }

  document.getElementById('paramsForm').style.display="none";
  document.getElementById('paramsForm_').style.display="none";
  document.getElementById('controlPanel').style.display="";
  document.getElementById('controlPanel_').style.display="";
  if (gameMode=='qlearning') {
    document.getElementById('qtable').style.display='';
    document.getElementById('qtable_').style.display='';
  }
  else {
    if (gameMode=='csv') {
      document.getElementById('debug2').style.display="";
      document.getElementById('debug2_').style.display="";
    }
  }

  //Hide code panel
  var e1=document.getElementById('code');
  var e2=document.getElementById('start')
  e1.style.display='none';
  e2.style.display='none';
}

function skipToStoppedState() {
  gameMode=document.getElementById('gameMode').value;
  width=40*document.getElementById('width').value;
  height=40*document.getElementById('height').value;

  document.getElementById('paramsForm').style.display="none";
  document.getElementById('paramsForm_').style.display="none";
  document.getElementById('controlPanel').style.display="";
  document.getElementById('controlPanel_').style.display="";
  if (gameMode=='qlearning') {
    document.getElementById('qtable').style.display='';
    document.getElementById('qtable_').style.display='';
  }
  else {
    if (gameMode=='csv') {
      document.getElementById('debug2').style.display="";
      document.getElementById('debug2_').style.display="";
    }
  }

  //Hide code panel
  var e1=document.getElementById('code');
  var e2=document.getElementById('start')
  e1.style.display='none';
  e2.style.display='none';
  document.getElementById('restart').style.display='';
  document.getElementById('restart').value='Start';
  document.getElementById('retry').style.display="";

  g_init(width,height,30,Array(''),function(){},function(){});
  document.getElementById('resetCode').style.display="none";
  document.getElementById('resetParams').style.display="none";


  stopped=true;
  document.getElementById('stop').style.display="none";
}

function backtrace() {
  console.trace('Starting backtrace');
  console.log('Post mortem debugger says : '+postMortemDebug);
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

  if (frame==2) score=0;
  if (gameMode=='survival') score+=deltaTime;
  else if (gameMode=='csv') score+=deltaTime;
  else if (gameMode=='species') score+=deltaTime;
  else if (gameMode=='qlearning') score=(qEau*1000)/(frame+1);

  document.getElementById('score').innerHTML='Score : '+Math.round(score*100)/100;
  //Update the game model
  updateGod(deltaTime);
}

//Called by the graphics abstraction layer when the resources are loaded
function init() {
  //Init IA
  ia_init();

  //Create initial population
  for (var i=0; i<initialWater; i++) {
    var w=new Water();
    w.element.move(Math.random()*width,Math.random()*height);
  }
  for (var i=0; i<initialGreen; i++) {
    var e=new Green();
    e.element.move(Math.random()*width,Math.random()*height);
    e.element.rotate(Math.random()*360);
    if (i==0) {
      e.selected=true;
      e.element.changeImage('green_selected.png');
    }
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
    postMortemDebug='opc from ('+bakx+','+baky+') to ('+this.x+','+this.y+')';
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
  this.selected=false;
  //Updates somesthetic sensors such as hunder and fatigue
  this.update=function(deltaTime) {
    this.element.update();
    if (this.selected) {
      document.getElementById('fatigueSensor').innerHTML=Math.round(this.getFatigue()*1000)/1000;
      document.getElementById('hungerSensor').innerHTML=Math.round(this.getHunger()*1000)/1000;
      var color=this.getColor();
//      document.getElementById('colorSensor').innerHTML='('+color.r+';'+color.g+';'+color.b+')';
      document.getElementById('colorSensorVisual').style.background='rgb('+Math.floor(color.r*255.0)+','+Math.floor(color.g*255.0)+','+Math.floor(color.b*255.0)+')';
      var smell=this.getSmell();
//      document.getElementById('smellSensor').innerHTML='('+smell.r+';'+smell.g+';'+smell.b+')';
      document.getElementById('smellSensorVisual').style.background='rgb('+Math.floor(smell.r*255.0)+','+Math.floor(smell.g*255.0)+','+Math.floor(smell.b*255.0)+')';
      document.getElementById('painSensor').innerHTML=Math.round(this.getPain()*1000)/1000;
      document.getElementById('lustSensor').innerHTML=Math.round(this.getLust()*1000)/1000;
    }
    if (this.cumulatedFatigueDistance<equilibrumSpeed*deltaTime) this.cumulatedFatigueDistance=0
    else this.cumulatedFatigueDistance-=equilibrumSpeed*deltaTime;

    this.hunger+=hungerEvolution*deltaTime;
    this.pain-=0.01*deltaTime;
    if (this.pain<0) this.pain=0;
    this.lust+=lustEvolution*deltaTime;
    if (this.lust>1) this.lust=1;
    this.age++;
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
    this.element.color=4;
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
  this.age=-1;
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
    if (this.contact!=null) {
      var smell=new Color((this.contact.element.color==2)?1:0,(this.contact.element.color==1)?1:0,(this.contact.element.color==3)?1:0);
      if (this.contact.element.color==4) smell=new Color(1,1,1);
    }
    else var smell=new Color(0,0,0);
    return (smell);
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
    if (this.contact!=null) {
      var smell=new Color((this.contact.element.color==2)?1:0,(this.contact.element.color==1)?1:0,(this.contact.element.color==3)?1:0);
      if (this.contact.element.color==4) smell=new Color(1,1,1);
    }
    else var smell=new Color(0,0,0);
    return (smell);
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
function rayCastNarrowPhase(casterDot,receiverDot,ray,shiftx,shifty) {
  if (shiftx==undefined || shifty==undefined)
    var iterations=1;
  else
    var iterations=-1;
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
  if (iterations==-1) {
    var ix=shiftx;
    var iy=shifty;
    var d2=move(ix*width,iy*height);
    if (d2<minDist2) {
      minDist2=d2;
      minIX=ix;
      minIY=iy;
      minPos.x=receiverDot.x+width*ix;
      minPos.y=receiverDot.y+height*iy;
    }
  }
  else {
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
      //To store a potention shift
      var modVec=new Vector();
      var cell=getMatrixCellShifted(caster.x,caster.y,x,y,modVec);
      alreadyChecked[x][y]=true;
      if (cell.length!=0) {
        for (var dot=cell.first; dot!=null; dot=dot.next) {
          if (caster!=dot.data.element) {
            drawLine=true;
            //console.log('narrow');
            var ret=rayCastNarrowPhase(caster,dot.data.element,ray,modVec.x,modVec.y);  //TESTME tell how to shift
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
                        //To store a potention shift
                        var modVec=new Vector();
                        var cell2=getMatrixCellShifted(caster.x,caster.y,x3,y3,modVec);
                        if (cell.length!=0) {
                          for (var dot2=cell.first; dot2!=null; dot2=dot2.next) {
                            gNarrowPhases2++;
                            var ret2=rayCastNarrowPhase(caster,dot2.data.element,ray,modVec.x,modVec.y);
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
    var modVec=new Vector();
    if (x<0) {x+=matrixW; modVec.x-=1;}
    if (y<0) {y+=matrixH; modVec.y-=1;}
    if (x>=matrixW) {x-=matrixW; modVec.x+=1;}
    if (y>=matrixH) {y-=matrixH; modVec.y+=1;}
    //TODO see why matrixW is not correct
    //To store a potential shift
    var cell=getMatrixCell(x*matrixCellSize,y*matrixCellSize);
    for (dot=cell.first; dot!=null; dot=dot.next) {
      if (caster!=dot.data.element) { //FIXME
        gNarrowPhases++;
        var ret=rayCastNarrowPhase(caster,dot.data.element,ray,modVec.x,modVec.y);  //FIXME
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
  if (color==4) rgbColor=new Color(1,1,1);  //Wall or cadaver

  rgbColor.setSaturation(1-Math.sqrt(ret.distance2)/200);
  return (rgbColor);
}
 

