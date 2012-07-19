var globWidth, globHeight, globFps, globGame;
var gUpdateCallBack=function() {} //TODO
var gLastUpdated,gFps,gUpdate;

function Game(w,h) {
  this.w=w;
  this.h=h;
  this.fps=10;
  gFps=10;
  this.onload=function() {};
  this.updateCallBack=function() {};
  this.start=function() {
    this.onload();
    gLastUpdated=time();
    gUpdate();
  }

  gUpdate=function() {
    gUpdateCallBack();
    var updateTime=time()-gLastUpdated;
    console.log('time is '+time()+' lastUpdated='+gLastUpdated+' so updateTime='+updateTime);
    gLastUpdated=time();
    console.log("delta is "+((1/gFps)-updateTime)*1000);
    if (updateTime<1/gFps) {
      setTimeout(gUpdate,((1/gFps)-updateTime)*1000);
    } else {
      setTimeout(gUpdate,1);
    }
  }
  this.rootScene=new function() {};
  this.rootScene.addChild=new function() {};
}

function g_init(w,h,fps,resourceFiles,onLoad,onFrame) {
  //return (FakeGame(w,h,200,resourceFiles,onLoad,onFrame));
  globWidth=w;
  globHeight=h;
  globFps=fps;
  globGame=new Game(globWidth, globHeight);
  globGame.fps=globFps;
  gUpdateCallBack=function() {onFrame();};

  globGame.onload=function() {
    /*var ball = new Sprite(w, h);
    var surface = new Surface(w,h);
    surface.context.beginPath();
    surface.context.strokeRect(0,0,w,h);
    surface.context.fill();
    ball.image = surface;
    globGame.rootScene.addChild(ball);

    //DEBUG
    var lineH = new Surface(w,1);
    lineH.context.beginPath();
    lineH.context.strokeRect(0,0,w,1);
    lineH.context.fill();
    var lineV = new Surface(1,h);
    lineV.context.beginPath();
    lineV.context.strokeRect(0,0,1,h);
    lineV.context.fill();
    for (var i=40; i<h; i+=40) {
      var sprite=new Sprite(w,1);
      sprite.image=lineH;
      sprite.y=i;
      globGame.rootScene.addChild(sprite);
    }
    for (var i=40; i<w; i+=40) {
      var sprite=new Sprite(1,h);
      sprite.image=lineV;
      sprite.x=i;
      globGame.rootScene.addChild(sprite);
    }
*/
    onLoad();
  }
  //globGame.addEventListener('enterframe',onFrame);

  globGame.start();
}

function GSprite(x,y,w,h,image) {
//  return (new FakeSprite(x,y,w,h,image));
  this.w=w;
  this.x=x;
  this.y=y;
  this.h=h;
  this.sprite=document.createElement('div');
  this.sprite.style.position='absolute';
  this.sprite.style.left=this.x+'px';
  this.sprite.style.top=this.y+'px';
  this.sprite.style.width=this.w+'px';
  this.sprite.style.height=this.h+'px';
  this.sprite.style.background='url("'+image+'")';
  document.getElementById('panel').appendChild(this.sprite);
  this.move=function(dx,dy) {
    this.x+=dx;
    this.y+=dy;
    this.sprite.style.left=this.x+'px';
    this.sprite.style.top=this.y+'px';
  }
  this.position=function(x,y) {
    this.x=x;
    this.y=y;
    this.sprite.style.left=this.x+'px';
    this.sprite.style.top=this.y+'px';
  }
  this.changeImage=function(image) {
    this.sprite.style.background='url("'+image+'")';
  }
  this.hide=function() {
    this.sprite.visible=false;
  }
  this.sprite.scale=function() {}

  //DEBUG
  /*this.sprite.addEventListener('touchstart', function() {
    //globGame.popscene();
  });*/
}

function FakeSprite(x,y,w,h,image) {
  this.w=w;
  this.x=x;
  this.y=y;
  this.h=h;
  this.move=function(dx,dy) {
    this.x+=dx;
    this.y+=dy;
  }
  this.position=function(x,y) {
    this.x=x;
    this.y=y;
  }
  this.changeImage=function(image) {
  }
  this.hide=function() {
  }
}


function FakeGame(w,h,fps,resourceFiles,onLoad,onFrame) {
  globWidth=w;
  globHeight=h;
  globFps=fps;
  globGame=new Game(globWidth, globHeight);
  globGame.fps=globFps;

  for (i in resourceFiles) {
    globGame.preload(resourceFiles[i]);
  }

  globGame.onload=function() {
    onLoad();
  }
  globGame.addEventListener('enterframe',onFrame);

  globGame.start();
}

