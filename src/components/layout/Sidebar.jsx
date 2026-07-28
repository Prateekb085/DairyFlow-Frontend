import {
  Box,
  Typography,
  List,
  ListItemButton,
  ListItemIcon,
  ListItemText,
} from "@mui/material";

import DashboardIcon from "@mui/icons-material/Dashboard";
import PeopleIcon from "@mui/icons-material/People";
import OpacityIcon from "@mui/icons-material/Opacity";
import PaymentsIcon from "@mui/icons-material/Payments";
import AssessmentIcon from "@mui/icons-material/Assessment";
import SettingsIcon from "@mui/icons-material/Settings";

const menus = [
  { name: "Dashboard", icon: <DashboardIcon /> },
  { name: "Farmers", icon: <PeopleIcon /> },
  { name: "Milk Entries", icon: <OpacityIcon /> },
  { name: "Payments", icon: <PaymentsIcon /> },
  { name: "Reports", icon: <AssessmentIcon /> },
  { name: "Settings", icon: <SettingsIcon /> },
];

export default function Sidebar() {
  return (
    <Box
      sx={{
        width: 270,
        height: "100vh",
        bgcolor: "#fff",
        position: "fixed",
        borderRight: "1px solid #ECECEC",
      }}
    >
      <Box sx={{ p: 3 }}>
  <Typography
    variant="h4"
    sx={{
      fontWeight: 800,
      color: "#2563EB",
      letterSpacing: 0.5,
    }}
  >
    🥛 DairyFlow
  </Typography>

  <Typography
    variant="body2"
    color="text.secondary"
  >
    Milk Collection System
  </Typography>
</Box>

      <List>
        {menus.map((menu) => (
          <ListItemButton
  key={menu.name}
  sx={{
    mx: 2,
    my: 0.8,
    py: 1.3,
    borderRadius: 3,
    color: "#64748B",
    transition: "all 0.25s ease",

    "&:hover": {
      bgcolor: "#EEF4FF",
      color: "#2563EB",
      transform: "translateX(4px)",
    },

    "&.active": {
      bgcolor: "#2563EB",
      color: "#fff",
    },
  }}
>
            <ListItemIcon
  sx={{
    color: "inherit",
    minWidth: 40,
  }}
>
  {menu.icon}
</ListItemIcon>

            <ListItemText primary={menu.name} />
          </ListItemButton>
        ))}
      </List>
    </Box>
  );
}