import { parseURL } from "@solana/pay";
import React, { FC } from "react";
import { PaymentDetails } from "types";

type Props = {
  paymentData: PaymentDetails[];
  setLocalUrl: any;
  setIsQRModalOpen: any;
};

const Table: FC<Props> = ({ paymentData, setIsQRModalOpen, setLocalUrl }) => {
  const handleOnClickShowQR = (url: string) => {
    setLocalUrl(url);
    setIsQRModalOpen(true);
  };

  return (
    <div className="flex flex-col">
      <div className="overflow-x-auto sm:-mx-6 lg:-mx-8">
        <div className="inline-block min-w-full py-2 sm:px-6 lg:px-8">
          <div className="overflow-hidden shadow-md sm:rounded-lg">
            <table className="min-w-full">
              <thead className="bg-neutral-50 dark:bg-neutral-700">
                <tr>
                  <th
                    scope="col"
                    className="py-3 px-6 text-left text-xs font-medium uppercase tracking-wider text-gray-700 dark:text-gray-400"
                  >
                    Label
                  </th>
                  <th
                    scope="col"
                    className="py-3 px-6 text-left text-xs font-medium uppercase tracking-wider text-gray-700 dark:text-gray-400"
                  >
                    Amount
                  </th>
                  <th
                    scope="col"
                    className="py-3 px-6 text-left text-xs font-medium uppercase tracking-wider text-gray-700 dark:text-gray-400"
                  >
                    Reference
                  </th>
                  <th scope="col" className="relative py-3 px-6">
                    <span className="sr-only">Edit</span>
                  </th>
                </tr>
              </thead>
              <tbody>
                {paymentData &&
                  paymentData.map((link: any) => {
                    const { label, url, amount } = link;
                    const { reference } = parseURL(url);

                    return (
                      <>
                        <tr className=" bg-white  dark:bg-neutral-900">
                          <td className="max-w-3xl whitespace-nowrap py-4 px-6 text-sm font-medium text-gray-900 dark:text-white">
                            {label}
                          </td>
                          <td className="max-w-3xl whitespace-nowrap py-4 px-6 text-sm font-medium text-gray-900 dark:text-white">
                            {amount}
                          </td>
                          <td className="max-w-3xl whitespace-nowrap py-4 px-6 text-sm font-medium text-gray-900 dark:text-white">
                            {JSON.parse(JSON.stringify(reference))[0]}
                          </td>
                          <td className="whitespace-nowrap py-4 px-6 text-right text-sm font-medium">
                            <div
                              className="cursor-pointer text-blue-600 hover:underline dark:text-blue-500"
                              onClick={() => handleOnClickShowQR(url)}
                            >
                              Show QR
                            </div>
                          </td>
                        </tr>
                      </>
                    );
                  })}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Table;
