const express = require("express");
const axios = require("axios");
const router = express.Router();

router.get("/", (req, res) => {
  res.send("hello world");
});

router.post("/userDetails", async (req, res) => {
  const { userId, accessToken } = req.body;

  try {
    // Validate request body
    if (!userId || !accessToken) {
      return res.status(400).send("Missing userId or accessToken.");
    }

    // Step 1: Verify the access token
    if (!(await verifyAccessToken(accessToken))) {
      return res.status(400).send("Invalid access token.");
    }

    // Step 2: Exchange for a long-lived token
    const longLivedToken = await exchangeForLongLivedToken(accessToken);
    if (!longLivedToken) {
      return res.status(500).send("Failed to exchange for long-lived token.");
    }

    // Step 3: Fetch page access tokens
    const pageTokens = await fetchPageAccessTokens(longLivedToken);
    if (pageTokens.length === 0) {
      return res
        .status(500)
        .send("No pages found or failed to fetch page tokens.");
    }

    // Here you should store the longLivedToken and pageTokens securely
    // And possibly set up webhooks for each page

    res.send({
      message: "User details and pages processed successfully.",
      pageTokens,
    });
  } catch (error) {
    console.error("Error processing userDetails:", error);
    res.status(500).send("An error occurred while processing user details.");
  }
});

// Helper functions
async function verifyAccessToken(accessToken) {
  const app_id = process.env.APP_ID;
  const app_secret = process.env.APP_SECRET;
  const verifyUrl = `https://graph.facebook.com/debug_token?input_token=${accessToken}&access_token=${app_id}|${app_secret}`;

  try {
    const response = await axios.get(verifyUrl);
    return response.data.data.is_valid;
  } catch (error) {
    console.error("Error verifying access token:", error);
    return false;
  }
}

async function exchangeForLongLivedToken(accessToken) {
  const app_id = process.env.APP_ID;
  const app_secret = process.env.APP_SECRET;
  const exchangeUrl = `https://graph.facebook.com/oauth/access_token?grant_type=fb_exchange_token&client_id=${app_id}&client_secret=${app_secret}&fb_exchange_token=${accessToken}`;

  try {
    const response = await axios.get(exchangeUrl);
    return response.data.access_token;
  } catch (error) {
    console.error("Error exchanging token:", error);
    return null;
  }
}

async function fetchPageAccessTokens(userLongLivedToken) {
  const pagesUrl = `https://graph.facebook.com/me/accounts?access_token=${userLongLivedToken}`;

  try {
    const response = await axios.get(pagesUrl);
    return response.data.data.map((page) => ({
      id: page.id,
      accessToken: page.access_token,
    }));
  } catch (error) {
    console.error("Error fetching page tokens:", error);
    return [];
  }
}

module.exports = router;
