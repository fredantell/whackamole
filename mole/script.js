/*What does my script need to do?
 Randomly pop up moles
 only if they are at rest and ready to pop up
 When a mole pops up
 Check to see if it gets clicked
 If Yes, then
 play hit animation and
 send mole down
 increase score
 If No, then
 play laugh and
 send mole down
 Set Timings
 How fast does a mole rise?
 How long does a mole stay at top?
 How fast does a mole fall?
 When should laugh animation start?
 How long should timings be for hit animation?



 */

var timings = {
  moleRise: 2000,
  moleTop: 1000,
  moleFall: 2000,
  animLaughDur: 500,
  animLaughStart: this.moleFall - this.animLaughDur,
  animHitDur: 200,
  moleFrequency: 500
};
var allMoles = document.querySelectorAll('.moleContainer');

function moleRise(moleEl) {
  moleEl.style.webkitAnimation = 'rise ' + timings.moleRise + 'ms 0ms forwards';
  moleEl.classList.add('rise');
  startDetectingHits(moleEl);
  window.setTimeout(function() {
    if (moleEl.className.indexOf('hit') !== -1) return;
    moleEl.classList.remove('rise');
    moleFall(moleEl);
  }, timings.moleRise);

}
function moleFall(moleEl) {
  moleEl.style.webkitAnimation = 'fall ' + timings.moleFall + 'ms 0ms forwards';
  moleEl.classList.add('fall');

  window.setTimeout(function() {
    if (moleEl.className.indexOf('hit') !== -1) return;
    moleLaugh(moleEl);
  }, timings.animLaughStart);
  window.setTimeout(function() {
    moleEl.classList.remove('fall');
  }, timings.moleFall);

}
function moleHit(moleEl) {
  moleEl.style.webkitAnimation = 'rise 50ms 0ms forwards, fall 100ms 50ms forwards';
  moleEl.firstElementChild.style.webkitAnimation = 'hit 150ms 0ms steps(4) 2 alternate';
  moleEl.classList.add('hit');
}
function moleLaugh(moleEl) {
  moleEl.classList.add('laugh');
  window.setTimeout(function() {
    moleEl.classList.remove('laugh');
  }, timings.animLaughDur);
}
function clearMoleClasses(moleEl) {
  moleEl.className = "moleContainer";
}

function animateRandomMole() {
  var availableMoles = [];

  allMoles.forEach(function(mole) {
    if (mole.className !== "moleContainer") return;
    availableMoles.push(mole);
  });

  var randomMole = availableMoles[Math.floor(Math.random() * availableMoles.length)];
  moleRise(randomMole);
}

var startDetectingHits = function(moleEl) {
  var counter = 0;
  function handleHit(e) {
    var moleContEl = e.target.parentElement;
    if (moleContEl.classList.toString().indexOf('hit') !== -1) return; //exit if the mole was just hit
    console.log('score', ++counter);
    moleContEl.classList.add('hit');
    moleContEl.classList.remove('rise');

    window.setTimeout(function() {
      moleContEl.classList.remove('hit');
      moleContEl.removeEventListener('click', startDetectingHits);
    }, timings.animHitDur);
  }
  moleEl.addEventListener('click', handleHit, false);
};

var popUpAMole = function() {
//take the moles that are not currently being animated
};

//  function init(speed) {
//    var moles = [moleC1, moleC2, moleC3];
//    moles.forEach(function(mole) {
//      startDetectingHits(mole);
//    });
//
//  }
//  init();



var peek = function(moleEl) {
  moleEl.classList.add('exposed');
  window.setTimeout(function() {
    if (moleEl.classList.toString().indexOf('hit') === -1) {
      laugh(moleEl);
    }
    moleEl.classList.remove('exposed');
  }, 750);
};
var hide = function(moleEl) {
  moleEl.classList.add('hidden');
  window.setTimeout(function() {
    moleEl.classList.remove('hidden');
  }, 500);
};

