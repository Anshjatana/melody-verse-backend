const express = require("express");
const {
  test,
  registerUser,
  loginUser,
  refreshToken
} = require("../controllers/authController");
const router = express.Router();
const cors = require("cors");
const authenticateToken = require("../middleware/authenticateToken");

// middleware
router.use(
  cors({
    origin: "http://localhost:3000",
    credentials: true,
  })
);
// Public route
router.get("/", test);
router.post("/signup", registerUser);
router.post("/login", loginUser);
router.post("/refresh-token", refreshToken);

// Protected route
router.get("/profile", authenticateToken, (req, res) => {
  res.json({ message: "This is a protected route", user: req.user });
});

module.exports = router;
