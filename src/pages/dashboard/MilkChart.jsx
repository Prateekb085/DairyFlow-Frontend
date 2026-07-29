import { Card, CardContent, Typography } from "@mui/material";
import { BarChart } from "@mui/x-charts/BarChart";

export default function MilkChart() {
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
          Milk Collection
        </Typography>

        <BarChart
          xAxis={[
            {
              scaleType: "band",
              data: ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"],
            },
          ]}
          series={[
            {
              data: [180, 220, 200, 260, 240, 300, 320],
            },
          ]}
          height={300}
        />
      </CardContent>
    </Card>
  );
}