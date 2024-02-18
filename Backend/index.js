const express = require("express");
const app = express();
require("dotenv").config();
const PORT = process.env.PORT || 5050;
const bodyParser = require("body-parser");
const userFacebook = require("./routes/userFacebook");
const userRoutes = require("./routes/user");
const pagesRouter = require("./routes/pages");
const webHookRouter = require("./routes/webhooks");
const conversationRoutes = require("./routes/conversations");
const connectDb = require("./database/");
const cors = require("cors");

app.use(bodyParser.json());
app.use(cors());

app.get("/", (req, res) => {
  res.send("test");
});

//routes
app.use("/user", userRoutes);
app.use("/userFacebook", userFacebook);
app.use("/pages", pagesRouter);
app.use("/conversations", conversationRoutes);
app.use("/webhook", webHookRouter);

//database connection
connectDb();

app.listen(PORT, () => {
  console.log("Listening on port " + PORT);
});
