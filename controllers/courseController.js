const course = require("../models/courseSchema");
const fs = require("fs");
const cloudinary = require("../cloudinary");

// ---- add book ----
exports.course = async (req, res) => {
  const { FLAG, CourseID, Title, Price, NoOfSeat, Image } = req.body;

  try {
    if (FLAG === "I") {
      if (!Title || !Price || !Image || !NoOfSeat) {
        return res.status(422).json({
          Message: "Please fill the required fields",
        });
      }
      if (Price < 0 || NoOfSeat < 0) {
        return res.status(422).json({
          Message: "Must be more than zero",
        });
      }

      const courseImg = await cloudinary.uploader.upload(Image, {
        folder: "course",
      });

      const courseData = new course({
        Title,
        Price,
        NoOfSeat,
        Image: {
          public_id: courseImg.public_id,
          url: courseImg.secure_url,
        },
      });
      await courseData.save();
      res.status(201).json({
        StatusCode: 200,
        Message: "success",
        Image: courseData.Image,
      });
    } else if (FLAG === "U") {
      if (!Title || !Price || !Image || !NoOfSeat) {
        return res.status(422).json({
          Message: "Please fill the required fields",
        });
      }
      if (Price < 0 || NoOfSeat < 0) {
        return res.status(422).json({
          Message: "Must be more than zero",
        });
      }
      let urlRegex =
        /^(?:https?|ftp):\/\/[\w-]+(?:\.[\w-]+)+[\w.,@?^=%&amp;:/~+#-]*$/;

      // Check if the URL matches the regex pattern
      const changeImage = urlRegex.test(Image);

      let courseImg;

      if (!changeImage) {
        const updateBook = await course.findById({ _id: CourseID });

        await cloudinary.uploader.destroy(updateBook.Image.public_id);

        courseImg = await cloudinary.uploader.upload(Image, {
          folder: "course",
        });
      }

      let update;

      if (changeImage === false) {
        update = {
          Title,
          NoOfSeat,
          Price,
          Image: {
            public_id: courseImg.public_id,
            url: courseImg.secure_url,
          },
        };
      } else {
        update = {
          Title,
          NoOfSeat,
          Price,
        };
      }

      await course.findByIdAndUpdate(CourseID, update, {
        new: true,
      });
      res.status(201).json({
        StatusCode: 200,
        Message: "success",
      });
    } else if (FLAG === "BOOKED") {
      const update = {
        $inc: { NoOfSeat: -1 } // Decrement NoOfSeat by 1
      };

      await category.findByIdAndUpdate(CourseID, update, {
        new: true,
      });
      res.status(201).json({
        StatusCode: 200,
        Message: "success",
      });
    } else if (FLAG === "SI") {
      const showcourse = await course.findById({ _id: CourseID });
      if (showcourse) {
        res.status(201).json({
          StatusCode: 200,
          Message: "success",
          Values: [showcourse],
        });
      } else {
        res.status(401).json({
          StatusCode: 400,
          Message: "course not found",
        });
      }
    } else if (FLAG === "D") {
      const deletecourse = await course.findByIdAndDelete({ _id: CourseID });

      // Delete the image from Cloudinary
      await cloudinary.uploader.destroy(deletecourse.Image.public_id);

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

// --- get course ---
exports.getCourse = async (req, res) => {
  try {
    const courseData = await course.find().sort({ createdAt: -1 });

    res.status(201).json({
      StatusCode: 200,
      Message: "success",
      Values: courseData.length <= 0 ? null : courseData,
    });
  } catch (error) {
    res.status(401).json({
      StatusCode: 400,
      Message: "course does not exist",
    });
  }
};
