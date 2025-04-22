import React, { useEffect, useState } from 'react';
import {
  getTotalUsers,
  getTotalMeals,
  getTotalExpenses,
  getBalance,
} from '../services/api';

const DashboardHome = () => {
  const [users, setUsers] = useState(0);
  const [meals, setMeals] = useState(0);
  const [expenses, setExpenses] = useState(0);
  const [balance, setBalance] = useState(0);

  useEffect(() => {
    const fetchStats = async () => {
      setUsers(await getTotalUsers());
      setMeals(await getTotalMeals());
      setExpenses(await getTotalExpenses());
      setBalance(await getBalance());
    };
    fetchStats();
  }, []);

  const stats = [
    { label: 'Total Users', value: users, color: 'bg-blue-500' },
    { label: 'Total Meals', value: meals, color: 'bg-green-500' },
    { label: 'Total Expenses', value: `৳ ${expenses}`, color: 'bg-red-500' },
    { label: 'Current Balance', value: `৳ ${balance}`, color: 'bg-yellow-500' },
  ];

  return (
    <div className="p-6 bg-gray-100 min-h-screen">
      <h1 className="text-3xl font-bold mb-6 text-gray-800">Admin Dashboard</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat, index) => (
          <div
            key={index}
            className={`${stat.color} text-white p-6 rounded-2xl shadow-lg transition-transform transform hover:scale-105`}
          >
            <h2 className="text-lg font-semibold">{stat.label}</h2>
            <p className="text-3xl font-bold mt-2">{stat.value}</p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default DashboardHome;
