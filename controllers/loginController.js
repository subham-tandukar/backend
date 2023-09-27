const User = require("../models/userSchema");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const JWT_SECRET = "Thisis@secret";

// --- login ---
exports.login = async (req, res) => {
  const { email, password } = req.body;

  try {
    let user = await User.findOne({ email });
    if (!user) {
      return res.status(401).json({
        Message: "User doesn't exist",
      });
    }

    const passwordCompare = await bcrypt.compare(password, user.password);
    if (!passwordCompare) {
      return res.status(401).json({
        Message: "Password doesn't match",
      });
    }

    const data = {
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
      },
    };
    const authToken = jwt.sign(data, JWT_SECRET);
    if (user.Status === "1") {
      res.status(201).json({
        StatusCode: 200,
        Message: "success",
        Token: authToken,
        Login: [
          {
            name: user.name,
            email: user.email,
            userID: user._id,
          },
        ],
      });
    } else {
      res.status(401).json({
        StatusCode: 400,
        Message: "User deactivated",
      });
    }
  } catch (err) {
    res.status(401).json({
      StatusCode: 400,
      Message: err,
    });
  }
};
