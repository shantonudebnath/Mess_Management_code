const express = require('express');
const router = express.Router();
const getConnection = require('../db/oracleConnection');

// Route: POST /api/meals
router.post('/', async (req, res) => {
  const { user_id, meal_date, morning, evening, night } = req.body;

  console.log(`Received data: user_id = ${user_id}, meal_date = ${meal_date}, morning = ${morning}, evening = ${evening}, night = ${night}`);

  let conn;

  try {
    conn = await getConnection();
    console.log('Connected to DB successfully!');

    // Begin a transaction explicitly
    const result = await conn.execute(
      `INSERT INTO meals 
   (user_id, meal_date, morning, evening, night)
   VALUES (:user_id, TO_DATE(:meal_date_str, 'YYYY-MM-DD'), :morning, :evening, :night)`,
  {
    user_id,
    meal_date_str: meal_date, // format: 'YYYY-MM-DD'
    morning,
    evening,
    night
  },
  { autoCommit: true }
    );

    console.log('Insert result:', result);

    // Commit the transaction explicitly
    await conn.commit();

    console.log('Data inserted successfully');
    res.status(200).json({ message: 'Meal booked successfully!' });

  } catch (error) {
    console.error('Error executing the query:', error);
    res.status(500).json({ error: 'Failed to book meal', details: error.message });
  } finally {
    if (conn) {
      try {
        await conn.close();
        console.log('Connection closed.');
      } catch (error) {
        console.error('Error closing the connection:', error);
      }
    }
  }
});

// GET /api/meals/:user_id?start=2025-04-01&end=2025-04-30
router.get('/:user_id', async (req, res) => {
    const { user_id } = req.params;
    const { start, end } = req.query;
  
    try {
      const conn = await getConnection();
      const result = await conn.execute(
        `SELECT * FROM meals
         WHERE user_id = :user_id
         AND meal_date BETWEEN TO_DATE(:start_date, 'YYYY-MM-DD') AND TO_DATE(:end_date, 'YYYY-MM-DD')`,
        {
          user_id: user_id,
          start_date: start,
          end_date: end
        }
      );
      res.status(200).json(result.rows);
    } catch (err) {
      console.error(err);
      res.status(500).json({ error: 'Failed to fetch meals' });
    }
  });

// ... other routes for meals (like POST, DELETE, etc.)

// Define the API route to get total meal count per user
router.get('/count/:user_id', async (req, res) => {
  const { user_id } = req.params;

  try {
    // Get a database connection
    const conn = await getConnection();
    
    // Query to fetch the total meal count for the user
    const result = await conn.execute(
      `SELECT COUNT(*) AS total_meals
       FROM meals
       WHERE user_id = :user_id`,
      { user_id }
    );
    
    // Respond with the meal count
    res.status(200).json({ total_meals: result.rows[0].TOTAL_MEALS });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to fetch meal count' });
  }
});

// Export the router to be used in your app
module.exports = router;

