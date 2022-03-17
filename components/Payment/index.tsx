import { Dialog, Transition } from "@headlessui/react";
import { FC, Fragment, useRef, useState } from "react";
import { WalletContextState } from "@solana/wallet-adapter-react";
import GenerateLink from "./GenerateLink";

interface Props {
  isOpen: boolean;
  setIsOpen: (value: boolean) => void;
  callback?: () => void;
  wallet: WalletContextState;
  setGeneratedLinks: any;
  setIsQRModalOpen: any;
  setLocalUrl: any;
}

const PaymentLink: FC<Props> = ({
  isOpen,
  setIsOpen,
  callback,
  wallet,
  setGeneratedLinks,
  setIsQRModalOpen,
  setLocalUrl,
}) => {
  const closeButtonRef = useRef(null);
  const [showConnectModal, setShowConnectModal] = useState<boolean>(false);
  // const { publicKey, disconnect } = wallet;
  const defaultCallback = () => {
    setShowConnectModal(false);
  };

  const handleClose = () => {
    setIsOpen(false);
    setShowConnectModal(false);
  };

  return (
    <Transition.Root show={isOpen} as={Fragment}>
      <Dialog
        as="div"
        className="fixed inset-0 z-50 overflow-y-auto"
        initialFocus={closeButtonRef}
        onClose={handleClose}
      >
        <div className="flex min-h-screen items-center justify-center text-center sm:p-0">
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
            <div className="demo-modal transform overflow-hidden rounded-xl bg-white p-2 shadow-xl transition-all dark:bg-dark">
              <div className="flex h-full flex-col">
                <div className="flex items-center justify-end">
                  <i
                    className="ri-close-line cursor-pointer text-3xl hover:text-red-400"
                    onClick={handleClose}
                    ref={closeButtonRef}
                  />
                </div>

                <GenerateLink
                  wallet={wallet}
                  connect={() => setShowConnectModal(true)}
                  setGeneratedLinks={setGeneratedLinks}
                  setIsOpen={setIsOpen}
                  setIsQRModalOpen={setIsQRModalOpen}
                  setLocalUrl={setLocalUrl}
                />
              </div>
            </div>
          </Transition.Child>
        </div>
      </Dialog>
    </Transition.Root>
  );
};

export default PaymentLink;
