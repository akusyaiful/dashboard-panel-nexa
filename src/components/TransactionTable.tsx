import { TransactionDto } from "@libs/dto/transaction";
import {
  Box,
  Button,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Typography,
} from "@mui/material";
import numberSeparator from "@utils/numberSeparator";
import { useRouter } from "next/router";

interface TransactionTableProps {
  data: TransactionDto[];
  handleShowDialogDelete: (id: number) => void;
}

export default function TransactionsTable(props: TransactionTableProps) {
  const { data, handleShowDialogDelete } = props;
  const route = useRouter();

  const totalSum = data.reduce((sum, transaction) => {
    return sum + transaction.total_transaksi;
  }, 0);

  return (
    <TableContainer component={Paper}>
      <Table sx={{ minWidth: 650 }} aria-label="simple table">
        <TableHead>
          <TableRow>
            <TableCell>No</TableCell>
            <TableCell>Nomor Transaksi</TableCell>
            <TableCell>Customer</TableCell>
            <TableCell>Total Transaksi</TableCell>
            <TableCell>Action</TableCell>
          </TableRow>
        </TableHead>
        {data.length ? (
          <TableBody>
            {data.map((row, index) => (
              <TableRow
                key={row.id}
                sx={{ "&:last-child td, &:last-child th": { border: 0 } }}
              >
                <TableCell component="th" scope="row">
                  {index + 1}
                </TableCell>
                <TableCell>{row.nomor_transaksi}</TableCell>
                <TableCell>{row.customer}</TableCell>
                <TableCell>Rp{numberSeparator(row.total_transaksi)}</TableCell>
                <TableCell>
                  <Box
                    sx={{ display: "flex", alignItems: "center", gap: "16px" }}
                  >
                    <Button
                      variant="contained"
                      onClick={() => route.push(`/transaction/${row.id}`)}
                      disableElevation
                      color="success"
                    >
                      Edit
                    </Button>
                    <Button
                      variant="contained"
                      onClick={() => handleShowDialogDelete(row.id)}
                      disableElevation
                      color="secondary"
                    >
                      Delete
                    </Button>
                  </Box>
                </TableCell>
              </TableRow>
            ))}
            <TableRow
              sx={{ "&:last-child td, &:last-child th": { border: 0 } }}
            >
              <TableCell component="th" scope="row"></TableCell>
              <TableCell></TableCell>
              <TableCell>
                <Typography
                  sx={{ fontWeight: 600, fontSize: "20px" }}
                  color="primary"
                >
                  Total Transaksi:
                </Typography>{" "}
              </TableCell>
              <TableCell>
                <Typography
                  sx={{ fontWeight: 600, fontSize: "20px" }}
                  color="primary"
                >
                  Rp{numberSeparator(totalSum)}
                </Typography>
              </TableCell>
            </TableRow>
          </TableBody>
        ) : null}
      </Table>
      {!data.length && (
        <Typography
          sx={{ textAlign: "center", color: "#a2a2a2", margin: "16px 0px" }}
        >
          Transaction table is empty
        </Typography>
      )}
    </TableContainer>
  );
}
