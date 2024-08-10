import { query } from "@config/db";
import { NextApiRequest, NextApiResponse } from "next";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const { id } = req.query;

  if (req.method === "GET") {
    // Get transaction by ID
    try {
      const transaction = await query(
        `
        SELECT t.id, t.nomor_transaksi, t.tanggal_transaksi, t.total_transaksi, c.id as id_customer, c.nama AS customer, 
               d.kd_barang, d.nama_barang, d.qty, d.subtotal
        FROM transaksi_h t
        JOIN ms_customer c ON t.id_customer = c.id
        LEFT JOIN transaksi_d d ON t.id = d.id_transaksi_h
        WHERE t.id = ?
        `,
        [id]
      );

      if (transaction.length === 0) {
        res.status(404).json({ message: "Transaction not found" });
      } else {
        res.status(200).json(transaction);
      }
    } catch (e) {
      res.status(500).json({ message: (e as Error).message });
    }
  } else if (req.method === "PUT") {
    const { transaction, items } = req.body;
    const { id_customer, tanggal_transaksi, total_transaksi } = transaction;

    try {
      await query(
        `
        UPDATE transaksi_h 
        SET id_customer = ?, tanggal_transaksi = ?, total_transaksi = ? 
        WHERE id = ?`,
        [id_customer, tanggal_transaksi, total_transaksi, id]
      );

      await query(`DELETE FROM transaksi_d WHERE id_transaksi_h = ?`, [id]);

      for (const item of items) {
        await query(
          `
          INSERT INTO transaksi_d (id_transaksi_h, kd_barang, nama_barang, qty, subtotal) 
          VALUES (?, ?, ?, ?, ?)`,
          [id, item.kd_barang, item.nama_barang, item.qty, item.subtotal]
        );
      }

      res.status(200).json({ message: "Transaction updated successfully" });
    } catch (e) {
      res.status(500).json({ message: (e as Error).message });
    }
  } else if (req.method === "DELETE") {
    try {
      await query(`DELETE FROM transaksi_d WHERE id_transaksi_h = ?`, [id]);
      await query(`DELETE FROM transaksi_h WHERE id = ?`, [id]);

      res.status(200).json({ message: "Transaction deleted successfully" });
    } catch (e) {
      res.status(500).json({ message: (e as Error).message });
    }
  } else {
    res.setHeader("Allow", ["GET", "POST", "PUT", "DELETE"]);
    res.status(405).end(`Method ${req.method} Not Allowed`);
  }
}
