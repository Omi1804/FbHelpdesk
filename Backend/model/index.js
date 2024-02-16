const mongoose = require("mongoose");

const UserSchema = new mongoose.Schema({
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
});

const UserFacebookSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
  facebookUserId: { type: String, required: true, unique: true },
  longLivedAccessToken: { type: String, required: true },
});

const PageSchema = new mongoose.Schema({
  userFacebookId: { type: mongoose.Schema.Types.ObjectId, ref: "UserFacebook" },
  pageId: { type: String, required: true },
  pageName: { type: String, required: true },
  pageAccessToken: { type: String, required: true },
});

const ConversationSchema = new mongoose.Schema({
  pageId: { type: mongoose.Schema.Types.ObjectId, ref: "Page" },
  conversationId: { type: String, required: true, unique: true },
  lastMessageTimestamp: { type: Date },
});

const MessageSchema = new mongoose.Schema({
  conversationId: { type: mongoose.Schema.Types.ObjectId, ref: "Conversation" },
  messageId: { type: String, required: true, unique: true },
  messageContent: { type: String, required: true },
  senderId: { type: String, required: true },
  timestamp: { type: Date, required: true },
});

module.exports = {
  User: mongoose.model("User", UserSchema),
  UserFacebook: mongoose.model("UserFacebook", UserFacebookSchema),
  Page: mongoose.model("Page", PageSchema),
  Conversation: mongoose.model("Conversation", ConversationSchema),
  Message: mongoose.model("Message", MessageSchema),
};
