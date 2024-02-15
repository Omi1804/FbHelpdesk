const mongoose = require("mongoose");

const connectDb = () => {
  mongoose
    .connect(process.env.MONGO_URI, { dbName: "FbHelpdesk" })
    .then(() => {
      console.log("Database Connection established successfully!");
    })
    .catch((err) => {
      console.log("Error connecting to database: " + err.message);
    });
};

module.exports = connectDb;
