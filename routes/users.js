const express = require('express');
const router = express.Router();
const getConnection = require('../db/oracleConnection'); // Your database connection file

// POST /api/users - Add a new user
router.post('/', async (req, res) => {
  const { name, email, role } = req.body;

  let conn;

  try {
    conn = await getConnection();
    console.log('Connected to DB successfully!');

    const result = await conn.execute(
      `INSERT INTO users (name, email, role)
       VALUES (:name, :email, :role)`,
      { name, email, role },
      { autoCommit: true }
    );

    console.log('Insert result:', result);
    res.status(201).json({ message: 'User created successfully!' });
  } catch (error) {
    console.error('Error executing the query:', error);
    res.status(500).json({ error: 'Failed to create user', details: error.message });
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

// GET /api/users - Get all users
router.get('/', async (req, res) => {
  let conn;

  try {
    conn = await getConnection();
    console.log('Connected to DB successfully!');

    const result = await conn.execute(`SELECT * FROM users`);
    res.status(200).json(result.rows);
  } catch (error) {
    console.error('Error fetching users:', error);
    res.status(500).json({ error: 'Failed to fetch users', details: error.message });
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

// PUT /api/users/:user_id - Update user
router.put('/:user_id', async (req, res) => {
  const { user_id } = req.params;
  const { name, email, role } = req.body;

  let conn;

  try {
    conn = await getConnection();
    console.log('Connected to DB successfully!');

    const result = await conn.execute(
      `UPDATE users
       SET name = :name, email = :email, role = :role
       WHERE user_id = :user_id`,
      { name, email, role, user_id },
      { autoCommit: true }
    );

    if (result.rowsAffected > 0) {
      res.status(200).json({ message: 'User updated successfully!' });
    } else {
      res.status(404).json({ message: 'User not found' });
    }
  } catch (error) {
    console.error('Error executing the query:', error);
    res.status(500).json({ error: 'Failed to update user', details: error.message });
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

// DELETE /api/users/:user_id - Delete user
router.delete('/:user_id', async (req, res) => {
  const { user_id } = req.params;

  let conn;

  try {
    conn = await getConnection();
    console.log('Connected to DB successfully!');

    const result = await conn.execute(
      `DELETE FROM users WHERE user_id = :user_id`,
      { user_id },
      { autoCommit: true }
    );

    if (result.rowsAffected > 0) {
      res.status(200).json({ message: 'User deleted successfully!' });
    } else {
      res.status(404).json({ message: 'User not found' });
    }
  } catch (error) {
    console.error('Error executing the query:', error);
    res.status(500).json({ error: 'Failed to delete user', details: error.message });
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

module.exports = router;
