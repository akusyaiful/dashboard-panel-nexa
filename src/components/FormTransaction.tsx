import { PayloadAddCustomer } from "@libs/dto/customer";
import { ItemDto, TableItemDto } from "@libs/dto/item";
import {
  DetailTransactionDto,
  PayloadAddTransaction,
} from "@libs/dto/transaction";
import { PersonAdd } from "@mui/icons-material";
import {
  Box,
  Button,
  Divider,
  Grid,
  MenuItem,
  Select,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TextField,
  Typography,
} from "@mui/material";
import { styled } from "@mui/system";
import { DatePicker, LocalizationProvider } from "@mui/x-date-pickers";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import numberSeparator from "@utils/numberSeparator";
import dayjs, { Dayjs } from "dayjs";
import { useEffect, useState } from "react";
import { v4 as uuidv4 } from "uuid";

const StyledButton = styled(Button)({
  width: "100%",
  borderRadius: "8px",
  padding: "8px",
  fontSize: "16px",
  fontWeigth: 500,
  height: "47px",
});

const Label = styled(Typography)({
  fontWeight: 500,
});

interface FormTransactionProps {
  listCustomer: {
    id: number;
    nama: string;
    alamat: string;
    phone: number;
  }[];
  listBarang: ItemDto[];
  detailTransaction?: DetailTransactionDto[];
  handleSubmitTransaction: (payload: PayloadAddTransaction) => void;
  handleAddCustomerAndTransaction: (
    payloadCustomer: PayloadAddCustomer,
    payloadTransaction: PayloadAddTransaction
  ) => void;
}

export default function FormTransaction(props: FormTransactionProps) {
  const {
    listCustomer,
    listBarang,
    detailTransaction,
    handleSubmitTransaction,
    handleAddCustomerAndTransaction,
  } = props;
  const [formBarang, setFormBarang] = useState({
    id: "",
    kd_barang: "",
    nama_barang: "",
    qty: "",
    subtotal: "",
  });
  const [formCustomer, setFormCustomer] = useState({
    nama: "",
    alamat: "",
    phone: "",
  });
  const [isEdit, setIsEdit] = useState(false);
  const [selectedCustomer, setSelectedCustomer] = useState<string>("");
  const [transactionNumber, setTransactionNumber] = useState<string>("");
  const [tableBarang, setTableBarang] = useState<TableItemDto[]>([]);
  const [transactionDate, setTransactionDate] = useState<Dayjs | null>(null);

  useEffect(() => {
    if (detailTransaction?.[0]?.id) {
      const result = {
        id: detailTransaction[0]?.id,
        nomor_transaksi: detailTransaction[0]?.nomor_transaksi,
        tanggal_transaksi: detailTransaction[0]?.tanggal_transaksi,
        total_transaksi: detailTransaction[0]?.total_transaksi,
        id_customer: detailTransaction[0]?.id_customer,
        customer: detailTransaction[0]?.customer,
        items: detailTransaction?.map((item) => ({
          id: uuidv4(),
          kd_barang: item.kd_barang,
          nama_barang: item.nama_barang,
          qty: item.qty,
          subtotal: item.subtotal,
        })),
      };
      setTableBarang(result.items);
      setSelectedCustomer(result.id_customer);
      setTransactionDate(dayjs(result.tanggal_transaksi));
      setTransactionNumber(result.nomor_transaksi);
    }
  }, [detailTransaction]);

  const selectBarang = (data: ItemDto) => {
    setFormBarang({
      ...formBarang,
      nama_barang: data.nama_barang,
      kd_barang: data.kd_barang,
    });
  };

  const selectEditBarang = (data: TableItemDto) => {
    setIsEdit(true);
    setFormBarang({
      id: data.id,
      kd_barang: data.kd_barang,
      nama_barang: data.nama_barang,
      qty: data.qty,
      subtotal: data.subtotal,
    });
  };

  const handleSelectCustomer = (value: string) => {
    setSelectedCustomer(value);
  };

  const handleTambahBarang = (data: TableItemDto) => {
    setTableBarang((prevListBarang) => [
      ...prevListBarang,
      {
        ...data,
        id: uuidv4(),
      },
    ]);
  };

  const handleEditBarang = (data: TableItemDto) => {
    setTableBarang((prevListBarang) => [...prevListBarang, data]);
  };

  const handleDeleteBarang = (id: string) => {
    setTableBarang((prevItems) => prevItems.filter((item) => item.id !== id));
  };

  const totalSum = tableBarang.reduce((sum, barang) => {
    return sum + Number(barang.subtotal);
  }, 0);

  const payloadTransaction = {
    transaction: {
      id_customer: selectedCustomer,
      tanggal_transaksi: dayjs(transactionDate).format("YYYY-MM-DD"),
      total_transaksi: totalSum,
    },
    items: tableBarang,
  };

  const handleSubmitForm = () => {
    if (selectedCustomer === "add-customer") {
      handleAddCustomerAndTransaction(formCustomer, payloadTransaction);
    } else {
      handleSubmitTransaction(payloadTransaction);
    }
  };

  return (
    <Box>
      <Typography sx={{ fontSize: "20px", fontWeight: 500 }}>
        Transaction Form{" "}
      </Typography>
      <Box sx={{ marginTop: "16px" }}>
        <Box sx={{ marginBottom: "16px" }}>
          <Label>Transaction Number</Label>
          <Typography sx={{ fontStyle: "italic" }} color="primary">
            {transactionNumber ? transactionNumber : "Auto Generated"}
          </Typography>
        </Box>
        <LocalizationProvider dateAdapter={AdapterDayjs}>
          <Grid container spacing={2}>
            <Grid item xs={3}>
              <Label>Transaction Date</Label>
              <DatePicker
                value={transactionDate}
                onChange={(newValue) => setTransactionDate(newValue)}
                sx={{
                  width: "100%",
                }}
              />
            </Grid>
          </Grid>
        </LocalizationProvider>
      </Box>
      <Divider sx={{ margin: "16px 0px" }} />
      <Grid container spacing={2}>
        <Grid item xs={3}>
          <Label>Select Customer</Label>
          <Select
            value={selectedCustomer}
            onChange={(event) =>
              handleSelectCustomer(event.target.value as string)
            }
            displayEmpty
            fullWidth
            inputProps={{ "aria-label": "Without label" }}
          >
            <MenuItem value="" disabled>
              <Typography sx={{ color: "#a2a2a2" }}>Option Customer</Typography>
            </MenuItem>
            <MenuItem value="add-customer">
              <Box sx={{ display: "flex", alignItems: "center", gap: "8px" }}>
                <PersonAdd color="primary" />
                <Typography color="primary">Add Customer</Typography>
              </Box>
            </MenuItem>
            {listCustomer.map((customer) => (
              <MenuItem value={customer.id}>{customer.nama}</MenuItem>
            ))}
          </Select>
        </Grid>
      </Grid>
      <Box>
        {selectedCustomer === "add-customer" && (
          <Box sx={{ marginTop: "16px" }}>
            <Label>Data Customer</Label>
            <Grid container spacing={2}>
              <Grid item xs={3}>
                <TextField
                  fullWidth
                  value={formCustomer.nama}
                  placeholder="Name"
                  onChange={(event) =>
                    setFormCustomer({
                      ...formCustomer,
                      nama: event.target.value,
                    })
                  }
                />
              </Grid>
              <Grid item xs={3}>
                <TextField
                  fullWidth
                  value={formCustomer.alamat}
                  placeholder="Address"
                  onChange={(event) =>
                    setFormCustomer({
                      ...formCustomer,
                      alamat: event.target.value,
                    })
                  }
                />
              </Grid>
              <Grid item xs={3}>
                <TextField
                  fullWidth
                  placeholder="Phone"
                  value={formCustomer.phone}
                  onChange={(event) =>
                    setFormCustomer({
                      ...formCustomer,
                      phone: event.target.value,
                    })
                  }
                />
              </Grid>
            </Grid>
          </Box>
        )}
      </Box>
      <Divider sx={{ margin: "16px 0px" }} />
      <Box>
        <Label>Select Items</Label>
        <Grid container spacing={2}>
          <Grid item xs={3}>
            <Select
              value={formBarang.kd_barang}
              displayEmpty
              fullWidth
              inputProps={{ "aria-label": "Without label" }}
            >
              <MenuItem value="" disabled>
                <Typography sx={{ color: "#a2a2a2" }}>Option Items</Typography>
              </MenuItem>
              {listBarang.map((barang) => (
                <MenuItem
                  value={barang.kd_barang}
                  onClick={() => selectBarang(barang)}
                >
                  {barang.nama_barang}
                </MenuItem>
              ))}
            </Select>
          </Grid>
          <Grid item xs={2}>
            <TextField
              fullWidth
              value={formBarang.qty}
              placeholder="Qty"
              type="number"
              onChange={(event) =>
                setFormBarang({
                  ...formBarang,
                  qty: event.target.value,
                })
              }
            />
          </Grid>
          <Grid item xs={3}>
            <TextField
              value={formBarang.subtotal}
              fullWidth
              placeholder="Subtotal"
              onChange={(event) =>
                setFormBarang({
                  ...formBarang,
                  subtotal: event.target.value,
                })
              }
            />
          </Grid>
          <Grid item xs={3}>
            <StyledButton
              variant="contained"
              color="primary"
              disableElevation
              onClick={() => {
                if (isEdit) {
                  handleEditBarang(formBarang);
                  setIsEdit(false);
                } else {
                  handleTambahBarang(formBarang);
                }
                setFormBarang({
                  id: "",
                  kd_barang: "",
                  nama_barang: "",
                  qty: "",
                  subtotal: "",
                });
              }}
            >
              {isEdit ? "Edit Item" : "Add Item"}
            </StyledButton>
          </Grid>
        </Grid>
        <TableContainer sx={{ marginTop: "16px" }}>
          <Table aria-label="simple table">
            <TableHead>
              <TableRow>
                <TableCell>No</TableCell>
                <TableCell>Item Name</TableCell>
                <TableCell>Qty</TableCell>
                <TableCell>Subtotal</TableCell>
                <TableCell>Action</TableCell>
              </TableRow>
            </TableHead>
            {tableBarang.length ? (
              <TableBody>
                {tableBarang.map((barang, index) => (
                  <TableRow
                    key={index}
                    sx={{ "&:last-child td, &:last-child th": { border: 0 } }}
                  >
                    <TableCell component="th" scope="row">
                      {index + 1}
                    </TableCell>
                    <TableCell>{barang.nama_barang}</TableCell>
                    <TableCell>{barang.qty}</TableCell>
                    <TableCell>
                      Rp{numberSeparator(Number(barang.subtotal))}
                    </TableCell>
                    <TableCell>
                      <Box
                        sx={{
                          display: "flex",
                          alignItems: "center",
                          gap: "16px",
                        }}
                      >
                        <Button
                          variant="contained"
                          onClick={() => selectEditBarang(barang)}
                          disableElevation
                          color="success"
                        >
                          Edit
                        </Button>
                        <Button
                          variant="contained"
                          onClick={() => handleDeleteBarang(barang.id)}
                          disableElevation
                          color="secondary"
                        >
                          Delete
                        </Button>
                      </Box>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            ) : null}
          </Table>

          {!tableBarang.length && (
            <Typography
              sx={{ textAlign: "center", color: "#a2a2a2", margin: "16px 0px" }}
            >
              Item table is empty
            </Typography>
          )}
        </TableContainer>

        <Typography sx={{ fontWeight: 500, fontSize: 20, margin: "20px 0px" }}>
          Total Transaction: Rp{numberSeparator(totalSum)}
        </Typography>
        <Grid container spacing={2}>
          <Grid item xs={3}>
            <StyledButton
              variant="contained"
              color="primary"
              disableElevation
              onClick={handleSubmitForm}
            >
              Add Transaction
            </StyledButton>
          </Grid>
        </Grid>
      </Box>
    </Box>
  );
}
