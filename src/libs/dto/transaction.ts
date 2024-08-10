import { TableItemDto } from "./item";

export interface TransactionDto {
  id: number;
  nomor_transaksi: string;
  customer: string;
  total_transaksi: number;
  tanggal_transaksi: number;
}

export interface DetailTransactionDto {
  customer: string;
  id: number;
  kd_barang: string;
  nama_barang: string;
  nomor_transaksi: string;
  id_customer: string;
  qty: string;
  subtotal: string;
  tanggal_transaksi: string;
  total_transaksi: number;
}

export interface PayloadAddTransaction {
  transaction: {
    id_customer: string;
    tanggal_transaksi: string;
    total_transaksi: number;
  };
  items: TableItemDto[];
}
