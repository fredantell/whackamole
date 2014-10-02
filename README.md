whackamole
==========

This game can be played at fredantell.github.io/whackamole/mole

I wrote this late 2013 and looking back there is quite a bit I would change.

A few of the issues I noticed while glancing the code:

The program at times queries the DOM for data and then writes back to it (namely score and timer).
It would be much better to move all game state to a single object and then use that within any function
to render the view.

It seems like I originally built reasonably small functions, but they reference and mutate outside objects constantly.
It's up to the programmer to keep in mind what all the moving pieces are.  It would be interesting to transition 
this to a more functional style that receives the current game state and computes the next game state.

Rendering is being handled by reaching into the DOM and using JS to edit the stylesheets.  It may have been easier
in the end to just use JS to handle the animations.  However, part of the learning exercise for me at the time was 
using CSS animations instead.