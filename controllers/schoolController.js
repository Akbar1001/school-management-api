const db = require("../config/db");

const addSchool = (req, res) => {
  const { name, address, latitude, longitude } = req.body;

  // Validation
  if (
    !name ||
    !address ||
    latitude === undefined ||
    longitude === undefined
  ) {
    return res.status(400).json({
      message: "All fields are required",
    });
  }

  // Validate numbers
  if (
    typeof latitude !== "number" ||
    typeof longitude !== "number"
  ) {
    return res.status(400).json({
      message: "Latitude and Longitude must be numbers",
    });
  }

  const query =
    "INSERT INTO schools(name, address, latitude, longitude) VALUES (?, ?, ?, ?)";

  db.query(
    query,
    [name, address, latitude, longitude],
    (err, result) => {
      if (err) {
        console.log(err);

        return res.status(500).json({
          message: "Database Error",
        });
      }

      res.status(201).json({
        message: "School Added Successfully",
        schoolId: result.insertId,
      });
    }
  );
};

module.exports = {
  addSchool,
};