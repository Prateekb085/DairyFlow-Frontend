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
} from "@mui/material";

import { DataGrid } from "@mui/x-data-grid";

import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import dayjs from "dayjs";

export default function MilkEntries() {

  const [milkEntries, setMilkEntries] = useState([]);



    const [farmers, setFarmers] = useState([]);

  const [open, setOpen] = useState(false);

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


  const handleOpen = () => {
  setOpen(true);
};

const handleClose = () => {
  setOpen(false);

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

const saveMilkEntry = () => {

  const request = {
    farmer: {
      id: milkEntry.farmerId,
    },
    collectionDate: milkEntry.collectionDate,
    shift: milkEntry.shift,
    milkType: milkEntry.milkType,
    quantity: Number(milkEntry.quantity),
    fat: Number(milkEntry.fat),
    ratePerLiter: Number(milkEntry.ratePerLiter),
    totalAmount: Number(milkEntry.totalAmount),
  };

  api
    .post("/milk", request)
    .then(() => {

      handleClose();

      loadMilkEntries();

      alert("Milk Entry Added Successfully");

    })
    .catch((error) => {
      console.error(error);
      alert("Failed to Save Milk Entry");
    });
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
  valueGetter: (_, row) => row?.farmer?.farmerName || "",
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
  ];

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

        <Paper
          sx={{
            height: 600,
            borderRadius: 4,
          }}
        >
          <DataGrid
            rows={milkEntries}
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
  <DialogTitle>Add Milk Entry</DialogTitle>

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
       onChange={(e) => {
  const rate = Number(e.target.value);

  setMilkEntry({
    ...milkEntry,
    ratePerLiter: rate,
    totalAmount: (milkEntry.quantity || 0) * rate,
  });
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
  Save
</Button>

  </DialogActions>
</Dialog>



      </Box>

    </DashboardLayout>
  );
}