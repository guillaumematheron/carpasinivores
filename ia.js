function ia_green_init(green) {
  green.direction=1;
  green.seesWater=false;
  green.lastHunger=green.getHunger();
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
  eval("ia_green_update=function (green) {"+document.getElementById("code").value+"}");
}
