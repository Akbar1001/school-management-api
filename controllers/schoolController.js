const db = require("../config/db");


// =========================
// ADD SCHOOL API
// =========================
const addSchool = (req, res) => {
  const { name, address, latitude, longitude } = req.body;

  // Validate required fields
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

  // Validate latitude & longitude are numbers
  if (
    isNaN(latitude) ||
    isNaN(longitude)
  ) {
    return res.status(400).json({
      message: "Latitude and Longitude must be valid numbers",
    });
  }

  // Validate coordinate ranges
  if (
    latitude < -90 ||
    latitude > 90 ||
    longitude < -180 ||
    longitude > 180
  ) {
    return res.status(400).json({
      message: "Invalid latitude or longitude range",
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

      return res.status(201).json({
        message: "School Added Successfully",
        schoolId: result.insertId,
      });
    }
  );
};


// =========================
// DISTANCE CALCULATION
// Haversine Formula
// =========================
function calculateDistance(lat1, lon1, lat2, lon2) {
  const toRadians = (degree) => degree * (Math.PI / 180);

  const earthRadius = 6371; // Earth's radius in KM

  const dLat = toRadians(lat2 - lat1);
  const dLon = toRadians(lon2 - lon1);

  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(toRadians(lat1)) *
      Math.cos(toRadians(lat2)) *
      Math.sin(dLon / 2) *
      Math.sin(dLon / 2);

  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));

  return earthRadius * c;
}


// =========================
// LIST SCHOOLS API
// =========================
const listSchools = (req, res) => {
  const userLatitude = parseFloat(req.query.latitude);
  const userLongitude = parseFloat(req.query.longitude);

  // Validate query params
  if (
    isNaN(userLatitude) ||
    isNaN(userLongitude)
  ) {
    return res.status(400).json({
      message: "Valid latitude and longitude are required",
    });
  }

  // Validate coordinate ranges
  if (
    userLatitude < -90 ||
    userLatitude > 90 ||
    userLongitude < -180 ||
    userLongitude > 180
  ) {
    return res.status(400).json({
      message: "Invalid latitude or longitude range",
    });
  }

  const query = "SELECT * FROM schools";

  db.query(query, (err, results) => {
    if (err) {
      console.log(err);

      return res.status(500).json({
        message: "Database Error",
      });
    }

    // Add distance to each school
    const schoolsWithDistance = results.map((school) => {
      const distance = calculateDistance(
        userLatitude,
        userLongitude,
        school.latitude,
        school.longitude
      );

      return {
        ...school,
        distance: `${distance.toFixed(2)} km`,
      };
    });

    // Sort by nearest school
    schoolsWithDistance.sort(
      (a, b) =>
        parseFloat(a.distance) - parseFloat(b.distance)
    );

    return res.status(200).json(schoolsWithDistance);
  });
};


module.exports = {
  addSchool,
  listSchools,
};