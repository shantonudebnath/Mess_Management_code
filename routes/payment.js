const express = require('express');
const router = express.Router();
const db = require('../db/oracleConnection');

// Create payment status record per user
router.post('/generate', async (req, res) => {
  const { user_id, month_year, total_due } = req.body;

  try {
    const result = await db.execute(
      `INSERT INTO payment_status (user_id, month_year, total_due)
       VALUES (:user_id, :month_year, :total_due)`,
      { user_id, month_year, total_due }
    );
    res.json({ success: true, message: 'Payment record generated' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'DB insert error' });
  }
});

// Get payment status by user
router.get('/:userId', async (req, res) => {
  const userId = req.params.userId;

  try {
    const result = await db.execute(
      `SELECT * FROM payment_status WHERE user_id = :userId`,
      { userId }
    );
    res.json(result.rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Fetch failed' });
  }
});

// Update payment (admin)
router.put('/:id', async (req, res) => {
  const paymentId = req.params.id;
  const { total_paid, status } = req.body;

  try {
    const result = await db.execute(
      `UPDATE payment_status 
       SET total_paid = :total_paid, status = :status, updated_at = SYSDATE
       WHERE id = :paymentId`,
      { total_paid, status, paymentId }
    );
    res.json({ success: true, message: 'Payment updated' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Update failed' });
  }
});

module.exports = router;
