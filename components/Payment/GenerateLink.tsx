import { WalletContextState } from "@solana/wallet-adapter-react";
import { Button, Text } from "components";
import LegacyButton from "components/ui/Button";
import React, { FC, useEffect, useState } from "react";
import { PaymentStatus, usePayment } from "hooks/usePayment";
import BigNumber from "bignumber.js";
import Image from "next/image";
import { shortenAddress } from "utils";
import { PaymentDetails } from "types";
import { useUser } from "utils/useUser";
import { insertPaymentDetails } from "utils/supabase-client";

type Props = {
  wallet: WalletContextState;
  connect: () => void;
  setGeneratedLinks: any;
};

const GenerateLink: FC<Props> = ({ wallet, connect, setGeneratedLinks }) => {
  const {
    url,
    amount,
    setAmount,
    payWithWallet,
    status,
    signature,
    reset,
    setMessage,
    setMemo,
    setLabel,
  } = usePayment();

  const { user } = useUser();

  const [amountInput, setAmountInput] = useState<string>(
    amount?.toString() ?? "",
  );

  const [localMessage, setLocalMessage] = useState<string>("");
  const [localMemo, setLocalMemo] = useState<string>("");
  const [localLabel, setLocalLabel] = useState<string>("");

  const [loading, setLoading] = useState<boolean>(false);
  const [hash, setHash] = useState<string>("");
  const [error, setError] = useState<string>("");
  const { publicKey } = wallet;

  const handleChangeAmount = () => {
    let newAmount = new BigNumber(amountInput ? amountInput : 0);
    setAmount(newAmount);
    setAmountInput(newAmount.toString());
  };

  const handlePay = async () => {
    setLoading(true);
    try {
      const hash = await payWithWallet();
      setHash(hash);
    } catch (e: any) {
      console.error(e);
      setError(e.message ?? "Something went wrong :(");
      setLoading(false);
    }
  };

  useEffect(() => {
    if (status === PaymentStatus.Confirmed) {
      setLoading(true);
    } else if (status === PaymentStatus.Finalized) {
      setLoading(false);
      setHash(signature ?? "");
    }
  }, [status, signature]);

  const handleReset = () => {
    reset();
    setAmountInput("1");
    setHash("");
    setError("");
    setLoading(false);
  };

  const handleGenerateLink = async () => {
    setLoading(true);
    reset();
    let newAmount = new BigNumber(amountInput ? amountInput : 0);
    setAmount(newAmount);
    setAmountInput(newAmount.toString());
    setLabel(localLabel);

    const paymentRow: PaymentDetails = {
      amount: parseInt(amountInput),
      label: localLabel,
      url: url,
      user_id: user.id,
    };
    try {
      await insertPaymentDetails(paymentRow);
    } catch (error: any) {
      setError(error);
    }
    setGeneratedLinks((prevState: any) => [...prevState, url]);
    setLoading(false);
  };

  return (
    <div className="flex flex-col justify-center">
      {loading ? (
        <div className="flex flex-col items-center justify-center pt-32">
          <div className="h-24 w-24 animate-spin rounded-full border-t-4 border-b-4 border-solanaGreen"></div>
          <Text className="mt-8 text-lg">Processing transaction...</Text>
          {signature && (
            <a
              href={`https://explorer.solana.com/tx/${signature}?cluster=devnet`}
              className="mt-2 cursor-pointer text-sm hover:text-solanaGreen hover:underline"
              target="_blank"
              rel="noreferrer"
            >
              Check status: {shortenAddress(signature, 6)}
            </a>
          )}
        </div>
      ) : error ? (
        <div className="flex h-full flex-col items-center justify-center pt-32">
          <Image
            src="/failure.png"
            alt="solana logo"
            width={128}
            height={128}
          />
          <Text className="mt-8">Error: {error}</Text>
          <div className="mt-4 flex px-8">
            <Button label="Try Again" onClick={handleReset} type="positive" />
          </div>
        </div>
      ) : status === PaymentStatus.Finalized ? (
        <div className="flex h-full flex-col items-center justify-center pt-32">
          <Image
            src="/success.png"
            alt="solana logo"
            width={128}
            height={128}
          />
          <Text className="mt-8 text-lg">Transaction Successful</Text>
          <a
            href={`https://explorer.solana.com/tx/${hash}?cluster=devnet`}
            className="mt-2 cursor-pointer text-sm hover:text-solanaGreen hover:underline"
            target="_blank"
            rel="noreferrer"
          >
            Explore: {shortenAddress(hash, 6)}
          </a>
          <div className="mt-4 flex px-8">
            <Button label="Start Over" onClick={handleReset} type="positive" />
          </div>
        </div>
      ) : (
        <div className="mt-10 flex flex-col items-center justify-center px-10">
          <div className="mx-24 mb-3 flex w-full items-center rounded-lg border ">
            <input
              className="w-full rounded-l-lg bg-white px-6 py-3 text-lg font-bold dark:bg-dark"
              value={amountInput}
              onChange={(e) => setAmountInput(e.target.value)}
            />
            <div className="flex w-1/2 justify-center border-l">
              <Text className="text-lg font-extrabold">SOL</Text>
            </div>
          </div>
          <div className="mx-24 mb-3 flex w-full items-center rounded-lg border ">
            <input
              className="w-full rounded-lg bg-white px-6 py-3 text-lg font-bold dark:bg-dark"
              placeholder="label"
              value={localLabel}
              onChange={(e) => setLocalLabel(e.target.value)}
            />
          </div>
          {/* <div className="mx-24 mb-3 flex items-center rounded-lg border ">
            <input
              className="w-full rounded-lg bg-white px-6 py-3 text-lg font-bold dark:bg-dark"
              placeholder="message"
              value={localMessage}
              onChange={(e) => setLocalMessage(e.target.value)}
            />
          </div>
          <div className="mx-24 mb-3 flex items-center rounded-lg border ">
            <input
              className="w-full rounded-lg bg-white px-6 py-3 text-lg font-bold dark:bg-dark"
              placeholder="memo"
              value={localMemo}
              onChange={(e) => setLocalMemo(e.target.value)}
            />
          </div> */}
          <div className="mx-24 mb-3 flex w-full items-center justify-center">
            <LegacyButton
              className="w-full"
              onClick={handleGenerateLink}
              loading={loading}
            >
              Generate Link
            </LegacyButton>
          </div>

          {/* <QRCode url={url} /> */}
        </div>
      )}
    </div>
  );
};

export default GenerateLink;
