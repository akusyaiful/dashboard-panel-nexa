import { query } from "@config/db";
import { NextApiRequest, NextApiResponse } from "next";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method === "GET") {
    const { startDate, endDate, search } = req.query;

    try {
      let sql = `
        SELECT t.id, t.nomor_transaksi, c.nama AS customer, t.tanggal_transaksi, t.total_transaksi
        FROM transaksi_h t
        JOIN ms_customer c ON t.id_customer = c.id
        WHERE 1=1
      `;

      const params: any[] = [];

      if (startDate) {
        sql += " AND t.tanggal_transaksi >= ?";
        params.push(startDate);
      }

      if (endDate) {
        sql += " AND t.tanggal_transaksi <= ?";
        params.push(endDate);
      }

      if (search) {
        sql += " AND t.nomor_transaksi LIKE ?";
        params.push(`%${search}%`);
      }

      const results = await query(sql, params);

      res.status(200).json(results);
    } catch (e) {
      res.status(500).json({ message: (e as Error).message });
    }
  }
}
