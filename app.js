// API :: https://api.quotable.io/random?maxLength=50

const API = "https://api.quotable.io/random?maxLength=100&minLength=50";
const textElement = document.getElementById("quoteDisplay");

function fetchText() {
  return fetch(API)
    .then((response) => response.json())
    .then((fetchedData) => fetchedData.content);
}

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
