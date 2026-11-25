
import { Routes, Route, Navigate } from "react-router-dom";

import Login from "../pages/auth/Login";
import Dashboard from "../pages/dashboard/Dashboard";
import Farmers from "../pages/farmers/Farmers";
import MilkEntries from "../pages/milk/MilkEntries";
import Reports from "../pages/reports/Reports";
import Payments from "../pages/payments/Payments";
import ProtectedRoute from "./ProtectedRoute";
import Settings from "../pages/settings/Settings";
import CustomerBills from "../customer/CustomerBills";

export default function AppRoutes() {
  return (
    <Routes>
      <Route path="/" element={<Navigate to="/dashboard" replace />} />

      <Route path="/login" element={<Login />} />

      <Route element={<ProtectedRoute />}>
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/farmers" element={<Farmers />} />
        <Route path="/milk" element={<MilkEntries />} />
        <Route path="/payments" element={<Payments />} />
        <Route path="/customer-bills" element={<CustomerBills />} />
        <Route path="/reports" element={<Reports />} />
        <Route path="/settings" element={<Settings />} />
      </Route>

      <Route path="*" element={<Navigate to="/dashboard" replace />} />
    </Routes>
  );
}
