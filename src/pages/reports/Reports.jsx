import { useState } from "react";
import {
  Box,
  Card,
  CardContent,
  Typography,
  TextField,
  Button,
  Grid,
  Alert,
  CircularProgress,
} from "@mui/material";

import { DataGrid } from "@mui/x-data-grid";
import SearchIcon from "@mui/icons-material/Search";
import LocalDrinkIcon from "@mui/icons-material/LocalDrink";
import CurrencyRupeeIcon from "@mui/icons-material/CurrencyRupee";
import AgricultureIcon from "@mui/icons-material/Agriculture";

import api from "../../services/api";
import DashboardLayout from "../../components/layout/DashboardLayout";

export default function Reports() {
  const [date, setDate] = useState("");
  const [reports, setReports] = useState([]);
  const [loading, setLoading] = useState(false);
  const [searched, setSearched] = useState(false);
  const [error, setError] = useState("");

  const generateReport = async () => {
    if (!date) {
      setError("Please select a date.");
      return;
    }

    try {
      setLoading(true);
      setError("");
      setSearched(true);

      const response = await api.get("/reports/daily", {
        params: {
          date: date,
        },
      });

      setReports(response.data);
    } catch (err) {
      console.error("Report Error:", err);

      setReports([]);

      setError(
        err.response?.data?.message ||
          "Unable to load the daily report."
      );
    } finally {
      setLoading(false);
    }
  };

  // Total milk
  const totalMilk = reports.reduce(
    (sum, item) => sum + Number(item.quantity || 0),
    0
  );

  // Total amount
  const totalAmount = reports.reduce(
    (sum, item) => sum + Number(item.totalAmount || 0),
    0
  );

  // Cow milk
  const cowMilk = reports
    .filter(
      (item) =>
        item.milkType?.toLowerCase() === "cow"
    )
    .reduce(
      (sum, item) => sum + Number(item.quantity || 0),
      0
    );

  // Buffalo milk
  const buffaloMilk = reports
    .filter(
      (item) =>
        item.milkType?.toLowerCase() === "buffalo"
    )
    .reduce(
      (sum, item) => sum + Number(item.quantity || 0),
      0
    );

  const columns = [
    {
      field: "farmerName",
      headerName: "Farmer Name",
      flex: 1.2,
      minWidth: 150,
    },
    {
      field: "milkType",
      headerName: "Milk Type",
      flex: 1,
      minWidth: 120,
    },
    {
      field: "quantity",
      headerName: "Quantity (L)",
      flex: 1,
      minWidth: 120,
      valueFormatter: (params) =>
        `${Number(params).toFixed(2)} L`,
    },
    {
      field: "fatPercentage",
      headerName: "Fat %",
      flex: 0.8,
      minWidth: 90,
      valueFormatter: (params) =>
        `${Number(params).toFixed(2)}%`,
    },
    {
      field: "ratePerLiter",
      headerName: "Rate/L",
      flex: 0.9,
      minWidth: 100,
      valueFormatter: (params) =>
        `₹${Number(params).toFixed(2)}`,
    },
    {
      field: "totalAmount",
      headerName: "Total Amount",
      flex: 1,
      minWidth: 130,
      valueFormatter: (params) =>
        `₹${Number(params).toFixed(2)}`,
    },
  ];

  const rows = reports.map((item, index) => ({
    id: index + 1,
    ...item,
  }));

  return (
    <DashboardLayout>
      <Box>

        {/* Header */}
        <Box
          sx={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            mb: 3,
          }}
        >
          <Box>
            <Typography
              variant="h4"
              fontWeight="700"
              sx={{ color: "#1E293B" }}
            >
              Daily Milk Report
            </Typography>

            <Typography
              variant="body2"
              sx={{ color: "#64748B", mt: 0.5 }}
            >
              View milk collection and payment details for a selected date.
            </Typography>
          </Box>
        </Box>

        {/* Date Search */}
        <Card
          sx={{
            mb: 3,
            borderRadius: 3,
            boxShadow: "0 4px 15px rgba(0,0,0,0.06)",
          }}
        >
          <CardContent>
            <Box
              sx={{
                display: "flex",
                gap: 2,
                alignItems: "center",
                flexWrap: "wrap",
              }}
            >
             <Box sx={{ minWidth: 220 }}>
  <Typography
    variant="body2"
    sx={{
      mb: 0.8,
      fontWeight: 600,
      color: "#475569",
    }}
  >
    Select Date
  </Typography>

  <TextField
    type="date"
    value={date}
    onChange={(e) => {
      setDate(e.target.value);
      setError("");
    }}
    fullWidth
    sx={{
      "& .MuiInputBase-root": {
        height: 56,
        borderRadius: 2,
      },
    }}
  />
</Box>

              <Button
                variant="contained"
                startIcon={<SearchIcon />}
                onClick={generateReport}
                disabled={loading}
                sx={{
                  height: 56,
                  px: 3,
                  textTransform: "none",
                  borderRadius: 2,
                }}
              >
                {loading ? (
                  <CircularProgress
                    size={24}
                    color="inherit"
                  />
                ) : (
                  "Generate Report"
                )}
              </Button>
            </Box>
          </CardContent>
        </Card>

        {/* Error */}
        {error && (
          <Alert
            severity="error"
            sx={{ mb: 3 }}
          >
            {error}
          </Alert>
        )}

        {/* Summary Cards */}
        {searched && (
          <Grid
            container
            spacing={2}
            sx={{ mb: 3 }}
          >

            {/* Total Milk */}
            <Grid item xs={12} sm={6} md={3}>
              <Card
                sx={{
                  borderRadius: 3,
                  boxShadow:
                    "0 4px 15px rgba(0,0,0,0.06)",
                }}
              >
                <CardContent>
                  <Box
                    sx={{
                      display: "flex",
                      justifyContent: "space-between",
                    }}
                  >
                    <Box>
                      <Typography
                        variant="body2"
                        color="text.secondary"
                      >
                        Total Milk
                      </Typography>

                      <Typography
                        variant="h5"
                        fontWeight="700"
                        sx={{ mt: 1 }}
                      >
                        {totalMilk.toFixed(2)} L
                      </Typography>
                    </Box>

                    <LocalDrinkIcon
                      sx={{
                        fontSize: 40,
                        color: "#2563EB",
                      }}
                    />
                  </Box>
                </CardContent>
              </Card>
            </Grid>

            {/* Cow Milk */}
            <Grid item xs={12} sm={6} md={3}>
              <Card
                sx={{
                  borderRadius: 3,
                  boxShadow:
                    "0 4px 15px rgba(0,0,0,0.06)",
                }}
              >
                <CardContent>
                  <Box
                    sx={{
                      display: "flex",
                      justifyContent: "space-between",
                    }}
                  >
                    <Box>
                      <Typography
                        variant="body2"
                        color="text.secondary"
                      >
                        Cow Milk
                      </Typography>

                      <Typography
                        variant="h5"
                        fontWeight="700"
                        sx={{ mt: 1 }}
                      >
                        {cowMilk.toFixed(2)} L
                      </Typography>
                    </Box>

                    <AgricultureIcon
                      sx={{
                        fontSize: 40,
                        color: "#16A34A",
                      }}
                    />
                  </Box>
                </CardContent>
              </Card>
            </Grid>

            {/* Buffalo Milk */}
            <Grid item xs={12} sm={6} md={3}>
              <Card
                sx={{
                  borderRadius: 3,
                  boxShadow:
                    "0 4px 15px rgba(0,0,0,0.06)",
                }}
              >
                <CardContent>
                  <Box
                    sx={{
                      display: "flex",
                      justifyContent: "space-between",
                    }}
                  >
                    <Box>
                      <Typography
                        variant="body2"
                        color="text.secondary"
                      >
                        Buffalo Milk
                      </Typography>

                      <Typography
                        variant="h5"
                        fontWeight="700"
                        sx={{ mt: 1 }}
                      >
                        {buffaloMilk.toFixed(2)} L
                      </Typography>
                    </Box>

                    <AgricultureIcon
                      sx={{
                        fontSize: 40,
                        color: "#9333EA",
                      }}
                    />
                  </Box>
                </CardContent>
              </Card>
            </Grid>

            {/* Total Amount */}
            <Grid item xs={12} sm={6} md={3}>
              <Card
                sx={{
                  borderRadius: 3,
                  boxShadow:
                    "0 4px 15px rgba(0,0,0,0.06)",
                }}
              >
                <CardContent>
                  <Box
                    sx={{
                      display: "flex",
                      justifyContent: "space-between",
                    }}
                  >
                    <Box>
                      <Typography
                        variant="body2"
                        color="text.secondary"
                      >
                        Total Amount
                      </Typography>

                      <Typography
                        variant="h5"
                        fontWeight="700"
                        sx={{ mt: 1 }}
                      >
                        ₹{totalAmount.toFixed(2)}
                      </Typography>
                    </Box>

                    <CurrencyRupeeIcon
                      sx={{
                        fontSize: 40,
                        color: "#F59E0B",
                      }}
                    />
                  </Box>
                </CardContent>
              </Card>
            </Grid>

          </Grid>
        )}

        {/* Report Table */}
        {searched && (
          <Card
            sx={{
              borderRadius: 3,
              boxShadow:
                "0 4px 15px rgba(0,0,0,0.06)",
            }}
          >
            <CardContent>
              <Typography
                variant="h6"
                fontWeight="600"
                sx={{ mb: 2 }}
              >
                Daily Collection Details
              </Typography>

              {reports.length === 0 ? (
                <Alert severity="info">
                  No milk collection records found for{" "}
                  <strong>{date}</strong>.
                </Alert>
              ) : (
                <Box sx={{ width: "100%" }}>
                  <DataGrid
                    rows={rows}
                    columns={columns}
                    autoHeight
                    pageSizeOptions={[5, 10, 25]}
                    initialState={{
                      pagination: {
                        paginationModel: {
                          pageSize: 10,
                          page: 0,
                        },
                      },
                    }}
                    disableRowSelectionOnClick
                  />
                </Box>
              )}
            </CardContent>
          </Card>
        )}

      </Box>
    </DashboardLayout>
  );
}