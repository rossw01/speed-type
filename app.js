const textElement = document.getElementById("quoteDisplay");
const inputElement = document.getElementById("textInput");
const timerElement = document.getElementById("timer");
const wpmElement = document.getElementById("wpm");
const minLengthElement = document.getElementById("minLengthInput");
const maxLengthElement = document.getElementById("maxLengthInput");
const languagesList = document.getElementById("langaugePicker");

// Populate languageList with countries from countries.js
for (let langID in countries) {
  let isSelected;
  if (langID == "en-GB") {
    // Sets default
    isSelected = "selected";
    //*Bad practise to use "isSelected" for non-bool var, but it makes the inner HTML insert easier to understand
  }
  languagesList.insertAdjacentHTML(
    "beforeend",
    `<option value="${langID}" ${isSelected}>${countries[langID]}</option>`
  );
}
function getTranslatedText(text, language) {
  return fetch(
    `https://api.mymemory.translated.net/get?q=${text}&langpair=en|${language}&de=asdok@gmail.com`
  )
    .then((response) => response.json())
    .then((data) => data.responseData.translatedText);
}

function fetchText(minLength, maxLength) {
  return fetch(
    `https://api.quotable.io/random?maxLength=${maxLength}&minLength=${minLength}`
  )
    .then((response) => response.json())
    .then((fetchedData) => fetchedData.content);
}

/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
/////////////////////////////////////////////  TIMER TIMER TIMER TIMER TIMER TIMER TIMER TIMER TIMER TIMER  /////////////////////////////////////////////
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

function startTimer() {
  timerElement.innerText = 0;
  startTime = new Date();
  let interval = setInterval(() => {
    timerElement.innerText = checkTime();
    if (testCompleted) {
      // Stop timer when test is done
      clearInterval(interval);
    }
    if (!timerStarted) {
      // If the timer has been reset
      clearInterval(interval); // Stop the timer
      timerElement.innerText = 0; // Reset timer to 0
    }
  }, 50);
}

let startTime;
function checkTime() {
  return (Math.floor(new Date() - startTime) / 1000).toFixed(2); // Math.floor to avoid decimal in ms to seconds conversion
}

/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
///////////////////////////////////////////////  WPM WPM WPM WPM WPM WPM WPM WPM WPM WPM WPM WPM WPM WPM WPM  ///////////////////////////////////////////
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

// To avoid WPM being displayed at >1000 in the first 0.2 seconds, we can make a delay utility function
// stackoverflow.com/a/47480429
// this function allows us to delay wpm being displayed until it's a reasonable number.

const delay = (ms) => new Promise((res) => setTimeout(res, ms));

var startWpm = async () => {
  wpmElement.innerText = 0;
  await delay(2000); // Start the timer after 1000ms
  let interval = setInterval(() => {
    wpmElement.innerText = checkWpm();
    if (testCompleted) {
      clearInterval(interval);
    }
  }, 50);
};

function checkWpm() {
  if (!timerStarted) {
    // For getting new text
    return 0;
  }
  return ((inputElement.value.split(" ").length / checkTime()) * 60).toFixed(0);
}

/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

// DONT SET THIS TO "KEYDOWN"
inputElement.addEventListener("input", (input) => {
  // Start timer if it's not already been started
  if (!timerStarted) {
    timerStarted = true;
    startTimer();

    wpmStarted = true;
    startWpm();
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
    new Audio("complete.mp3").play();

    console.log(
      `WPM: ${(inputElement.value.split(" ").length / checkTime()) * 60}`
    );
  }
});

/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

// Prevents it from being promise call
async function drawText(minLength, maxLength, selectedLanguage) {
  let textToType = await fetchText(minLength, maxLength);

  // If not english, translate
  if (selectedLanguage != "en-GB") {
    textToType = await getTranslatedText(textToType, selectedLanguage);
  }

  textElement.innerText = ""; // This must be here or else the size of the window changes on reset

  textToType.split("").forEach((char) => {
    let charSpan = document.createElement("span");
    charSpan.innerText = char;
    textElement.appendChild(charSpan);
  });
}

/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
/////////////////////////////////////////////////// NEW NEW NEW NEW NEW NEW NEW NEW NEW NEW NEW /////////////////////////////////////////////////////////
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

function checkParams(minLengthString, maxLengthString) {
  let minLength = Number(minLengthString);
  let maxLength = Number(maxLengthString);

  if (minLength > maxLength) {
    alert("The minimum length cannot be greater than the maximum length!");
    return false;
  } else if (minLength < 20) {
    alert(
      "Invalid minimum length - the minimum length cannot be less than 20 characters!"
    );
    return false;
  } else if (minLength > 350) {
    alert(
      "Invalid minimum length - the minimum length cannot be greater than 350 characters!"
    );
    return false;
  } else if (isNaN(minLength)) {
    alert("Invalid minimum length - Please only use numbers!");
    return false;
  } else if (isNaN(maxLength)) {
    alert("Invalid maximum length - Please only use numbers!");
    return false;
  }
  return true;
}

function startNew() {
  // Reset all values...
  // TODO: Fix WPM still being displayed when enter is pressed
  inputElement.value = "";
  wpmElement.value = "";
  timerStarted = false;
  testCompleted = false;
  wpmStarted = false;

  // Get length choices
  let minLength = minLengthElement.value;
  let maxLength = maxLengthElement.value;

  if (minLength.length == 0) {
    minLength = 50;
  }
  if (maxLength.length == 0) {
    maxLength = 100;
  }

  // Language choice
  selectedLanguage = languagesList.value;
  console.log(`Selected language: ${selectedLanguage}`);

  if (checkParams(minLength, maxLength)) {
    // TODO: Maybe make a check for parameters like min: 348, 349, which returns nothing
    drawText(minLength, maxLength, selectedLanguage);
    timerElement.innerText = "0.00";
  }
}

// Check for "Enter" hotkey for resetting test
document.addEventListener("keypress", (input) => {
  if (input.key == "Enter") {
    startNew();
  }
});

startNew();
