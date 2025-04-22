const express = require('express');
const router = express.Router();

// Sample GET
router.get('/', (req, res) => {
  res.send('Auth route working');
});

module.exports = router;
