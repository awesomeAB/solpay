import { FC, useEffect } from "react";

import Image from "next/image";
import { Text } from "components";
import toast from "react-hot-toast";
import { useWallet } from "@solana/wallet-adapter-react";

const WalletConnect: FC = () => {
  const { wallets, select, connect, adapter } = useWallet();

  useEffect(() => {
    if (adapter) {
      toast.promise(connect(), {
        loading: "Connecting Wallet...",
        success: <b>Wallet connected successfully!</b>,
        error: <b>Connection failed, please try again :(</b>,
      });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [adapter]);

  return (
    <div className="mx-4 mt-4">
      <Text className="max-w-lg mb-4 text-xl">
        Select your wallet to continue
      </Text>
      <div className="flex flex-col px-4 mx-8 my-4">
        {wallets.map((wallet) => (
          <div
            key={wallet.name}
            onClick={() => select(wallet.name)}
            className="flex justify-center w-full py-3 my-2 bg-gray-400 border cursor-pointer bg-opacity-10 dark:bg-dark rounded-2xl bg-black-100 hover:border-solanaGreen"
          >
            <Image src={wallet.icon} alt="wallet icon" width={28} height={28} />
            <Text className="pl-4 text-xl">{wallet.name}</Text>
          </div>
        ))}
      </div>
      <div className="flex items-center justify-center w-full h-8">
        <Text className="text-md">Powered by</Text>
        <span className="flex items-center pl-2">
          <Image
            src="/solana-icon.svg"
            alt="solana logo"
            width={24}
            height={24}
          />
          <Text className="pl-2 text-md">SOLANA</Text>
        </span>
      </div>
    </div>
  );
};

export default WalletConnect;
