import { query } from "@config/db";
import { NextApiRequest, NextApiResponse } from "next";

interface CounterResult {
  counter: number;
}

async function generateNumber(): Promise<string | undefined> {
  try {
    const date = new Date();
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, "0");

    const counterResult: CounterResult[] = await query(
      "SELECT counter FROM counter WHERE bulan = ? AND tahun = ? LIMIT 1",
      [month, year]
    );

    let counter = 1;
    if (counterResult.length > 0) {
      counter = counterResult[0].counter + 1;
      await query(
        "UPDATE counter SET counter = ? WHERE bulan = ? AND tahun = ?",
        [counter, month, year]
      );
    } else {
      await query(
        "INSERT INTO counter (bulan, tahun, counter) VALUES (?, ?, ?)",
        [month, year, counter]
      );
    }

    const transactionNumber = `SO/${year}-${month}/${String(counter).padStart(
      4,
      "0"
    )}`;
    return transactionNumber;
  } catch (e) {
    console.error("Error generating transaction number:", e);
  }
}

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method === "POST") {
    const { transaction, items } = req.body;
    const { id_customer, tanggal_transaksi, total_transaksi } = transaction;

    const nomor_transaksi = await generateNumber();
    try {
      const result = await query(
        `
        INSERT INTO transaksi_h (id_customer, nomor_transaksi, tanggal_transaksi, total_transaksi) 
        VALUES (?, ?, ?, ?)`,
        [id_customer, nomor_transaksi, tanggal_transaksi, total_transaksi]
      );
      const id_transaksi_h = result.insertId;
      for (const item of items) {
        await query(
          `
          INSERT INTO transaksi_d (id_transaksi_h, kd_barang, nama_barang, qty, subtotal) 
          VALUES (?, ?, ?, ?, ?)`,
          [
            id_transaksi_h,
            item.kd_barang,
            item.nama_barang,
            item.qty,
            item.subtotal,
          ]
        );
      }
      res.status(201).json({ message: "Transaction added successfully" });
    } catch (e) {
      res.status(500).json({ message: (e as Error).message });
    }
  } else {
    res.setHeader("Allow", ["GET", "POST"]);
    res.status(405).end(`Method ${req.method} Not Allowed`);
  }
}
