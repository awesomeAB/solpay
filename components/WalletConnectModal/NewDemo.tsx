import { WalletContextState } from "@solana/wallet-adapter-react";
import { Button, HeroButton, Text } from "components";
import React, { FC, useEffect, useState } from "react";
import { QRCode } from "components/QRCode";
import { PaymentStatus, usePayment } from "hooks/usePayment";
import SolanaPayLogo from "components/Images/SolanaPayLogo";
import BigNumber from "bignumber.js";
import Image from "next/image";
import { shortenAddress } from "utils";

type Props = {
  wallet: WalletContextState;
  connect: () => void;
};

const Demo: FC<Props> = ({ wallet, connect }) => {
  const { url, amount, setAmount, payWithWallet, status, signature, reset } =
    usePayment();
  const [amountInput, setAmountInput] = useState<string>(
    amount?.toString() ?? "",
  );
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
        <>
          <div className="mx-24 mb-3 flex items-center rounded-lg border ">
            <input
              className="w-1/2 rounded-l-lg bg-white px-6 py-3 text-lg font-bold dark:bg-dark"
              value={amountInput}
              onChange={(e) => setAmountInput(e.target.value)}
              onBlur={handleChangeAmount}
            />
            <div className="flex w-1/2 justify-center border-l">
              <Text className="text-lg font-extrabold">SOL</Text>
            </div>
          </div>
          <QRCode url={url} />
          <Text className="text-lg font-bold">or</Text>
          <div className="my-4 flex items-center justify-center">
            {publicKey ? (
              <div className="group relative">
                <div className="absolute inset-0.5 rounded-xl bg-gradient-to-r from-solanaGreen to-purple-600 opacity-80 blur-lg filter transition duration-200 group-hover:opacity-100" />
                <button
                  className="relative inset-0 flex w-full items-center justify-center rounded-xl bg-white py-4 px-16 leading-none focus:outline-none dark:bg-dark"
                  onClick={() => handlePay()}
                >
                  <SolanaPayLogo />
                </button>
              </div>
            ) : (
              <HeroButton label="Connect Wallet" onClick={() => connect()} />
            )}
          </div>
          <Text className="text-xs" color="text-red-400">
            Please ensure you are using the DEVNET for this demo*
          </Text>
        </>
      )}
    </div>
  );
};

export default Demo;
