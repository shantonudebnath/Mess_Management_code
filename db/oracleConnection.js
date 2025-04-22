const oracledb = require('oracledb');
require('dotenv').config();

// Set default output format for results
oracledb.outFormat = oracledb.OUT_FORMAT_OBJECT;

// Create and return a database connection
async function getConnection() {
  try {
    const connection = await oracledb.getConnection({
      user: process.env.DB_USER,
      password: process.env.DB_PASSWORD,
      connectionString: process.env.DB_STRING
    });

    console.log('Oracle DB connected');
    return connection;

  } catch (error) {
    console.error('Oracle DB connection error:', error);
    throw error; // Rethrow so it can be handled in the calling code
  }
}

// Function to execute a query (useful for select, insert, update)
async function executeQuery(query, binds = [], options = {}) {
  let connection;
  try {
    connection = await getConnection();
    const result = await connection.execute(query, binds, options);
    await connection.commit();
    return result;
  } catch (error) {
    console.error('Error executing query:', error);
    throw error;
  } finally {
    if (connection) {
      try {
        await connection.close();
      } catch (err) {
        console.error('Error closing connection:', err);
      }
    }
  }
}

// Function to insert payment status
async function insertPaymentStatus(user_id, total_due, status) {
  const query = `
    INSERT INTO payment_status (user_id, total_due, payment_status)
    VALUES (:user_id, :total_due, :payment_status)
  `;
  await executeQuery(query, [user_id, total_due, status]);
}

// Function to update payment status
async function updatePaymentStatus(user_id, status) {
  const query = `
    UPDATE payment_status
    SET payment_status = :status, payment_date = SYSDATE
    WHERE user_id = :user_id AND payment_status = 'Pending'
  `;
  await executeQuery(query, [user_id, status]);
}

module.exports = {
  getConnection,
  insertPaymentStatus,
  updatePaymentStatus,
  executeQuery,
};
