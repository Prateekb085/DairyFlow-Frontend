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
} from "@mui/material";

import { DataGrid } from "@mui/x-data-grid";

import DashboardLayout from "../../components/layout/DashboardLayout";

export default function Farmers() {

  const [farmers, setFarmers] = useState([]);

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
};

  const saveFarmer = () => {
  if (editingId) {
    api
      .put(`/farmers/${editingId}`, newFarmer)
      .then(() => {
        loadFarmers();
        handleClose();
        setEditingId(null);
      })
      .catch((error) => {
        console.error("Update Error:", error);
      });
  } else {
    api
      .post("/farmers", newFarmer)
      .then(() => {
        loadFarmers();
        handleClose();
      })
      .catch((error) => {
        console.error("Add Error:", error);
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
      })
     .catch((error) => {
  const message =
    error.response?.data?.message ||
    "Cannot delete farmer because milk records exist.";

  alert(message);
});
  }
};

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
          <DataGrid
            rows={farmers}
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

      </Box>
    </DashboardLayout>
  );
}