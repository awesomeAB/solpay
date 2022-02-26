import { FC, useEffect } from "react";

import Image from "next/image";
import { Text } from "components";
import toast from "react-hot-toast";
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
      <Text className="mb-8 max-w-lg text-xl">
        Select your wallet to continue
      </Text>
      <div className="mx-8 my-4 flex flex-col px-4">
        {wallets.map((wallet) => (
          <div
            key={wallet.adapter.name}
            onClick={() => select(wallet.adapter.name)}
            className="bg-black-100 my-2 flex w-full cursor-pointer justify-center rounded-2xl border bg-gray-400 bg-opacity-10 py-3 hover:border-solanaGreen dark:bg-dark"
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
    </div>
  );
};

export default WalletConnect;
