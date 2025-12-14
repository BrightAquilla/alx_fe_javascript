/*********************************
 * DOM ELEMENTS
 *********************************/
const quoteDisplay = document.getElementById("quoteDisplay");
const newQuoteButton = document.getElementById("newQuote");

/*********************************
 * UI NOTIFICATION ELEMENT
 *********************************/
const notification = document.createElement("div");
notification.style.marginTop = "10px";
notification.style.color = "green";
document.body.appendChild(notification);

function notify(message) {
  notification.textContent = message;
  setTimeout(() => {
    notification.textContent = "";
  }, 3000);
}

/*********************************
 * LOCAL STORAGE
 *********************************/
let localQuotes = JSON.parse(localStorage.getItem("quotes")) || [];

/*********************************
 * FETCH FROM MOCK API (REQUIRED)
 *********************************/
async function fetchQuotesFromServer() {
  const response = await fetch("https://jsonplaceholder.typicode.com/posts");
  const data = await response.json(); // REQUIRED .json()

  // Convert posts to quote objects
  return data.slice(0, 5).map(post => ({
    id: post.id,
    text: post.title,
    category: "Mock API",
    updatedAt: Date.now()
  }));
}

/*********************************
 * POST TO MOCK API (REQUIRED)
 *********************************/
async function postQuoteToServer(quote) {
  const response = await fetch(
    "https://jsonplaceholder.typicode.com/posts",
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify(quote)
    }
  );

  const data = await response.json();

  return {
    id: data.id || Date.now(),
    text: quote.text,
    category: quote.category,
    updatedAt: Date.now()
  };
}

/*********************************
 * DISPLAY RANDOM QUOTE
 *********************************/
function showRandomQuote() {
  if (localQuotes.length === 0) {
    quoteDisplay.textContent = "No quotes available.";
    return;
  }

  const randomQuote =
    localQuotes[Math.floor(Math.random() * localQuotes.length)];

  quoteDisplay.textContent =
    `"${randomQuote.text}" — ${randomQuote.category}`;
}

/*********************************
 * ADD QUOTE
 *********************************/
async function addQuote() {
  const text = document.getElementById("newQuoteText").value;
  const category = document.getElementById("newQuoteCategory").value;

  if (!text || !category) {
    alert("Please fill in both fields");
    return;
  }

  const newQuote = { text, category };

  // POST to server
  const savedQuote = await postQuoteToServer(newQuote);

  localQuotes.push(savedQuote);
  localStorage.setItem("quotes", JSON.stringify(localQuotes));

  notify("Quote added and synced with server");

  document.getElementById("newQuoteText").value = "";
  document.getElementById("newQuoteCategory").value = "";
}

/*********************************
 * SYNC WITH SERVER (REQUIRED)
 *********************************/
async function syncQuotes() {
  const serverQuotes = await fetchQuotesFromServer();
  let updated = false;

  serverQuotes.forEach(serverQuote => {
    const localQuote = localQuotes.find(q => q.id === serverQuote.id);

    if (!localQuote) {
      localQuotes.push(serverQuote);
      updated = true;
    } else if (serverQuote.updatedAt > localQuote.updatedAt) {
      // Conflict resolution: server wins
      Object.assign(localQuote, serverQuote);
      updated = true;
    }
  });

  if (updated) {
    localStorage.setItem("quotes", JSON.stringify(localQuotes));
    notify("Quotes updated from server");
  }
}

/*********************************
 * PERIODIC SERVER CHECK (REQUIRED)
 *********************************/
setInterval(() => {
  syncQuotes();
}, 5000);

/*********************************
 * INITIAL LOAD
 *********************************/
async function init() {
  const serverQuotes = await fetchQuotesFromServer();
  localQuotes = serverQuotes;
  localStorage.setItem("quotes", JSON.stringify(localQuotes));
  showRandomQuote();
}

newQuoteButton.addEventListener("click", showRandomQuote);
init();