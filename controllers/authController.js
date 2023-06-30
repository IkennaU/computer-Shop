const User = require("../models/User");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const asyncHandler = require("express-async-handler");

// desc Login
// @ route POST/auth
// @access public

const login = asyncHandler(async (req, res) => {
  const { username, password } = req.body;
  if (!username || !password) {
    return res.status(400).json({ message: "All Fields Are Required.." });
  }
  const foundUser = await User.findOne({ username }).exec();
  if (!foundUser || !foundUser.active) {
    return res.status(401).json({ message: "Unauthorized.." });
  }
  const match = await bcrypt.compare(password, foundUser.password);
  if (!match) {
    return res.status(401).json({ message: "Unauthorized.." });
  }

  const accessToken = jwt.sign(
    {
      UserInfo: { username: foundUser.username, roles: foundUser.roles },
    },
    process.env.ACCESS_TOKEN_SECRET,
    { expiresIn: "1d" }
  );
  const refreshToken = jwt.sign(
    {
      username: foundUser.username,
    },
    process.env.REFRESH_TOKEN_SECRET,
    { expiresIn: "7d" }
  );
  //   create secure cookie with refresh token
  res.cookie("jwt", refreshToken, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "None",
    maxAge: 7 * 24 * 60 * 60 * 1000,
  });
  //   send access token containing username and roles..
  res.json({ accessToken });
});

// desc Refresh
// @ route GET/auth/refresh
// @access public

const refresh = (req, res) => {
  const cookies = req.cookies;
  if (!cookies?.jwt) {
    return res.status(401).json({ message: "Unauthorized No Cookies..." });
  } else {
    const refreshToken = cookies.jwt;
    jwt.verify(
      refreshToken,
      process.env.REFRESH_TOKEN_SECRET,
      asyncHandler(async (err, decoded) => {
        if (err) {
          return res.status(403).json({ message: "Forbidden" });
        }
        const foundUser = await User.findOne({ username: decoded.username });
        if (!foundUser) {
          return res
            .status(401)
            .json({ message: "Unauthorized..No User Found" });
        }
        const accessToken = jwt.sign(
          {
            UserInfo: { username: foundUser.username, roles: foundUser.roles },
          },
          process.env.ACCESS_TOKEN_SECRET,
          { expiresIn: "1d" }
        );
        res.json({ accessToken });
      })
    );
  }
};

// desc logout
// @ route POST/auth
// @access public

const logout = (req, res) => {
  const cookies = req.cookies;
  if (!cookies?.jwt) {
    return res.sendStatus(204); // No Content.
  } else {
    res.clearCookie("jwt", {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "None",
    });
    res.json({ message: "cookies cleared.." });
  }
};

module.exports = { login, refresh, logout };
