const User = require("../models/user");
const jwt = require("jsonwebtoken");

const { hashPassword, comparePassword } = require("../helpers/auth-helper");

const test = (req, res) => {
  res.json("test is working fine");
};

// signup controller
const registerUser = async (req, res) => {
  try {
    const { username, email, password } = req.body;
    // Checking if name was entered by user
    const existingUsername = await User.findOne({ username });
    if (existingUsername) {
      return res.status(400).json({ error: "Username is already taken" });
    } else if (!username) {
      return res.status(400).json({ error: "Username is required" });
    } else if (username.length < 4) {
      return res
        .status(400)
        .json({ error: "Username should be atleast 4 characters long" });
    }
    // Checking if password was entered by user
    if (!password || password.length < 6) {
      return res.status(400).json({
        error: "Password is required and should be atleast 6 characters long",
      });
    }
    // Checking email
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ error: "Email is already registered" });
    } else if (!email) {
      return res.status(400).json({ error: "Email is required" });
    }

    const hashedPassword = await hashPassword(password);
    const user = await User.create({
      username,
      email,
      password: hashedPassword,
    });

    return res
      .status(200)
      .json({ user, message: "User registered successfully" });
  } catch (err) {
    console.log(err);
  }
};

// login controller
const loginUser = async (req, res) => {
  try {
    const { email, password } = req.body;

    // Checking if user exists
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({ error: "User does not exist" });
    }

    // Checking password
    const isMatch = await comparePassword(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ error: "Invalid credentials" });
    }

    // Creating JWT token
    const accessToken = jwt.sign(
      { email: user.email, id: user._id, username: user.username },
      process.env.JWT_SECRET,
      { expiresIn: 60 * 60 * 24 } // 24 hours
    );

    const refreshToken = jwt.sign(
        { email: user.email, id: user._id, username: user.username },
        process.env.REFRESH_TOKEN_SECRET,
        { expiresIn: '7d' } // Refresh token expires in 7 days
      );

    // Setting token in a cookie
    res.cookie("accessToken", accessToken, {
      httpOnly: true, // Ensures the cookie is accessible only by the web server
      secure: true,
    });

    res.cookie("refreshToken", refreshToken, {
      httpOnly: true, // Ensures the cookie is accessible only by the web server
      secure: true,
    });

    // Returning the response with token
    return res.status(200).json({
      message: "User logged in successfully",
      accessToken: accessToken,
      refreshToken: refreshToken,
    });
  } catch (err) {
    console.log(err);
    return res.status(500).json({ error: "Internal server error" });
  }
};

const refreshToken = (req, res) => {
    const refreshToken = req.cookies.refreshToken;
  
    if (!refreshToken) {
      return res.status(401).json({ error: "No refresh token provided" });
    }
  
    try {
      const decoded = jwt.verify(refreshToken, process.env.REFRESH_TOKEN_SECRET);
      const newAccessToken = jwt.sign(
        { email: decoded.email, id: decoded.id, username: decoded.username },
        process.env.JWT_SECRET,
        { expiresIn: '15m' } // Issue a new access token with a short expiration
      );
  
      res.cookie("accessToken", newAccessToken, {
        httpOnly: true,
        secure: true,
      });
  
      return res.status(200).json({ message: "Access token refreshed" });
    } catch (err) {
      return res.status(401).json({ error: "Invalid refresh token" });
    }
  };

module.exports = {
  test,
  registerUser,
  loginUser,
  refreshToken
};
