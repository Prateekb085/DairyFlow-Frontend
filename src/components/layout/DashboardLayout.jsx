import { Box } from "@mui/material";
import Sidebar from "./Sidebar";
import Topbar from "./Topbar";

export default function DashboardLayout({ children }) {
  return (
    <Box sx={{ display: "flex", minHeight: "100vh", bgcolor: "#F8FAFC" }}>
      <Sidebar />

      <Box
        sx={{
          flexGrow: 1,
          ml: "270px",
        }}
      >
        <Topbar />

        <Box
          sx={{
            p: 3,
            mt: "72px",
          }}
        >
          {children}
        </Box>
      </Box>
    </Box>
  );
}