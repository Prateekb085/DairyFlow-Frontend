import { useEffect, useState } from "react";
import api from "../../services/api";

import DashboardLayout from "../../components/layout/DashboardLayout";


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
  MenuItem,
  Stack,
  IconButton,
  Tooltip,
  Snackbar,
  Alert,
} from "@mui/material";

import { DataGrid } from "@mui/x-data-grid";

import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import dayjs from "dayjs";


import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";

export default function MilkEntries() {

  const [milkEntries, setMilkEntries] = useState([]);



    const [farmers, setFarmers] = useState([]);

  const [open, setOpen] = useState(false);

  const [editingId, setEditingId] = useState(null);

  const [searchText, setSearchText] = useState("");
const [filterMilkType, setFilterMilkType] = useState("");
const [filterShift, setFilterShift] = useState("");

  const [milkEntry, setMilkEntry] = useState({
    farmerId: "",
    collectionDate: "",
    shift: "Morning",
    milkType: "Cow",
    quantity: "",
    fat: "",
    ratePerLiter: "",
    totalAmount: "",
  });

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

  useEffect(() => {
    loadMilkEntries();
    loadFarmers();
  }, []);

  const loadMilkEntries = () => {
    api
      .get("/milk")
      .then((response) => {
        setMilkEntries(response.data);
      })
      .catch((error) => {
        console.error(error);
      });
  };


  const loadFarmers = () => {
  api
    .get("/farmers")
    .then((response) => {
      setFarmers(response.data);
    })
    .catch((error) => {
      console.error("Farmer Error:", error);
    });
};

const fetchRate = async (milkType, fat) => {
  if (!milkType || fat === "" || fat === null) {
    setMilkEntry((prev) => ({
      ...prev,
      ratePerLiter: "",
      totalAmount: 0,
    }));
    return;
  }

  try {
    const response = await api.get("/rates/search", {
      params: {
        milkType: milkType,
        fat: Number(fat),
      },
    });

    const rate = Number(response.data.ratePerLiter);

    setMilkEntry((prev) => ({
      ...prev,
      ratePerLiter: rate,
      totalAmount: Number(prev.quantity || 0) * rate,
    }));

  } catch (error) {
    console.error("Rate Error:", error);
    console.error("Rate Response:", error.response);

    setMilkEntry((prev) => ({
      ...prev,
      ratePerLiter: "",
      totalAmount: 0,
    }));

    showSnackbar(
      error.response?.data?.message || "Rate not found",
      "error"
    );
  }
};


useEffect(() => {
  if (milkEntry.milkType && milkEntry.fat !== "") {
    fetchRate(milkEntry.milkType, milkEntry.fat);
  }
}, [milkEntry.milkType, milkEntry.fat]);




const handleOpen = () => {
  setEditingId(null);

  setMilkEntry({
    farmerId: "",
    collectionDate: "",
    shift: "Morning",
    milkType: "Cow",
    quantity: "",
    fat: "",
    ratePerLiter: "",
    totalAmount: "",
  });

  setOpen(true);
};

const handleClose = () => {
  setOpen(false);
  setEditingId(null);

  setMilkEntry({
    farmerId: "",
    collectionDate: "",
    shift: "Morning",
    milkType: "Cow",
    quantity: "",
    fat: "",
    ratePerLiter: "",
    totalAmount: "",
  });
};

const handleEdit = (row) => {
  setEditingId(row.id);

  setMilkEntry({
    farmerId: row.farmer?.id || "",
    collectionDate: row.collectionDate || "",
    shift: row.shift || "Morning",
    milkType: row.milkType || "Cow",
    quantity: row.quantity || "",
    fat: row.fat || "",
    ratePerLiter: row.ratePerLiter || "",
    totalAmount: row.totalAmount || "",
  });

  setOpen(true);
};

const handleDelete = (id) => {
  const confirmDelete = window.confirm(
    "Are you sure you want to delete this milk entry?"
  );

  if (!confirmDelete) {
    return;
  }

  api
    .delete(`/milk/${id}`)
    .then(() => {
      loadMilkEntries();
      showSnackbar("Milk Entry Deleted Successfully", "success");
    })
    .catch((error) => {
      console.error("Delete Error:", error);
      showSnackbar("Failed to Delete Milk Entry", "error");
    });
};

const saveMilkEntry = () => {

  const request = {
    farmer: {
      id: Number(milkEntry.farmerId),
    },
    collectionDate: milkEntry.collectionDate,
    shift: milkEntry.shift,
    milkType: milkEntry.milkType,
    quantity: Number(milkEntry.quantity),
    fat: Number(milkEntry.fat),
  };

  if (editingId !== null) {

    api
      .put(`/milk/${editingId}`, request)
      .then(() => {
        handleClose();
        loadMilkEntries();
        showSnackbar("Milk Entry Updated Successfully", "success");
      })
      .catch((error) => {
        console.error("Update Error:", error);
        console.error("Response:", error.response);
        showSnackbar(
          error.response?.data?.message ||
          "Failed to Update Milk Entry",
          "error"
        );
      });

  } else {

    api
      .post("/milk", request)
      .then(() => {
        handleClose();
        loadMilkEntries();
        showSnackbar("Milk Entry Added Successfully", "success");
      })
      .catch((error) => {
        console.error("Save Error:", error);
        console.error("Response:", error.response);
        showSnackbar(
          error.response?.data?.message ||
          "Failed to Save Milk Entry",
          "error"
        );
      });
  }
};


  const columns = [
    {
      field: "id",
      headerName: "ID",
      width: 70,
    },
    {
  field: "farmerName",
  headerName: "Farmer",
  flex: 1,
  renderCell: (params) =>
    params.row?.farmer?.farmerName || "Unknown",
},
    {
      field: "collectionDate",
      headerName: "Date",
      width: 120,
    },
    {
      field: "shift",
      headerName: "Shift",
      width: 110,
    },
    {
      field: "milkType",
      headerName: "Milk Type",
      width: 120,
    },
    {
      field: "quantity",
      headerName: "Qty (L)",
      width: 100,
    },
    {
      field: "fat",
      headerName: "Fat",
      width: 90,
    },
    {
      field: "ratePerLiter",
      headerName: "Rate",
      width: 100,
    },
    {
      field: "totalAmount",
      headerName: "Amount",
      width: 120,
    },

    {
  field: "actions",
  headerName: "Actions",
  width: 130,
  sortable: false,
  filterable: false,
  renderCell: (params) => (
    <>
      <Tooltip title="Edit">
        <IconButton
          color="primary"
          onClick={() => handleEdit(params.row)}
        >
          <EditIcon />
        </IconButton>
      </Tooltip>

      <Tooltip title="Delete">
        <IconButton
          color="error"
          onClick={() => handleDelete(params.row.id)}
        >
          <DeleteIcon />
        </IconButton>
      </Tooltip>
    </>
  ),
},
  ];

  const filteredMilkEntries = milkEntries.filter((entry) => {

  const farmerName =
    entry.farmer?.farmerName?.toLowerCase() || "";

  const search =
    searchText.toLowerCase();

  const matchesSearch =
    farmerName.includes(search);

  const matchesMilkType =
    filterMilkType === "" ||
    entry.milkType === filterMilkType;

  const matchesShift =
    filterShift === "" ||
    entry.shift === filterShift;

  return (
    matchesSearch &&
    matchesMilkType &&
    matchesShift
  );
});


  return (
    <DashboardLayout>

      <Box>

        <Box
          sx={{
            display: "flex",
            justifyContent: "space-between",
            mb: 3,
          }}
        >
          <Typography
            variant="h4"
            fontWeight="bold"
          >
            Milk Entries
          </Typography>

          <Button
            variant="contained"
         onClick={handleOpen}
         >
         Add Milk Entry
          </Button>

        </Box>

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
    sx={{ minWidth: 220 }}
  />

  <TextField
    select
    label="Milk Type"
    size="small"
    value={filterMilkType}
    onChange={(e) => setFilterMilkType(e.target.value)}
    sx={{ minWidth: 160 }}
  >
    <MenuItem value="">All</MenuItem>
    <MenuItem value="Cow">Cow</MenuItem>
    <MenuItem value="Buffalo">Buffalo</MenuItem>
  </TextField>

  <TextField
    select
    label="Shift"
    size="small"
    value={filterShift}
    onChange={(e) => setFilterShift(e.target.value)}
    sx={{ minWidth: 160 }}
  >
    <MenuItem value="">All</MenuItem>
    <MenuItem value="Morning">Morning</MenuItem>
    <MenuItem value="Evening">Evening</MenuItem>
  </TextField>

  <Button
    variant="outlined"
    onClick={() => {
      setSearchText("");
      setFilterMilkType("");
      setFilterShift("");
    }}
  >
    Clear Filters
  </Button>
</Box>




        <Paper
          sx={{
            height: 600,
            borderRadius: 4,
          }}
        >
          <DataGrid
            rows={filteredMilkEntries}
            columns={columns}
            pageSizeOptions={[5,10,20]}
            initialState={{
              pagination:{
                paginationModel:{
                  pageSize:5,
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
  {editingId !== null ? "Edit Milk Entry" : "Add Milk Entry"}
</DialogTitle>

  <DialogContent>
    <Stack spacing={2} mt={1}>

      {/* Farmer */}
      <TextField
        select
        label="Farmer"
        value={milkEntry.farmerId}
        onChange={(e) =>
          setMilkEntry({
            ...milkEntry,
            farmerId: e.target.value,
          })
        }
      >
        {farmers.map((farmer) => (
          <MenuItem
            key={farmer.id}
            value={farmer.id}
          >
            {farmer.farmerName}
          </MenuItem>
        ))}
      </TextField>

      {/* Collection Date */}
      <LocalizationProvider dateAdapter={AdapterDayjs}>
  <DatePicker
    label="Collection Date"
    value={
      milkEntry.collectionDate
        ? dayjs(milkEntry.collectionDate)
        : null
    }
    onChange={(newValue) =>
      setMilkEntry({
        ...milkEntry,
        collectionDate: newValue
          ? newValue.format("YYYY-MM-DD")
          : "",
      })
    }
    slotProps={{
      textField: {
        fullWidth: true,
      },
    }}
  />
</LocalizationProvider>

      {/* Shift */}
      <TextField
        select
        label="Shift"
        value={milkEntry.shift}
        onChange={(e) =>
          setMilkEntry({
            ...milkEntry,
            shift: e.target.value,
          })
        }
      >
        <MenuItem value="Morning">Morning</MenuItem>
        <MenuItem value="Evening">Evening</MenuItem>
      </TextField>

      {/* Milk Type */}
      <TextField
        select
        label="Milk Type"
        value={milkEntry.milkType}
        onChange={(e) =>
          setMilkEntry({
            ...milkEntry,
            milkType: e.target.value,
          })
        }
      >
        <MenuItem value="Cow">Cow</MenuItem>
        <MenuItem value="Buffalo">Buffalo</MenuItem>
      </TextField>

      {/* Quantity */}
      <TextField
        label="Quantity (Litres)"
        type="number"
        value={milkEntry.quantity}
        onChange={(e) => {
  const quantity = Number(e.target.value);

  setMilkEntry({
    ...milkEntry,
    quantity,
    totalAmount: quantity * (milkEntry.ratePerLiter || 0),
  });
}}
      />

      {/* Fat */}
      <TextField
        label="Fat %"
        type="number"
        value={milkEntry.fat}
        onChange={(e) =>
          setMilkEntry({
            ...milkEntry,
            fat: e.target.value,
          })
        }
      />

      {/* Rate */}
      <TextField
  label="Rate Per Liter"
  type="number"
  value={milkEntry.ratePerLiter}
  fullWidth
  InputProps={{
    readOnly: true,
  }}
/>
      {/* Total */}
      <TextField
  label="Total Amount"
  fullWidth
  value={milkEntry.totalAmount}
  InputProps={{
    readOnly: true,
  }}
/>

    </Stack>
  </DialogContent>

  <DialogActions>
    <Button onClick={handleClose}>
      Cancel
    </Button>

    <Button
  variant="contained"
  onClick={saveMilkEntry}
>
  {editingId !== null ? "Update" : "Save"}
</Button>

  </DialogActions>
</Dialog>



      </Box>


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

    </DashboardLayout>
  );
}