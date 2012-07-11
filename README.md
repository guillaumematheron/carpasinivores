carpasinivores
==============

Grain 3.0 : les carpasinivores

API
===

The current object is designated by the variable 'me'. You have five variables to use as the element's 'memory' : you can assign whatever you want to these variables (they are initialized at zero).

You can use the following functions on the variable 'me' to get status information : 
- me.getColor() -> Returns the color that the object sees. Use getColor().r, getColor().g, getColor().b to get individual color components (between 0 and 1)
- me.getHunger()
- me.getFatigue()
- me.getLust()
- me.getPain()
- me.getSmell() -> Returns a color, see me.getColor() for information about how to use it

You can use the following functions on the variable 'me' to act on the element : 
- me.forward(distance) -> Goes forward of the specified distance (in pixels/second)
- me.rotate(angle) -> Rotates to the right with the following angle (in degrees/seconds)

Note : the sensors are not updated during the frame, so you cannot perform a full rotation in just one frame and sample the color every 10° like this for instance : 

    for (var i=0; i<360; i+=10) {
        me.rotate(10);
        //This won't work : me.getColor() is not updated during the frame
        if (me.getColor().b>0) {
            //...
        }
    }
