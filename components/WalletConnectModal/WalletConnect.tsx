import { FC, useEffect } from "react";

import Image from "next/image";
import { Text } from "components";
import toast from "react-hot-toast";
import SolanaPayLogo from "components/Images/SolanaPayLogo";
import { WalletContextState } from "@solana/wallet-adapter-react";

type Props = {
  callback?: () => void;
  wallet: WalletContextState;
};

const WalletConnect: FC<Props> = ({ callback, wallet }) => {
  const { wallets, wallet: currentWallet, select, connect } = wallet;

  useEffect(() => {
    if (currentWallet?.adapter) {
      toast.promise(connect(), {
        loading: "Connecting Wallet...",
        success: () => {
          if (callback) callback();
          return <b>Wallet connected successfully!</b>;
        },
        error: <b>Connection failed, please try again :(</b>,
      });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [currentWallet]);

  return (
    <div className="mx-4 mt-4">
      <Text className="max-w-lg mb-4 text-xl">
        Select your wallet to continue
      </Text>
      <div className="flex flex-col px-4 mx-8 my-4">
        {wallets.map((wallet) => (
          <div
            key={wallet.adapter.name}
            onClick={() => select(wallet.adapter.name)}
            className="flex justify-center w-full py-3 my-2 bg-gray-400 border cursor-pointer bg-opacity-10 dark:bg-dark rounded-2xl bg-black-100 hover:border-solanaGreen"
          >
            <Image
              src={wallet.adapter.icon}
              alt="wallet icon"
              width={28}
              height={28}
            />
            <Text className="pl-4 text-xl">{wallet.adapter.name}</Text>
          </div>
        ))}
      </div>
      <div className="flex items-center justify-center w-full h-8">
        <Text className="mr-2 text-md">Powered by</Text>
        <SolanaPayLogo />
      </div>
    </div>
  );
};

export default WalletConnect;
