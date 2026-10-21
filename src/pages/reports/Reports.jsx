import { useEffect, useState } from "react";
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
  Tabs,
  Tab,
  MenuItem,
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

  const [activeTab, setActiveTab] = useState(0);

  const [farmers, setFarmers] = useState([]);
const [selectedFarmer, setSelectedFarmer] = useState("");
const [farmerReports, setFarmerReports] = useState([]);
const [farmerLoading, setFarmerLoading] = useState(false);
const [farmerSearched, setFarmerSearched] = useState(false);
const [farmerError, setFarmerError] = useState("");
const [paymentHistory, setPaymentHistory] = useState([]);
const [paymentHistoryLoading, setPaymentHistoryLoading] = useState(false);
const [paymentHistorySearched, setPaymentHistorySearched] = useState(false);
const [paymentHistoryError, setPaymentHistoryError] = useState("");

useEffect(() => {
  const loadFarmers = async () => {
    try {
      const response = await api.get("/farmers");

      console.log("Farmers API response:", response.data);

      setFarmers(
        Array.isArray(response.data) ? response.data : []
      );
    } catch (err) {
      console.error("Failed to load farmers:", err);
      console.error("API error:", err.response?.status, err.response?.data);
      setFarmerError("Unable to load farmers.");
    }
  };

  loadFarmers();
}, []);

const [month, setMonth] = useState(
  String(new Date().getMonth() + 1)
);

const [year, setYear] = useState(
  String(new Date().getFullYear())
);

const [monthlyReports, setMonthlyReports] = useState([]);
const [monthlyLoading, setMonthlyLoading] = useState(false);
const [monthlySearched, setMonthlySearched] = useState(false);
const [monthlyError, setMonthlyError] = useState("");

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

  const generateMonthlyReport = async () => {
  const selectedMonth = Number(month);
  const selectedYear = Number(year);

  if (
    !Number.isInteger(selectedMonth) ||
    selectedMonth < 1 ||
    selectedMonth > 12
  ) {
    setMonthlyError("Please select a valid month.");
    return;
  }

  if (
    !Number.isInteger(selectedYear) ||
    selectedYear < 2000 ||
    selectedYear > 2100
  ) {
    setMonthlyError("Please enter a valid year.");
    return;
  }

  try {
    setMonthlyLoading(true);
    setMonthlyError("");
    setMonthlySearched(true);

    const response = await api.get("/reports/monthly", {
      params: {
        month: selectedMonth,
        year: selectedYear,
      },
    });

    setMonthlyReports(
      Array.isArray(response.data) ? response.data : []
    );
  } catch (err) {
    console.error("Monthly Report Error:", err);

    setMonthlyReports([]);

    setMonthlyError(
      err.response?.data?.message ||
        "Unable to load the monthly report."
    );
  } finally {
    setMonthlyLoading(false);
  }
};
const generateFarmerReport = async () => {
  if (!selectedFarmer) {
    setFarmerError("Please select a farmer.");
    return;
  }

  try {
    setFarmerLoading(true);
    setFarmerError("");
    setFarmerSearched(true);
    setFarmerReports([]);

    const response = await api.get(
      `/reports/farmer/${selectedFarmer}`
    );

    setFarmerReports(
      Array.isArray(response.data) ? response.data : []
    );
  } catch (err) {
    console.error("Farmer Report Error:", err);
    setFarmerReports([]);

    setFarmerError(
      err.response?.data?.message ||
        "Unable to load the farmer report."
    );
  } finally {
    setFarmerLoading(false);
  }
};

const generatePaymentHistory = async () => {
  if (!selectedFarmer) {
    setPaymentHistoryError("Please select a farmer.");
    return;
  }

  try {
    setPaymentHistoryLoading(true);
    setPaymentHistoryError("");
    setPaymentHistorySearched(true);

    const response = await api.get(
      `/payments/history/${selectedFarmer}`
    );

    setPaymentHistory(
      Array.isArray(response.data) ? response.data : []
    );
  } catch (err) {
    console.error("Payment History Error:", err);
    setPaymentHistory([]);

    setPaymentHistoryError(
      err.response?.data?.message ||
        "Unable to load payment history."
    );
  } finally {
    setPaymentHistoryLoading(false);
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

  
const monthlyTotalMilk = monthlyReports.reduce(
  (sum, item) => sum + Number(item.totalQuantity || 0),
  0
);

const monthlyTotalAmount = monthlyReports.reduce(
  (sum, item) => sum + Number(item.totalAmount || 0),
  0
);

const monthlyCowMilk = monthlyReports
  .filter(
    (item) => item.milkType?.toLowerCase() === "cow"
  )
  .reduce(
    (sum, item) => sum + Number(item.totalQuantity || 0),
    0
  );

const monthlyBuffaloMilk = monthlyReports
  .filter(
    (item) => item.milkType?.toLowerCase() === "buffalo"
  )
  .reduce(
    (sum, item) => sum + Number(item.totalQuantity || 0),
    0
  );

const monthlyRows = monthlyReports.map((item, index) => ({
  id: index + 1,
  ...item,
}));

const monthlyColumns = [
  {
    field: "farmerName",
    headerName: "Farmer Name",
    flex: 1.2,
    minWidth: 160,
  },
  {
    field: "milkType",
    headerName: "Milk Type",
    flex: 1,
    minWidth: 120,
  },
  {
    field: "totalQuantity",
    headerName: "Total Quantity (L)",
    flex: 1,
    minWidth: 150,
    valueFormatter: (value) =>
      `${Number(value || 0).toFixed(2)} L`,
  },
  {
    field: "totalAmount",
    headerName: "Total Amount",
    flex: 1,
    minWidth: 140,
    valueFormatter: (value) =>
      `₹${Number(value || 0).toFixed(2)}`,
  },
];


  return (
    <DashboardLayout>
      <Box>
        <Tabs
  value={activeTab}
  onChange={(_, newValue) => setActiveTab(newValue)}
  sx={{
    mb: 3,
    borderBottom: 1,
    borderColor: "divider",
  }}
>
  <Tab label="Daily Report" />
  <Tab label="Monthly Report" />
  <Tab label="Farmer-wise Report" />
  <Tab label="Payment History" />
</Tabs>

{activeTab === 0 && (
  <>

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
      </>
      )}

      {activeTab === 1 && (
        <Box>
    <Typography variant="h4" fontWeight={700} sx={{ mb: 1 }}>
      Monthly Milk Report
    </Typography>

    <Typography sx={{ color: "#64748B", mb: 3 }}>
      View monthly milk collection and farmer-wise amounts.
    </Typography>

    <Card sx={{ mb: 3, borderRadius: 3 }}>
      <CardContent>
        <Box sx={{ display: "flex", gap: 2, flexWrap: "wrap", alignItems: "center" }}>
          <TextField
            select
            label="Month"
            value={month}
            onChange={(e) => setMonth(e.target.value)}
            sx={{ minWidth: 180 }}
          >
            {[
              "January", "February", "March", "April",
              "May", "June", "July", "August",
              "September", "October", "November", "December",
            ].map((name, index) => (
              <MenuItem key={name} value={String(index + 1)}>
                {name}
              </MenuItem>
            ))}
          </TextField>

          <TextField
            label="Year"
            type="number"
            value={year}
            onChange={(e) => setYear(e.target.value)}
            sx={{ width: 140 }}
          />

          <Button
            variant="contained"
            startIcon={<SearchIcon />}
            onClick={generateMonthlyReport}
            disabled={monthlyLoading}
            sx={{ height: 56, px: 3, textTransform: "none" }}
          >
            {monthlyLoading ? (
              <CircularProgress size={24} color="inherit" />
            ) : (
              "Generate Report"
            )}
          </Button>
        </Box>
      </CardContent>
    </Card>

    {monthlyError && (
      <Alert severity="error" sx={{ mb: 3 }}>
        {monthlyError}
      </Alert>
    )}

    {monthlySearched && !monthlyError && (
      <>
        <Grid container spacing={2} sx={{ mb: 3 }}>
          {[
            { title: "Total Milk", value: `${monthlyTotalMilk.toFixed(2)} L` },
            { title: "Cow Milk", value: `${monthlyCowMilk.toFixed(2)} L` },
            { title: "Buffalo Milk", value: `${monthlyBuffaloMilk.toFixed(2)} L` },
            { title: "Total Amount", value: `₹${monthlyTotalAmount.toFixed(2)}` },
          ].map((item) => (
            <Grid item xs={12} sm={6} md={3} key={item.title}>
              <Card sx={{ borderRadius: 3, height: "100%" }}>
                <CardContent>
                  <Typography color="text.secondary">
                    {item.title}
                  </Typography>
                  <Typography variant="h5" fontWeight={700} sx={{ mt: 1 }}>
                    {item.value}
                  </Typography>
                </CardContent>
              </Card>
            </Grid>
          ))}
        </Grid>

        <Card sx={{ borderRadius: 3 }}>
          <CardContent>
            <Typography variant="h6" fontWeight={600} sx={{ mb: 2 }}>
              Monthly Collection Details
            </Typography>

            {monthlyReports.length === 0 ? (
              <Alert severity="info">
                No records found for {month}/{year}.
              </Alert>
            ) : (
              <DataGrid
                rows={monthlyRows}
                columns={monthlyColumns}
                autoHeight
                pageSizeOptions={[5, 10, 25]}
                initialState={{
                  pagination: {
                    paginationModel: { pageSize: 10, page: 0 },
                  },
                }}
                disableRowSelectionOnClick
              />
            )}
          </CardContent>
        </Card>
      </>
    )}
              </Box>
              
      )}
      {/* Farmer-wise Report */}
{activeTab === 2 && (
  <Box>
    <Typography variant="h4" fontWeight={700} sx={{ mb: 1 }}>
      Farmer-wise Report
    </Typography>

    <Typography sx={{ color: "#64748B", mb: 3 }}>
      View milk collection details for an individual farmer.
    </Typography>

    <Card sx={{ mb: 3, borderRadius: 3 }}>
      <CardContent>
        <Box
          sx={{
            display: "flex",
            gap: 2,
            flexWrap: "wrap",
            alignItems: "center",
          }}
        >
          <TextField
            select
            label="Select Farmer"
            value={selectedFarmer}
            onChange={(e) => {
              setSelectedFarmer(e.target.value);
              setFarmerError("");
            }}
            sx={{ minWidth: 250 }}
          >
{farmers.map((farmer) => (
  <MenuItem key={farmer.id} value={farmer.id}>
    {farmer.farmerName} ({farmer.farmerCode})
  </MenuItem>
))}
          </TextField>

          <Button
            variant="contained"
            startIcon={<SearchIcon />}
            onClick={generateFarmerReport}
            disabled={farmerLoading}
            sx={{ height: 56, px: 3, textTransform: "none" }}
          >
            {farmerLoading ? (
              <CircularProgress size={24} color="inherit" />
            ) : (
              "Generate Report"
            )}
          </Button>
        </Box>
      </CardContent>
    </Card>

    {farmerError && (
      <Alert severity="error" sx={{ mb: 3 }}>
        {farmerError}
      </Alert>
    )}

    {farmerSearched && !farmerError && (
      <Card sx={{ borderRadius: 3 }}>
        <CardContent>
          <Typography variant="h6" fontWeight={600} sx={{ mb: 2 }}>
            Farmer Collection Details
          </Typography>

          {farmerReports.length === 0 ? (
            <Alert severity="info">
              No collection records found for this farmer.
            </Alert>
          ) : (
            <DataGrid
              rows={farmerReports.map((item, index) => ({
                id: index + 1,
                ...item,
              }))}
              columns={[
                {
                  field: "collectionDate",
                  headerName: "Date",
                  minWidth: 130,
                  flex: 1,
                },
                {
                  field: "shift",
                  headerName: "Shift",
                  minWidth: 100,
                  flex: 0.8,
                },
                {
                  field: "milkType",
                  headerName: "Milk Type",
                  minWidth: 110,
                  flex: 0.8,
                },
                {
                  field: "quantity",
                  headerName: "Quantity (L)",
                  minWidth: 120,
                  flex: 1,
                  valueFormatter: (value) =>
                    `${Number(value || 0).toFixed(2)} L`,
                },
                {
                  field: "fat",
                  headerName: "Fat %",
                  minWidth: 90,
                  flex: 0.7,
                },
                {
                  field: "ratePerLiter",
                  headerName: "Rate/L",
                  minWidth: 110,
                  flex: 0.9,
                  valueFormatter: (value) =>
                    `₹${Number(value || 0).toFixed(2)}`,
                },
                {
                  field: "totalAmount",
                  headerName: "Total Amount",
                  minWidth: 130,
                  flex: 1,
                  valueFormatter: (value) =>
                    `₹${Number(value || 0).toFixed(2)}`,
                },
              ]}
              autoHeight
              pageSizeOptions={[5, 10, 25]}
              initialState={{
                pagination: {
                  paginationModel: { pageSize: 10, page: 0 },
                },
              }}
              disableRowSelectionOnClick
            />
          )}
        </CardContent>
      </Card>
    )}
  </Box>
)}
{/* Payment History */}
{activeTab === 3 && (
  <Box>
    <Typography variant="h4" fontWeight={700} sx={{ mb: 1 }}>
      Payment History
    </Typography>

    <Typography sx={{ color: "#64748B", mb: 3 }}>
      View payment periods, amounts, and payment status for a selected farmer.
    </Typography>

    <Card sx={{ mb: 3, borderRadius: 3 }}>
      <CardContent>
        <Box
          sx={{
            display: "flex",
            gap: 2,
            flexWrap: "wrap",
            alignItems: "center",
          }}
        >
          <TextField
            select
            label="Select Farmer"
            value={selectedFarmer}
            onChange={(e) => {
              setSelectedFarmer(e.target.value);
              setPaymentHistoryError("");
              setPaymentHistorySearched(false);
            }}
            sx={{ minWidth: 250 }}
          >
            {farmers.map((farmer) => (
              <MenuItem key={farmer.id} value={farmer.id}>
                {farmer.farmerName} ({farmer.farmerCode})
              </MenuItem>
            ))}
          </TextField>

          <Button
            variant="contained"
            startIcon={<SearchIcon />}
            onClick={generatePaymentHistory}
            disabled={paymentHistoryLoading}
            sx={{ height: 56, px: 3, textTransform: "none" }}
          >
            {paymentHistoryLoading ? (
              <CircularProgress size={24} color="inherit" />
            ) : (
              "View Payment History"
            )}
          </Button>
        </Box>
      </CardContent>
    </Card>

    {paymentHistoryError && (
      <Alert severity="error" sx={{ mb: 3 }}>
        {paymentHistoryError}
      </Alert>
    )}

    {paymentHistorySearched && !paymentHistoryError && (
      <>
        <Grid container spacing={2} sx={{ mb: 3 }}>
          <Grid item xs={12} sm={6}>
            <Card sx={{ borderRadius: 3, height: "100%" }}>
              <CardContent>
                <Typography color="text.secondary">
                  Total Payments
                </Typography>
                <Typography variant="h5" fontWeight={700} sx={{ mt: 1 }}>
                  {paymentHistory.length}
                </Typography>
              </CardContent>
            </Card>
          </Grid>

          <Grid item xs={12} sm={6}>
            <Card sx={{ borderRadius: 3, height: "100%" }}>
              <CardContent>
                <Typography color="text.secondary">
                  Total Payment Amount
                </Typography>
                <Typography variant="h5" fontWeight={700} sx={{ mt: 1 }}>
                  ₹
                  {paymentHistory
                    .reduce(
                      (sum, item) =>
                        sum + Number(item.totalAmount || 0),
                      0
                    )
                    .toFixed(2)}
                </Typography>
              </CardContent>
            </Card>
          </Grid>
        </Grid>

        <Card sx={{ borderRadius: 3 }}>
          <CardContent>
            <Typography variant="h6" fontWeight={600} sx={{ mb: 2 }}>
              Payment Records
            </Typography>

            {paymentHistory.length === 0 ? (
              <Alert severity="info">
                No payment records found for this farmer.
              </Alert>
            ) : (
              <DataGrid
                rows={paymentHistory.map((item, index) => ({
                  id: index + 1,
                  ...item,
                }))}
                columns={[
                  {
                    field: "fromDate",
                    headerName: "From Date",
                    minWidth: 130,
                    flex: 1,
                  },
                  {
                    field: "toDate",
                    headerName: "To Date",
                    minWidth: 130,
                    flex: 1,
                  },
                  {
                    field: "totalAmount",
                    headerName: "Amount",
                    minWidth: 140,
                    flex: 1,
                    valueFormatter: (value) =>
                      `₹${Number(value || 0).toFixed(2)}`,
                  },
                  {
                    field: "paymentStatus",
                    headerName: "Status",
                    minWidth: 120,
                    flex: 1,
                  },
                ]}
                autoHeight
                pageSizeOptions={[5, 10, 25]}
                initialState={{
                  pagination: {
                    paginationModel: { pageSize: 10, page: 0 },
                  },
                }}
                disableRowSelectionOnClick
              />
            )}
          </CardContent>
        </Card>
      </>
    )}
  </Box>
)}
    </Box>
  </DashboardLayout>
);
}