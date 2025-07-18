const path = require("path");

const index = (req, res) => {
  res.render("index");
};

const flashcard = (req, res) => {
  res.render("flashcard", { js: ["/js/flashcard.js"] });
};

const done = (req, res) => {
  res.render("done", { js: ["/js/done.js"] });
};

const stats = (req, res) => {
  res.render("stats", { js: ["/js/stats.js"] });
};

module.exports = {
  index,
  flashcard,
  done,
  stats,
};
