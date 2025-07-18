const express = require("express");
const path = require("path");
const {
  index,
  flashcard,
  done,
  stats,
} = require("../controllers/web.controller.js");

const router = express.Router();

router.get("/", index);

router.get("/flashcard", flashcard);

router.get("/stats", stats);

router.get("/done", done);

module.exports = router;
