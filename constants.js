//Not really constants, just globals in general

//var width=40*35;
//var height=40*18;
var width=40*15;
var height=40*10;
var stopped=false;  //Not a constant, but still a global
var gDeltaTime;  //Not a constant, but still a global
var score=0;
var qEau=0;
var gNarrowPhases;
var gNarrowPhases2;
var gNarrowPhases_;
var gNarrowPhases2_;

var gameMode='species';
var rainFactor=0.00005;
var killFactor=0.4;
var eatFactor=0.3;
var drinkFactor=0.3;
var initialGreen=20;
var initialRed=6;
var initialWater=35;
var hungerEvolution=0.02;
var lustEvolution=0.02;

var decompositionTime=5.0;
var phoneGap=true;  //True by, default, but will be set to false if the phonegap library is not found
