import { query } from "@config/db";
import { NextApiRequest, NextApiResponse } from "next";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method === "POST") {
    const { nama, alamat, phone } = req.body;

    try {
      // Insert customer into the database
      const result = await query(
        `
        INSERT INTO ms_customer (nama, alamat, phone) 
        VALUES (?, ?, ?)`,
        [nama, alamat, phone]
      );

      res.status(201).json({ message: "Customer added successfully" });
    } catch (e) {
      res.status(500).json({ message: (e as Error).message });
    }
  } else {
    res.setHeader("Allow", ["POST"]);
    res.status(405).end(`Method ${req.method} Not Allowed`);
  }
}
