const express = require("express");
const app = express();
const dotenv = require("dotenv");
const mongoose = require("mongoose");
const { readdirSync } = require("fs");
const cors = require("cors");
const path = require("path");
const { urlencoded, text, json } = require("body-parser");

app.use(json({ limit: "200mb" }));
app.use(urlencoded({ limit: "200mb", extended: true }));
dotenv.config();
// connect to DB
mongoose.connect(
  process.env.DB_CONNECT,
  { useNewUrlParser: true, useUnifiedTopology: true },
  () => console.log("Connect to DB!")
);
// Middleware
app.use(
  cors({
    origin: "*",
  })
);
app.use(express.json());
// ْRoute Middlewares
readdirSync("./routes").map((r) => app.use("/api", require("./routes/" + r)));

app.listen(process.env.PORT || 3000, () => {
  console.log("server is running at 3000 port");
});
const publicDirectoryPath = path.join(__dirname, "./public");
app.use(express.static(publicDirectoryPath));
