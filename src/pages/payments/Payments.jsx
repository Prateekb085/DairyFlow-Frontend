
import { useEffect, useState } from "react";
import {
  Alert,
  Box,
  Button,
  Card,
  CardContent,
  CircularProgress,
  MenuItem,
  TextField,
  Typography,
} from "@mui/material";
import api from "../../services/api";
import DashboardLayout from "../../components/layout/DashboardLayout";

export default function Payments() {
  const [farmers, setFarmers] = useState([]);
  const [payments, setPayments] = useState([]);
  const [farmerId, setFarmerId] = useState("");
  const [fromDate, setFromDate] = useState("");
  const [toDate, setToDate] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [message, setMessage] = useState("");

  const loadData = async () => {
    try {
      setLoading(true);
      const [farmerResponse, paymentResponse] = await Promise.all([
        api.get("/farmers"),
        api.get("/payments"),
      ]);

      setFarmers(
        Array.isArray(farmerResponse.data) ? farmerResponse.data : []
      );
      setPayments(
        Array.isArray(paymentResponse.data) ? paymentResponse.data : []
      );
    } catch (err) {
      console.error(err);
      setError("Unable to load farmers or payment records.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const generatePayment = async () => {
    if (!farmerId || !fromDate || !toDate) {
      setError("Select a farmer and both dates.");
      return;
    }

    if (fromDate > toDate) {
      setError("From date must be before or equal to To date.");
      return;
    }

    try {
      setLoading(true);
      setError("");
      setMessage("");

      await api.post("/payments/generate", null, {
        params: { farmerId, fromDate, toDate },
      });

      setMessage("Payment generated successfully.");
      await loadData();
    } catch (err) {
      console.error(err);
      setError(
        err.response?.data?.message || "Unable to generate payment."
      );
    } finally {
      setLoading(false);
    }
  };


const updateStatus = async (paymentId) => {
  try {
    setError("");
    setMessage("");

    await api.put(`/payments/${paymentId}/confirm`, null, {
      params: { confirmedBy: "admin" },
    });

    setMessage("Payment confirmed successfully.");
    await loadData();
  } catch (err) {
    console.error(err);
    setError(
      err.response?.data?.message || "Unable to confirm payment."
    );
  }
};


  return (
    <DashboardLayout>
      <Box sx={{ p: 1 }}>
        <Typography variant="h4" fontWeight={700} sx={{ mb: 1 }}>
          Payments Management
        </Typography>

        <Typography sx={{ color: "#64748B", mb: 3 }}>
          Generate payments and manage farmer payment statuses.
        </Typography>

        {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}
        {message && <Alert severity="success" sx={{ mb: 2 }}>{message}</Alert>}

        <Card sx={{ mb: 3, borderRadius: 3 }}>
          <CardContent>
            <Typography variant="h6" fontWeight={600} sx={{ mb: 2 }}>
              Generate Payment
            </Typography>

            <Box sx={{ display: "flex", gap: 2, flexWrap: "wrap" }}>
              <TextField
                select
                label="Select Farmer"
                value={farmerId}
                onChange={(e) => setFarmerId(e.target.value)}
                sx={{ minWidth: 230 }}
              >
                {farmers.map((farmer) => (
                  <MenuItem key={farmer.id} value={farmer.id}>
                    {farmer.farmerName} ({farmer.farmerCode})
                  </MenuItem>
                ))}
              </TextField>

              <TextField
                label="From Date"
                type="date"
                value={fromDate}
                onChange={(e) => setFromDate(e.target.value)}
                slotProps={{ inputLabel: { shrink: true } }}
              />

              <TextField
                label="To Date"
                type="date"
                value={toDate}
                onChange={(e) => setToDate(e.target.value)}
                slotProps={{ inputLabel: { shrink: true } }}
              />

              <Button
                variant="contained"
                onClick={generatePayment}
                disabled={loading}
              >
                Generate Payment
              </Button>
            </Box>
          </CardContent>
        </Card>

        <Card sx={{ borderRadius: 3 }}>
          <CardContent>
            <Typography variant="h6" fontWeight={600} sx={{ mb: 2 }}>
              Payment Records
            </Typography>

            {loading ? (
              <CircularProgress />
            ) : payments.length === 0 ? (
              <Alert severity="info">No payment records found.</Alert>
            ) : (
              <Box sx={{ overflowX: "auto" }}>
                <table style={{ width: "100%", borderCollapse: "collapse" }}>
                  <thead>
                    <tr>
                      {["Farmer", "From Date", "To Date", "Amount", "Status", "Action"].map((heading) => (
                        <th key={heading} style={{ padding: 12, textAlign: "left", borderBottom: "1px solid #ddd" }}>
                          {heading}
                        </th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {payments.map((payment) => (
                      <tr key={payment.id}>
                        <td style={{ padding: 12 }}>
                          {payment.farmer?.farmerName || "—"}
                        </td>
                        <td style={{ padding: 12 }}>
                        {payment.settlement?.startDate || "—"}
                      </td>
                      <td style={{ padding: 12 }}>
                        {payment.settlement?.endDate || "—"}
                      </td>
                        <td style={{ padding: 12 }}>
                          ₹{Number(payment.totalAmount || 0).toFixed(2)}
                        </td>
                        <td style={{ padding: 12 }}>{payment.paymentStatus}</td>
                        <td style={{ padding: 12 }}>
                          {payment.paymentStatus?.toLowerCase() !== "paid" && (
                            <Button
                              size="small"
                              variant="outlined"
                              onClick={() => updateStatus(payment.id)}
                            >
                              Mark Paid
                            </Button>
                          )}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </Box>
            )}
          </CardContent>
        </Card>
      </Box>
    </DashboardLayout>
  );
}
