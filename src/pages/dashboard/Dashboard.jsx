import { Grid, Typography } from "@mui/material";
import DashboardLayout from "../../components/layout/DashboardLayout";
import StatCard from "./StatCard";

import CurrencyRupeeIcon from "@mui/icons-material/CurrencyRupee";
import PeopleIcon from "@mui/icons-material/People";
import OpacityIcon from "@mui/icons-material/Opacity";
import PaymentsIcon from "@mui/icons-material/Payments";

export default function Dashboard() {
  return (
    <DashboardLayout>
      <Typography variant="h4" fontWeight="bold" sx={{ mb: 4 }}>
        Welcome Back 👋
      </Typography>

      <Grid container spacing={3}>
        <Grid size={{ xs: 12, sm: 6, lg: 3 }}>
          <StatCard
            title="Today's Collection"
            value="245 L"
            color="#2563EB"
            icon={<OpacityIcon />}
          />
        </Grid>

        <Grid size={{ xs: 12, sm: 6, lg: 3 }}>
          <StatCard
            title="Revenue"
            value="₹18,500"
            color="#10B981"
            icon={<CurrencyRupeeIcon />}
          />
        </Grid>

        <Grid size={{ xs: 12, sm: 6, lg: 3 }}>
          <StatCard
            title="Farmers"
            value="126"
            color="#F59E0B"
            icon={<PeopleIcon />}
          />
        </Grid>

        <Grid size={{ xs: 12, sm: 6, lg: 3 }}>
          <StatCard
            title="Pending Payments"
            value="12"
            color="#EF4444"
            icon={<PaymentsIcon />}
          />
        </Grid>
      </Grid>
    </DashboardLayout>
  );
}