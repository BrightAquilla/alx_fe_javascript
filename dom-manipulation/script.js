// Array of quote objects
const quotes = [
  { text: "The best way to predict the future is to create it.", category: "Motivation" },
  { text: "Talk is cheap. Show me the code.", category: "Programming" },
  { text: "Success is not final; failure is not fatal.", category: "Inspiration" }
];

// Get DOM elements
const quoteDisplay = document.getElementById("quoteDisplay");
const newQuoteButton = document.getElementById("newQuote");

// Function to show a random quote
function showRandomQuote() {
  if (quotes.length === 0) {
    quoteDisplay.textContent = "No quotes available.";
    return;
  }

  const randomIndex = Math.floor(Math.random() * quotes.length);
  const selectedQuote = quotes[randomIndex];

  quoteDisplay.textContent = `"${selectedQuote.text}" — ${selectedQuote.category}`;
}

// Function to add a new quote
function addQuote() {
  const quoteText = document.getElementById("newQuoteText").value;
  const quoteCategory = document.getElementById("newQuoteCategory").value;

  if (quoteText === "" || quoteCategory === "") {
    alert("Please fill in both fields.");
    return;
  }

  // Add new quote to array
  quotes.push({
    text: quoteText,
    category: quoteCategory
  });

  // Clear input fields
  document.getElementById("newQuoteText").value = "";
  document.getElementById("newQuoteCategory").value = "";

  alert("Quote added successfully!");
}

// Event listener for button
newQuoteButton.addEventListener("click", showRandomQuote);
