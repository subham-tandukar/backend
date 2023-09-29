const User = require("../models/userSchema");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const JWT_SECRET = "Thisis@Secret";

// --- user ---
exports.user = async (req, res) => {
  const { Name, Email, Password, FLAG } = req.body;
  try {
    if (FLAG === "I") {
      if (!Name || !Email || !Password) {
        return res.status(422).json({
          Message: "Please fill the required fields",
        });
      }
      let user = await User.findOne({ Email: Email });

      if (user) {
        return res.status(422).json({
          Message: "This email already exist",
        });
      }

      const salt = await bcrypt.genSalt(10);
      const secPass = await bcrypt.hash(Password, salt);

      user = await User.create({
        Name: Name,
        Email: Email,
        Password: secPass,
      });

      const data = {
        user: {
          id: user.id,
          name: user.Name,
          email: user.Email,
        },
      };

      const authToken = jwt.sign(data, JWT_SECRET);

      res.status(201).json({
        StatusCode: 200,
        Message: "success",
        authToken,
        Status: user.Status,
      });
    } else if (FLAG === "S") {
      const userdata = await User.find();
      res.status(201).json({
        StatusCode: 200,
        Message: "success",
        Values: userdata.length <= 0 ? "No data" : userdata,
      });
    } else {
      res.status(400).json({ StatusCode: 400, Message: "Invalid flag" });
    }
  } catch (error) {
    res.status(401).json({
      StatusCode: 400,
      Message: error,
    });
  }
};
