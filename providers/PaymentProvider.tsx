import {
  createTransaction,
  encodeURL,
  findTransactionSignature,
  FindTransactionSignatureError,
  parseURL,
  validateTransactionSignature,
  ValidateTransactionSignatureError,
} from "@solana/pay";

import { useConnection, useWallet } from "@solana/wallet-adapter-react";
import {
  ConfirmedSignatureInfo,
  PublicKey,
  TransactionSignature,
  Keypair,
} from "@solana/web3.js";
import BigNumber from "bignumber.js";
import React, {
  FC,
  ReactNode,
  useCallback,
  useEffect,
  useMemo,
  useState,
} from "react";
import { useConfig } from "hooks/useConfig";
import { PaymentContext, PaymentStatus } from "../hooks/usePayment";
import { Confirmations } from "../types";

export interface PaymentProviderProps {
  children: ReactNode;
}

const INDEX_KEY = new PublicKey(process.env.NEXT_PUBLIC_INDEX_KEY ?? "");

const getNewAddress = (): PublicKey => {
  return Keypair.generate().publicKey;
};

export const PaymentProvider: FC<PaymentProviderProps> = ({ children }) => {
  const { connection } = useConnection();
  const { recipient, splToken, requiredConfirmations, connectWallet } =
    useConfig();
  const { publicKey, sendTransaction } = useWallet();

  const [amount, setAmount] = useState<BigNumber | undefined>(new BigNumber(1));
  const [message, setMessage] = useState<string>();
  const [memo, setMemo] = useState<string>();
  const [reference, setReference] = useState<PublicKey[]>([
    getNewAddress(),
    INDEX_KEY,
  ]);
  const [label, setLabel] = useState<string | undefined>("");

  const [signature, setSignature] = useState<TransactionSignature>();
  const [status, setStatus] = useState(PaymentStatus.New);
  const [confirmations, setConfirmations] = useState<Confirmations>(0);

  const progress = useMemo(
    () => confirmations / requiredConfirmations,
    [confirmations, requiredConfirmations],
  );

  const url = useMemo(
    () =>
      encodeURL({
        recipient,
        amount,
        splToken,
        reference,
        label,
        message,
        memo,
      }),
    [recipient, amount, splToken, reference, label, message, memo],
  );

  const reset = useCallback(() => {
    setAmount(new BigNumber(1));
    setReference([getNewAddress(), INDEX_KEY]);
    setStatus(PaymentStatus.New);
    setMessage(undefined);
    setMemo(undefined);
    setSignature(undefined);
    setConfirmations(0);
  }, []);

  const generate = useCallback(() => {
    if (status === PaymentStatus.New) {
      setStatus(PaymentStatus.Pending);
    }
  }, [status]);

  useEffect(() => {
    if (status === PaymentStatus.New && amount) {
      setStatus(PaymentStatus.Pending);
      setReference([getNewAddress(), INDEX_KEY]);
    }
  }, [status, amount]);

  // If there's a connected wallet, use it to sign and send the transaction
  useEffect(() => {
    if (status === PaymentStatus.Pending && connectWallet && publicKey) {
      let changed = false;

      const run = async () => {
        try {
          const { recipient, amount, splToken, reference, memo } =
            parseURL(url);
          if (!amount) return;

          const transaction = await createTransaction(
            connection,
            publicKey,
            recipient,
            amount,
            {
              splToken,
              reference,
              memo,
            },
          );

          if (!changed) {
            await sendTransaction(transaction, connection);
          }
        } catch (error) {
          // If the transaction is declined or fails, try again
          console.error(error);
          timeout = setTimeout(run, 5000);
        }
      };
      let timeout = setTimeout(run, 0);

      return () => {
        changed = true;
        clearTimeout(timeout);
      };
    }
  }, [status, connectWallet, publicKey, url, connection, sendTransaction]);

  // When the status is pending, poll for the transaction using the reference key
  useEffect(() => {
    if (!(status === PaymentStatus.Pending && reference.length && !signature))
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

  // When the status is confirmed, validate the transaction against the provided params
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

  // When the status is valid, poll for confirmations until the transaction is finalized
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
  }, [status, signature, connection, requiredConfirmations]);

  const payWithWallet = async () => {
    const { recipient, amount, splToken, reference, memo } = parseURL(url);
    if (!amount || !publicKey) throw new Error("Invalid Transaction");
    const transaction = await createTransaction(
      connection,
      publicKey,
      recipient,
      amount,
      {
        splToken,
        reference,
        memo,
      },
    );

    return await sendTransaction(transaction, connection);
  };

  return (
    <PaymentContext.Provider
      value={{
        amount,
        setAmount,
        message,
        setMessage,
        memo,
        setMemo,
        reference,
        signature,
        status,
        confirmations,
        progress,
        url,
        reset,
        generate,
        payWithWallet,
        label,
        setLabel,
      }}
    >
      {children}
    </PaymentContext.Provider>
  );
};
