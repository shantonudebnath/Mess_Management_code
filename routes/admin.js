const express = require('express');
const router = express.Router();
const getConnection = require('../db/oracleConnection');

// POST /api/admin/utility
router.post('/utility', async (req, res) => {
  const { house_key, category, amount, bill_month } = req.body;

  try {
    const conn = await getConnection();
    await conn.execute(
        `INSERT INTO utilities (house_key, category, amount, bill_month)
         VALUES (:house_key, :category, :amount, TO_DATE(:bill_month, 'YYYY-MM'))`,
        {
          house_key: house_key,
          category: category,
          amount: amount,
          bill_month: bill_month
        },
        { autoCommit: true }
    );
    res.status(200).json({ message: 'Utility bill added' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to insert utility bill' });
  }
});

module.exports = router;
