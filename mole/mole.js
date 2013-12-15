(function() {
  'use strict';

  //array containing all moles in game
  var moles = document.querySelectorAll('.moleContainer');
  var moleInterval;  //used to set and clear timer for moles
  var countdownInterval;  //used to manage the countdown timer
  var gameLevelTimings = [
    {
      moleInterval: 2000,
      lengthOfRound: 5,
      riseDuration: 1800,
      fallDuration: 500,
      outroMsg: 'Those moles were sick and weak.  Can you do better?'
    },
    {
      moleInterval: 1500,
      lengthOfRound: 7,
      riseDuration: 1500,
      fallDuration: 300,
      outroMsg: 'Do you show no mercy!?'
    },
    {
      moleInterval: 1100,
      lengthOfRound: 12,
      riseDuration: 1200,
      fallDuration: 200,
      outroMsg: 'Ok Tex, let\'s take this up a notch.'
    },
    {
      moleInterval: 750,
      lengthOfRound: 12,
      riseDuration: 800,
      fallDuration: 100
    }
  ];
  var gameVars = {
    currentLevel: null,
    maxLevel: gameLevelTimings.length - 1,
    currentScore: function() { return parseInt(document.querySelector('.score').innerHTML, 10)},
    maxScorePossible: function() { return parseInt(document.querySelector('.scorePossible').innerHTML, 10)},
    endGameMsgs: [
      'Eesh, you do know this is whack-a-mole and not miss-a-mole, right?',
      'Steady those hands cowboy and try again',
      'Prairie dogs everywhere fear you.  Perhaps with another try you can get that elusive perfect score..',
      'Perfect Score!  Chuck Norris?  Is that you??'
    ]
  };

  var createCSSforMoleAnimation = function() {
    var riseDuration = gameLevelTimings[gameVars.currentLevel].riseDuration + '';
    var fallDuration = gameLevelTimings[gameVars.currentLevel].fallDuration + '';

    var tmpl = 'rise {{riseDuration}}ms 0ms forwards, fall {{fallDuration}}ms {{riseDuration}}ms forwards';

    var text = tmpl.replace(/{{riseDuration}}/gi, riseDuration)
        .replace(/{{fallDuration}}/gi, fallDuration);

    return text;
  };
  var editCSSforMoleAnimation = function() {
    var newCSS = createCSSforMoleAnimation();
    var cssRules = document.styleSheets[0].cssRules; //I only have one stylesheet
    var selectorTextv1 = '.moleContainer.riseFallLaugh';
    var selectorTextv2 = '.riseFallLaugh.moleContainer';
    //locate the rule I'm looking for

    for (var i = 0; i < cssRules.length; i++) {
      var rule = cssRules[i];
      if ((typeof rule.selectorText === 'undefined') ||
          (rule.selectorText !== selectorTextv1 &&
          rule.selectorText !== selectorTextv2)) {
        continue;
      }

      if (rule.style.MozAnimation) {
        rule.style.MozAnimation = newCSS;
      }
      if (rule.style.webkitAnimation) {
        rule.style.webkitAnimation = newCSS;
      }
      if (rule.style.animation) {
        rule.style.animation = newCSS;
      }
    }
  };

  var listAvailableMoles = function() {
    var availableMoles = [];

    for (var i = 0; i < moles.length; i++) {
      var obj = moles[i];
      //only continue if mole does not have any animation classes attached
      // and is therefore at rest
      if (obj.className !== 'moleContainer') continue;
      availableMoles.push(obj);
    }
    return availableMoles;
  };

  var handleAnimationEnd = function(e) {
    if (e.animationName === 'fall') {
      e.target.className = 'moleContainer';
    }
    /*this will remove the click handler after the fall animation. The handler would have already been removed if the mole was hit in order to prevent people clicking the same mole multiple times.    We remove it again here too in the case of a miss.  We want to prevent endlessly registering click handlers as the game progresses.*/
    e.target.removeEventListener('click', handleMoleClick, false);

  };

  var handleMoleClick = function(e) {
    //exit unless the click is a mole (i.e. node is img.mole)
    if (! (e.target.nodeName === 'IMG' &&
        e.target.className === 'mole')) {
      return;
    }

    var moleContainer = e.target.parentNode;
    var scoreEl = document.querySelector('.score');
    var newScore = parseInt(scoreEl.innerHTML, 10) + 1;
    moleContainer.className = 'moleContainer hit';
    moleContainer.removeEventListener('click', handleMoleClick, false);

    scoreEl.innerHTML = newScore < 10 ? '0' + newScore : newScore;

  };
  var playOuch = function(e) {
    if (! (e.animationName === 'hit')) return;

    var sfxhit = document.getElementById('sfxhit');
    //apparently sounds don't work well cross browser.  Chrome only plays a sound once unless it is reloaded with another network request.
    if (window.chrome) {
      sfxhit.load();
      sfxhit.play();
    } else {
      sfxhit.play();
    }
  };
  //var playLaugh = function(e) {
  //  if (! (e.animationName === 'laugh')) return;
  //
  //  var sfxlaugh = document.getElementById('sfxlaugh');
  //
  //  //apparently sounds don't work well cross browser.  Chrome only plays a sound once unless it is reloaded with another network request.
  //  if (window.chrome) {
  //    sfxlaugh.load();
  //    sfxlaugh.play();
  //  } else {
  //    sfxlaugh.play();
  //  }
  //};

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

  var countdown = function(lengthOfRound) {
    var counter = lengthOfRound || 20;
    var timer = document.querySelector('.timer');

    function decreaseTime() {
      if (counter === 0) stopRound();
      timer.innerHTML = counter;
      counter--;
    }
    countdownInterval = window.setInterval(decreaseTime, 1000);
  };
  var stopRound = function() {
    window.clearInterval(countdownInterval);
    window.clearInterval(moleInterval);

    if (gameVars.currentLevel === gameVars.maxLevel ||
        (gameVars.currentScore() / gameVars.maxScorePossible()) <= (gameVars.currentLevel / gameVars.maxLevel)) {
      window.setTimeout(issueEndOfGameMessage, 2000);  //slight delay in case of ongoing animations
    } else {
      window.setTimeout(issueNextLevelMessage, 2000);  //slight delay in case of ongoing animations
    }
  };
  var issueNextLevelMessage = function() {
    createOverlay(gameLevelTimings[gameVars.currentLevel].outroMsg);
    createActionButton('I\'m ready!', newRoundEventHandler);
  };
  var issueEndOfGameMessage = function() {
    var score = gameVars.currentScore();    //parseInt(document.querySelector('.score').innerHTML, 10);
    var maxScore = gameVars.maxScorePossible();  //parseInt(document.querySelector('.scorePossible').innerHTML, 10);
    var msgToUse = gameVars.endGameMsgs[Math.floor((score / maxScore) * (gameVars.endGameMsgs.length - 1))];

    createOverlay(msgToUse);
    createActionButton('Play Again!', restartGame);
  };
  var createActionButton = function(buttonTxt, handlerFunc) {
    var button = document.createElement('div');
    button.id = 'replay';
    button.innerHTML = buttonTxt;
    document.querySelector('#scoreboard').appendChild(button);
    button.addEventListener('click', handlerFunc, false);
  };
  var resetScoreboard = function() {
    document.querySelector('.timer').innerHTML = '--';
    document.querySelector('.score').innerHTML = '00';
    document.querySelector('.scorePossible').innerHTML = '00';
  };
  var createOverlay = function(overlayMsg) {
    var boardEl = document.querySelector('.board');

    var overlay = document.createElement('div');
    overlay.id = 'overlay';
    boardEl.appendChild(overlay);

    var msg = document.createElement('div');
    msg.id = 'msg';
    msg.innerHTML = overlayMsg;
    overlay.appendChild(msg);
  };
  var removeOverlay = function() {
    //remove overlay if present
    var overlayEl = document.querySelector('#overlay');
    var replayEl = document.querySelector('#replay');
    overlayEl && overlayEl.parentNode.removeChild(overlayEl);
    replayEl && replayEl.parentNode.removeChild(replayEl);
  };
  var restartGame = function() {
    removeOverlay();
    resetScoreboard();
    newRound(0);
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

  var newRoundEventHandler = function(e) {
    removeOverlay();
    newRound(gameVars.currentLevel + 1);
  };
  var newRound = function(level) {
    if (typeof level !== 'number' ||
        level > gameLevelTimings.length) {
      return console.log('invalid level');
    }

    gameVars.currentLevel = level;  //0-indexed
    var speed = gameLevelTimings[level].moleInterval;
    var time = gameLevelTimings[level].lengthOfRound;
    editCSSforMoleAnimation();

    countdown(time);

    moleInterval = window.setInterval(popUpAMole, speed);
  };

  newRound(0);

})();

