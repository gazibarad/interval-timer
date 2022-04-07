// GETTING CONTROL BUTTONS
const startButton = document.getElementById("start");
const resetButton = document.getElementById("reset");
const stopButton = document.getElementById("stop");

// DEFINING INTERVALS GLOBALLY
let fullInterval;
let workInterval;
let restInterval;
let roundsLeft;

// EACH TIMER HAS A SWITCH
let fsw = false;
let wsw = false;
let rsw = false;

// SPLITTING TIMES AT THE START TO RESET THEM WHEN NEEDED
let c, rc, wc, roundsc, i, ri, wi;

// GLOBAL TIME WATCHER
let currTime;

// SOUNDS
let workSound, restSound, endSound;

// PLAY AUDIO
function playWork() {
  workSound = new Audio("../sfx/tworings.mp3");
  workSound.play();
}
function playRest() {
  restSound = new Audio("../sfx/threerings.mp3");
  restSound.play();
}

function playEnd() {
  endSound = new Audio("../sfx/oneRing.mp3");
  endSound.play();
}

// DECREMENT FULL TIME
function decrementFullTime() {
  if (fsw === false) {
    fsw = true;
    fullTimeInterval();
  }
}

// DECREMENT WORK TIME
function decrementWorkTime() {
  // SWITCH CHECK
  if (wsw === false) {
    // PLAYING SOUND
    playWork();
    // SETTING THE CURRENT TIME TO WORK
    currTime = "work";
    // CALLING THE COLOR FLASH
    colorChanges("success", 400);
    // SWITCH FLIP
    wsw = true;
    // CALLING INTERVAL
    workTimeInterval();
  }
}

// DECREMENT REST TIME
function decrementRestTime() {
  // CHECK FOR LAST ROUND OR FIRST
  if (roundsLeft > 1 || roundsLeft === undefined) {
    playRest();
    colorChanges("failure", 400);
    currTime = "rest";
    if (rsw === false) {
      rsw = true;
      restTimeInterval();
    }
  } else {
    // SKIP REST IN CASE OF LAST ROUND
    playEnd();
    colorChanges("failure", 1200);
    resetAllTimes();
  }
}

// DECREMENT ROUNDS
function decrementRounds() {
  roundsLeft = parseInt(document.getElementById("rounds-left").innerText);
  roundsc = roundsLeft;
  if (roundsLeft != 1) {
    roundsLeft--;
    document.getElementById("rounds-left").innerText = roundsLeft;
  } else {
    roundsLeft = roundsc;
    document.getElementById("rounds-left").innerText = roundsc;
  }
}

// WORK TIME INTERVAL
function workTimeInterval() {
  // SETTING INTERVAL
  workInterval = setInterval(() => {
    // CHECKING FOR FIRST CLICK
    if (typeof wi === "undefined") {
      // SPLITTING VALUE
      wi = wc;
    } else {
      // CHECKING IF THE TIMER IS 0
      if (wi > 1) {
        // DECREMENT TIME BY 1
        wi--;
        document.getElementById("work-time").innerText = wi;
      } else {
        // IF LESS THAN 1 CLEAR INTERVAL
        clearInterval(workInterval);
        // RESETTING DISPLAY
        document.getElementById("work-time").innerText = wc;
        // RESETTING TO SPLIT VALUE
        wi = wc;
        // FLIPPERINO
        wsw = false;
        // START REST TIME TIMER
        decrementRestTime();
      }
    }
  }, 1000);
}

function restTimeInterval() {
  restInterval = setInterval(() => {
    if (typeof ri === "undefined") {
      ri = rc;
    } else {
      if (ri > 1) {
        ri--;
        document.getElementById("rest-time").innerText = ri;
      } else {
        clearInterval(restInterval);
        document.getElementById("rest-time").innerText = rc;
        ri = rc;
        rsw = false;
        decrementRounds();
        decrementWorkTime();
      }
    }
  }, 1000);
}

function fullTimeInterval() {
  c = parseInt(document.getElementById("full-time-left").innerText);

  fullInterval = setInterval(() => {
    if (typeof i === "undefined") {
      i = parseInt(document.getElementById("full-time-left").innerText);
    } else {
      if (i > 0) {
        document.getElementById("full-time-left").innerText = i;
        i--;
      } else {
        // WE CHECK FULL TIME TO END THE CYCLE
        resetAllTimes();
      }
    }
  }, 1000);
}

// RESETTING ALL THE MOVING PARTS
function resetAllTimes() {
  if (i === undefined || c === undefined) {
    return;
  } else {
    //FULL TIME
    clearInterval(fullInterval);
    document.getElementById("full-time-left").innerText = c;
    i = c;
    fsw = false;
    //WORK TIME
    clearInterval(workInterval);
    document.getElementById("work-time").innerText = wc;
    wi = wc;
    wsw = false;
    //REST TIME
    if (rc === undefined || ri === undefined) {
      rsw = false;
    } else {
      clearInterval(restInterval);
      document.getElementById("rest-time").innerText = rc;
      ri = rc;
      rsw = false;
    }
    // ROUNDS
    if (roundsc === undefined) {
      return;
    } else {
      roundsLeft = roundsc;
      document.getElementById("rounds-left").innerText = roundsc;
    }
  }
}

// STOP ALL TIMES
function stopAllTimes() {
  if (i === undefined || c === undefined) {
    return;
  } else {
    //FULL TIME
    clearInterval(fullInterval);
    fsw = false;
    //WORK TIME
    clearInterval(workInterval);
    wsw = false;
    //REST TIME
    if (rc === undefined || ri === undefined) {
      rsw = false;
    } else {
      clearInterval(restInterval);
      rsw = false;
    }
  }
}

// COLOR CHANGE FUNCTION
function colorChanges(selector, par) {
  document.querySelector("body").classList.add(selector);
  setTimeout(() => {
    document.querySelector("body").classList.remove(selector);
  }, par);
}

// SETTING EVENT LISTENERS
startButton.addEventListener("click", decrementFullTime);
startButton.addEventListener("click", () => {
  // CHECKING IF THE TIMER WAS STOPPED ON WORK OR REST TIME
  if (currTime === "work" || currTime === undefined) {
    decrementWorkTime();
  } else if (currTime === "rest") {
    decrementRestTime();
  }
});
resetButton.addEventListener("click", resetAllTimes);
stopButton.addEventListener("click", stopAllTimes);
// SETTING EVENT LISTENERS
