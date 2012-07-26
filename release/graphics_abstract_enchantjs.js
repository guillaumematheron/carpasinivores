enchant();

var globWidth, globHeight, globFps, globGame, globCanvas, game;

//inits a game
function g_init(w,h,fps,resourceFiles,onLoad,onFrame) {
  globWidth=w;
  globHeight=h;
  globFps=fps;
  globGame=new Game(globWidth, globHeight, document.getElementById('container'));
  game=globGame;  //Compatibility with canvas.enchant.js
  globGame.fps=globFps;

  for (i in resourceFiles) {
    globGame.preload(resourceFiles[i]);
  }

  globGame.onload=function() {
    globCanvas=new CanvasGroup(); //unused ?
    globGame.rootScene.addChild(globCanvas);

    //Draw scene contour
    var ball = new Sprite(w, h);
    var surface = new Surface(w,h);
    surface.context.beginPath();
    surface.context.strokeRect(0,0,w,h);
    surface.context.fill();
    ball.image = surface;
    globGame.rootScene.addChild(ball);

    //DEBUG draw cells
   /* var lineH = new Surface(w,1);
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
    }*/

    onLoad();
  }
  globGame.addEventListener('enterframe',onFrame);

  globGame.rootScene.addEventListener("touchstart",function() {});
  globGame.rootScene.addEventListener("touchend",function() {});
  globGame.rootScene.addEventListener("touchmove",function() {});

  globGame.start();
}

//A sprite is a positionnable image
function GSprite(x,y,w,h,image) {
  this.w=w;
  this.x=x;
  this.y=y;
  this.h=h;
  this.sprite=new Sprite(w,h);
  this.sprite.image=globGame.assets[image];
  this.sprite.x=x;
  this.sprite.y=y;
  this.move=function(dx,dy) {
    this.sprite.x+=dx;
    this.sprite.y+=dy;
    this.x=this.sprite.x;
    this.y=this.sprite.y;
  }
  this.position=function(x,y) {
    this.sprite.x=x;
    this.sprite.y=y;
    this.x=this.sprite.x;
    this.y=this.sprite.y;
  }
  this.changeImage=function(image) {
    this.sprite.image=globGame.assets[image]
  }
  this.hide=function() {
    this.sprite.visible=false;
  }
  this.destroy=function() {
    var parent=globGame.rootScene;
    parent.removeChild(this.sprite);
  }
  var parent=globGame.rootScene;
  parent.addChild(this.sprite);
}

//DEBUG, unstable but unused except for debug
function GLine(x1,y1,x2,y2) {
  var ctx=globCanvas.context;
  ctx.moveTo(x1,y1);
  ctx.lineTo(x2,y2);
  ctx.stroke();
}

//Can be used to run the game in high-freq, no-graphics mode
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

//We can use this to run the game in high-freq, no-graphics mode
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
    globGame.addEventListener('enterframe',onFrame);
    onLoad();
  }

  globGame.start();
}

