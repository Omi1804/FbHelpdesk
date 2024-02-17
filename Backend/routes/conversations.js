const express = require("express");
const { Message, Conversation, Page } = require("../model");
const router = express.Router();
const axios = require("axios");
const authenticateUser = require("../middleware/auth");

router.get("/:conversationId/messages", authenticateUser, async (req, res) => {
  const conversationId = req.params.conversationId;

  try {
    const messages = await Message.find({
      fbConversationId: conversationId,
    }).sort({
      timestamp: 1,
    });
    if (messages.length === 0) {
      res.json({ message: "No messages found" });
    }
    res.json(messages);
  } catch (error) {
    console.error("Error fetching messages:", error);
    res.status(500).send("An error occurred while fetching messages.");
  }
});

router.post("/:conversationId/send", authenticateUser, async (req, res) => {
  const conversationId = req.params.conversationId;
  const { messageContent } = req.body;

  try {
    const conversation = await Conversation.findById(conversationId).populate({
      path: "pageId",
      populate: { path: "userFacebookId" },
    });

    console.log(conversation);

    if (!conversation) {
      return res.status(404).send("Conversation not found.");
    }

    const pageAccessToken = conversation.pageId.pageAccessToken;
    const pageId = conversation.pageId.pageId;

    if (!pageAccessToken) {
      return res.status(500).send("Page access token not found.");
    }

    const sendMessageUrl = `https://graph.facebook.com/v19.0/me/messages`;

    const recipientId = conversation.initiatorFacebookId;

    // console.log(pageAccessToken, pageId, recipientId);

    const response = await axios.post(
      sendMessageUrl,
      {
        recipient: { id: recipientId },
        message: { text: messageContent },
      },
      {
        headers: { Authorization: `Bearer ${pageAccessToken}` },
      }
    );

    // If the message is successfully sent, Facebook's API returns a message_id
    if (response.data && response.data.message_id) {
      const newMessage = new Message({
        conversationId: conversation._id, // MongoDB ObjectId of the conversation
        fbConversationId: conversation.conversationId, // Facebook's conversation ID
        messageId: response.data.message_id,
        messageContent,
        senderId: "Page", // Adjust as needed, e.g., to match the sender's real ID
        timestamp: new Date(), // Consider using the timestamp from Facebook's response if available
      });

      await newMessage.save();
      res.status(201).json(newMessage);
    } else {
      throw new Error("Failed to send message via Facebook Graph API");
    }
  } catch (error) {
    console.error("Error sending message:", error.message);
    res.status(500).send("An error occurred while sending the message.");
  }
});

module.exports = router;
