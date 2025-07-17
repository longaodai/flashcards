import express from "express";
import path from "path";
import {
  index,
  flashcard,
  done,
  stats,
} from "../controllers/web.controller.js";

const router = express.Router();

router.get("/", index);

router.get("/flashcard", flashcard);

router.get("/stats", stats);

router.get("/done", done);

export default router;
