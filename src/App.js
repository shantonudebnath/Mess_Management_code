import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';

import Sidebar from './components/Sidebar';
import Navbar from './components/Navbar';

import DashboardHome from './pages/DashboardHome';
import UserList from './pages/UserList';
import MealReports from './pages/MealReports';
import ExpenseReports from './pages/ExpenseReports';
import MonthlySummary from './pages/MonthlySummary';

const App = () => {
  return (
    <Router>
      <div className="flex">
        <Sidebar />
        <div className="flex-1">
          <Navbar />
          <div className="p-6">
            <Routes>
              <Route path="/" element={<DashboardHome />} />
              <Route path="/users" element={<UserList />} />
              <Route path="/meals" element={<MealReports />} />
              <Route path="/expenses" element={<ExpenseReports />} />
              <Route path="/monthly" element={<MonthlySummary />} />
            </Routes>
          </div>
        </div>
      </div>
    </Router>
  );
};

export default App;
