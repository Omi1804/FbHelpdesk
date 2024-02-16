const express = require("express");
const jwt = require("jsonwebtoken");
const secretKey = process.env.JWT_Secret;
const router = express.Router();
const { User } = require("../model");

//Admin singup
router.post("/signup", async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    res
      .status(400)
      .json({ message: "Please Enter your Email or Password Correctly." });
  } else {
    const existingUser = await User.findOne({
      email: email,
      password: password,
    });

    if (existingUser) {
      res.status(400).json({ message: "User already exists!" });
    } else {
      const obj = { email, password };
      await User.create(obj);
      if (!secretKey) {
        console.log("Token missing or malformed secret key");
        return res
          .status(401)
          .json({ message: "Token missing or malmalformed secret key" });
      }
      const token = jwt.sign(obj, secretKey, { expiresIn: "1h" });
      res
        .status(200)
        .json({ message: "User signed in successfully.", token: token });
    }
  }
});

//Admin Login
router.post("/login", async (req, res) => {
  const { email, password } = req.body;
  if (!email || !password) {
    res.status(400).json({ message: "Invalid email or password" });
  } else {
    const existingUser = await User.findOne({
      email: email,
      password: password,
    });
    if (existingUser) {
      if (!secretKey) {
        console.log("Token missing or malformed secret key");
        return res
          .status(401)
          .json({ message: "Token missing or malmalformed secret key" });
      }
      const token = jwt.sign({ email, password }, secretKey, {
        expiresIn: "1d",
      });
      res
        .status(200)
        .json({ message: "User logged in successfully!", token: token });
    } else {
      res.status(401).json({ message: "Please Signup First!" });
    }
  }
});

module.exports = router;
