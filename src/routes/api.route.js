const express = require("express");
const { getRandomWords } = require("../controllers/api.controller");

const router = express.Router();

router.get("/random-words", getRandomWords);

module.exports = router;
