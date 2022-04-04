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
  div.innerText =
    "Please set all the input values or the values will be set to default automatically.";
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
// ALERT BOX DISPLAY

// GET FULL TIME FUNCTION
function getFullTime() {
  // GET FULL TIME
  const workTime = parseInt(workTimeContainer.textContent);
  const restTime = parseInt(restTimeContainer.textContent);
  const roundsLeft = parseInt(roundsLeftContainer.textContent);
  const fullTimeLeft = (workTime + restTime) * roundsLeft;
  // INSERT INTO THE DOM
  fullTimeLeftContainer.textContent = fullTimeLeft;
}

// LANDING EVENT LISTENER
window.addEventListener("DOMContentLoaded", setValuesToDefault);
