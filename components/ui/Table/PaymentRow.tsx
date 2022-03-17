import { parseURL } from "@solana/pay";
import React, { FC, useEffect, useState } from "react";
import toast from "react-hot-toast";
import { PaymentDetails, TransactionDetails } from "types";
import { shortenAddress } from "utils";
import { getTransactionDetails } from "utils/supabase-client";

type Props = {
  payment: PaymentDetails;
  isQRModalOpen: any;
  handleOnClickShowQR: (url: string) => void;
};

const PaymentRow: FC<Props> = ({
  payment,
  isQRModalOpen,
  handleOnClickShowQR,
}) => {
  const { label, amount, reference } = parseURL(payment.url);
  const parsedReference = JSON.parse(JSON.stringify(reference))[0];

  const [transcationData, setTransactionData] = useState<
    TransactionDetails | any
  >(null);

  useEffect(() => {
    const handleGetTransactionData = async () => {
      try {
        const data = await getTransactionDetails(parsedReference);
        if (data) setTransactionData(data[0]);
      } catch (error) {
        console.log(error);
      }
    };
    handleGetTransactionData();
  }, [isQRModalOpen, parsedReference]);

  const handleCopyLink = () => {
    // copy to clipboard
    toast.promise(
      navigator.clipboard.writeText("https://solpay.so/pay/" + parsedReference),
      {
        loading: "Generating payment link...",
        success: () => {
          return <b>Copied to clipboard!</b>;
        },
        error: <b>Something went wrong, please try again :(</b>,
      },
    );
  };

  return (
    <>
      <tr className="bg-white  dark:bg-neutral-900">
        <td className="max-w-3xl whitespace-nowrap py-4 px-6 text-sm font-medium text-gray-900 dark:text-white">
          {label}
        </td>
        <td className="max-w-3xl whitespace-nowrap py-4 px-6 text-sm font-medium text-gray-900 dark:text-white">
          {amount?.toString()}
        </td>
        <td className="max-w-3xl whitespace-nowrap py-4 px-6 text-sm font-medium text-gray-900 dark:text-white">
          {parsedReference}
        </td>
        <td className="whitespace-nowrap py-4 px-6 text-right text-sm font-medium">
          {transcationData && transcationData ? (
            <a
              href={`https://explorer.solana.com/tx/${transcationData.id}?cluster=devnet`}
              className="mt-2 cursor-pointer text-sm text-solanaGreen hover:underline"
              target="_blank"
              rel="noreferrer"
            >
              {shortenAddress(transcationData.id, 6)}
            </a>
          ) : (
            <div className="flex">
              <div
                className="mr-4 cursor-pointer text-blue-600 hover:underline dark:text-blue-500"
                onClick={() => handleOnClickShowQR(payment.url)}
              >
                Show QR
              </div>
              <div
                className="cursor-pointer text-blue-600 hover:underline dark:text-blue-500"
                onClick={() => handleCopyLink()}
              >
                Copy Link
              </div>
            </div>
          )}
        </td>
      </tr>
    </>
  );
};

export default PaymentRow;
