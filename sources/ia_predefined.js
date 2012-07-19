function ia_green_init(green) {
  green.direction=1;
  green.seesWater=false;
  green.lastHunger=green.getHunger();
}

function ia_green_update(green) {
  if (green.getColor()==3 && !green.seesWater) {green.seesWater=true;}
  if (green.getColor()!=3 && green.seesWater) {green.seesWater=false; green.direction*=-1;}
  green.rotate(green.direction*5);
  if (green.getHunger()>=green.lastHunger) green.forward(6);
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

function ia_init() {
}
