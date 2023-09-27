const user = require("../models/userSchema");
const bcrypt = require("bcrypt");

// --- user ---
exports.user = async (req, res) => {
  const { flag, userID, name, roleName, email, password, status } = req.body;
  try {
    if (flag === "I") {
      let preuser = await user.findOne({ email: email });

      if (preuser) {
        return res.status(422).json({
          Message: "This email already exist",
        });
      }

      const salt = await bcrypt.genSalt(10);
      const secPass = await bcrypt.hash(password, salt);

      const adduser = new user({
        name,
        email,
        password: secPass,
        roleName,
        status,
      });

      await adduser.save();
      res.status(201).json({
        StatusCode: 200,
        Message: "success",
      });
    } else if (flag === "U") {
      const update = {
        name,
        roleName,
      };
      await user.findByIdAndUpdate(userID, update, {
        new: true,
      });

      res.status(201).json({ StatusCode: 200, Message: "success" });
    } else if (flag === "S") {
      // const roleName = req.query.roleName;
      let userdata;
      if (status === "-1") {
        userdata = await user.find();
      } else if (status) {
        userdata = await user.find({ status: status });
      }
      if (userdata) {
        res.status(201).json({
          StatusCode: 200,
          Message: "success",
          Values: userdata,
        });
      } else {
        res.status(401).json({
          StatusCode: 400,
          Message: "User not found",
        });
      }
    } else if (flag === "SI") {
      const userdata = await user.findById({ _id: userID });
      if (userdata) {
        res.status(201).json({
          StatusCode: 200,
          Message: "success",
          Values: [userdata],
        });
      } else {
        res.status(401).json({
          StatusCode: 400,
          Message: "User not found",
        });
      }
    } else if (flag === "US") {
      const update = {
        status,
      };
      await user.findByIdAndUpdate(userID, update, {
        new: true,
      });

      res.status(201).json({ StatusCode: 200, Message: "success" });
    } else if (flag === "D") {
      await user.findByIdAndDelete({ _id: userID });

      res.status(201).json({ StatusCode: 200, Message: "success" });
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
