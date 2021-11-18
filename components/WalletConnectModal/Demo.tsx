import { Button, Text } from "components";
import { FC, useState } from "react";
import { LAMPORTS_PER_SOL, PublicKey } from "@solana/web3.js";
import { formatAmount, shortenAddress } from "utils";

import Image from "next/image";
import WalletDetails from "./WalletDetails";
import toast from "react-hot-toast";
import { useConnection } from "@solana/wallet-adapter-react";
import useUserBalance from "hooks/useUserBalance";

interface Props {
  publicKey: PublicKey;
  handleDisconnect: () => Promise<void>;
  className?: string;
}

const Demo: FC<Props> = ({ publicKey, handleDisconnect }) => {
  const [showWalletDetails, setShowWalletDetails] = useState(false);
  const { balance } = useUserBalance();
  const { connection } = useConnection();

  const requestAirdrop = async () => {
    toast
      .promise(connection.requestAirdrop(publicKey, LAMPORTS_PER_SOL), {
        loading: "Requesting Airdrop...",
        success: <b>Airdrop 1 SOL Successful!</b>,
        error: <b>Airdrop failed, please try again :(</b>,
      })
      .then();
  };

  return showWalletDetails ? (
    <WalletDetails
      publicKey={publicKey}
      handleDisconnect={handleDisconnect}
      goBack={() => setShowWalletDetails(false)}
    />
  ) : (
    <div className="px-2 pt-4">
      <Text className="mx-4 mb-8 text-2xl">Checkout</Text>
      <div className="flex justify-between px-8 py-4 mx-8 my-8 text-xl bg-gray-400 rounded-xl bg-opacity-5">
        <Text>Total Amount:</Text>
        <Text>$1</Text>
      </div>
      <div className="px-8 mt-44">
        <div className="relative group">
          <div className="absolute opacity-75 inset-0.5 bg-gradient-to-r from-solanaGreen to-purple-600 rounded-xl filter blur-lg group-hover:opacity-100 transition duration-200" />
          <button
            className="relative inset-0 flex items-center justify-center w-full py-4 leading-none focus:outline-none bg-dark rounded-xl"
            onClick={() => console.log("pay")}
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
      <div className="absolute left-0 flex justify-center w-full bottom-4">
        <Text className="text-sm">
          Don't have enough SOL for testing?{" "}
          <span
            className="text-blue-400 cursor-pointer hover:underline"
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
