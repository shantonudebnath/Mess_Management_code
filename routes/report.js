// routes/report.js
const express = require('express');
const router = express.Router();
const { getConnection, insertPaymentStatus, updatePaymentStatus, executeQuery } = require('../db/oracleConnection');

// ✅ GET monthly report for a specific user
router.get('/:user_id', async (req, res) => {
  let { user_id } = req.params;

  // Convert to number and validate
  user_id = Number(user_id);
  if (isNaN(user_id)) {
    return res.status(400).json({ error: 'Invalid user_id. Must be a number.' });
  }

  try {
    const conn = await getConnection();

    // 🏠 House Rent
    const rentQuery = await conn.execute(
      `SELECT TO_NUMBER(NVL(amount, 0)) AS amount FROM house_rent WHERE rownum = 1`
    );
    const rent = parseFloat(rentQuery.rows[0]?.AMOUNT) || 0;

    // 🍽️ Meal Count
    const mealsQuery = await conn.execute(
      `SELECT COUNT(*) AS total_meals FROM meals WHERE user_id = :user_id`,
      { user_id }
    );
    const totalMeals = parseInt(mealsQuery.rows[0]?.TOTAL_MEALS) || 0;

    // 💡 Utility Bill
    const utilityQuery = await conn.execute(
      `SELECT 
         TO_NUMBER(NVL(total_amount, 0)) AS total_amount, 
         TO_NUMBER(NVL(house_member_count, 1)) AS house_member_count
       FROM utility_bills 
       WHERE rownum = 1`
    );
    const utilityData = utilityQuery.rows[0] || {};
    const utilityBill = parseFloat(utilityData.TOTAL_AMOUNT);
    const houseMemberCount = parseInt(utilityData.HOUSE_MEMBER_COUNT);
    const utilityShare = utilityBill / houseMemberCount;

    // 🧾 Food Cost Logic
    const foodExpensePerMeal = 10;
    const foodExpense = totalMeals * foodExpensePerMeal;

    const totalExpense = rent + foodExpense + utilityShare;

    // 💾 Insert payment status
    await insertPaymentStatus(user_id, totalExpense, 'Pending');

    res.status(200).json({
      user_id,
      rent,
      foodExpense,
      utilityShare,
      totalExpense,
      totalMeals,
      utilityBill,
    });
  } catch (err) {
    console.error('Error generating report:', err);
    res.status(500).json({ error: 'Failed to generate report' });
  }
});

// ✅ Update payment status route using PUT
router.put('/:user_id/pay', async (req, res) => {
  let { user_id } = req.params;

  // Ensure user_id is a valid number
  user_id = Number(user_id);
  if (isNaN(user_id)) {
    return res.status(400).json({ error: 'Invalid user_id. Must be a number.' });
  }

  try {
    await updatePaymentStatus(user_id, 'Paid');
    res.status(200).json({ message: 'Payment status updated to Paid' });
  } catch (err) {
    console.error('Error updating payment status:', err);
    res.status(500).json({ error: 'Failed to update payment status' });
  }
});

// ✅ Update payment status via POST (alternative endpoint)
router.post('/update-payment-status', async (req, res) => {
  try {
    const { user_id, status } = req.body;

    if (!user_id || !status) {
      return res.status(400).json({ error: 'user_id and status are required' });
    }

    const numericUserId = Number(user_id);
    if (isNaN(numericUserId)) {
      return res.status(400).json({ error: 'Invalid user_id. Must be a number.' });
    }

    await updatePaymentStatus(numericUserId, status);

    return res.status(200).json({ message: 'Payment status updated successfully.' });

  } catch (err) {
    console.error('Error updating payment status:', err);
    return res.status(500).json({ error: 'Internal Server Error' });
  }
});

// ✅ GET admin monthly report
// Example: /api/report/monthly?month=4&year=2025
router.get('/monthly', async (req, res) => {
  try {
    const month = parseInt(req.query.month);
    const year = parseInt(req.query.year);

    if (isNaN(month) || isNaN(year)) {
      return res.status(400).json({ error: 'Please provide valid month and year as numbers' });
    }

    const query = `
      SELECT
        COUNT(*) AS total_users,
        SUM(total_due) AS total_due,
        SUM(CASE WHEN payment_status = 'Paid' THEN total_due ELSE 0 END) AS total_paid,
        COUNT(CASE WHEN payment_status = 'Pending' THEN 1 END) AS pending_users
      FROM payment_status
      WHERE EXTRACT(MONTH FROM created_at) = :month
        AND EXTRACT(YEAR FROM created_at) = :year
    `;

    const result = await executeQuery(query, { month, year });

    if (result.rows.length > 0) {
      res.json(result.rows[0]);
    } else {
      res.status(404).json({ error: 'No data found for the specified month and year' });
    }
  } catch (error) {
    console.error('Monthly report error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// GET /api/expenses/report/monthly?month=4&year=2025
router.get('/report/monthly', async (req, res) => {
  const { month, year } = req.query;

  if (!month || !year) {
    return res.status(400).json({ error: 'Month and Year are required' });
  }

  try {
    const conn = await getConnection();
    
    // Query to fetch monthly expenses for the given month and year
    const result = await conn.execute(
      `SELECT
        SUM(morning) AS total_morning_expenses,
        SUM(evening) AS total_evening_expenses,
        SUM(night) AS total_night_expenses,
        SUM(morning + evening + night) AS total_expenses
      FROM expenses
      WHERE EXTRACT(MONTH FROM meal_date) = :month
        AND EXTRACT(YEAR FROM meal_date) = :year`,
      { month, year }
    );

    const data = result.rows[0];
    res.status(200).json({
      total_morning_expenses: data.TOTAL_MORNING_EXPENSES,
      total_evening_expenses: data.TOTAL_EVENING_EXPENSES,
      total_night_expenses: data.TOTAL_NIGHT_EXPENSES,
      total_expenses: data.TOTAL_EXPENSES
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to fetch monthly expense report' });
  }
});

module.exports = router;
