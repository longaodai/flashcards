// controllers/api.controller.js
const db = require("../config/db");

const getRandomWords = (req, res) => {
  const sql = `SELECT word, frequency, dispersion, part, part_full, spelling, translate FROM five_thousand_words where translate is not null and spelling is not null ORDER BY RAND() LIMIT 50`;

  db.query(sql, (err, results) => {
    if (err) {
      console.error("❌ Query error:", err);
      return res
        .status(500)
        .json({ success: false, message: "Internal server error" });
    }

    return res.json({ success: true, data: results });
  });
};

module.exports = {
  getRandomWords,
};
