import React from 'react';
import { Link } from 'react-router-dom';

const Sidebar = () => {
  return (
    <div className="w-64 bg-gray-800 text-white min-h-screen p-4">
      <h1 className="text-2xl font-bold mb-6">Admin Panel</h1>
      <nav className="flex flex-col space-y-4">
        <Link to="/" className="hover:text-blue-400">Dashboard</Link>
        <Link to="/users" className="hover:text-blue-400">Users</Link>
        <Link to="/meals" className="hover:text-blue-400">Meal Reports</Link>
        <Link to="/expenses" className="hover:text-blue-400">Expense Reports</Link>
        <Link to="/monthly" className="hover:text-blue-400">Monthly Summary</Link>
      </nav>
    </div>
  );
};

export default Sidebar;
