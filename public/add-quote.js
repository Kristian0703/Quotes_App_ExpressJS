const submitButton = document.getElementById("submit-quote");
const newQuoteContainer = document.getElementById("new-quote");

submitButton.addEventListener("click", (event) => {
  event.preventDefault(); // Prevents any default behavior, just in case

  const quote = document.getElementById("quote").value.trim();
  const person = document.getElementById("person").value.trim();
  const year = document.getElementById("year").value.trim();

  if (!quote || !person) {
    newQuoteContainer.innerHTML =
      "<p>Please enter both a quote and a person.</p>";
    return;
  }

  fetch(
    `/api/quotes?quote=${encodeURIComponent(quote)}&person=${encodeURIComponent(
      person
    )}&year=${encodeURIComponent(year)}`,
    {
      method: "POST",
    }
  )
    .then((response) => {
      if (!response.ok) {
        throw new Error(`Server responded with status ${response.status}`);
      }
      return response.json();
    })
    .then(({ quote }) => {
      const newQuote = document.createElement("div");
      newQuote.innerHTML = `
      <h3>Congrats, your quote was added!</h3>
      <div class="quote-text">${quote.quote}</div>
      <div class="attribution">- ${quote.person}${
        quote.year ? `, <span class="year">${quote.year}</span>` : ""
      }</div>
      <p>Go to the <a href="index.html">home page</a> to request and view all quotes.</p>
    `;
      newQuoteContainer.innerHTML = "";
      newQuoteContainer.appendChild(newQuote);

      // Optional: clear inputs
      document.getElementById("quote").value = "";
      document.getElementById("person").value = "";
      document.getElementById("year").value = "";
    })
    .catch((error) => {
      newQuoteContainer.innerHTML = `<p>Error: ${error.message}</p>`;
    });
});
