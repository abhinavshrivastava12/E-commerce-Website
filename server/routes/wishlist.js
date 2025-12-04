const express = require("express");
const router = express.Router();

// temporarily return empty wishlist
router.get("/", (req, res) => {
  res.json({ success: true, wishlist: [] });
});

module.exports = router;
