const quotes = [
    "quote 1",
    "quote 2",
    "quote 3"
];

const getQuote = (req, res, next) => {
    const idx = Math.floor(Math.random() * quotes.length);
    res.locals.quote = quotes[idx];
    next();
   }

module.exports = getQuote;