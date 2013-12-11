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
  var scoreEl = document.querySelector('.score');
  var score = parseInt(scoreEl.innerHTML, 10) + 1;
  moleContainer.className = 'moleContainer hit';
  moleContainer.removeEventListener('click', handleMoleClick, false);

  scoreEl.innerHTML = score < 10 ? '0' + score : score;

};
var playOuch = function(e) {
  if (! (e.animationName === 'hit')) return;

  var sfxhit = document.getElementById('sfxhit');
  if (window.chrome) {
    sfxhit.load();
    sfxhit.play();
  } else {
    sfxhit.play();
  }
};
var playLaugh = function(e) {
  if (! (e.animationName === 'laugh')) return;

  var sfxlaugh = document.getElementById('sfxlaugh');
  if (window.chrome) {
    sfxlaugh.load();
    sfxlaugh.play();
  } else {
    sfxlaugh.play();
  }
};

var popUpAMole = function() {

  var availableMoles = listAvailableMoles();
  if (availableMoles.length === 0) return;

  var randomMole = availableMoles[Math.floor(Math.random() * availableMoles.length)];
  var posScoreEl = document.querySelector('.scorePossible');

  //triggers animation
  randomMole.classList.add('riseFallLaugh');
  var maxScorePossible = parseInt(posScoreEl.innerHTML, 10) + 1;
  posScoreEl.innerHTML = maxScorePossible < 10 ? '0' + maxScorePossible : maxScorePossible;

  //event listener responds to mole getting whacked
  randomMole.addEventListener('click', handleMoleClick, false);
};

var countdown = function(initTime) {
    var counter = initTime || 20;
    var timer = document.querySelector('.timer');

    function decreaseTime() {
      if (counter === 0) stopGame();
      timer.innerHTML = counter;
      counter--;
    }
    function stopGame() {
      window.clearInterval(countdownInterval);
      window.clearInterval(moleInterval);
      window.setTimeout(issueEndOfGameMessage, 1500);  //slight delay in case of pending animations
    }
    var countdownInterval = window.setInterval(decreaseTime, 1000);
};
var issueEndOfGameMessage = function() {
  var messages = [
    "Eesh, you do know this is whack-a-mole and not miss-a-mole, right?",
    "Steady those hands cowboy and try again",
    "You are a mole master.  Prairie dogs everywhere fear you.",
    "Perfect Score!  Chuck Norris?  Is that you??"
  ];

  var score = parseInt(document.querySelector('.score').innerHTML, 10);
  var maxScore = parseInt(document.querySelector('.scorePossible').innerHTML, 10);
  var msgToUse = messages[Math.floor((score / maxScore) * (messages.length - 1))];
  var boardEl = document.querySelector('.board');

  var overlay = document.createElement('div');
  overlay.id = 'overlay';
  boardEl.appendChild(overlay);

  var msg = document.createElement('div');
  msg.id = 'msg';
  msg.innerHTML = msgToUse;
  overlay.appendChild(msg);

  var replayButton = document.createElement('div');
  replayButton.id = 'replay';
  replayButton.innerHTML = 'Play Again!';
  document.querySelector('#scoreboard').appendChild(replayButton);
  replayButton.addEventListener('click', restartGame, false);


};
var restartGame = function() {
  var overlayEl = document.querySelector('#overlay');
  var replayEl = document.querySelector('#replay');
  overlayEl.parentNode.removeChild(overlayEl);
  replayEl.parentNode.removeChild(replayEl);


  document.querySelector('.timer').innerHTML = '--';
  document.querySelector('.score').innerHTML = '00';
  document.querySelector('.scorePossible').innerHTML = '00';


  countdown(6);
  moleInterval = window.setInterval(popUpAMole, 1200);
};
//whenever a mole finishes a "fall" animation, remove all of its classes
//animation events will need to use prefixes for compatibility
document.addEventListener('webkitAnimationEnd', handleAnimationEnd, false);
document.addEventListener('animationend', handleAnimationEnd, false);

document.addEventListener('webkitAnimationStart', playOuch, false);
document.addEventListener('animationstart', playOuch, false);

//commented out because playing laughs constantly is too annoying
//could also have generalized this into one "PlaySound" fn, but this is whackamole
//document.addEventListener('webkitAnimationStart', playLaugh, false);
//document.addEventListener('animationstart', playLaugh, false);

var moleInterval = window.setInterval(popUpAMole, 1200);
countdown(5);

})();
