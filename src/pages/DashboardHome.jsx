import React, { useEffect, useState } from 'react';
import axios from 'axios';

const DashboardHome = () => {
  const [stats, setStats] = useState({
    total_users: 0,
    total_meals: 0,
    total_expenses: 0,
    balance: 0,
  });

  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const today = new Date();
        const month = today.getMonth() + 1; // JavaScript month is 0-based
        const year = today.getFullYear();

        const res = await axios.get(`http://localhost:5000/api/admin/monthly-report?month=${month}&year=${year}`);
        setStats(res.data);
      } catch (error) {
        console.error('Failed to fetch stats:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchStats();
  }, []);

  if (loading) return <div className="p-4 text-lg">Loading dashboard...</div>;

  return (
    <div className="grid grid-cols-2 gap-4 p-4">
      <div className="bg-white shadow-xl rounded-2xl p-6">
        <h2 className="text-xl font-semibold mb-2">Total Users</h2>
        <p className="text-2xl">{stats.total_users}</p>
      </div>
      <div className="bg-white shadow-xl rounded-2xl p-6">
        <h2 className="text-xl font-semibold mb-2">Total Meals</h2>
        <p className="text-2xl">{stats.total_meals}</p>
      </div>
      <div className="bg-white shadow-xl rounded-2xl p-6">
        <h2 className="text-xl font-semibold mb-2">Total Expenses</h2>
        <p className="text-2xl">{stats.total_expenses} BDT</p>
      </div>
      <div className="bg-white shadow-xl rounded-2xl p-6">
        <h2 className="text-xl font-semibold mb-2">Balance</h2>
        <p className="text-2xl">{stats.balance} BDT</p>
      </div>
    </div>
  );
};

export default DashboardHome;
