q=Array(8);
n=Array(8);

function buildQTable() {
  var w=(getMobile().any())?30:60;
  for (var i=0; i<3; i++) {
    for (var j=0; j<3; j++) {
      var el=document.getElementById('q'+i+''+j)
      var txt='';
      txt+='<table style="padding: 0px; margin: 0px;">';
      for (var k=0; k<9; k++) {
        txt+='<tr><td><div style="background-color:rgb(0,0,'+32*k+'); width: 20px; height: 5px;"></div></td><td><div style="background-color:rgb(0,0,0); width: '+w+'px; height: 5px;" id="q'+i+''+j+''+k+'"></div></td></tr>';
      }
      txt+='</table>';
      el.innerHTML=txt;
    }
  }

  for (var i=0; i<8; i++) {
    q[i]=new Array(3);
    n[i]=new Array(3);
    for (var j=0; j<3; j++) {
      q[i][j]=Array(3);
      n[i][j]=Array(3);
      for (var k=0; k<3; k++) {
        q[i][j][k]=0;//Math.random()*5;
        var color=min(max(q[i][j][k]/5,0),1);
        document.getElementById('q'+k+''+j+''+i).style.backgroundColor='rgb('+Math.floor(color*255)+',0,0)';
        n[i][j][k]=0;
      }
    }
  }
}

function State(vision,lastAction) {
  this.vision=vision;
  this.lastAction=lastAction;
}

function pickAction(currentState) {
  var sum=0;
  for (var i=0; i<3; i++)
    sum+=(q[currentState.vision][currentState.lastAction][i]+.01);
  var r=Math.random()*sum;
  var runningSum=0, a=0;
  for (var n=0; n<3; n++) {
    runningSum+=(q[currentState.vision][currentState.lastAction][n]+.01);
    if (r<runningSum) {
      a=n;
      break;
    }
  }
  return (a);
}

var delta=0.02;

function pickAction_max(currentState) {
  var nope=false;
  var maxAc=0;
  var maxQ=0;
  for (var n=0; n<3; n++) {
    var r=q[currentState.vision][currentState.lastAction][n];
    if (r==maxQ) nope=true;
    if (r>maxQ) {
      maxQ=r;
      maxAc=n;
    }
  }
  if (nope==true || Math.random()<delta) {
    console.log('nope');
    return (Math.floor(Math.random()*3));
  }
  return (maxAc);
}


var currentState=new State(0,0);
var lastHunger=0;

function min(a,b) {
  return (a<b)?a:b;
}

function max(a,b) {
  return (a>b)?a:b;
}

function iterate(obj) {
  var gamma=0.97;

  if (obj.age==0) lastHunger=obj.getHunger();
  hunger=obj.getHunger();

  //Pick an action
  var a=pickAction(currentState);
  
  //Apply the action
  if (a==0)  //Forward
    obj.forward(20*5);
  else if (a==1)  //Left
    obj.rotate(-50*5);
  else if (a==2)  //Right
    obj.rotate(50*5);

  //Compute new state
  var newState=new State(Math.floor(obj.getColor().b*7),a);

  //Compute payoff
  var payoff=(obj.getSmell().b>0)?1:0;
  qEau+=payoff;

  //Compute maximum Q for the next action
  var maxQ=0;
  for (var i=0; i<3; i++) {
    var cq=q[newState.vision][newState.lastAction][i];
    if (cq>maxQ) maxQ=cq;
  }

  q[currentState.vision][currentState.lastAction][a]=payoff+gamma*maxQ;
  var color=min(max((payoff+gamma*maxQ)/3,0),1);
  document.getElementById('q'+currentState.lastAction+''+a+''+currentState.vision).style.backgroundColor='rgb('+Math.floor(color*255)+',0,0)';

  currentState=newState;
  lastHunger=hunger;
}


function iterate_(obj) {
  var gamma=0.99;

  //Pick an action
  var a=pickAction(currentState);
  
  //Apply the action
  if (a==0)  //Forward
    obj.forward(20*5);
  else if (a==1)  //Left
    obj.rotate(-50*5);
  else if (a==2)  //Right
    obj.rotate(50*5);

  //Compute new state
  var newState=new State(Math.floor(obj.getColor().b*7),a);
  n[currentState.vision][currentState.lastAction][a]++;

  //Compute payoff
  var payoff=(obj.getSmell().b>0)?10:0;
  //console.log('payoff='+payoff);

  //Compute maximum Q for the next action
  var maxQ=0;
  for (var i=0; i<3; i++) {
    var cq=q[newState.vision][newState.lastAction][i];
    if (cq>maxQ) maxQ=cq;
  }

  var alpha=1/(obj.age/100+1);
  console.log('alpha='+alpha+' n[][][]='+n[currentState.vision][currentState.lastAction][a]);
  q[currentState.vision][currentState.lastAction][a]+=alpha*n[currentState.vision][currentState.lastAction][a]*(payoff+gamma*maxQ-q[currentState.vision][currentState.lastAction][a]);
//  console.log(payoff+gamma*maxQ);
  var color=min(max((payoff+gamma*maxQ)/5,0),1);
  document.getElementById('q'+currentState.lastAction+''+a+''+currentState.vision).style.backgroundColor='rgb('+Math.floor(color*255)+',0,0)';

  currentState=newState;
}
