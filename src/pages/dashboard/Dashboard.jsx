import { Grid, Typography } from "@mui/material";
import DashboardLayout from "../../components/layout/DashboardLayout";
import StatCard from "./StatCard";

import CurrencyRupeeIcon from "@mui/icons-material/CurrencyRupee";
import PeopleIcon from "@mui/icons-material/People";
import OpacityIcon from "@mui/icons-material/Opacity";
import PaymentsIcon from "@mui/icons-material/Payments";

import RevenueChart from "./RevenueChart";
import MilkChart from "./MilkChart";
import RecentActivity from "./RecentActivity";

import { useEffect, useState } from "react";
import api from "../../services/api";

export default function Dashboard() {

  // Dashboard State
  const [dashboard, setDashboard] = useState({
    todayMilkCollection: 0,
    todayRevenue: 0,
    totalFarmers: 0,
    pendingPayments: 0,
  });

  // Fetch Dashboard Data
  useEffect(() => {
    api
      .get("/dashboard")
      .then((response) => {
        setDashboard(response.data);
      })
      .catch((error) => {
        console.error("Dashboard API Error:", error);
      });
  }, []);

  return (
    <DashboardLayout>
      <Typography variant="h4" fontWeight="bold" sx={{ mb: 4 }}>
        Welcome Back 👋
      </Typography>

      <Grid container spacing={3}>
        <Grid size={{ xs: 12, sm: 6, lg: 3 }}>
          <StatCard
            title="Today's Collection"
            value={`${dashboard.todayMilkCollection} L`}
            color="#2563EB"
            icon={<OpacityIcon />}
          />
        </Grid>

        <Grid size={{ xs: 12, sm: 6, lg: 3 }}>
          <StatCard
            title="Revenue"
            value={`₹${dashboard.todayRevenue}`}
            color="#10B981"
            icon={<CurrencyRupeeIcon />}
          />
        </Grid>

        <Grid size={{ xs: 12, sm: 6, lg: 3 }}>
          <StatCard
            title="Farmers"
            value={dashboard.totalFarmers}
            color="#F59E0B"
            icon={<PeopleIcon />}
          />
        </Grid>

        <Grid size={{ xs: 12, sm: 6, lg: 3 }}>
          <StatCard
            title="Pending Payments"
            value={dashboard.pendingPayments}
            color="#EF4444"
            icon={<PaymentsIcon />}
          />
        </Grid>
      </Grid>

      <Grid container spacing={3} sx={{ mt: 2 }}>
        <Grid size={{ xs: 12, lg: 6 }}>
          <RevenueChart />
        </Grid>

        <Grid size={{ xs: 12, lg: 6 }}>
          <MilkChart />
        </Grid>
      </Grid>

      <RecentActivity />
    </DashboardLayout>
  );
}