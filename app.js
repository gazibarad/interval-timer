// GLOBAL SCOPE VARIABLES
const workTimeContainer = document.getElementById("work-time");
const restTimeContainer = document.getElementById("rest-time");
const roundsLeftContainer = document.getElementById("rounds-left");
const fullTimeLeftContainer = document.getElementById("full-time-left");

// GETTING INPUT FIELDS FROM THE MENU
const inputWork = document.getElementById("work-input");
const inputRest = document.getElementById("rest-input");
const inputRounds = document.getElementById("rounds-left-input");

// FUNCTION FOR SETTING VALUES TO DEFAULT
const setValuesToDefault = () => {
  workTimeContainer.textContent = 20;
  restTimeContainer.textContent = 10;
  roundsLeftContainer.textContent = 3;

  // WC AND RC ARE USED TO SEPERATE THE VALUES AT THE START SO WE CAN RESET THE TIMERS AFTER EACH ROUND
  wc = parseInt(document.getElementById("work-time").innerText);
  rc = parseInt(document.getElementById("rest-time").innerText);

  // CALCULATE THE FULL TIME
  getFullTime();
};

// FUNCTION FOR CHECKING FOR INPUT AND DISPLAYING THEM ONSCREEN
const checkInputAndUpdateTimer = () => {
  // EMPTY STRING CHECK "!="
  if (
    inputWork.value !== "" &&
    inputRest.value !== "" &&
    inputRounds.value !== "" &&
    inputWork.value > 0 &&
    inputRest.value > 0 &&
    inputRounds.value > 0
  ) {
    // DISPLAY VALUES
    workTimeContainer.textContent = inputWork.value;
    restTimeContainer.textContent = inputRest.value;
    roundsLeftContainer.textContent = inputRounds.value;
    // WC AND RC ARE USED TO SEPERATE THE VALUES AT THE START SO WE CAN RESET THE TIMERS AFTER EACH ROUND
    wc = parseInt(document.getElementById("work-time").innerText);
    rc = parseInt(document.getElementById("rest-time").innerText);

    // ALERT SUCCESSFUL INPUT
    alertBoxSuccess();
    resetAllTimes();
  } else {
    // ALERT FOR NOT INPUTTING VALUES CORRECTLY AND SETTING THEM TO DEFAULT
    alertBoxFailure();
    setValuesToDefault();
  }
  // GET FULL TIME
  getFullTime();
};

// ALERT BOX DISPLAY
const alertBoxFailure = () => {
  const div = document.createElement("div");
  div.innerText = "Please set all the input values!";
  div.classList.add("alert");
  div.classList.add("failure");
  document.getElementById("menu-button").insertAdjacentElement("afterend", div);
  setTimeout(() => {
    div.remove();
  }, 3000);
};

const alertBoxSuccess = () => {
  const div = document.createElement("div");
  div.innerText = "The values have been set!";
  div.classList.add("alert");
  div.classList.add("success");
  document.getElementById("menu-button").insertAdjacentElement("afterend", div);
  setTimeout(() => {
    div.remove();
  }, 3000);
};

// GET FULL TIME FUNCTION
function getFullTime() {
  // GET FULL TIME
  const workTime = parseInt(workTimeContainer.textContent);
  const restTime = parseInt(restTimeContainer.textContent);
  const roundsLeft = parseInt(roundsLeftContainer.textContent);
  const fullTimeLeft = (workTime + restTime) * roundsLeft - restTime;
  // INSERT INTO THE DOM
  fullTimeLeftContainer.textContent = fullTimeLeft;
}

// LANDING EVENT LISTENER
window.addEventListener("DOMContentLoaded", setValuesToDefault);

//GETTING MENU BUTTONS AND ADDING EVENT LISTENERS
document.getElementById("menu-button").addEventListener("click", () => {
  document.querySelector(".tabata-container").setAttribute("id", "is-hidden");
  document.querySelector(".menu").removeAttribute("id");
});

document.getElementById("button-main").addEventListener("click", () => {
  document.querySelector(".menu").setAttribute("id", "is-hidden");
  document.querySelector(".tabata-container").removeAttribute("id");
  checkInputAndUpdateTimer();
});

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
let roundsw = false;

// SPLITTING TIMES AT THE START TO RESET THEM WHEN NEEDED
let c, rc, wc, roundsc, i, ri, wi;

// GLOBAL TIME WATCHER
let currTime;

// SOUNDS
let workSound, restSound, endSound;

// PLAY AUDIO
function playWorkSound() {
  workSound = new Audio("../sfx/tworings.mp3");
  workSound.play();
}
function playRestSound() {
  restSound = new Audio("../sfx/threerings.mp3");
  restSound.play();
}
function playEndSound() {
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

// SCREEN WAKE API
let wakeLock = null;
// WAKELOCK SWITCH
let wakesw = false;

// WAKELOCK LOGIC
async function acquireLock() {
  if (!"wakeLock" in navigator || wakesw === true) return;
  wakeLock = await navigator.wakeLock.request("screen");
  wakesw = true;
  wakeLock.addEventListener("release", () => {
    wakesw = false;
  });
}

// DECREMENT WORK TIME
function decrementWorkTime() {
  // SWITCH CHECK
  if (wsw === false) {
    // PLAYING SOUND
    playWorkSound();
    // SETTING THE CURRENT TIME TO WORK
    currTime = "work";
    // CALLING THE COLOR FLASH
    colorChanges("success", 400);
    // SWITCH FLIP
    wsw = true;
    // CALLING INTERVAL
    workTimeInterval();
    // CALLING WAKELOCK LOGIC
    acquireLock();
  }
}

// DECREMENT REST TIME
function decrementRestTime() {
  // CHECK FOR LAST ROUND OR FIRST
  if (roundsLeft > 1 || roundsLeft === undefined) {
    if (rsw === false) {
      rsw = true;
      playRestSound();
      colorChanges("failure", 400);
      currTime = "rest";
      restTimeInterval();
    }
  }
}

// DECREMENT ROUNDS
function decrementRounds() {
  if (!roundsw) {
    roundsLeft = parseInt(document.getElementById("rounds-left").innerText);
    roundsc = roundsLeft;
    console.log(`roundsc:${roundsc} roundsLeft:${roundsLeft}`);
    roundsw = true;
  }
  if (roundsLeft > 1) {
    roundsLeft--;
    document.getElementById("rounds-left").innerText = roundsLeft;
  } else {
    roundsw = true;
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
        // FLIPPING THE SWITCH
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
        playEndSound();
        colorChanges("failure", 1200);
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
  document
    .getElementById("menu-worktime-resttime-container")
    .classList.add(selector);
  setTimeout(() => {
    document
      .getElementById("menu-worktime-resttime-container")
      .classList.remove(selector);
  }, par);
}

const whichTimeCheck = () => {
  if (currTime === "work" || currTime === undefined) {
    decrementWorkTime();
  } else if (currTime === "rest") {
    decrementRestTime();
  }
};

// SETTING EVENT LISTENERS
startButton.addEventListener("click", decrementFullTime);
startButton.addEventListener("click", whichTimeCheck);
resetButton.addEventListener("click", resetAllTimes);
stopButton.addEventListener("click", stopAllTimes);
