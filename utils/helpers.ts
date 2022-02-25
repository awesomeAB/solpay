import { Price } from "types";

export const getURL = () => {
  const url =
    process?.env?.URL && process.env.URL !== ""
      ? process.env.URL
      : process?.env?.VERCEL_URL && process.env.VERCEL_URL !== ""
      ? process.env.VERCEL_URL
      : "http://localhost:3000";
  return url.includes("http") ? url : `https://${url}`;
};

export const postData = async ({
  url,
  token,
  data,
}: {
  url: string;
  data?: { price: Price };
  token: string;
}) => {
  console.log("posting,", url, token, data);

  const res: Response = await fetch(url, {
    method: "POST",
    headers: new Headers({ "Content-Type": "application/json", token }),
    credentials: "same-origin",
    body: JSON.stringify(data),
  });

  if (!res.ok) {
    console.log("Error in postData", { url, token, data, res });

    throw Error(res.statusText);
  }

  return res.json();
};

export const toDateTime = (secs: number) => {
  var t = new Date("1970-01-01T00:30:00Z"); // Unix epoch start.
  t.setSeconds(secs);
  return t;
};

/**
 * @example
 * ```
 * sliceAddress('terra1v99undfjkdr3zej4edtpgg73upc3kc8fcjsmgw'); // 'terra1v99undfj.....73upc3kc8fcjsmgw'
 * ```
 * @returns A shortened address so that it can be displayed on a single line.
 */

export type Indexes = {
  readonly start: number;
  readonly end: number;
};

export default function sliceAddress(
  address: string,
  indexes?: Indexes,
): string {
  if (indexes)
    return `${address.slice(0, indexes.start)}..${address.slice(
      address.length - indexes.end,
    )}`;
  return `${address.slice(0, 6)}......${address.slice(address.length - 6)}`;
}
