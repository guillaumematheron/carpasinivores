function ia_green_init(green) {
  green.var1=0;
  green.var2=0;
  green.var3=0;
  green.var4=0;
  green.var5=0;
}

function ia_red_init(red) {
  red.direction=1;
  red.seesWater=false;
}

function ia_red_update(red) {
  if (red.getColor()==1 && !red.seesWater) {red.seesWater=true;}
  if (red.getColor()!=1 && red.seesWater) {red.seesWater=false; red.direction*=-1;}
  red.rotate(red.direction*10);
  red.forward(10);
}

var ia_green_update;

function ia_init() {
  eval("ia_green_update=function (green) {var me=green;"+document.getElementById("code").value+"}");
}
