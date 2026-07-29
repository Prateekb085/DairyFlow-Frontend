import {
  Card,
  CardContent,
  Typography,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
} from "@mui/material";

import { useEffect, useState } from "react";
import api from "../../services/api";

export default function RecentActivity() {
  const [entries, setEntries] = useState([]);

  useEffect(() => {
  api
    .get("/milk")
    .then((response) => {
      setEntries(response.data);
    })
    .catch((error) => {
      console.error("Milk API Error:", error);
    });
}, []);

  return (
    <Card
      elevation={0}
      sx={{
        mt: 3,
        borderRadius: 4,
        border: "1px solid #E5E7EB",
      }}
    >
      <CardContent>
        <Typography variant="h6" fontWeight="bold" mb={2}>
          Recent Milk Entries
        </Typography>

        <TableContainer component={Paper} elevation={0}>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell><b>Farmer</b></TableCell>
                <TableCell><b>Milk</b></TableCell>
                <TableCell><b>Amount</b></TableCell>
                <TableCell><b>Date</b></TableCell>
              </TableRow>
            </TableHead>

            <TableBody>
              {entries.length > 0 ? (
                entries.map((entry) => (
                  <TableRow key={entry.id}>
                    <TableCell>{entry.farmer?.farmerName}</TableCell>
                    <TableCell>{entry.quantity} L</TableCell>
                    <TableCell>₹{entry.totalAmount}</TableCell>
                    <TableCell>{entry.collectionDate}</TableCell>
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell colSpan={4} align="center">
                    No Milk Entries Found
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </TableContainer>
      </CardContent>
    </Card>
  );
}