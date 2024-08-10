"use client";

import FormTransaction from "@components/FormTransaction";
import Loading from "@components/Loading";
import { PayloadAddCustomer } from "@libs/dto/customer";
import { ItemDto } from "@libs/dto/item";
import {
  DetailTransactionDto,
  PayloadAddTransaction,
} from "@libs/dto/transaction";
import { ArrowBack } from "@mui/icons-material";
import { AppBar, Box, IconButton, Toolbar, Typography } from "@mui/material";
import axios from "axios";
import Head from "next/head";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";

export default function DetailTransaction() {
  const router = useRouter();
  const { id } = router.query;
  const [listCustomer, setListCustomer] = useState([]);
  const [listBarang, setListBarang] = useState<ItemDto[]>([]);
  const [detailTransaction, setDetailTransaction] = useState<
    DetailTransactionDto[]
  >([]);
  const [isLoading, setIsLoading] = useState(true);

  const getCustomers = async () => {
    try {
      const response = await axios.get("/api/customers/list", {});
      setListCustomer(response.data);
    } catch (error) {
      console.error("Error fetching transactions:", error);
    }
  };

  const getBarang = async () => {
    try {
      const admin = JSON.parse(localStorage.getItem("admin") || "{}");

      const response = await axios.post("/api/listBarang", {
        token: admin.token,
      });

      setListBarang(response.data.response);
    } catch (error) {
      console.log(error);
    }
  };

  const getDetailTransaction = async () => {
    setIsLoading(true);
    try {
      const response = await axios.get(`/api/transactions/${id}`, {});

      setIsLoading(false);
      setDetailTransaction(response.data);
    } catch (error) {
      setIsLoading(false);
      console.log(error);
    }
  };

  const handleUpdateTransaction = async (payload: PayloadAddTransaction) => {
    try {
      await axios.put(`/api/transactions/${id}`, {
        ...payload,
      });
      router.push("/");
    } catch (error) {
      console.log(error);
    }
  };

  const handleAddCustomer = async (
    payloadCustomer: PayloadAddCustomer,
    payloadTransaction: PayloadAddTransaction
  ) => {
    try {
      const response = await axios.post("/api/customers/add", {
        ...payloadCustomer,
      });

      if (response.status === 201) {
        handleUpdateTransaction(payloadTransaction);
      }
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    getCustomers();
    getBarang();
  }, []);

  useEffect(() => {
    if (id) {
      getDetailTransaction();
    }
  }, [router.query]);

  return (
    <>
      <Head>
        <title>Dashboard</title>
        <meta name="description" content="Generated by create next app" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <Box>
        <AppBar position="fixed" sx={{ width: `100%` }}>
          <Toolbar>
            <Box sx={{ display: "flex", alignItems: "center", gap: "8px" }}>
              <IconButton onClick={() => router.back()}>
                <ArrowBack sx={{ color: "black" }} />
              </IconButton>
              <Typography variant="h6" noWrap component="div">
                Edit Transaction
              </Typography>
            </Box>
          </Toolbar>
        </AppBar>
        <Box
          component="main"
          sx={{
            flexGrow: 1,
            bgcolor: "background.default",
            p: 3,
            marginTop: "70px",
          }}
        >
          <FormTransaction
            listCustomer={listCustomer}
            listBarang={listBarang}
            handleSubmitTransaction={(payload) =>
              handleUpdateTransaction(payload)
            }
            handleAddCustomerAndTransaction={(
              payloadCustomer,
              payloadTransaction
            ) => handleAddCustomer(payloadCustomer, payloadTransaction)}
            detailTransaction={detailTransaction}
          />
        </Box>
      </Box>
      <Loading open={isLoading} onClose={() => setIsLoading(false)} />
    </>
  );
}
