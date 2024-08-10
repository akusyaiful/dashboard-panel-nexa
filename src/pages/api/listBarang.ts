import type { NextApiRequest, NextApiResponse } from "next";
import axios from "axios";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method === "POST") {
    try {
      const { token } = req.body;
      const response = await axios.post(
        "http://gmedia.bz/DemoCase/main/list_barang",
        req.body,
        {
          headers: {
            "Content-Type": "application/json",
            "Client-Service": "gmedia-recruitment",
            "Auth-Key": "demo-admin",
            "User-Id": 1,
            Token: token,
          },
        }
      );

      res.status(response.status).json(response.data);
    } catch (error: any) {
      res
        .status(error.response?.status || 500)
        .json({ error: "Something went wrong" });
    }
  }
}
