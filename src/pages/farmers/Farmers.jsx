import { useEffect, useState } from "react";
import api from "../../services/api";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
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

const showSnackbar = (message, severity = "success") => {
  setSnackbar({
    open: true,
    message,
    severity,
  });
};

  const [open, setOpen] = useState(false);

  const [newFarmer, setNewFarmer] = useState({
    farmerCode: "",
    farmerName: "",
    mobileNumber: "",
    village: "",
  });

  const [editingId, setEditingId] = useState(null);

  useEffect(() => {
    loadFarmers();
  }, []);

  const loadFarmers = () => {
    api
      .get("/farmers")
      .then((response) => {
        setFarmers(response.data);
      })
      .catch((error) => {
        console.error("Farmers API Error:", error);
      });
  };

  const handleOpen = () => {
    setOpen(true);
  };

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
    newErrors.mobileNumber = "Enter a valid 10-digit mobile number";
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
      showSnackbar("Farmer updated successfully", "success");
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
      showSnackbar("Farmer added successfully", "success");
    })
    .catch((error) => {
      console.error("Add Error:", error);
      showSnackbar("Error adding farmer", "error");
    });
}
};

const editFarmer = (farmer) => {
  setEditingId(farmer.id);

  setNewFarmer({
    farmerCode: farmer.farmerCode,
    farmerName: farmer.farmerName,
    mobileNumber: farmer.mobileNumber,
    village: farmer.village,
  });

  setOpen(true);
};

const deleteFarmer = (id) => {
  if (window.confirm("Are you sure you want to delete this farmer?")) {
    api
      .delete(`/farmers/${id}`)
      .then(() => {
        loadFarmers();
        showSnackbar("Farmer deleted successfully", "success");
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


const filteredFarmers = farmers.filter((farmer) => {
  const search = searchText.toLowerCase();

  return (
    farmer.farmerName?.toLowerCase().includes(search) ||
    farmer.farmerCode?.toLowerCase().includes(search) ||
    farmer.mobileNumber?.toLowerCase().includes(search) ||
    farmer.village?.toLowerCase().includes(search)
  );
});


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
  },
  {
    field: "actions",
    headerName: "Actions",
    width: 140,
    sortable: false,
    renderCell: (params) => (
      <>
        <IconButton
          color="primary"
          onClick={() => editFarmer(params.row)}
        >
          <EditIcon />
        </IconButton>

        <IconButton
          color="error"
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

          <Button
            variant="contained"
            onClick={handleOpen}
          >
            Add Farmer
          </Button>
        </Box>

        <Paper
          sx={{
            height: 550,
            borderRadius: 4,
          }}
        >


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

            <Button
  variant="contained"
  onClick={saveFarmer}
>
  {editingId ? "Update" : "Save"}
</Button>

          </DialogActions>
        </Dialog>
<Snackbar
  open={snackbar.open}
  autoHideDuration={3000}
  onClose={() =>
    setSnackbar({
      ...snackbar,
      open: false,
    })
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
      setSnackbar({
        ...snackbar,
        open: false,
      })
    }
  >
    {snackbar.message}
  </Alert>
</Snackbar>
      </Box>
    </DashboardLayout>
  );
}