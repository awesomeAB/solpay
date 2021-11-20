import { Dialog, Transition } from "@headlessui/react";
import { FC, Fragment, useRef } from "react";

import Demo from "./Demo";
import WalletConnect from "./WalletConnect";
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
            <div className="p-2 overflow-hidden shadow-xl demo-modal rounded-xl bg-snow dark:bg-dark transform transition-all">
              <div className="flex flex-col">
                <div className="flex justify-end">
                  <i
                    className="text-4xl cursor-pointer ri-close-line hover:text-solanaGreen"
                    onClick={() => setIsOpen(false)}
                    ref={closeButtonRef}
                  />
                </div>
                {publicKey ? (
                  <Demo publicKey={publicKey} handleDisconnect={disconnect} />
                ) : (
                  <WalletConnect />
                )}
              </div>
            </div>
          </Transition.Child>
        </div>
      </Dialog>
    </Transition.Root>
  );
};

export default WalletConnectModal;
