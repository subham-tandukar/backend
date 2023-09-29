const User = require("../models/userSchema");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const JWT_SECRET = "Thisis@Secret";

// --- login ---
exports.login = async (req, res) => {
  const { Email, Password } = req.body;

  try {
    let user = await User.findOne({ Email });
    if (!user) {
      return res.status(401).json({
        Message: "User doesn't exist",
      });
    }

    const passwordCompare = await bcrypt.compare(Password, user.Password);
    if (!passwordCompare) {
      return res.status(401).json({
        Message: "Password doesn't match",
      });
    }

    const data = {
      user: {
        id: user.id,
        name: user.Name,
        email: user.Email,
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
            Name: user.Name,
            Email: user.Email,
            UserID: user._id,
          },
        ],
      });
    } else {
      res.status(401).json({
        StatusCode: 400,
        Message: "Please verify your email first",
      });
    }
  } catch (err) {
    res.status(401).json({
      StatusCode: 400,
      Message: err,
    });
  }
};
