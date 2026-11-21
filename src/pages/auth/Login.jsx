
import { useState } from "react";
import {
  Alert,
  Box,
  Button,
  Card,
  CardContent,
  TextField,
  Typography,
  CircularProgress,
} from "@mui/material";
import { useNavigate } from "react-router-dom";
import api from "../../services/api";

export default function Login() {
  const navigate = useNavigate();

  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleLogin = async (e) => {
    e.preventDefault();

    if (!username.trim() || !password) {
      setError("Please enter username and password.");
      return;
    }

    try {
      setLoading(true);
      setError("");

      const response = await api.post("/auth/login", {
        username,
        password,
      });

      const token = response.data.token;

      if (!token) {
        throw new Error("Authentication token was not received.");
      }

      localStorage.setItem("token", token);

      navigate("/dashboard", { replace: true });
    } catch (err) {
      console.error(err);
      localStorage.removeItem("token");
      setError(
        err.response?.data?.message ||
        err.message ||
        "Invalid username or password."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <Box
      sx={{
        minHeight: "100vh",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        background: "#F1F5F9",
        p: 2,
      }}
    >
      <Card sx={{ width: "100%", maxWidth: 420, borderRadius: 4 }}>
        <CardContent sx={{ p: 4 }}>
          <Typography
            variant="h4"
            fontWeight={800}
            textAlign="center"
            color="primary"
          >
            DairyFlow
          </Typography>

          <Typography
            color="text.secondary"
            textAlign="center"
            sx={{ mt: 1, mb: 4 }}
          >
            Village Milk Dairy Management System
          </Typography>

          <Typography variant="h5" fontWeight={700} sx={{ mb: 1 }}>
            Admin Login
          </Typography>

          <Typography color="text.secondary" sx={{ mb: 3 }}>
            Enter your credentials to continue.
          </Typography>

          {error && (
            <Alert severity="error" sx={{ mb: 2 }}>
              {error}
            </Alert>
          )}

          <Box component="form" onSubmit={handleLogin}>
            <TextField
              fullWidth
              label="Username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              margin="normal"
              required
            />

            <TextField
              fullWidth
              label="Password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              margin="normal"
              required
            />

            <Button
              fullWidth
              type="submit"
              variant="contained"
              size="large"
              disabled={loading}
              sx={{ mt: 3, py: 1.5, borderRadius: 2 }}
            >
              {loading ? (
                <CircularProgress size={24} color="inherit" />
              ) : (
                "Sign In"
              )}
            </Button>
          </Box>
        </CardContent>
      </Card>
    </Box>
  );
}
