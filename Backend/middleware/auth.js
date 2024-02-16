const jwt = require("jsonwebtoken");
const secretKey = process.env.JWT_Secret;
const { User } = require("../model");

const authenticateUser = (req, res, next) => {
  const authHeader = req.headers.authorization;

  if (!authHeader) {
    return res.status(401).json({ message: "Authorization header missing!" });
  }

  const token = authHeader.split(" ")[1];

  if (!token) {
    return res.status(401).json({ message: "Token missing or malformed!" });
  }

  if (!secretKey) {
    console.log("Token missing or malformed secret key");
    return res
      .status(401)
      .json({ message: "Token missing or malmalformed secret key" });
  }

  jwt.verify(token, secretKey, async (err, data) => {
    if (err) {
      return res.status(401).json({ message: "Invalid token!" });
    }

    const { email, password } = data;

    // Use hashed password for comparison
    const existingUser = await User.findOne({
      email: email,
      password: password,
    });

    if (!existingUser) {
      return res.status(403).json({ message: "User not found!" });
    }

    req.headers["userId"] = existingUser.user_id;
    next();
  });
};

module.exports = authenticateUser;
