
import { useEffect, useState } from "react";
import {
  Alert,
  Box,
  Button,
  Card,
  CardContent,
  Chip,
  CircularProgress,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  MenuItem,
  Stack,
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
  const [processingId, setProcessingId] = useState(null);

  const [error, setError] = useState("");
  const [message, setMessage] = useState("");

  const [selectedPayment, setSelectedPayment] = useState(null);
  const [selectedPayoutMode, setSelectedPayoutMode] = useState("");

  // Load farmers and payments
  const loadData = async () => {
    try {
      setLoading(true);
      setError("");

      const [farmerResponse, paymentResponse] = await Promise.all([
        api.get("/farmers"),
        api.get("/payments"),
      ]);

      setFarmers(
        Array.isArray(farmerResponse.data)
          ? farmerResponse.data
          : []
      );

      setPayments(
        Array.isArray(paymentResponse.data)
          ? paymentResponse.data
          : []
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

  // Dashboard calculations
  const totalPayments = payments.length;

  const pendingAmount = payments
    .filter((p) =>
      ["PENDING", "TEST_FAILED"].includes(p.paymentStatus)
    )
    .reduce(
      (sum, p) => sum + Number(p.totalAmount || 0),
      0
    );

  const totalDemoPayouts = payments
    .filter((p) => p.paymentStatus === "TEST_SUCCESS")
    .reduce(
      (sum, p) => sum + Number(p.totalAmount || 0),
      0
    );

  const successfulPayments = payments.filter(
    (p) => p.paymentStatus === "TEST_SUCCESS"
  ).length;

  // Generate payment
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

      setFarmerId("");
      setFromDate("");
      setToDate("");

      await loadData();
    } catch (err) {
      console.error(err);
      setError(
        err.response?.data?.message ||
        "Unable to generate payment."
      );
    } finally {
      setLoading(false);
    }
  };

  // Open payout confirmation
  const openPayoutDialog = (payment, payoutMode) => {
    setSelectedPayment(payment);
    setSelectedPayoutMode(payoutMode);
    setError("");
    setMessage("");
  };

  // Close payout confirmation
  const closePayoutDialog = () => {
    if (processingId !== null) return;

    setSelectedPayment(null);
    setSelectedPayoutMode("");
  };

  // Process demo payout
  const processPayout = async () => {
    if (!selectedPayment || !selectedPayoutMode) return;

    const paymentId = selectedPayment.id;

    try {
      setProcessingId(paymentId);
      setError("");
      setMessage("");

      await api.post(
        `/payments/${paymentId}/simulate-payout`,
        null,
        {
          params: {
            payoutMode: selectedPayoutMode,
            simulateSuccess: true,
            confirmedBy: "admin",
          },
        }
      );

      setMessage(
        `${
          selectedPayoutMode === "UPI_DEMO"
            ? "UPI Demo"
            : "Bank Transfer Demo"
        } payout completed successfully.`
      );

      setSelectedPayment(null);
      setSelectedPayoutMode("");

      await loadData();
    } catch (err) {
      console.error(err);
      setError(
        err.response?.data?.message ||
        "Unable to process demo payout."
      );
    } finally {
      setProcessingId(null);
    }
  };

  // Payment status colors
  const getStatusColor = (status) => {
    switch (status) {
      case "PENDING":
        return "warning";
      case "TEST_SUCCESS":
        return "success";
      case "TEST_FAILED":
        return "error";
      case "PAID":
        return "success";
      default:
        return "default";
    }
  };

  const formatAmount = (amount) =>
    Number(amount || 0).toFixed(2);

  return (
    <DashboardLayout>
      <Box sx={{ p: 1 }}>

        {/* Page Heading */}
        <Typography variant="h4" fontWeight={700} sx={{ mb: 1 }}>
          Payments Management
        </Typography>

        <Typography sx={{ color: "#64748B", mb: 3 }}>
          Generate farmer payments and manage demo payouts.
        </Typography>

        {/* Alerts */}
        {error && (
          <Alert severity="error" sx={{ mb: 2 }}>
            {error}
          </Alert>
        )}

        {message && (
          <Alert severity="success" sx={{ mb: 2 }}>
            {message}
          </Alert>
        )}

        {/* Dashboard Summary Cards */}
        <Box
          sx={{
            display: "grid",
            gridTemplateColumns: {
              xs: "1fr",
              sm: "1fr 1fr",
              md: "repeat(4, 1fr)",
            },
            gap: 2,
            mb: 3,
          }}
        >
          {[
            {
              title: "Total Payments",
              value: totalPayments,
              color: "#2563EB",
              icon: "📋",
            },
            {
              title: "Pending Amount",
              value: `₹${pendingAmount.toFixed(2)}`,
              color: "#D97706",
              icon: "⏳",
            },
            {
              title: "Total Demo Payouts",
              value: `₹${totalDemoPayouts.toFixed(2)}`,
              color: "#059669",
              icon: "💰",
            },
            {
              title: "Successful Payments",
              value: successfulPayments,
              color: "#7C3AED",
              icon: "✅",
            },
          ].map((item) => (
            <Card
              key={item.title}
              sx={{
                borderRadius: 3,
                border: "1px solid #E2E8F0",
                boxShadow: "0 2px 8px rgba(0,0,0,0.04)",
                transition: "0.2s",
                "&:hover": {
                  transform: "translateY(-3px)",
                  boxShadow: "0 5px 15px rgba(0,0,0,0.08)",
                },
              }}
            >
              <CardContent>
                <Typography
                  color="text.secondary"
                  variant="body2"
                  fontWeight={500}
                >
                  {item.icon} {item.title}
                </Typography>

                <Typography
                  variant="h5"
                  fontWeight={700}
                  sx={{ color: item.color, mt: 1 }}
                >
                  {item.value}
                </Typography>
              </CardContent>
            </Card>
          ))}
        </Box>

        {/* Generate Payment */}
        <Card sx={{ mb: 3, borderRadius: 3 }}>
          <CardContent>
            <Typography variant="h6" fontWeight={600} sx={{ mb: 2 }}>
              Generate Payment
            </Typography>

            <Box
              sx={{
                display: "flex",
                gap: 2,
                flexWrap: "wrap",
              }}
            >
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
                slotProps={{
                  inputLabel: { shrink: true },
                }}
              />

              <TextField
                label="To Date"
                type="date"
                value={toDate}
                onChange={(e) => setToDate(e.target.value)}
                slotProps={{
                  inputLabel: { shrink: true },
                }}
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

        {/* Payment Records */}
        <Card sx={{ borderRadius: 3 }}>
          <CardContent>
            <Typography variant="h6" fontWeight={600} sx={{ mb: 2 }}>
              Payment Records
            </Typography>

            {loading ? (
              <CircularProgress />
            ) : payments.length === 0 ? (
              <Alert severity="info">
                No payment records found.
              </Alert>
            ) : (
              <Box sx={{ overflowX: "auto" }}>
                <table
                  style={{
                    width: "100%",
                    borderCollapse: "collapse",
                    minWidth: 850,
                  }}
                >
                  <thead>
                    <tr>
                      {[
                        "ID",
                        "Farmer",
                        "From Date",
                        "To Date",
                        "Amount",
                        "Payment Mode",
                        "Status",
                        "Transaction Reference",
                        "Action",
                      ].map((heading) => (
                        <th
                          key={heading}
                          style={{
                            padding: 12,
                            textAlign: "left",
                            borderBottom: "1px solid #ddd",
                            whiteSpace: "nowrap",
                          }}
                        >
                          {heading}
                        </th>
                      ))}
                    </tr>
                  </thead>

                  <tbody>
                    {payments.map((payment) => {
                      const canProcess =
                        payment.paymentStatus === "PENDING" ||
                        payment.paymentStatus === "TEST_FAILED";

                      return (
                        <tr key={payment.id}>
                          <td style={{ padding: 12 }}>
                            {payment.id}
                          </td>

                          <td style={{ padding: 12 }}>
                            {payment.farmer?.farmerName || "—"}
                          </td>

                          <td style={{ padding: 12 }}>
                            {payment.settlement?.startDate || "—"}
                          </td>

                          <td style={{ padding: 12 }}>
                            {payment.settlement?.endDate || "—"}
                          </td>

                          <td style={{ padding: 12, whiteSpace: "nowrap" }}>
                            ₹{formatAmount(payment.totalAmount)}
                          </td>

                          <td style={{ padding: 12 }}>
                            {payment.payoutMode ||
                              payment.paymentMethod ||
                              "—"}
                          </td>

                          <td style={{ padding: 12 }}>
                            <Chip
                              size="small"
                              label={payment.paymentStatus}
                              color={getStatusColor(
                                payment.paymentStatus
                              )}
                            />
                          </td>

                          <td style={{ padding: 12 }}>
                            {payment.transactionReference || "—"}
                          </td>

                          <td style={{ padding: 12 }}>
                            {canProcess ? (
                              <Stack
                                direction="row"
                                spacing={1}
                                sx={{ minWidth: 230 }}
                              >
                                <Button
                                  size="small"
                                  variant="contained"
                                  disabled={processingId !== null}
                                  onClick={() =>
                                    openPayoutDialog(
                                      payment,
                                      "UPI_DEMO"
                                    )
                                  }
                                >
                                  UPI Demo
                                </Button>

                                <Button
                                  size="small"
                                  variant="outlined"
                                  disabled={processingId !== null}
                                  onClick={() =>
                                    openPayoutDialog(
                                      payment,
                                      "BANK_TRANSFER_DEMO"
                                    )
                                  }
                                >
                                  Bank Demo
                                </Button>
                              </Stack>
                            ) : (
                              "—"
                            )}
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </Box>
            )}
          </CardContent>
        </Card>

        {/* Payout Confirmation Dialog */}
        <Dialog
          open={Boolean(selectedPayment)}
          onClose={closePayoutDialog}
          fullWidth
          maxWidth="xs"
        >
          <DialogTitle>
            Confirm Demo Payout
          </DialogTitle>

          <DialogContent>
            <Typography sx={{ mb: 2 }}>
              Are you sure you want to process this demo payout?
            </Typography>

            {selectedPayment && (
              <Box
                sx={{
                  p: 2,
                  bgcolor: "#F8FAFC",
                  borderRadius: 2,
                }}
              >
                <Typography>
                  Payment ID: <strong>{selectedPayment.id}</strong>
                </Typography>

                <Typography>
                  Amount:{" "}
                  <strong>
                    ₹{formatAmount(selectedPayment.totalAmount)}
                  </strong>
                </Typography>

                <Typography>
                  Method: <strong>{selectedPayoutMode}</strong>
                </Typography>
              </Box>
            )}

            <Alert severity="warning" sx={{ mt: 2 }}>
              Demo only. No real money will be transferred to the farmer.
            </Alert>
          </DialogContent>

          <DialogActions>
            <Button
              onClick={closePayoutDialog}
              disabled={processingId !== null}
            >
              Cancel
            </Button>

            <Button
              variant="contained"
              onClick={processPayout}
              disabled={processingId !== null}
            >
              {processingId !== null
                ? "Processing..."
                : "Confirm Payout"}
            </Button>
          </DialogActions>
        </Dialog>

      </Box>
    </DashboardLayout>
  );
}
