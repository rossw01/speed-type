// API :: https://api.quotable.io/random?maxLength=50

const API = "https://api.quotable.io/random?maxLength=100&minLength=50";
const textElement = document.getElementById("quoteDisplay");
const inputElement = document.getElementById("textInput");

function fetchText() {
  return fetch(API)
    .then((response) => response.json())
    .then((fetchedData) => fetchedData.content);
}

// DONT SET THIS TO "KEYDOWN"
inputElement.addEventListener("input", (input) => {
  let textArray = textElement.querySelectorAll("span"); // Array of all spans (characters we parsed from string)
  let inputArray = inputElement.value.split("");

  let complete = true; // if this ever gets set to false alone the way, it never gets set back to true
  textArray.forEach((charSpan, index) => {
    let inputtedChar = inputArray[index];
    if (inputtedChar == null) {
      charSpan.classList.remove("correct");
      charSpan.classList.remove("typo");
      complete = false;
    } else if (inputtedChar == charSpan.innerText) {
      charSpan.classList.add("correct");
      charSpan.classList.remove("typo");
    } else if (inputtedChar != charSpan.innerText) {
      charSpan.classList.add("typo");
      charSpan.classList.remove("correct");
      complete = false;
    }
  });

  if (complete) {
    console.log("complete");
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
