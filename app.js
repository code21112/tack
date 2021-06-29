const express = require("express");
const app = express();
const PORT = process.env.PORT || 5000;
const mongoose = require("mongoose");
const { MONGO_DB_URI } = require("./config/keys");

mongoose.connect(MONGO_DB_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  useCreateIndex: true,
  useFindAndModify: false,
});
mongoose.connection.on("connected", () => {
  console.log("database connected");
});
mongoose.connection.on("error", (err) => {
  console.log("error in database connection", err);
});

require("./models/userModel");
require("./models/postModel");

app.use(express.json());
app.use(require("./routes/authRoutes"));
app.use(require("./routes/postRoutes"));
app.use(require("./routes/userRoutes"));

if (process.env.NODE_ENV == "production") {
  app.use(express.static("client/build"));
  const path = require("path");
  app.get("*", (req, res) => {
    res.sendFile(path.resolve(__dirname, "client", "build", "index.html"));
  });
}

app.listen(PORT, () => {
  console.log("Server is running on", PORT);
});
