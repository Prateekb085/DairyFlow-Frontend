
import { Routes, Route, Navigate } from "react-router-dom";

import Login from "../pages/auth/Login";
import Dashboard from "../pages/dashboard/Dashboard";
import Farmers from "../pages/farmers/Farmers";
import MilkEntries from "../pages/milk/MilkEntries";
import Reports from "../pages/reports/Reports";
import Payments from "../pages/payments/Payments";

export default function AppRoutes() {
  return (
    <Routes>
      <Route path="/" element={<Navigate to="/login" replace />} />

      <Route path="/login" element={<Login />} />
      <Route path="/dashboard" element={<Dashboard />} />
      <Route path="/farmers" element={<Farmers />} />
      <Route path="/milk" element={<MilkEntries />} />
      <Route path="/payments" element={<Payments />} />
      <Route path="/reports" element={<Reports />} />
    </Routes>
  );
}
