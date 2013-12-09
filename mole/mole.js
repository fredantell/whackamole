/**
 * Created by FredAdmin on 12/8/13.
 */
(function() {
  'use strict';

//array containing all moles in game
var moles = document.querySelectorAll('.moleContainer');

var listAvailableMoles = function() {
  var availableMoles = [];

  for (var i = 0; i < moles.length; i++) {
    var obj = moles[i];
    //only continue if mole does not have any animation classes attached and is therefore at rest
    if (obj.className !== "moleContainer") continue;
    availableMoles.push(obj);
  }
  return availableMoles;
};

var handleAnimationEnd = function(e) {
  if (e.animationName === 'fall') {
    e.target.className = 'moleContainer';
  }
  /*this will remove the click handler after the fall animation this would have already been removed if the mole was hit    in order to prevent people clicking the same mole multiple times.    We remove it again here too in the case of a miss.  We want to    prevent endlessly registering click handlers as the game progresses.*/
  e.target.removeEventListener('click', handleMoleClick, false);

};

var handleMoleClick = function(e) {
  //exit unless the click is a mole (i.e. node is img.mole)
  if (! (e.target.nodeName === 'IMG' && e.target.className === 'mole')) return;

  var moleContainer = e.target.parentNode;
  moleContainer.className = 'moleContainer hit';
  moleContainer.removeEventListener('click', handleMoleClick, false);
};

var popUpAMole = function() {
  var availableMoles = listAvailableMoles();
  if (availableMoles.length === 0) return;

  var randomMole = availableMoles[Math.floor(Math.random() * availableMoles.length)];

  //triggers animation
  randomMole.classList.add('riseFallLaugh');

  //event listener responds to mole getting whacked
  randomMole.addEventListener('click', handleMoleClick, false);
};

//whenever a mole finishes a "fall" animation, remove all of its classes
//animation events will need to use prefixes for compatibility
document.addEventListener('webkitAnimationEnd', handleAnimationEnd, false);

window.setInterval(popUpAMole, 1200);

})();
