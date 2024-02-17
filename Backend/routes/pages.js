const express = require("express");
const axios = require("axios"); // Make sure axios is imported
const router = express.Router();
const { Page, Conversation, Message } = require("../model");
const authenticateUser = require("../middleware/auth");

// Connect to the page and fetch conversations
router.get("/:pageId/conversations", authenticateUser, async (req, res) => {
  const { pageId } = req.params;

  try {
    const page = await Page.findOne({ pageId: pageId });
    if (!page) {
      return res.status(404).send("No Conversations found for this Page!");
    }

    const fetchedConversations = await fetchConversations(
      page.pageAccessToken,
      pageId
    );

    // Assuming fetchedConversations now includes the required details
    const savedConversations = await Promise.all(
      fetchedConversations.conversations.map(async (conv) => {
        // Extracting additional details: initiatorName and lastMessage
        const {
          conversationId,
          initiatorName,
          initiatorFacebookId,
          lastMessage,
          lastMessageTimestamp,
        } = conv;

        await fetchAndStoreMessages(page.pageAccessToken, conversationId);

        const conversation = await Conversation.findOneAndUpdate(
          { conversationId },
          {
            $set: {
              pageId: page._id,
              initiatorName,
              initiatorFacebookId,
              lastMessage,
              lastMessageTimestamp: new Date(lastMessageTimestamp),
            },
          },
          { new: true, upsert: true }
        );

        return conversation;
      })
    );

    res.json({ conversations: savedConversations });
  } catch (error) {
    console.error("Error in conversation fetch/save route:", error);
    res
      .status(500)
      .send("An error occurred while fetching/saving conversations.");
  }
});

// Function to fetch conversations from the Facebook Graph API
async function fetchConversations(pageAccessToken, pageId) {
  try {
    const pageConversationsUrl = `https://graph.facebook.com/v12.0/${pageId}/conversations?fields=participants,messages.limit(1){message,from,created_time}&access_token=${pageAccessToken}`;
    const response = await axios.get(pageConversationsUrl);

    const conversations = response.data.data.map((conv) => {
      const lastMessage = conv.messages.data[0];
      return {
        conversationId: conv.id,
        initiatorName: lastMessage.from.name,
        initiatorFacebookId: lastMessage.from.id,
        lastMessage: lastMessage.message,
        lastMessageTimestamp: lastMessage.created_time,
      };
    });

    return { conversations };
  } catch (error) {
    console.error("Error fetching conversations:", error);
    return [];
  }
}

async function fetchAndStoreMessages(pageAccessToken, fbConversationId) {
  try {
    // First, find the corresponding Conversation document in your database
    const conversation = await Conversation.findOne({
      conversationId: fbConversationId,
    });
    if (!conversation) {
      console.log("Conversation not found in DB, skipping message fetch");
      return;
    }

    const messagesUrl = `https://graph.facebook.com/v12.0/${fbConversationId}/messages?access_token=${pageAccessToken}&fields=id,message,from,created_time`;
    const response = await axios.get(messagesUrl);
    const messages = response.data.data;

    await Promise.all(
      messages.map(async (msg) => {
        try {
          const newMessage = new Message({
            conversationId: conversation._id, // Use MongoDB ObjectId of the Conversation document
            fbConversationId: conversation.conversationId,
            messageId: msg.id,
            messageContent: msg.message,
            senderId: msg.from.id,
            timestamp: new Date(msg.created_time),
          });
          await newMessage.save();
        } catch (saveError) {
          console.error("Error saving a message:", saveError);
        }
      })
    );
  } catch (error) {
    console.error("Error fetching or saving messages:", error);
  }
}

module.exports = router;
