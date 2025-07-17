import path from "path";
import { fileURLToPath } from "url";

// Define __dirname for ES modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

export const index = (req, res) => {
  res.render("index");
};

export const flashcard = (req, res) => {
  res.render("flashcard", { js: ["/js/flashcard.js"] });
};

export const done = (req, res) => {
  res.render("done", { js: ["/js/done.js"] });
};

export const stats = (req, res) => {
  res.render("stats", { js: ["/js/stats.js"] });
};
