const express = require("express");
const axios = require("axios");
const router = express.Router();
const { UserFacebook, Page, Conversation, Message } = require("../model");
const authenticateUser = require("../middleware/auth");

router.post("/register", authenticateUser, async (req, res) => {
  const { userFacebookId, accessToken } = req.body;
  const { userId } = req.headers;

  try {
    if (!userFacebookId || !accessToken) {
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

    // Save or update the user in the database
    let user = await UserFacebook.findOne({ facebookUserId: userFacebookId });
    if (!user) {
      user = new UserFacebook({
        userId: userId,
        facebookUserId: userFacebookId,
        longLivedAccessToken: longLivedToken,
      });
    } else {
      user.longLivedAccessToken = longLivedToken; // Update the token if the user already exists
    }
    await user.save();

    res.send({
      message: "UserFacebook registered successfully.",
      longLivedToken,
    });
  } catch (error) {
    console.error("Error processing userDetails:", error);
    res.status(500).send("An error occurred while processing user details.");
  }
});

router.post("/fetchPages", authenticateUser, async (req, res) => {});

// router.post("/userDetails", async (req, res) => {
//   const { userId, accessToken } = req.body;

//   try {
//     // Validate request body
//     if (!userId || !accessToken) {
//       return res.status(400).send("Missing userId or accessToken.");
//     }

//     // Step 1: Verify the access token
//     if (!(await verifyAccessToken(accessToken))) {
//       return res.status(400).send("Invalid access token.");
//     }

//     // Step 2: Exchange for a long-lived token
//     const longLivedToken = await exchangeForLongLivedToken(accessToken);
//     if (!longLivedToken) {
//       return res.status(500).send("Failed to exchange for long-lived token.");
//     }

//     // Save or update the user in the database
//     let user = await User.findOne({ facebookUserId: userId });
//     if (!user) {
//       user = new User({
//         facebookUserId: userId,
//         longLivedAccessToken: longLivedToken,
//       });
//     } else {
//       user.longLivedAccessToken = longLivedToken; // Update the token if the user already exists
//     }
//     await user.save();

//     // Step 3: Fetch page access tokens
//     const pageTokens = await fetchPageAccessTokens(longLivedToken, user._id);
//     if (pageTokens.length === 0) {
//       return res
//         .status(500)
//         .send("No pages found or failed to fetch page tokens.");
//     }

//     const pagesDetails = await Promise.all(
//       pageTokens.map(async (pageToken) => {
//         const page = await Page.findOneAndUpdate(
//           { pageId: pageToken.id, userId: user._id },
//           {
//             $set: {
//               pageName: pageToken.name,
//               pageAccessToken: pageToken.accessToken,
//             },
//           },
//           { new: true, upsert: true }
//         );
//         return page;
//       })
//     );

//     // And possibly set up webhooks for each page
//     // const pagesConversations = await fetchConversationsForAllPages(pageTokens);
//     // console.log(pagesConversations);

//     res.send({
//       message: "User details and pages processed successfully.",
//       pageTokens: pagesDetails.map(({ pageId, pageName, pageAccessToken }) => ({
//         pageId,
//         pageName,
//         pageAccessToken,
//       })),
//     });
//   } catch (error) {
//     console.error("Error processing userDetails:", error);
//     res.status(500).send("An error occurred while processing user details.");
//   }
// });

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

// async function fetchPageAccessTokens(userLongLivedToken) {
//   const pagesUrl = `https://graph.facebook.com/me/accounts?access_token=${userLongLivedToken}&fields=id,name,access_token`;

//   try {
//     const response = await axios.get(pagesUrl);
//     return response.data.data.map((page) => ({
//       id: page.id,
//       name: page.name,
//       accessToken: page.access_token,
//     }));
//   } catch (error) {
//     console.error("Error fetching page tokens:", error);
//     return [];
//   }
// }

//gives the messages
// async function fetchConversationsForAllPages(pageTokens) {
//   try {
//     const conversationsPromises = pageTokens.map(async (page) => {
//       const pageConversationsUrl = `https://graph.facebook.com/${page.id}/conversations?fields=participants,messages.limit(10){id,message}&access_token=${page.accessToken}`;
//       const response = await axios.get(pageConversationsUrl);
//       return {
//         pageId: page.id,
//         conversations: response.data.data,
//       };
//     });

//     const pagesConversations = await Promise.all(conversationsPromises);
//     console.log(pagesConversations);
//     return pagesConversations;
//   } catch (error) {
//     console.error("Error fetching conversations:", error);
//     return [];
//   }
// }

module.exports = router;
