# Carpasinivores

Grain 3.0 : [les carpasinivores](http://198.245.54.228/carpasinivores)

## Repository architecture

- `index.html`

    Redirects to `release/index.html`. Required because PhoneGap only
    pulls its app from the repo root.

- `config.xml` and `icon.png`

    Required by PhoneGap.

The git repository has 4 top-level folders : 

- `/sources`
  
    We didn't use 'src' because on blackberry devices this name is
    reserved.

    Contains the js, png, xcf and html sources of the simulator.

- `/doc`
  
    Contains md, xcf and png files (sources of the doc). The md files
    are dynamically converted to html by `tools/publish.sh`.

    `doc/headerHTML` and `doc/footerHTML` are app-(prep-)ended to
    generated HTML files.

- `/tools`
  
    Contains `publish.sh`.

- `/release`
  
    Contains the generated app. This must stay on GitHub because PhoneGap
    gets its sources directly from GitHub.

## API

The current object is designated by the variable 'me'. You have five
variables to use as the element's 'memory': you can assign whatever
you want to these variables (they are initialized at zero).

You can use the following functions on the variable 'me' to get status
information :

- `me.getColor()` -> Returns the color that the object sees. Use `getColor().r`, `getColor().g`, `getColor().b` to get individual color components (between 0 and 1)
- `me.getHunger()`
- `me.getFatigue()`
- `me.getLust()`
- `me.getPain()`
- `me.getSmell()` Returns a color, see `me.getColor()` for information about how to use it

You can use the following functions on the variable 'me' to act on the
element : 

- `me.forward(distance)` Goes forward of the specified distance (in pixels/second)
- `me.rotate(angle)` Rotates to the right with the following angle (in degrees/seconds)

Note : the sensors are not updated during the frame, so you cannot perform a full rotation in just one frame and sample the color every 10° like this for instance : 

```javascript
for (var i=0; i<360; i+=10) {
    me.rotate(10);
    //This won't work : me.getColor() is not updated during the frame
    if (me.getColor().b>0) {
        //...
    }
}
```

## Modes of operation


You have currently three modes of operation.

### Survival of the species

You write a program that rules the behaviour of all the green
elements. You aim is to ensure the species will survive.

### Survival of an individual

You write a program for one of the green elements (the one that has a
black border), and all the other green elements are 'bots'.
   
Your goal is to make sure your green element survives as long as
possible.

### Q-Learning

In this mode, any code you enter in the program area is ignored. All
the green elements are normal bots, but the one that has a black
border has a learning algorithm that allows him to evolve according to
what he experiences.
  
The basic idea behind Q-learning is that the agent has a *state*
which, in our case is the association of the level of blue the element
sees (0-7) and the last action the agent took. The agent has three
*actions* that are possible in each iteration : it can go forward,
rotate left or rotate right. This means that there are 8\*3=24
possible states. If we had to program manually an optimal behaviour
for this situation, we would have to select the best action for each
state. For instance, if we do not see any blue (color=0) and the last
action was rotate left, then the optimal action is to rotate right.
To know what is the best action for each state, the element uses a
Q-Table to store the *expected payoffs* for each action, and each
state. For instance, if we are in state S, the element will query the
Q-Table for the three state-action couples (S;forward), (S;left) and
(S;right). It will then select the one that has the *highest expected
payoff*.  Of course the content of the Q-Table is essential to the
learning process : the idea behind Q-Learning is to *fill in the table
while the element is experimenting* : at the beginning the table is
empty, so the element always makes random choices, but when the
element gets a payoff (touching water in our case) after performing
action A from state S, the cell (S;A) of the Q-Table is incremented of
one. Thus, the next time the element is in state S, it will be more
likely to pick action A.  However, how is the agent able to plan its
actions over several iterations ? Indeed, some actions may be good,
but not generate any immediate payoff. In our case, only the action
that immediately preceeds touching water has a payoff. This is why
even when no immediate payoff is received after performing (S;A), a
value Q-Table is added to the corresponding cell. *This value depends
on the maximum expected payoff the agent can get from the new state S'
in which it arrived.* For instance, the agent is able to learn that
any move that tends to bring him closer to the water (brighter color)
is a good move.


## Panels and HUDs

The page contains several panels that are used in the different game modes.

- The *code* panel lets you type your own program in 'survival of the
  species' and 'survival of an individual' modes. See the *API* for
  instructions on how to program your element(s).

- The *settings* panel lets you enter custom settings for your
  simulation. Please be careful when changing these settings, you
  could crash the simulator or even overload your computerif you get
  exponential growths.
  
    If you enter settings that show an interesting result, you can
    share your simulation with friends and/or teachers by pressing
    'Link to these settings'. If you entered your own code in the
    *code* panel, you will have to include this code as well.

- The *control* panel lets you observe the inputs of one of the
  elements (the one that has a black border).

- The *CSV log* panel contains a log of the game states, each ten
  iterations. After you stop the game, you can copy-paste this data to
  a csv file and open it with your favourite spreadsheet software to
  plot the evolution of the number of green and red elements. Note
  that this view does not appear in 'Q-Learning' mode because you
  typically observe very few elements in this mode.

- The *Q-Table* panel shows the current content of the Q-Table. Each
  row corresponds to a state (there are 24 states), and each column to
  an action (3 actions).

## Dev notes

- This application conflicts with Firefox extension [Disconnect](https://disconnect.me/).
