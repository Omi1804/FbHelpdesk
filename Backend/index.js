const express = require("express");
const app = express();
require("dotenv").config();
const PORT = process.env.PORT || 5050;
const bodyParser = require("body-parser");
const userFacebook = require("./routes/userFacebook");
const userRoutes = require("./routes/user");
const connectDb = require("./database/");
const cors = require("cors");

app.use(bodyParser.json());
app.use(cors());
app.use("/user", userRoutes);
app.use("/userFacebook", userFacebook);

//database connection
connectDb();

app.listen(PORT, () => {
  console.log("Listening on port " + PORT);
});
