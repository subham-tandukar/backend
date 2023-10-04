const category = require("../models/categorySchema");

// ---- category ----
exports.category = async (req, res) => {
  const { FLAG, CategoryID, Category, Status } = req.body;

  try {
    if (FLAG === "I") {
      if (!Category) {
        return res.status(422).json({
          Message: "Please fill the required fields",
        });
      }
      let unique = await category.findOne({ Category: Category });
      if (unique) {
        return res.status(422).json({
          Message: "This Category already exist",
        });
      }

      const categoryData = new category({
        Category,
      });
      await categoryData.save();
      res.status(201).json({
        StatusCode: 200,
        Message: "success",
      });
    } else if (FLAG === "U") {
      if (!Category) {
        return res.status(422).json({
          Message: "Please fill the required fields",
        });
      }

      const update = {
        Category,
      };

      await category.findByIdAndUpdate(CategoryID, update, {
        new: true,
      });
      res.status(201).json({
        StatusCode: 200,
        Message: "success",
      });
    } else if (FLAG === "S") {
      let categorydata;
      if (Status === "-1") {
        categorydata = await category.find().sort({ createdAt: -1 });
      } else if (Status) {
        categorydata = await category
          .find({ Status: Status })
          .sort({ createdAt: -1 });
      }

      if (categorydata) {
        res.status(201).json({
          StatusCode: 200,
          Message: "success",
          Values: categorydata,
        });
      } else {
        res.status(401).json({
          StatusCode: 400,
          Message: "Category not found",
        });
      }
    } else if (FLAG === "SI") {
      const categorydata = await category.findById({ _id: CategoryID });
      if (categorydata) {
        res.status(201).json({
          StatusCode: 200,
          Message: "success",
          Values: [categorydata],
        });
      } else {
        res.status(401).json({
          StatusCode: 400,
          Message: "Category not found",
        });
      }
    } else if (FLAG === "US") {
      const update = {
        Status,
      };
      await category.findByIdAndUpdate(CategoryID, update, {
        new: true,
      });

      res.status(201).json({ StatusCode: 200, Message: "success" });
    } else if (FLAG === "D") {
      await category.findByIdAndDelete({ _id: CategoryID });

      res.status(201).json({
        StatusCode: 200,
        Message: "success",
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
