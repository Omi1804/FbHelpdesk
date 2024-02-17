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
      res.sendStatus(403);
    }
  }
});

// POST /webhook - To receive notifications from Facebook
router.post("/", (req, res) => {
  let body = req.body;

  if (body.object === "page") {
    body.entry.forEach(function (entry) {
      // Handle the event
      let webhookEvent = entry.messaging[0];
      console.log(webhookEvent);
      // Here, you can call a function to handle the event, e.g., save a new message
    });

    res.status(200).send("EVENT_RECEIVED");
  } else {
    res.sendStatus(404);
  }
});

module.exports = router;
