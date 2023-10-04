const blog = require("../models/blogSchema");
const fs = require("fs");
const cloudinary = require("../cloudinary");

// ---- add book ----
exports.blog = async (req, res) => {
  const { FLAG, BlogID, Title, Description, Auther, CategoryID, Image } =
    req.body;

  try {
    if (FLAG === "I") {
      if (!Title || !Description || !Image || !Auther || !CategoryID) {
        return res.status(422).json({
          Message: "Please fill the required fields",
        });
      }

      const blogImg = await cloudinary.uploader.upload(Image, {
        folder: "blog",
      });

      const blogData = new blog({
        Title,
        Description,
        Auther,
        CategoryID: CategoryID,
        Image: {
          public_id: blogImg.public_id,
          url: blogImg.secure_url,
        },
      });
      await blogData.save();
      res.status(201).json({
        StatusCode: 200,
        Message: "success",
        Image: blogData.Image,
      });
    } else if (FLAG === "U") {
      if (!Title || !Description || !Image || !Auther || !CategoryID) {
        return res.status(422).json({
          Message: "Please fill the required fields",
        });
      }
      let urlRegex =
        /^(?:https?|ftp):\/\/[\w-]+(?:\.[\w-]+)+[\w.,@?^=%&amp;:/~+#-]*$/;

      // Check if the URL matches the regex pattern
      const changeImage = urlRegex.test(Image);

      let blogImg;

      if (!changeImage) {
        const updateBook = await blog.findById({ _id: BlogID });

        await cloudinary.uploader.destroy(updateBook.Image.public_id);

        blogImg = await cloudinary.uploader.upload(Image, {
          folder: "blog",
        });
      }

      let update;

      if (changeImage === false) {
        update = {
          Title,
          Auther,
          CategoryID: CategoryID,
          Description,
          Image: {
            public_id: blogImg.public_id,
            url: blogImg.secure_url,
          },
        };
      } else {
        update = {
          Title,
          Auther,
          CategoryID: CategoryID,
          Description,
        };
      }

      await blog.findByIdAndUpdate(BlogID, update, {
        new: true,
      });
      res.status(201).json({
        StatusCode: 200,
        Message: "success",
      });
    } else if (FLAG === "SI") {
      const showblog = await blog.findById({ _id: BlogID });
      if (showblog) {
        res.status(201).json({
          StatusCode: 200,
          Message: "success",
          Values: [showblog],
        });
      } else {
        res.status(401).json({
          StatusCode: 400,
          Message: "Blog not found",
        });
      }
    } else if (FLAG === "D") {
      const deleteBlog = await blog.findByIdAndDelete({ _id: BlogID });

      // Delete the image from Cloudinary
      await cloudinary.uploader.destroy(deleteBlog.Image.public_id);

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

// --- get blog ---
exports.getBlog = async (req, res) => {
  try {
    const CategoryID = req.query.CategoryID;

    let blogData;

    // Check if CategoryID is "-1" to retrieve all blogs
    if (CategoryID === "-1") {
      blogData = await blog
        .find()
        .sort({ createdAt: -1 })
        .populate("CategoryID");
    } else if (CategoryID) {
      // Retrieve blogs filtered by CategoryID and populate the Category field
      blogData = await blog
        .find({ CategoryID: CategoryID })
        .sort({ createdAt: -1 })
        .populate("CategoryID");
    } else {
      // Handle the case where no CategoryID is provided
    }

    res.status(201).json({
      StatusCode: 200,
      Message: "success",
      Values: blogData.length <= 0 ? null : blogData,
    });
  } catch (error) {
    res.status(401).json({
      StatusCode: 400,
      Message: "Blog does not exist",
    });
  }
};