// API :: https://api.quotable.io/random?maxLength=50

const API = "https://api.quotable.io/random?maxLength=100&minLength=50";
const textElement = document.getElementById("quoteDisplay");
const inputElement = document.getElementById("textInput");
const timerElement = document.getElementById("timer");

let timerStarted = false;
let testCompleted = false;

function fetchText() {
  return fetch(API)
    .then((response) => response.json())
    .then((fetchedData) => fetchedData.content);
}

let startTime;
function startTimer() {
  timerElement.innerText = 0;
  startTime = new Date();
  let interval = setInterval(() => {
    timer.innerText = checkTime();
    if (testCompleted) {
      clearInterval(interval);
    }
  }, 50);
}

function drawFinalTime() {
  timerElement.innerText = checkTime();
}

function checkTime() {
  return Math.floor(new Date() - startTime) / 1000; // Math.floor to avoid decimal in ms to seconds conversion
}

// DONT SET THIS TO "KEYDOWN"
inputElement.addEventListener("input", (input) => {
  if (!timerStarted) {
    timerStarted = true;
    startTimer();
  }
  let textArray = textElement.querySelectorAll("span"); // Array of all spans (characters we parsed from string)
  let inputArray = inputElement.value.split("");

  let inputMatchesText = true; // if this ever gets set to false alone the way, it never gets set back to true
  textArray.forEach((charSpan, index) => {
    let inputtedChar = inputArray[index];
    if (inputtedChar == null) {
      charSpan.classList.remove("correct");
      charSpan.classList.remove("typo");
      if (charSpan.innerText == "█") {
        charSpan.innerText = " ";
      }
      inputMatchesText = false;
    } else if (inputtedChar == charSpan.innerText) {
      if (charSpan.innerText == "█") {
        charSpan.innerText = " ";
      }
      charSpan.classList.add("correct");
      charSpan.classList.remove("typo");
    } else if (inputtedChar != charSpan.innerText) {
      if (charSpan.innerText == " ") {
        charSpan.innerText = "█";
      }
      charSpan.classList.add("typo");
      charSpan.classList.remove("correct");
      inputMatchesText = false;
    }
  });

  if (inputMatchesText) {
    testCompleted = true;
    drawFinalTime();
    new Audio("complete.mp3").play();
    console.log(
      `WPM: ${(inputElement.value.split(" ").length / checkTime()) * 60}`
    );
  }
});

// Prevents it from being promise call
async function drawText() {
  let textToType = await fetchText();
  textElement.innerText = "";

  textToType.split("").forEach((char) => {
    let charSpan = document.createElement("span");
    charSpan.innerText = char;
    textElement.appendChild(charSpan);
  });
}

drawText();
