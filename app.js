// API :: https://api.quotable.io/random?maxLength=50

const API = "https://api.quotable.io/random?maxLength=100&minLength=50";

function fetchQuote() {
  return fetch(API)
    .then((response) => response.json())
    .then((fetched) => fetched.content);
}

// Prevents it from being promise call
async function getText() {
  let text = await fetchQuote();
  // Inner text allows you to avoid having to type out <p></p>, etc..
  document.getElementById("quoteDisplay").innerText = text;
  document.getElementById("quoteInput").value = "";
}

getText();
