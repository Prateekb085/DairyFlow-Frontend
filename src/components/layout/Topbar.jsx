
import {
  AppBar,
  Toolbar,
  Typography,
  Avatar,
  Box,
  IconButton,
  TextField,
  InputAdornment,
  Button,
} from "@mui/material";

import SearchIcon from "@mui/icons-material/Search";
import NotificationsNoneIcon from "@mui/icons-material/NotificationsNone";
import DarkModeOutlinedIcon from "@mui/icons-material/DarkModeOutlined";
import LogoutIcon from "@mui/icons-material/Logout";

import { useNavigate } from "react-router-dom";

export default function Topbar() {
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem("token");
    navigate("/login", { replace: true });
  };

  return (
    <AppBar
      position="fixed"
      elevation={0}
      color="inherit"
      sx={{
        width: "calc(100% - 270px)",
        ml: "270px",
        borderBottom: "1px solid #E5E7EB",
        bgcolor: "#fff",
      }}
    >
      <Toolbar>
        <Typography
          variant="h5"
          sx={{
            fontWeight: 700,
            flexGrow: 1,
          }}
        >
          Dashboard
        </Typography>

        <TextField
          size="small"
          placeholder="Search..."
          sx={{
            width: 250,
            mr: 3,
            bgcolor: "#F8FAFC",
            borderRadius: 3,
          }}
          slotProps={{
            input: {
              startAdornment: (
                <InputAdornment position="start">
                  <SearchIcon />
                </InputAdornment>
              ),
            },
          }}
        />

        <IconButton>
          <DarkModeOutlinedIcon />
        </IconButton>

        <IconButton sx={{ mx: 1 }}>
          <NotificationsNoneIcon />
        </IconButton>

        <Avatar sx={{ bgcolor: "#2563EB", mr: 2 }}>
          P
        </Avatar>

        <Button
          variant="outlined"
          color="error"
          startIcon={<LogoutIcon />}
          onClick={handleLogout}
        >
          Logout
        </Button>
      </Toolbar>
    </AppBar>
  );
}
