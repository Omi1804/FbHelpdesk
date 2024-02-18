const express = require("express");
const router = express.Router();

router.get("/", async (req, res) => {
  //   Your verify token. Should be a random string.
  let VERIFY_TOKEN = process.env.WEBHOOK_VERIFY_TOKEN;

  // Parse the query params
  let mode = req.query["hub.mode"];
  let token = req.query["hub.verify_token"];
  let challenge = req.query["hub.challenge"];

  if (mode && token) {
    if (mode === "subscribe" && token === VERIFY_TOKEN) {
      res.status(200).send(challenge);
    } else {
      res.sendStatus(403).send("failed to subscribe");
    }
  }
});

// POST /webhook - To receive notifications from Facebook
router.post("/", async (req, res) => {
  let body = req.body;

  console.log(body);
  if (body.object === "page") {
    body.entry.forEach(async (entry) => {
      let webhookEvent = entry.messaging[0];
      console.log(webhookEvent);

      // Assuming you receive message events
      if (webhookEvent.message && webhookEvent.sender) {
        try {
          // Here, additional logic might be needed to find or create the corresponding Conversation
          const newMessage = new Message({
            // conversationId: Some logic to find or create the conversation,
            fbConversationId: webhookEvent.sender.id, // Adjust according to your needs
            messageId: webhookEvent.message.mid,
            messageContent: webhookEvent.message.text,
            senderId: webhookEvent.sender.id,
            timestamp: new Date(webhookEvent.timestamp),
          });

          await newMessage.save();
          console.log("Message saved:", newMessage);
        } catch (error) {
          console.error("Error saving message:", error);
        }
      }
    });

    res.status(200).send("EVENT_RECEIVED");
  } else {
    res.sendStatus(404);
  }
});

module.exports = router;
