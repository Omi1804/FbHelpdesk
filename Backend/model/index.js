import mongoose from "mongoose";

const userDetails = new mongoose.Schema({
  userId: String,
  accessToken: String,
});
