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
