import React, { FC } from "react";
import { PaymentDetails } from "types";
import PaymentRow from "./PaymentRow";

type Props = {
  paymentData: PaymentDetails[];
  isQRModalOpen: any;
  setLocalUrl: any;
  setIsQRModalOpen: any;
};

const Table: FC<Props> = ({
  paymentData,
  isQRModalOpen,
  setIsQRModalOpen,
  setLocalUrl,
}) => {
  const handleOnClickShowQR = (url: string) => {
    setLocalUrl(url);
    setIsQRModalOpen(true);
  };

  return (
    <>
      {paymentData.length > 0 && (
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
                    {paymentData.map((payment: any, indx: number) => {
                      return (
                        <PaymentRow
                          key={payment.id}
                          payment={payment}
                          isQRModalOpen={isQRModalOpen}
                          handleOnClickShowQR={handleOnClickShowQR}
                        />
                      );
                    })}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default Table;
