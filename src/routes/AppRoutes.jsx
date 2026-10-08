import { Routes, Route, Navigate } from "react-router-dom";

import Login from "../pages/auth/Login";
import Dashboard from "../pages/dashboard/Dashboard";
import Farmers from "../pages/farmers/Farmers";
import MilkEntries from "../pages/milk/MilkEntries";
import Reports from "../pages/reports/Reports";

export default function AppRoutes() {
  return (
    <Routes>
      <Route path="/" element={<Navigate to="/login" />} />

      <Route path="/login" element={<Login />} />

      <Route path="/dashboard" element={<Dashboard />} />

      <Route path="/farmers" element={<Farmers />} />

      <Route path="/milk" element={<MilkEntries />} />
      
      <Route path="/reports" element={<Reports />} />

      <Route path="/reports" element={<Reports />} />
    </Routes>
  );
}