/*********************************
 * MOCK SERVER (SIMULATED API)
 *********************************/
let mockServerQuotes = [
  { id: 1, text: "The best way to predict the future is to create it.", category: "Motivation", updatedAt: Date.now() },
  { id: 2, text: "Talk is cheap. Show me the code.", category: "Programming", updatedAt: Date.now() }
];

// Simulate GET request
function fetchQuotesFromServer() {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve([...mockServerQuotes]);
    }, 800);
  });
}

// Simulate POST request
function postQuoteToServer(quote) {
  return new Promise((resolve) => {
    setTimeout(() => {
      const serverQuote = {
        ...quote,
        id: Date.now(),
        updatedAt: Date.now()
      };
      mockServerQuotes.push(serverQuote);
      resolve(serverQuote);
    }, 800);
  });
}

/*********************************
 * LOCAL STATE & STORAGE
 *********************************/
let localQuotes = JSON.parse(localStorage.getItem("quotes")) || [];

/*********************************
 * DOM ELEMENTS
 *********************************/
const quoteDisplay = document.getElementById("quoteDisplay");
const newQuoteButton = document.getElementById("newQuote");

const notification = document.createElement("div");
notification.style.marginTop = "10px";
document.body.appendChild(notification);

/*********************************
 * UI FUNCTIONS
 *********************************/
function notify(message) {
  notification.textContent = message;
  notification.style.color = "green";
  setTimeout(() => (notification.textContent = ""), 3000);
}

/*********************************
 * CORE FUNCTIONS
 *********************************/
function showRandomQuote() {
  if (localQuotes.length === 0) {
    quoteDisplay.textContent = "No quotes available.";
    return;
  }

  const random = localQuotes[Math.floor(Math.random() * localQuotes.length)];
  quoteDisplay.textContent = `"${random.text}" — ${random.category}`;
}

async function addQuote() {
  const text = document.getElementById("newQuoteText").value;
  const category = document.getElementById("newQuoteCategory").value;

  if (!text || !category) {
    alert("Please fill all fields");
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
 * SYNC & CONFLICT RESOLUTION
 *********************************/
async function syncQuotes() {
  const serverQuotes = await fetchQuotesFromServer();
  let updated = false;

  serverQuotes.forEach((serverQuote) => {
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
    notify("Quotes synced from server");
  }
}

/*********************************
 * PERIODIC SERVER CHECK
 *********************************/
setInterval(() => {
  syncQuotes();
}, 5000); // check every 5 seconds

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
