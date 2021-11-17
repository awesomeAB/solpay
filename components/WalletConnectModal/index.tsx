import { Dialog, Transition } from "@headlessui/react";
import { FC, Fragment, useRef } from "react";

import Image from "next/image";
import { Text } from "components";
import WalletConnect from "./WalletConnect";
import WalletDetails from "./WalletDetails";
import { useWallet } from "@solana/wallet-adapter-react";

interface Props {
  isOpen: boolean;
  setIsOpen: (value: boolean) => void;
}

const WalletConnectModal: FC<Props> = ({ isOpen, setIsOpen }) => {
  const { publicKey, disconnect } = useWallet();
  const closeButtonRef = useRef(null);

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
                  <WalletDetails
                    publicKey={publicKey}
                    handleDisconnect={disconnect}
                  />
                ) : (
                  <WalletConnect />
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
