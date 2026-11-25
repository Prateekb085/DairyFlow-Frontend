
import { useState } from "react";

import {
  Box,
  Card,
  CardContent,
  Typography,
  Grid,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Alert,
  CircularProgress,
  IconButton,
  InputAdornment,
  FormControlLabel,
  Switch,
} from "@mui/material";

import PeopleIcon from "@mui/icons-material/People";
import BusinessOutlinedIcon from "@mui/icons-material/BusinessOutlined";
import LockOutlinedIcon from "@mui/icons-material/LockOutlined";
import AccountBalanceOutlinedIcon from "@mui/icons-material/AccountBalanceOutlined";
import NotificationsOutlinedIcon from "@mui/icons-material/NotificationsOutlined";
import Visibility from "@mui/icons-material/Visibility";
import VisibilityOff from "@mui/icons-material/VisibilityOff";

import DashboardLayout from "../../components/layout/DashboardLayout";
import api from "../../services/api";

// SETTINGS ITEMS

const settingsItems = [
  {
    title: "Admin Profile",
    description: "Manage your name, email and contact information.",
    icon: <PeopleIcon />,
  },
  {
    title: "Dairy Information",
    description: "Manage dairy name, address and contact details.",
    icon: <BusinessOutlinedIcon />,
  },
  {
    title: "Security",
    description: "Change password and manage account security.",
    icon: <LockOutlinedIcon />,
  },
  {
    title: "Payment Configuration",
    description: "Configure direct UPI payments and payment verification.",
    icon: <AccountBalanceOutlinedIcon />,
  },
  {
    title: "Notifications",
    description: "Manage payment and milk collection notifications.",
    icon: <NotificationsOutlinedIcon />,
  },
];

export default function Settings() {

  // ================= ADMIN PROFILE STATE =================

  const [open, setOpen] = useState(false);

  const [profile, setProfile] = useState({
    username: "",
    fullName: "",
    email: "",
    phone: "",
  });

  // ================= DAIRY INFORMATION STATE =================

  const [dairyOpen, setDairyOpen] = useState(false);

  const [dairy, setDairy] = useState({
    dairyName: "",
    address: "",
    phone: "",
    email: "",
  });

  // COMMON PROFILE AND DAIRY STATES

  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  // ================= SECURITY STATE =================

  const [securityOpen, setSecurityOpen] = useState(false);

  const [passwords, setPasswords] = useState({
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  });

  const [passwordSaving, setPasswordSaving] = useState(false);
  const [passwordMessage, setPasswordMessage] = useState("");
  const [passwordError, setPasswordError] = useState("");

  const [showPasswords, setShowPasswords] = useState({
    current: false,
    new: false,
    confirm: false,
  });

  // ================= PAYMENT CONFIGURATION STATE =================

  const [paymentOpen, setPaymentOpen] = useState(false);

  const [paymentConfig, setPaymentConfig] = useState({
    paymentMethod: "UPI",
    upiEnabled: true,
    requireUtr: true,
    paymentInstructions:
      "Verify the UPI transaction and reference number before marking payment as paid.",
  });

  const [paymentLoading, setPaymentLoading] = useState(false);
  const [paymentSaving, setPaymentSaving] = useState(false);
  const [paymentMessage, setPaymentMessage] = useState("");
  const [paymentError, setPaymentError] = useState("");

  // ================= ADMIN PROFILE =================

  const handleOpenProfile = async () => {
    setOpen(true);
    setLoading(true);
    setMessage("");
    setError("");

    try {
      const response = await api.get("/admin/profile");

      setProfile({
        username: response.data.username || "",
        fullName: response.data.fullName || "",
        email: response.data.email || "",
        phone: response.data.phone || "",
      });

    } catch (err) {
      setError(
        err.response?.data?.message ||
        "Unable to load admin profile."
      );
    } finally {
      setLoading(false);
    }
  };

  const handleProfileChange = (event) => {
    const { name, value } = event.target;

    setProfile((previous) => ({
      ...previous,
      [name]: value,
    }));
  };

  const handleSaveProfile = async () => {
    setError("");
    setMessage("");

    if (!profile.fullName.trim()) {
      setError("Full name is required.");
      return;
    }

    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(profile.email)) {
      setError("Please enter a valid email address.");
      return;
    }

    if (!/^\d{10}$/.test(profile.phone)) {
      setError("Please enter a valid 10-digit mobile number.");
      return;
    }

    setSaving(true);

    try {
      const response = await api.put("/admin/profile", {
        fullName: profile.fullName.trim(),
        email: profile.email.trim(),
        phone: profile.phone.trim(),
      });

      setProfile(response.data);
      setMessage("Admin profile updated successfully!");

    } catch (err) {
      setError(
        err.response?.data?.message ||
        "Unable to update admin profile."
      );
    } finally {
      setSaving(false);
    }
  };

  // ================= DAIRY INFORMATION =================

  const handleOpenDairy = async () => {
    setDairyOpen(true);
    setLoading(true);
    setMessage("");
    setError("");

    try {
      const response = await api.get("/admin/dairy");

      setDairy({
        dairyName: response.data?.dairyName || "",
        address: response.data?.address || "",
        phone: response.data?.phone || "",
        email: response.data?.email || "",
      });

    } catch (err) {
      setError(
        err.response?.data?.message ||
        "Unable to load dairy information."
      );
    } finally {
      setLoading(false);
    }
  };

  const handleDairyChange = (event) => {
    const { name, value } = event.target;

    setDairy((previous) => ({
      ...previous,
      [name]: value,
    }));
  };

  const handleSaveDairy = async () => {
    setError("");
    setMessage("");

    if (!dairy.dairyName.trim()) {
      setError("Dairy name is required.");
      return;
    }

    if (!dairy.address.trim()) {
      setError("Dairy address is required.");
      return;
    }

    if (!/^\d{10}$/.test(dairy.phone)) {
      setError("Please enter a valid 10-digit mobile number.");
      return;
    }

    if (
      dairy.email.trim() &&
      !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(dairy.email)
    ) {
      setError("Please enter a valid email address.");
      return;
    }

    setSaving(true);

    try {
      const response = await api.put("/admin/dairy", {
        dairyName: dairy.dairyName.trim(),
        address: dairy.address.trim(),
        phone: dairy.phone.trim(),
        email: dairy.email.trim(),
      });

      setDairy(response.data);
      setMessage("Dairy information saved successfully!");

    } catch (err) {
      setError(
        err.response?.data?.message ||
        "Unable to save dairy information."
      );
    } finally {
      setSaving(false);
    }
  };

  // ================= SECURITY / CHANGE PASSWORD =================

  const handleOpenSecurity = () => {
    setPasswords({
      currentPassword: "",
      newPassword: "",
      confirmPassword: "",
    });

    setPasswordError("");
    setPasswordMessage("");

    setShowPasswords({
      current: false,
      new: false,
      confirm: false,
    });

    setSecurityOpen(true);
  };

  const handlePasswordChange = (event) => {
    const { name, value } = event.target;

    setPasswords((previous) => ({
      ...previous,
      [name]: value,
    }));
  };

  const handleTogglePassword = (field) => {
    setShowPasswords((previous) => ({
      ...previous,
      [field]: !previous[field],
    }));
  };

  const handleChangePassword = async () => {
    setPasswordError("");
    setPasswordMessage("");

    if (!passwords.currentPassword.trim()) {
      setPasswordError("Current password is required.");
      return;
    }

    if (!passwords.newPassword) {
      setPasswordError("New password is required.");
      return;
    }

    if (passwords.newPassword.length < 8) {
      setPasswordError("New password must contain at least 8 characters.");
      return;
    }

    if (passwords.newPassword !== passwords.confirmPassword) {
      setPasswordError("New password and confirm password do not match.");
      return;
    }

    if (passwords.currentPassword === passwords.newPassword) {
      setPasswordError("New password must be different from current password.");
      return;
    }

    setPasswordSaving(true);

    try {
      const response = await api.put("/auth/change-password", {
        currentPassword: passwords.currentPassword,
        newPassword: passwords.newPassword,
      });

      setPasswordMessage(
        typeof response.data === "string"
          ? response.data
          : response.data?.message || "Password changed successfully!"
      );

      setPasswords({
        currentPassword: "",
        newPassword: "",
        confirmPassword: "",
      });

    } catch (err) {
      setPasswordError(
        err.response?.data?.message ||
        "Unable to change password. Please try again."
      );
    } finally {
      setPasswordSaving(false);
    }
  };

  // ================= PAYMENT CONFIGURATION =================

  // LOAD PAYMENT CONFIGURATION

  const handleOpenPayment = async () => {
    setPaymentOpen(true);
    setPaymentLoading(true);
    setPaymentError("");
    setPaymentMessage("");

    try {
      const response = await api.get("/admin/payment-config");

      setPaymentConfig({
        paymentMethod: response.data.paymentMethod || "UPI",
        upiEnabled: response.data.upiEnabled ?? true,
        requireUtr: response.data.requireUtr ?? true,
        paymentInstructions:
          response.data.paymentInstructions || "",
      });

    } catch (err) {
      setPaymentError(
        err.response?.data?.message ||
        "Unable to load payment configuration."
      );
    } finally {
      setPaymentLoading(false);
    }
  };

  // HANDLE PAYMENT INPUT CHANGES

  const handlePaymentChange = (event) => {
    const { name, value, checked, type } = event.target;

    setPaymentConfig((previous) => ({
      ...previous,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  // SAVE PAYMENT CONFIGURATION

  const handleSavePayment = async () => {
    setPaymentError("");
    setPaymentMessage("");

    setPaymentSaving(true);

    try {
      const response = await api.put(
        "/admin/payment-config",
        paymentConfig
      );

      setPaymentConfig({
        paymentMethod: response.data.paymentMethod || "UPI",
        upiEnabled: response.data.upiEnabled ?? true,
        requireUtr: response.data.requireUtr ?? true,
        paymentInstructions:
          response.data.paymentInstructions || "",
      });

      setPaymentMessage(
        "Payment configuration updated successfully!"
      );

    } catch (err) {
      setPaymentError(
        err.response?.data?.message ||
        "Unable to update payment configuration."
      );
    } finally {
      setPaymentSaving(false);
    }
  };

  // ================= SETTINGS PAGE =================

  return (
    <DashboardLayout>
      <Box>

        <Typography variant="h4" fontWeight={700} mb={1}>
          Settings
        </Typography>

        <Typography color="text.secondary" mb={4}>
          Manage your DairyFlow application settings.
        </Typography>

        {/* SETTINGS CARDS */}

        <Grid container spacing={3}>
          {settingsItems.map((item) => (

            <Grid item xs={12} sm={6} md={4} key={item.title}>

              <Card
                sx={{
                  height: "100%",
                  borderRadius: 3,
                  boxShadow: "0 2px 12px rgba(0,0,0,0.05)",
                }}
              >

                <CardContent sx={{ p: 3 }}>

                  <Box
                    sx={{
                      color: "#2563EB",
                      mb: 2,
                      "& svg": { fontSize: 35 },
                    }}
                  >
                    {item.icon}
                  </Box>

                  <Typography variant="h6" fontWeight={700} mb={1}>
                    {item.title}
                  </Typography>

                  <Typography color="text.secondary" mb={3}>
                    {item.description}
                  </Typography>

                  <Button
                    variant="outlined"
                    size="small"
                    disabled={
                      item.title !== "Admin Profile" &&
                      item.title !== "Dairy Information" &&
                      item.title !== "Security" &&
                      item.title !== "Payment Configuration"
                    }
                    onClick={() => {
                      if (item.title === "Admin Profile") {
                        handleOpenProfile();
                      } else if (item.title === "Dairy Information") {
                        handleOpenDairy();
                      } else if (item.title === "Security") {
                        handleOpenSecurity();
                      } else if (item.title === "Payment Configuration") {
                        handleOpenPayment();
                      }
                    }}
                  >
                    {item.title === "Admin Profile" ||
                    item.title === "Dairy Information" ||
                    item.title === "Security" ||
                    item.title === "Payment Configuration"
                      ? "Configure"
                      : "Coming Soon"}
                  </Button>

                </CardContent>
              </Card>

            </Grid>
          ))}
        </Grid>

      </Box>

      {/* ================= ADMIN PROFILE DIALOG ================= */}

      <Dialog
        open={open}
        onClose={() => !saving && setOpen(false)}
        fullWidth
        maxWidth="sm"
      >

        <DialogTitle fontWeight={700}>
          Admin Profile
        </DialogTitle>

        <DialogContent>

          {loading ? (
            <Box display="flex" justifyContent="center" p={4}>
              <CircularProgress />
            </Box>
          ) : (

            <Box sx={{ display: "flex", flexDirection: "column", gap: 2, mt: 1 }}>

              {error && <Alert severity="error">{error}</Alert>}
              {message && <Alert severity="success">{message}</Alert>}

              <TextField
                label="Username"
                value={profile.username}
                fullWidth
                disabled
              />

              <TextField
                label="Full Name"
                name="fullName"
                value={profile.fullName}
                onChange={handleProfileChange}
                fullWidth
                required
              />

              <TextField
                label="Email Address"
                name="email"
                type="email"
                value={profile.email}
                onChange={handleProfileChange}
                fullWidth
                required
              />

              <TextField
                label="Mobile Number"
                name="phone"
                value={profile.phone}
                onChange={handleProfileChange}
                fullWidth
                inputProps={{ maxLength: 10 }}
                required
              />

            </Box>
          )}

        </DialogContent>

        <DialogActions sx={{ p: 3 }}>

          <Button
            onClick={() => setOpen(false)}
            color="inherit"
            disabled={saving}
          >
            Close
          </Button>

          <Button
            variant="contained"
            onClick={handleSaveProfile}
            disabled={loading || saving}
          >
            {saving ? (
              <CircularProgress size={22} color="inherit" />
            ) : (
              "Save Changes"
            )}
          </Button>

        </DialogActions>

      </Dialog>

      {/* ================= DAIRY INFORMATION DIALOG ================= */}

      <Dialog
        open={dairyOpen}
        onClose={() => !saving && setDairyOpen(false)}
        fullWidth
        maxWidth="sm"
      >

        <DialogTitle fontWeight={700}>
          Dairy Information
        </DialogTitle>

        <DialogContent>

          {loading ? (
            <Box display="flex" justifyContent="center" p={4}>
              <CircularProgress />
            </Box>
          ) : (

            <Box sx={{ display: "flex", flexDirection: "column", gap: 2, mt: 1 }}>

              {error && <Alert severity="error">{error}</Alert>}
              {message && <Alert severity="success">{message}</Alert>}

              <TextField
                label="Dairy Name"
                name="dairyName"
                value={dairy.dairyName}
                onChange={handleDairyChange}
                fullWidth
                required
              />

              <TextField
                label="Dairy Address"
                name="address"
                value={dairy.address}
                onChange={handleDairyChange}
                fullWidth
                multiline
                rows={3}
                required
              />

              <TextField
                label="Contact Number"
                name="phone"
                value={dairy.phone}
                onChange={handleDairyChange}
                fullWidth
                inputProps={{ maxLength: 10 }}
                required
              />

              <TextField
                label="Email Address"
                name="email"
                type="email"
                value={dairy.email}
                onChange={handleDairyChange}
                fullWidth
              />

            </Box>
          )}

        </DialogContent>

        <DialogActions sx={{ p: 3 }}>

          <Button
            onClick={() => setDairyOpen(false)}
            color="inherit"
            disabled={saving}
          >
            Close
          </Button>

          <Button
            variant="contained"
            onClick={handleSaveDairy}
            disabled={loading || saving}
          >
            {saving ? (
              <CircularProgress size={22} color="inherit" />
            ) : (
              "Save Changes"
            )}
          </Button>

        </DialogActions>

      </Dialog>

      {/* ================= SECURITY / CHANGE PASSWORD DIALOG ================= */}

      <Dialog
        open={securityOpen}
        onClose={() => !passwordSaving && setSecurityOpen(false)}
        fullWidth
        maxWidth="sm"
      >

        <DialogTitle fontWeight={700}>
          Change Password
        </DialogTitle>

        <DialogContent>

          <Box sx={{ display: "flex", flexDirection: "column", gap: 2, mt: 1 }}>

            <Typography color="text.secondary">
              Update your admin account password to keep your account secure.
            </Typography>

            {passwordError && (
              <Alert severity="error">
                {passwordError}
              </Alert>
            )}

            {passwordMessage && (
              <Alert severity="success">
                {passwordMessage}
              </Alert>
            )}

            <TextField
              label="Current Password"
              name="currentPassword"
              type={showPasswords.current ? "text" : "password"}
              value={passwords.currentPassword}
              onChange={handlePasswordChange}
              fullWidth
              required
              autoComplete="current-password"
              InputProps={{
                endAdornment: (
                  <InputAdornment position="end">
                    <IconButton
                      onClick={() => handleTogglePassword("current")}
                      edge="end"
                      aria-label="Toggle current password visibility"
                    >
                      {showPasswords.current ? <VisibilityOff /> : <Visibility />}
                    </IconButton>
                  </InputAdornment>
                ),
              }}
            />

            <TextField
              label="New Password"
              name="newPassword"
              type={showPasswords.new ? "text" : "password"}
              value={passwords.newPassword}
              onChange={handlePasswordChange}
              fullWidth
              required
              autoComplete="new-password"
              helperText="Minimum 8 characters"
              InputProps={{
                endAdornment: (
                  <InputAdornment position="end">
                    <IconButton
                      onClick={() => handleTogglePassword("new")}
                      edge="end"
                      aria-label="Toggle new password visibility"
                    >
                      {showPasswords.new ? <VisibilityOff /> : <Visibility />}
                    </IconButton>
                  </InputAdornment>
                ),
              }}
            />

            <TextField
              label="Confirm New Password"
              name="confirmPassword"
              type={showPasswords.confirm ? "text" : "password"}
              value={passwords.confirmPassword}
              onChange={handlePasswordChange}
              fullWidth
              required
              autoComplete="new-password"
              InputProps={{
                endAdornment: (
                  <InputAdornment position="end">
                    <IconButton
                      onClick={() => handleTogglePassword("confirm")}
                      edge="end"
                      aria-label="Toggle confirm password visibility"
                    >
                      {showPasswords.confirm ? <VisibilityOff /> : <Visibility />}
                    </IconButton>
                  </InputAdornment>
                ),
              }}
            />

          </Box>

        </DialogContent>

        <DialogActions sx={{ p: 3 }}>

          <Button
            onClick={() => setSecurityOpen(false)}
            color="inherit"
            disabled={passwordSaving}
          >
            Close
          </Button>

          <Button
            variant="contained"
            onClick={handleChangePassword}
            disabled={passwordSaving}
          >
            {passwordSaving ? (
              <CircularProgress size={22} color="inherit" />
            ) : (
              "Update Password"
            )}
          </Button>

        </DialogActions>

      </Dialog>

      {/* ================= PAYMENT CONFIGURATION DIALOG ================= */}

      <Dialog
        open={paymentOpen}
        onClose={() => !paymentSaving && setPaymentOpen(false)}
        fullWidth
        maxWidth="sm"
      >

        <DialogTitle fontWeight={700}>
          Payment Configuration
        </DialogTitle>

        <DialogContent>

          {paymentLoading ? (

            <Box display="flex" justifyContent="center" p={4}>
              <CircularProgress />
            </Box>

          ) : (

            <Box
              sx={{
                display: "flex",
                flexDirection: "column",
                gap: 3,
                mt: 1,
              }}
            >

              {paymentError && (
                <Alert severity="error">
                  {paymentError}
                </Alert>
              )}

              {paymentMessage && (
                <Alert severity="success">
                  {paymentMessage}
                </Alert>
              )}

              <TextField
                label="Payment Method"
                value="Direct UPI"
                fullWidth
                disabled
              />

              <FormControlLabel
                control={
                  <Switch
                    name="upiEnabled"
                    checked={paymentConfig.upiEnabled}
                    onChange={handlePaymentChange}
                  />
                }
                label="Enable UPI Payments"
              />

              <FormControlLabel
                control={
                  <Switch
                    name="requireUtr"
                    checked={paymentConfig.requireUtr}
                    onChange={handlePaymentChange}
                  />
                }
                label="Require UTR / Transaction Reference"
              />

              <TextField
                label="Payment Instructions"
                name="paymentInstructions"
                value={paymentConfig.paymentInstructions}
                onChange={handlePaymentChange}
                multiline
                rows={4}
                fullWidth
                inputProps={{ maxLength: 1000 }}
                helperText="Instructions displayed to the admin during payment processing."
              />

            </Box>
          )}

        </DialogContent>

        <DialogActions sx={{ p: 3 }}>

          <Button
            onClick={() => setPaymentOpen(false)}
            color="inherit"
            disabled={paymentSaving}
          >
            Close
          </Button>

          <Button
            variant="contained"
            onClick={handleSavePayment}
            disabled={paymentLoading || paymentSaving}
          >
            {paymentSaving ? (
              <CircularProgress size={22} color="inherit" />
            ) : (
              "Save Configuration"
            )}
          </Button>

        </DialogActions>

      </Dialog>

    </DashboardLayout>
  );
}
