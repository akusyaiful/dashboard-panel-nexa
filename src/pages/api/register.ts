import type { NextApiRequest, NextApiResponse } from "next";
import axios from "axios";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  try {
    const response = await axios.post(
      "http://gmedia.bz/DemoCase/auth/register",
      req.body,
      {
        headers: {
          "Content-Type": "application/json",
          "Client-Service": "gmedia-recruitment",
          "Auth-Key": "demo-admin",
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
