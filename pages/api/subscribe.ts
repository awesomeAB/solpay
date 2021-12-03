import type { NextApiRequest, NextApiResponse } from "next";

import { google } from "googleapis";

export default async function emailList(
  req: NextApiRequest,
  res: NextApiResponse,
) {
  const auth = new google.auth.GoogleAuth({
    credentials: {
      client_email: process.env.GOOGLE_CLIENT_EMAIL,
      private_key: process.env.GOOGLE_PRIVATE_KEY?.replace(/\\n/g, "\n"),
    },
    scopes: [
      "https://www.googleapis.com/auth/drive",
      "https://www.googleapis.com/auth/drive.file",
      "https://www.googleapis.com/auth/spreadsheets",
    ],
  });

  const sheets = google.sheets({
    auth,
    version: "v4",
  });

  const response = await sheets.spreadsheets.values.append({
    spreadsheetId: "13Lq0UNVnIJaW1Q4vrq2NVC4S1h2FfblE21hJPjqX9PI",
    range: "A1:C1",
    valueInputOption: "USER_ENTERED",
    requestBody: {
      values: [[req.body.date, req.body.email, req.body.ref]],
    },
  });

  return res.status(response.status).json({
    data: response.data,
  });
}
