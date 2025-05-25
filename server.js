const express = require("express");
const morgan = require("morgan");
const app = express();

const { quotes } = require("./data");
const { getRandomElement } = require("./utils");

const PORT = process.env.PORT || 3000;

app.use(express.static("public"));

app.listen(PORT, () => {
  console.log(`Servier is listening to port ${PORT}`);
});

app.get("/api/quotes/random", (req, res, next) => {
  const randomQuote = getRandomElement(quotes);
  res.status(200).send({ quote: randomQuote });
});

app.get("/api/quotes", (req, res) => {
  const person = req.query.person;

  if (person) {
    const filteredQuotes = quotes.filter((quote) => quote.person === person);
    res.status(200).send({ quotes: filteredQuotes });
  } else {
    res.status(200).send({ quotes: quotes });
  }
});

app.post("/api/quotes", (req, res) => {
  const { quote, person, year } = req.query;

  if (quote && person) {
    const newId =
      quotes.length > 0 ? Math.max(...quotes.map((q) => q.id || 0)) + 1 : 1;

    const newQuote = {
      id: newId,
      quote,
      person,
      ...(year && { year }),
    };

    quotes.push(newQuote);
    res.status(201).send({ quote: newQuote });
  } else {
    res.status(400).send();
  }
});


app.put("/api/quotes/:id", (req, res) => {
  const quoteId = parseInt(req.params.id);
  const { quote, person, year } = req.query;

  const quoteIndex = quotes.findIndex((q) => q.id === quoteId);

  if (quoteIndex !== -1) {
    if (quote) quotes[quoteIndex].quote = quote;
    if (person) quotes[quoteIndex].person = person;
    if (year) quotes[quoteIndex].year = parseInt(year);

    res.send({ quote: quotes[quoteIndex] });
  } else {
    res.status(404).send();
  }
});

app.delete("/api/quotes/:id", (req, res) => {
  const quoteId = parseInt(req.params.id);
  const quoteIndex = quotes.findIndex((q) => q.id === quoteId);

  if (quoteIndex !== -1) {
    const deleted = quotes.splice(quoteIndex, 1);
    res.send({ quote: deleted[0] });
  } else {
    res.status(404).send();
  }
});
