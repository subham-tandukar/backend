const booking = require("../models/bookingSchema");

// ---- add book ----
exports.booking = async (req, res) => {
  const {
    FLAG,
    BookingID,
    Fullname,
    Email,
    PhoneNumber,
    Address,
    Course,
    IsPaid,
  } = req.body;

  try {
    if (FLAG === "I") {
      if (!Fullname || !Email || !Address || !PhoneNumber || !Course) {
        return res.status(422).json({
          Message: "Please fill the required fields",
        });
      }

      const bookingData = new booking({
        Fullname,
        Email,
        PhoneNumber,
        Address,
        Course,
      });
      await bookingData.save();
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

// --- get booking ---
exports.getBooking = async (req, res) => {
  try {
    const bookingData = await booking.find().sort({ createdAt: -1 });

    res.status(201).json({
      StatusCode: 200,
      Message: "success",
      Values: bookingData.length <= 0 ? null : bookingData,
    });
  } catch (error) {
    res.status(401).json({
      StatusCode: 400,
      Message: "no booking exist",
    });
  }
};
