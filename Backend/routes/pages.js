const express = require("express");
const router = express.Router();
const { UserFacebook, Page } = require("../model");

// List all connected Facebook pages for the authenticated user
router.get("/getAllPages", async (req, res) => {
  const { userId } = req.headers;

  try {
    const user = await UserFacebook.findById(userId);
    if (!user) {
      return res.status(404).send("User not found.");
    }

    const pages = await Page.find({ userFacebookId: user._id });
    res.json(pages);
  } catch (error) {
    console.error("Error fetching connected pages:", error);
    res.status(500).send("An error occurred while fetching pages.");
  }
});

//connect to the page
router.get("/connect/", async (req, res) => {});

module.exports = router;
