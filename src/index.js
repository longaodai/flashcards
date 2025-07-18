const express = require("express");
const path = require("path");
const expressLayouts = require("express-ejs-layouts");

const webRoutes = require("./routes/web.route");
const apiRoutes = require("./routes/api.route");

const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.static(path.join(__dirname, "../public")));

// config views, engine
app.use(expressLayouts);
app.set("layout", "layout/master");
app.set("views", path.join(__dirname, "views"));
app.set("view engine", "ejs");

app.use("/", webRoutes);
app.use("/api", apiRoutes);

app.listen(PORT, () => {
  console.log(`server is running on port: ${PORT}`);
});
