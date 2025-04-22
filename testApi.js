const axios = require('axios');

const data = {
  user_id: 1,
  meal_date: '2025-04-17',
  morning: 1,
  evening: 0,
  night: 1
};

axios.post('http://localhost:5000/api/meals', data)
  .then(response => {
    console.log('Response:', response.data);
  })
  .catch(error => {
    console.error('Error:', error);
  });
