import { Dialog, Transition } from "@headlessui/react";
import { FC, Fragment, useEffect, useRef, useState } from "react";
import { QRCode } from "components/QRCode";
import SolanaPayLogo from "components/Images/SolanaPayLogo";
import { ConfirmedSignatureInfo, TransactionSignature } from "@solana/web3.js";
import { Confirmations } from "types";
import { PaymentStatus } from "hooks/usePayment";
import {
  findTransactionSignature,
  FindTransactionSignatureError,
  parseURL,
  validateTransactionSignature,
  ValidateTransactionSignatureError,
} from "@solana/pay";
import { useConnection } from "@solana/wallet-adapter-react";
import { useConfig } from "hooks/useConfig";
import Image from "next/image";
import Text from "components/Text";
import { shortenAddress } from "utils";
import { insertTransactionDetails } from "utils/supabase-client";

interface Props {
  isOpen: boolean;
  setIsOpen: (value: boolean) => void;
  callback?: () => void;
  url: string;
}

const QRModal: FC<Props> = ({ isOpen, setIsOpen, callback, url }) => {
  const closeButtonRef = useRef(null);
  const [showConnectModal, setShowConnectModal] = useState<boolean>(false);
  // const { publicKey, disconnect } = wallet;
  const { requiredConfirmations } = useConfig();
  const { connection } = useConnection();

  const { reference, amount, recipient, splToken, label } = parseURL(url);

  const [loading, setLoading] = useState<boolean>(false);
  const [hash, setHash] = useState<string>("");
  const [signature, setSignature] = useState<TransactionSignature>();
  const [status, setStatus] = useState(PaymentStatus.New);
  const [confirmations, setConfirmations] = useState<Confirmations>(0);
  const [intervalCondition, setIntervalCondition] = useState<number>(0);

  const defaultCallback = () => {
    setShowConnectModal(false);
  };

  const handleClose = () => {
    setIsOpen(false);
    setShowConnectModal(false);
  };

  useEffect(() => {
    if (status === PaymentStatus.Confirmed) {
      setLoading(true);
    } else if (status === PaymentStatus.Finalized) {
      setLoading(false);
      setHash(signature ?? "");
    }
  }, [status, signature]);

  useEffect(() => {
    handleReset();
  }, [url]);
  useEffect(() => {
    if (status === PaymentStatus.New) {
      setStatus(PaymentStatus.Pending);
    }
  }, [status]);

  useEffect(() => {
    if (!(status === PaymentStatus.Pending && reference?.length && !signature))
      return;
    let changed = false;

    const interval = setInterval(async () => {
      let signature: ConfirmedSignatureInfo;
      try {
        signature = await findTransactionSignature(
          connection,
          reference[0],
          undefined,
          "confirmed",
        );

        if (!changed) {
          clearInterval(interval);
          setSignature(signature.signature);
          setStatus(PaymentStatus.Confirmed);
          //   navigate("/confirmed", { replace: true });
        }
      } catch (error: any) {
        // If the RPC node doesn't have the transaction signature yet, try again
        if (!(error instanceof FindTransactionSignatureError)) {
          console.error(error);
        }
      }
    }, 250);

    return () => {
      changed = true;
      clearInterval(interval);
    };
  }, [status, reference, signature, connection]);

  useEffect(() => {
    if (!(status === PaymentStatus.Confirmed && signature && amount)) return;
    let changed = false;

    const run = async () => {
      try {
        await validateTransactionSignature(
          connection,
          signature,
          recipient,
          amount,
          splToken,
          reference,
          "confirmed",
        );

        if (!changed) {
          setStatus(PaymentStatus.Valid);
        }
      } catch (error: any) {
        // If the RPC node doesn't have the transaction yet, try again
        if (
          error instanceof ValidateTransactionSignatureError &&
          (error.message === "not found" || error.message === "missing meta")
        ) {
          console.warn(error);
          timeout = setTimeout(run, 250);
          return;
        }

        console.error(error);
        setStatus(PaymentStatus.Invalid);
      }
    };
    let timeout = setTimeout(run, 0);

    return () => {
      changed = true;
      clearTimeout(timeout);
    };
  }, [status, signature, amount, connection, recipient, splToken, reference]);

  useEffect(() => {
    if (!(status === PaymentStatus.Valid && signature)) return;
    let changed = false;

    const interval = setInterval(async () => {
      try {
        const response = await connection.getSignatureStatus(signature);
        const status = response.value;
        if (!status) return;
        if (status.err) throw status.err;

        if (!changed) {
          const confirmations = (status.confirmations || 0) as Confirmations;
          setConfirmations(confirmations);

          if (
            confirmations >= requiredConfirmations ||
            status.confirmationStatus === "finalized"
          ) {
            clearInterval(interval);
            if (intervalCondition < 1) {
              const transactionRow = {
                id: signature,
                payment_id: JSON.parse(JSON.stringify(reference))[0],
              };
              try {
                await insertTransactionDetails(transactionRow);
              } catch (error) {
                console.log(error);
              }
              setIntervalCondition(1);
            }

            setStatus(PaymentStatus.Finalized);
          }
        }
      } catch (error: any) {
        console.log(error);
      }
    }, 250);

    return () => {
      changed = true;
      clearInterval(interval);
    };
  }, [
    status,
    signature,
    connection,
    requiredConfirmations,
    reference,
    intervalCondition,
  ]);

  const handleReset = () => {
    setStatus(PaymentStatus.New);
    setSignature(undefined);
    setConfirmations(0);
    setHash("");
    setLoading(false);
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
                <div className="flex flex-col items-center justify-center">
                  <div className="mb-5">
                    <SolanaPayLogo height={66} width={180} />
                  </div>
                  {loading ? (
                    <div className="flex flex-col items-center justify-center pt-10">
                      <div className="h-24 w-24 animate-spin rounded-full border-t-4 border-b-4 border-solanaGreen"></div>
                      <Text className="text-lg">Processing transaction...</Text>
                      {signature && (
                        <a
                          href={`https://explorer.solana.com/tx/${signature}?cluster=devnet`}
                          className="mt-2 cursor-pointer text-sm hover:text-solanaGreen hover:underline"
                          target="_blank"
                          rel="noreferrer"
                        >
                          Check status: {shortenAddress(signature, 6)}
                        </a>
                      )}
                    </div>
                  ) : status === PaymentStatus.Finalized ? (
                    <div className="flex h-full flex-col items-center justify-center pt-5">
                      <Image
                        src="/success.png"
                        alt="solana logo"
                        width={128}
                        height={128}
                      />
                      <Text className="mt-8 text-lg">
                        Transaction Successful
                      </Text>
                      <a
                        href={`https://explorer.solana.com/tx/${hash}?cluster=devnet`}
                        className="mt-2 cursor-pointer text-sm hover:text-solanaGreen hover:underline"
                        target="_blank"
                        rel="noreferrer"
                      >
                        Explore: {shortenAddress(hash, 6)}
                      </a>
                    </div>
                  ) : (
                    <div className="flex flex-col items-center justify-center">
                      <div className="flex flex-col">
                        <Text className="mb-2 text-base opacity-80">
                          {label}
                        </Text>
                        <Text className="text-4xl font-extrabold">
                          {amount?.toString()} SOL
                        </Text>
                      </div>
                      <QRCode url={url} />
                    </div>
                  )}
                </div>
              </div>
            </div>
          </Transition.Child>
        </div>
      </Dialog>
    </Transition.Root>
  );
};

export default QRModal;
