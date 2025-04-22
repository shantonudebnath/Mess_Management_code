const express = require('express');
const cors = require('cors');
const app = express();
const db = require('./db/oracleConnection');
// Middleware
app.use(cors()); // Enable Cross-Origin Request Sharing
app.use(express.json()); // Parse incoming JSON requests

// Increase timeout to 5 minutes (300000ms) for handling long requests
app.timeout = 300000;

// Routes
app.use('/api/meals', require('./routes/meals')); // Meals route
app.use('/api/expenses', require('./routes/expenses'));
app.use('/api/admin', require('./routes/admin'));
app.use('/api/auth', require('./routes/auth'));

const reportRoute = require('./routes/report'); // Import route
app.use('/api/report', reportRoute);           // Add to Express app

const paymentRoutes = require('./routes/payment');
app.use('/api/payment', paymentRoutes);

const adminReportRoutes = require('./routes/adminReport');
app.use('/api/admin', adminReportRoutes);
const bodyParser = require('body-parser');
const usersRouter = require('./routes/users'); // Adjust the path to where your users.js is located

app.use(bodyParser.json()); // For parsing JSON bodies
app.use('/api/users', usersRouter);


// Server setup
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
