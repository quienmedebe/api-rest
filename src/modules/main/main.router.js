const express = require('express');
const router = express.Router();

router.get('/', function (_, res) {
  res.status(200).json({
    working: true,
  });
});

module.exports = router;
