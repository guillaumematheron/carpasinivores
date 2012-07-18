function ia_green_init(green) {
  green.var1=0;
  green.var2=0;
  green.var3=0;
  green.var4=0;
  green.var5=0;
}

//In survival mode, this program is used to control the 'automatic' green elements
function ia_green_update_auto(me) {
  //var1 : sees water
  //var2 : direction
  //var3 : last hunger
  if (me.age==0) {me.var1=false; me.var2=1; me.var3=me.getHunger();}
  if (me.getColor().b>0 && !me.var1) {me.var1=true;}
  if (me.getColor().b==0 && me.var1) {me.var1=false; me.var2*=-1;}
  me.rotate(me.var2*30);
  me.forward(20);
  me.var3=me.getHunger();
}

function ia_red_init(red) {
  red.direction=1;
  red.seesWater=false;
}

function ia_red_update(red) {
  if (red.getColor()==1 && !red.seesWater) {red.seesWater=true;}
  if (red.getColor()!=1 && red.seesWater) {red.seesWater=false; red.direction*=-1;}
  red.rotate(red.direction*10);
  red.forward(30);
}

var ia_green_update_user;
var userCode;

function ia_init() {
  userCode=document.getElementById('code').value;
  ia_green_update_user=function (me) {
    try {
      if (gameMode=='qlearning') iterate(me);
      else eval(userCode);
    }
    catch (err) {
      window.alert(err);
      stop();
      return (false);
    }
    return (true);
  }
}
