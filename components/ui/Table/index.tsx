import { parseURL } from "@solana/pay";
import React, { FC } from "react";

type Props = {
  generatedLinks: any;
  setLocalUrl: any;
  setIsQRModalOpen: any;
};

const Table: FC<Props> = ({
  generatedLinks,
  setIsQRModalOpen,
  setLocalUrl,
}) => {
  const handleOnClickShowQR = (link: string) => {
    setLocalUrl(link);
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
                    Message
                  </th>
                  <th
                    scope="col"
                    className="py-3 px-6 text-left text-xs font-medium uppercase tracking-wider text-gray-700 dark:text-gray-400"
                  >
                    Memo
                  </th>
                  <th scope="col" className="relative py-3 px-6">
                    <span className="sr-only">Edit</span>
                  </th>
                </tr>
              </thead>
              <tbody>
                {generatedLinks &&
                  generatedLinks.map((link: any) => {
                    const { label, message, memo } = parseURL(link);
                    return (
                      <>
                        <tr className=" bg-white  dark:bg-neutral-900">
                          <td className="max-w-3xl whitespace-nowrap py-4 px-6 text-sm font-medium text-gray-900 dark:text-white">
                            {label}
                          </td>
                          <td className="max-w-3xl whitespace-nowrap py-4 px-6 text-sm font-medium text-gray-900 dark:text-white">
                            {message}
                          </td>

                          <td className="max-w-3xl whitespace-nowrap py-4 px-6 text-sm font-medium text-gray-900 dark:text-white">
                            {memo}
                          </td>

                          <td className="whitespace-nowrap py-4 px-6 text-right text-sm font-medium">
                            <div
                              className="cursor-pointer text-blue-600 hover:underline dark:text-blue-500"
                              onClick={() => handleOnClickShowQR(link)}
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
