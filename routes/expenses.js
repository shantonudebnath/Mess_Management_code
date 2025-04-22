const express = require('express');
const router = express.Router();
const getConnection = require('../db/oracleConnection');

// POST /api/expenses
router.post('/', async (req, res) => {
  const { user_id, category, amount, expense_date } = req.body;

  try {
    const conn = await getConnection();
    await conn.execute(
      `INSERT INTO expenses (user_id, category, amount, expense_date)
       VALUES (:user_id, :category, :amount, TO_DATE(:expense_date, 'YYYY-MM-DD'))`,
      { user_id, category, amount, expense_date },
      { autoCommit: true }
    );
    res.status(200).json({ message: 'Expense added successfully!' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to add expense' });
  }
});

module.exports = router;
