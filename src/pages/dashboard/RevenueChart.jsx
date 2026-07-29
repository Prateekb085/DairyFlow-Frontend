import { Card, CardContent, Typography } from "@mui/material";
import { LineChart } from "@mui/x-charts/LineChart";

export default function RevenueChart() {
  return (
    <Card
      elevation={0}
      sx={{
        borderRadius: 4,
        border: "1px solid #E5E7EB",
        height: "100%",
      }}
    >
      <CardContent>
        <Typography
          variant="h6"
          fontWeight="bold"
          mb={2}
        >
          Revenue (Last 7 Days)
        </Typography>

        <LineChart
          xAxis={[
            {
              scaleType: "point",
              data: ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"],
            },
          ]}
          series={[
            {
              data: [12000, 18000, 15000, 22000, 19000, 25000, 28000],
            },
          ]}
          height={300}
        />
      </CardContent>
    </Card>
  );
}