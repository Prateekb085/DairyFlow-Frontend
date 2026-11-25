
import { useEffect, useState } from "react";
import api from "../../services/api";

import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import VisibilityIcon from "@mui/icons-material/Visibility";
import IconButton from "@mui/material/IconButton";

import {
  Paper,
  Typography,
  Box,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Stack,
  Snackbar,
  Alert,
  Switch,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Chip,
  CircularProgress,
  Divider,
} from "@mui/material";

import { DataGrid } from "@mui/x-data-grid";
import DashboardLayout from "../../components/layout/DashboardLayout";

export default function Farmers() {
  const [farmers, setFarmers] = useState([]);
  const [searchText, setSearchText] = useState("");
  const [errors, setErrors] = useState({});

  const [snackbar, setSnackbar] = useState({
    open: false,
    message: "",
    severity: "success",
  });

  const [open, setOpen] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [updatingId, setUpdatingId] = useState(null);

  // Farmer Profile states
  const [profileOpen, setProfileOpen] = useState(false);
  const [selectedFarmer, setSelectedFarmer] = useState(null);
  const [milkHistory, setMilkHistory] = useState([]);
  const [paymentHistory, setPaymentHistory] = useState([]);
  const [profileLoading, setProfileLoading] = useState(false);
  const [profileErrors, setProfileErrors] = useState({});

  const [newFarmer, setNewFarmer] = useState({
    farmerCode: "",
    farmerName: "",
    mobileNumber: "",
    village: "",
  });

  const showSnackbar = (message, severity = "success") => {
    setSnackbar({
      open: true,
      message,
      severity,
    });
  };

  useEffect(() => {
    loadFarmers();
  }, []);

  // Load all farmers
  const loadFarmers = () => {
    api
      .get("/farmers")
      .then((response) => {
        setFarmers(response.data);
      })
      .catch((error) => {
        console.error("Farmers API Error:", error);
        showSnackbar("Error loading farmers", "error");
      });
  };

  // Open Add Farmer dialog
  const handleOpen = () => {
    setOpen(true);
  };

  // Close dialog and reset form
  const handleClose = () => {
    setOpen(false);
    setEditingId(null);

    setNewFarmer({
      farmerCode: "",
      farmerName: "",
      mobileNumber: "",
      village: "",
    });

    setErrors({});
  };

  // Add or Update Farmer
  const saveFarmer = () => {
    const newErrors = {};

    if (!newFarmer.farmerCode.trim()) {
      newErrors.farmerCode = "Farmer Code is required";
    }

    if (!newFarmer.farmerName.trim()) {
      newErrors.farmerName = "Farmer Name is required";
    }

    if (!newFarmer.mobileNumber.trim()) {
      newErrors.mobileNumber = "Mobile Number is required";
    } else if (!/^\d{10}$/.test(newFarmer.mobileNumber)) {
      newErrors.mobileNumber =
        "Enter a valid 10-digit mobile number";
    }

    if (!newFarmer.village.trim()) {
      newErrors.village = "Village is required";
    }

    setErrors(newErrors);

    if (Object.keys(newErrors).length > 0) {
      return;
    }

    if (editingId) {
      api
        .put(`/farmers/${editingId}`, newFarmer)
        .then(() => {
          loadFarmers();
          handleClose();
          showSnackbar("Farmer updated successfully");
        })
        .catch((error) => {
          console.error("Update Error:", error);
          showSnackbar("Error updating farmer", "error");
        });
    } else {
      api
        .post("/farmers", newFarmer)
        .then(() => {
          loadFarmers();
          handleClose();
          showSnackbar("Farmer added successfully");
        })
        .catch((error) => {
          console.error("Add Error:", error);
          showSnackbar("Error adding farmer", "error");
        });
    }
  };

  // Edit Farmer
  const editFarmer = (farmer) => {
    setEditingId(farmer.id);

    setNewFarmer({
      farmerCode: farmer.farmerCode || "",
      farmerName: farmer.farmerName || "",
      mobileNumber: farmer.mobileNumber || "",
      village: farmer.village || "",
    });

    setOpen(true);
  };

  // Delete Farmer
  const deleteFarmer = (id) => {
    if (window.confirm("Are you sure you want to delete this farmer?")) {
      api
        .delete(`/farmers/${id}`)
        .then(() => {
          loadFarmers();
          showSnackbar("Farmer deleted successfully");
        })
        .catch((error) => {
          console.error("Delete Error:", error);

          const message =
            error.response?.data?.message ||
            "Cannot delete farmer because milk records exist.";

          showSnackbar(message, "error");
        });
    }
  };

  // Activate or Deactivate Farmer
  const updateFarmerStatus = async (farmer) => {
    const newStatus = !farmer.active;

    setUpdatingId(farmer.id);

    try {
      const response = await api.put(
        `/farmers/${farmer.id}/status?active=${newStatus}`
      );

      setFarmers((previousFarmers) =>
        previousFarmers.map((item) =>
          item.id === farmer.id ? response.data : item
        )
      );

      showSnackbar(
        newStatus
          ? "Farmer activated successfully"
          : "Farmer deactivated successfully"
      );
    } catch (error) {
      console.error("Status Update Error:", error);
      showSnackbar("Error updating farmer status", "error");
    } finally {
      setUpdatingId(null);
    }
  };

  // View Farmer Profile
  const viewFarmerProfile = async (farmer) => {
    setSelectedFarmer(farmer);
    setProfileOpen(true);
    setProfileLoading(true);

    setMilkHistory([]);
    setPaymentHistory([]);
    setProfileErrors({});

    try {
      const results = await Promise.allSettled([
        api.get(`/reports/farmer/${farmer.id}`),
        api.get(`/payments/history/${farmer.id}`),
      ]);

      // Milk collection history
      if (results[0].status === "fulfilled") {
        setMilkHistory(results[0].value.data || []);
      } else {
        console.error("Milk History Error:", results[0].reason);
        setProfileErrors((previous) => ({
          ...previous,
          milk: "Unable to load milk collection history.",
        }));
      }

      // Payment history
      if (results[1].status === "fulfilled") {
        setPaymentHistory(results[1].value.data || []);
      } else {
        console.error("Payment History Error:", results[1].reason);
        setProfileErrors((previous) => ({
          ...previous,
          payment: "Unable to load payment history.",
        }));
      }
    } finally {
      setProfileLoading(false);
    }
  };

  const closeProfile = () => {
    setProfileOpen(false);
    setSelectedFarmer(null);
    setMilkHistory([]);
    setPaymentHistory([]);
    setProfileErrors({});
  };

  // Calculate totals from milk history
  const totalMilk = milkHistory.reduce(
    (total, entry) => total + (Number(entry.quantity) || 0),
    0
  );

  const totalMilkAmount = milkHistory.reduce(
    (total, entry) => total + (Number(entry.totalAmount) || 0),
    0
  );

  // Format currency
  const formatCurrency = (amount) => {
    return Number(amount || 0).toLocaleString("en-IN", {
      style: "currency",
      currency: "INR",
      maximumFractionDigits: 2,
    });
  };

  // Format date
  const formatDate = (date) => {
    return date ? String(date).split("T")[0] : "-";
  };

  // Search Farmers
  const filteredFarmers = farmers.filter((farmer) => {
    const search = searchText.toLowerCase();

    return (
      farmer.farmerName?.toLowerCase().includes(search) ||
      farmer.farmerCode?.toLowerCase().includes(search) ||
      farmer.mobileNumber?.toLowerCase().includes(search) ||
      farmer.village?.toLowerCase().includes(search)
    );
  });

  // DataGrid Columns
  const columns = [
    {
      field: "id",
      headerName: "ID",
      width: 80,
    },
    {
      field: "farmerCode",
      headerName: "Code",
      width: 120,
    },
    {
      field: "farmerName",
      headerName: "Farmer Name",
      flex: 1,
      minWidth: 150,
    },
    {
      field: "mobileNumber",
      headerName: "Mobile",
      width: 150,
    },
    {
      field: "village",
      headerName: "Village",
      flex: 1,
      minWidth: 120,
    },
    {
      field: "active",
      headerName: "Status",
      width: 160,
      sortable: false,
      renderCell: (params) => {
        const isActive = params.row.active === true;

        return (
          <Stack direction="row" alignItems="center" spacing={1}>
            <Switch
              checked={isActive}
              disabled={updatingId === params.row.id}
              onChange={() => updateFarmerStatus(params.row)}
              color="success"
              size="small"
            />

            <Typography
              variant="body2"
              color={isActive ? "success.main" : "error.main"}
              fontWeight="medium"
            >
              {isActive ? "Active" : "Inactive"}
            </Typography>
          </Stack>
        );
      },
    },
    {
      field: "actions",
      headerName: "Actions",
      width: 170,
      sortable: false,
      renderCell: (params) => (
        <>
          <IconButton
            color="info"
            title="View Profile"
            onClick={() => viewFarmerProfile(params.row)}
          >
            <VisibilityIcon />
          </IconButton>

          <IconButton
            color="primary"
            title="Edit Farmer"
            onClick={() => editFarmer(params.row)}
          >
            <EditIcon />
          </IconButton>

          <IconButton
            color="error"
            title="Delete Farmer"
            onClick={() => deleteFarmer(params.row.id)}
          >
            <DeleteIcon />
          </IconButton>
        </>
      ),
    },
  ];

  return (
    <DashboardLayout>
      <Box>
        {/* Page Header */}
        <Box
          sx={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            mb: 3,
          }}
        >
          <Typography variant="h4" fontWeight="bold">
            Farmers
          </Typography>

          <Button variant="contained" onClick={handleOpen}>
            Add Farmer
          </Button>
        </Box>

        {/* Farmers Table */}
        <Paper
          sx={{
            height: 550,
            borderRadius: 4,
            p: 2,
          }}
        >
          {/* Search */}
          <Box
            sx={{
              display: "flex",
              gap: 2,
              mb: 3,
              flexWrap: "wrap",
            }}
          >
            <TextField
              label="Search Farmer"
              size="small"
              value={searchText}
              onChange={(e) => setSearchText(e.target.value)}
              sx={{ minWidth: 300 }}
            />

            <Button
              variant="outlined"
              onClick={() => setSearchText("")}
            >
              Clear
            </Button>
          </Box>

          <DataGrid
            rows={filteredFarmers}
            columns={columns}
            getRowId={(row) => row.id}
            pageSizeOptions={[5, 10, 20]}
            initialState={{
              pagination: {
                paginationModel: {
                  pageSize: 5,
                },
              },
            }}
          />
        </Paper>

        {/* Add / Edit Farmer Dialog */}
        <Dialog
          open={open}
          onClose={handleClose}
          fullWidth
          maxWidth="sm"
        >
          <DialogTitle>
            {editingId ? "Edit Farmer" : "Add Farmer"}
          </DialogTitle>

          <DialogContent>
            <Stack spacing={2} mt={1}>
              <TextField
                label="Farmer Code"
                value={newFarmer.farmerCode}
                error={!!errors.farmerCode}
                helperText={errors.farmerCode}
                onChange={(e) =>
                  setNewFarmer({
                    ...newFarmer,
                    farmerCode: e.target.value,
                  })
                }
              />

              <TextField
                label="Farmer Name"
                value={newFarmer.farmerName}
                error={!!errors.farmerName}
                helperText={errors.farmerName}
                onChange={(e) =>
                  setNewFarmer({
                    ...newFarmer,
                    farmerName: e.target.value,
                  })
                }
              />

              <TextField
                label="Mobile Number"
                value={newFarmer.mobileNumber}
                error={!!errors.mobileNumber}
                helperText={errors.mobileNumber}
                onChange={(e) =>
                  setNewFarmer({
                    ...newFarmer,
                    mobileNumber: e.target.value,
                  })
                }
              />

              <TextField
                label="Village"
                value={newFarmer.village}
                error={!!errors.village}
                helperText={errors.village}
                onChange={(e) =>
                  setNewFarmer({
                    ...newFarmer,
                    village: e.target.value,
                  })
                }
              />
            </Stack>
          </DialogContent>

          <DialogActions>
            <Button onClick={handleClose}>
              Cancel
            </Button>

            <Button variant="contained" onClick={saveFarmer}>
              {editingId ? "Update" : "Save"}
            </Button>
          </DialogActions>
        </Dialog>

        {/* Farmer Profile Dialog */}
        <Dialog
          open={profileOpen}
          onClose={closeProfile}
          fullWidth
          maxWidth="lg"
        >
          <DialogTitle>
            Farmer Profile
          </DialogTitle>

          <DialogContent dividers>
            {profileLoading ? (
              <Box
                sx={{
                  display: "flex",
                  justifyContent: "center",
                  alignItems: "center",
                  minHeight: 250,
                }}
              >
                <CircularProgress />
              </Box>
            ) : selectedFarmer ? (
              <Stack spacing={3}>
                {/* Farmer Details */}
                <Paper
                  variant="outlined"
                  sx={{ p: 3, borderRadius: 3 }}
                >
                  <Typography variant="h5" fontWeight="bold">
                    {selectedFarmer.farmerName}
                  </Typography>

                  <Stack
                    direction="row"
                    spacing={2}
                    flexWrap="wrap"
                    mt={2}
                    useFlexGap
                  >
                    <Typography>
                      <strong>Farmer Code:</strong>{" "}
                      {selectedFarmer.farmerCode}
                    </Typography>

                    <Typography>
                      <strong>Mobile:</strong>{" "}
                      {selectedFarmer.mobileNumber}
                    </Typography>

                    <Typography>
                      <strong>Village:</strong>{" "}
                      {selectedFarmer.village}
                    </Typography>

                    <Chip
                      label={
                        selectedFarmer.active ? "Active" : "Inactive"
                      }
                      color={
                        selectedFarmer.active ? "success" : "error"
                      }
                      size="small"
                    />
                  </Stack>
                </Paper>

                {/* Summary Cards */}
                <Box
                  sx={{
                    display: "grid",
                    gridTemplateColumns: {
                      xs: "1fr",
                      sm: "1fr 1fr",
                    },
                    gap: 2,
                  }}
                >
                  <Paper
                    variant="outlined"
                    sx={{ p: 3, borderRadius: 3 }}
                  >
                    <Typography color="text.secondary">
                      Total Milk Collected
                    </Typography>

                    <Typography
                      variant="h4"
                      fontWeight="bold"
                      color="primary.main"
                      mt={1}
                    >
                      {totalMilk.toFixed(2)} L
                    </Typography>
                  </Paper>

                  <Paper
                    variant="outlined"
                    sx={{ p: 3, borderRadius: 3 }}
                  >
                    <Typography color="text.secondary">
                      Total Milk Amount
                    </Typography>

                    <Typography
                      variant="h4"
                      fontWeight="bold"
                      color="success.main"
                      mt={1}
                    >
                      {formatCurrency(totalMilkAmount)}
                    </Typography>
                  </Paper>
                </Box>

                <Divider />

                {/* Milk Collection History */}
                <Box>
                  <Typography variant="h6" fontWeight="bold" mb={2}>
                    Milk Collection History
                  </Typography>

                  {profileErrors.milk && (
                    <Alert severity="error" sx={{ mb: 2 }}>
                      {profileErrors.milk}
                    </Alert>
                  )}

                  <TableContainer component={Paper} variant="outlined">
                    <Table size="small">
                      <TableHead>
                        <TableRow>
                          <TableCell><strong>Date</strong></TableCell>
                          <TableCell><strong>Shift</strong></TableCell>
                          <TableCell><strong>Milk Type</strong></TableCell>
                          <TableCell align="right"><strong>Quantity (L)</strong></TableCell>
                          <TableCell align="right"><strong>Fat</strong></TableCell>
                          <TableCell align="right"><strong>Rate/L</strong></TableCell>
                          <TableCell align="right"><strong>Amount</strong></TableCell>
                        </TableRow>
                      </TableHead>

                      <TableBody>
                        {milkHistory.length > 0 ? (
                          milkHistory.map((entry, index) => (
                            <TableRow key={index}>
                              <TableCell>
                                {formatDate(entry.collectionDate)}
                              </TableCell>
                              <TableCell>{entry.shift || "-"}</TableCell>
                              <TableCell>{entry.milkType || "-"}</TableCell>
                              <TableCell align="right">
                                {entry.quantity ?? "-"}
                              </TableCell>
                              <TableCell align="right">
                                {entry.fat ?? "-"}
                              </TableCell>
                              <TableCell align="right">
                                {formatCurrency(entry.ratePerLiter)}
                              </TableCell>
                              <TableCell align="right">
                                {formatCurrency(entry.totalAmount)}
                              </TableCell>
                            </TableRow>
                          ))
                        ) : (
                          <TableRow>
                            <TableCell colSpan={7} align="center">
                              No milk collection records found.
                            </TableCell>
                          </TableRow>
                        )}
                      </TableBody>
                    </Table>
                  </TableContainer>
                </Box>

                <Divider />

                {/* Payment History */}
                <Box>
                  <Typography variant="h6" fontWeight="bold" mb={2}>
                    Payment History
                  </Typography>

                  {profileErrors.payment && (
                    <Alert severity="error" sx={{ mb: 2 }}>
                      {profileErrors.payment}
                    </Alert>
                  )}

                  <TableContainer component={Paper} variant="outlined">
                    <Table size="small">
                      <TableHead>
                        <TableRow>
                          <TableCell><strong>From Date</strong></TableCell>
                          <TableCell><strong>To Date</strong></TableCell>
                          <TableCell align="right"><strong>Total Amount</strong></TableCell>
                          <TableCell align="center"><strong>Status</strong></TableCell>
                        </TableRow>
                      </TableHead>

                      <TableBody>
                        {paymentHistory.length > 0 ? (
                          paymentHistory.map((payment, index) => {
                            const status =
                              (payment.paymentStatus || "").toLowerCase();

                            return (
                              <TableRow key={index}>
                                <TableCell>
                                  {formatDate(payment.fromDate)}
                                </TableCell>

                                <TableCell>
                                  {formatDate(payment.toDate)}
                                </TableCell>

                                <TableCell align="right">
                                  {formatCurrency(payment.totalAmount)}
                                </TableCell>

                                <TableCell align="center">
                                  <Chip
                                    label={payment.paymentStatus || "Unknown"}
                                    size="small"
                                    color={
                                      status === "paid"
                                        ? "success"
                                        : status === "pending"
                                        ? "warning"
                                        : "default"
                                    }
                                  />
                                </TableCell>
                              </TableRow>
                            );
                          })
                        ) : (
                          <TableRow>
                            <TableCell colSpan={4} align="center">
                              No payment records found.
                            </TableCell>
                          </TableRow>
                        )}
                      </TableBody>
                    </Table>
                  </TableContainer>
                </Box>
              </Stack>
            ) : null}
          </DialogContent>

          <DialogActions>
            <Button onClick={closeProfile}>
              Close
            </Button>
          </DialogActions>
        </Dialog>

        {/* Success / Error Notification */}
        <Snackbar
          open={snackbar.open}
          autoHideDuration={3000}
          onClose={() =>
            setSnackbar((previous) => ({
              ...previous,
              open: false,
            }))
          }
          anchorOrigin={{
            vertical: "bottom",
            horizontal: "right",
          }}
        >
          <Alert
            severity={snackbar.severity}
            variant="filled"
            onClose={() =>
              setSnackbar((previous) => ({
                ...previous,
                open: false,
              }))
            }
          >
            {snackbar.message}
          </Alert>
        </Snackbar>
      </Box>
    </DashboardLayout>
  );
}
