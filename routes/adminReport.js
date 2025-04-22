const express = require('express');
const router = express.Router();
const oracleConnection = require('../db/oracleConnection'); // Adjust path if needed

// API to get the full monthly report for all users
router.get('/monthly-report/:month/:year', async (req, res) => {
    const { month, year } = req.params;

    try {
        // Convert month and year into a date range for the report
        const start_date = `${year}-${month}-01`;
        const end_date = `${year}-${month}-31`;

        // SQL query to get the report
        const query = `
        SELECT
            u.username,
            SUM(f.expense_amount) AS total_food_expense,
            r.rent_amount / h.total_members AS rent_share,
            u.utility_bill / h.total_members AS utility_share,
            (SUM(f.expense_amount) + (r.rent_amount / h.total_members) + (u.utility_bill / h.total_members)) AS total_due,
            CASE
                WHEN (u.total_payment >= (SUM(f.expense_amount) + (r.rent_amount / h.total_members) + (u.utility_bill / h.total_members)))
                THEN 'Paid'
                ELSE 'Unpaid'
            END AS payment_status
        FROM users u
        JOIN meals f ON u.user_id = f.user_id
        JOIN rent r ON r.house_key = u.house_key
        JOIN utility u ON u.house_key = r.house_key
        JOIN house_members h ON h.house_key = u.house_key
        WHERE f.date BETWEEN :start_date AND :end_date
        GROUP BY u.username, r.rent_amount, u.utility_bill, h.total_members
        ORDER BY u.username;
        `;

        // Execute the query using the new executeQuery function
        const result = await oracleConnection.executeQuery(query, [start_date, end_date]);

        // Send the result as a response
        res.status(200).json(result.rows);
    } catch (error) {
        console.error("Error fetching monthly report:", error);
        res.status(500).json({ error: "Failed to fetch the monthly report." });
    }
});

module.exports = router;
