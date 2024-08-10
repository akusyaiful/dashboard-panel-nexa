import { query } from "@config/db";
import { NextApiRequest, NextApiResponse } from "next";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method === "GET") {
    // Get transactions
    try {
      const results = await query(`
          SELECT id, nama, alamat, phone 
          FROM ms_customer
        `);
      res.status(200).json(results);
    } catch (e) {
      res.status(500).json({ message: (e as Error).message });
    }
  }
}
