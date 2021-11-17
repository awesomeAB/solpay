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
    <div className="mx-8 my-4">
      <Text className="max-w-lg mb-4 text-xl">
        Select your wallet to continue
      </Text>
      <div className="flex flex-col px-4 my-4 sm:mx-8">
        {wallets.map((wallet) => (
          <div
            key={wallet.name}
            onClick={() => select(wallet.name)}
            className="flex justify-start w-full px-4 py-4 my-2 border cursor-pointer sm:px-16 bg-dark rounded-2xl bg-black-100 hover:border-pink-500"
          >
            <Image src={wallet.icon} alt="wallet icon" width={30} height={30} />
            <Text className="pl-4 text-xl">{wallet.name}</Text>
          </div>
        ))}
      </div>
    </div>
  );
};

export default WalletConnect;
