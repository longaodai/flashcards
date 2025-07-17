import express from "express";
import path from "path";
import { fileURLToPath } from "url";
import expressLayouts from "express-ejs-layouts";

const app = express();

const PORT = process.env.PORT || 3000;
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

import webRoutes from "./routes/web.route.js";

app.use(express.static(path.join(__dirname, "../public")));

// config views, engine
app.use(expressLayouts);
app.set("layout", "layout/master");
app.set("views", path.join(__dirname, "views"));
app.set("view engine", "ejs");

app.use("/", webRoutes);

app.listen(PORT, () => {
  console.log(`server is running on port: ${PORT}`);
});
