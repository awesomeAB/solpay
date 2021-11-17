import { Button, Text } from "components";
import { Dialog, Transition } from "@headlessui/react";
import { FC, Fragment, useEffect, useRef } from "react";
import { useConnection, useWallet } from "@solana/wallet-adapter-react";

import Image from "next/image";
import { shortenAddress } from "utils";
import toast from "react-hot-toast";

interface Props {
  isOpen: boolean;
  setIsOpen: (value: boolean) => void;
}

const WalletConnectModal: FC<Props> = ({ isOpen, setIsOpen }) => {
  const { connection } = useConnection();
  const { wallets, select, connect, adapter, publicKey, disconnect } =
    useWallet();
  const closeButtonRef = useRef(null);
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
    <Transition.Root show={isOpen} as={Fragment}>
      <Dialog
        as="div"
        className="fixed inset-0 z-10 overflow-y-auto"
        initialFocus={closeButtonRef}
        onClose={setIsOpen}
      >
        <div className="flex items-center justify-center min-h-screen text-center sm:p-0">
          <Transition.Child
            as={Fragment}
            enter="ease-out duration-300"
            enterFrom="opacity-0"
            enterTo="opacity-100"
            leave="ease-in duration-200"
            leaveFrom="opacity-100"
            leaveTo="opacity-0"
          >
            <Dialog.Overlay className="fixed inset-0 bg-gray-800 bg-opacity-50 transition-opacity" />
          </Transition.Child>

          <Transition.Child
            as={Fragment}
            enter="ease-out duration-300"
            enterFrom="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95"
            enterTo="opacity-100 translate-y-0 sm:scale-100"
            leave="ease-in duration-200"
            leaveFrom="opacity-100 translate-y-0 sm:scale-100"
            leaveTo="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95"
          >
            <div className="p-2 overflow-hidden shadow-xl rounded-xl bg-dark transform transition-all sm:p-4">
              <div className="flex flex-col">
                <div className="flex justify-end">
                  <i
                    className="text-4xl cursor-pointer ri-close-line"
                    onClick={() => setIsOpen(false)}
                    ref={closeButtonRef}
                  />
                </div>
                {publicKey ? (
                  <div className="px-8 py-4 sm:px-16">
                    <Text className="mx-8 mb-8 text-2xl">Wallet Connected</Text>
                    <Text className="text-xl">
                      Address: {shortenAddress(publicKey.toBase58())}
                    </Text>
                    <div
                      onClick={disconnect}
                      className="flex justify-center w-full px-4 py-3 my-2 mt-8 border cursor-pointer sm:px-12 bg-dark rounded-2xl bg-black-100 hover:border-pink-500"
                    >
                      <Text>Disconnect Wallet</Text>
                    </div>
                  </div>
                ) : (
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
                          <Image
                            src={wallet.icon}
                            alt="wallet icon"
                            width={30}
                            height={30}
                          />
                          <Text className="pl-4 text-xl">{wallet.name}</Text>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
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
            </div>
          </Transition.Child>
        </div>
      </Dialog>
    </Transition.Root>
  );
};

export default WalletConnectModal;
