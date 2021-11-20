import { Button, Text } from "components";
import { FC, useState } from "react";
import {
  LAMPORTS_PER_SOL,
  PublicKey,
  SystemProgram,
  Transaction,
} from "@solana/web3.js";
import { formatAmount, shortenAddress, toLamports } from "utils";
import { useConnection, useWallet } from "@solana/wallet-adapter-react";

import Image from "next/image";
import WalletDetails from "./WalletDetails";
import toast from "react-hot-toast";
import useMarketRate from "hooks/useMarketRate";
import useUserBalance from "hooks/useUserBalance";

const receiveWallet = new PublicKey(
  "9r1ZdsMFRfdM56iLWiWH6RdRzwgPzpkEJFdYiffD5orQ",
);
interface Props {
  publicKey: PublicKey;
  handleDisconnect: () => Promise<void>;
  className?: string;
}

const Demo: FC<Props> = ({ publicKey, handleDisconnect }) => {
  const [showWalletDetails, setShowWalletDetails] = useState<boolean>(false);
  const { marketRate } = useMarketRate();
  const [loading, setLoading] = useState<boolean>(false);
  const [txnHash, setTxnHash] = useState<string>("");
  const { balance } = useUserBalance(publicKey);
  const { connection } = useConnection();
  const { signTransaction } = useWallet();

  const pay = async () => {
    setTxnHash("");
    if (signTransaction) {
      const solAmount = 1 / marketRate;
      const lamports = toLamports(solAmount);
      const recentBlockhash = await connection.getRecentBlockhash("max");
      const transaction = new Transaction({
        feePayer: publicKey,
        recentBlockhash: recentBlockhash.blockhash,
      }).add(
        SystemProgram.transfer({
          fromPubkey: publicKey,
          toPubkey: receiveWallet,
          lamports,
        }),
      );

      try {
        const signedTransaction = (
          await signTransaction(transaction)
        ).serialize();
        setLoading(true);
        const txn = await connection.sendRawTransaction(signedTransaction);
        setTxnHash(txn);
        setLoading(false);
      } catch (e) {
        setLoading(false);
        console.error(e);
      }
    }
  };

  return showWalletDetails ? (
    <WalletDetails
      publicKey={publicKey}
      handleDisconnect={handleDisconnect}
      goBack={() => setShowWalletDetails(false)}
      balance={balance}
    />
  ) : (
    <div className="px-2 pt-4">
      <Text className="mx-4 mb-8 text-2xl">Checkout</Text>
      <div className="flex justify-between px-8 py-4 mx-8 my-4 text-xl bg-gray-400 rounded-xl bg-opacity-5">
        <Text>Balance:</Text>
        <Text>${formatAmount(balance * marketRate, 2)}</Text>
      </div>
      <div className="flex justify-between px-8 py-4 mx-8 mb-6 text-xl bg-gray-400 rounded-xl bg-opacity-5">
        <Text>Total Price:</Text>
        <Text>$1</Text>
      </div>
      {loading && (
        <div className="flex items-center justify-center">
          <div className="w-16 h-16 border-t-4 border-b-4 rounded-full border-solanaGreen animate-spin"></div>
        </div>
      )}
      {!loading && txnHash ? (
        <a
          href={`https://explorer.solana.com/tx/${txnHash}?cluster=devnet`}
          className="text-xl cursor-pointer text-solanaGreen hover:underline"
          target="_blank"
          rel="noreferrer"
        >
          Explore: {shortenAddress(txnHash, 6)}
        </a>
      ) : null}
      <div className="absolute left-0 flex flex-col justify-center w-full bottom-4">
        <div className="mb-8 px-14">
          <div className="relative group">
            <div className="absolute opacity-75 inset-0.5 bg-gradient-to-r from-solanaGreen to-purple-600 rounded-xl filter blur-lg group-hover:opacity-100 transition duration-200" />
            <button
              className="relative inset-0 flex items-center justify-center w-full py-4 leading-none focus:outline-none bg-dark rounded-xl"
              onClick={pay}
            >
              <Image
                src="/solana-icon.svg"
                alt="solana logo"
                width={22}
                height={22}
              />
              <span className="pl-4 text-2xl text-primary">Pay</span>
            </button>
          </div>
        </div>
        <Text className="text-sm">
          Don't have enough SOL for testing?{" "}
          <span
            className="cursor-pointer text-solanaGreen hover:underline"
            onClick={() => setShowWalletDetails(true)}
          >
            Fund wallet.
          </span>
        </Text>
      </div>
    </div>
  );
};

export default Demo;
