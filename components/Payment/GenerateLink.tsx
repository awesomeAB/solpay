import { WalletContextState } from "@solana/wallet-adapter-react";
import { Text } from "components";
import LegacyButton from "components/ui/Button";
import React, { FC, useEffect, useState } from "react";
import { PaymentStatus, usePayment } from "hooks/usePayment";
import BigNumber from "bignumber.js";
import { PaymentDetails } from "types";
import { useUser } from "utils/useUser";
import { insertPaymentDetails } from "utils/supabase-client";
import { encodeURL } from "@solana/pay";
import { PublicKey } from "@solana/web3.js";
import { useConfig } from "hooks/useConfig";
import SolanaPayLogo from "components/Images/SolanaPayLogo";

type Props = {
  wallet: WalletContextState;
  connect: () => void;
  setGeneratedLinks: any;
  setIsOpen: any;
  setIsQRModalOpen: any;
  setLocalUrl: any;
};

const GenerateLink: FC<Props> = ({
  wallet,
  connect,
  setGeneratedLinks,
  setIsOpen,
  setIsQRModalOpen,
  setLocalUrl,
}) => {
  const { payWithWallet, status, signature, reset, reference } = usePayment();

  const { user, userDetails } = useUser();
  const { splToken } = useConfig();

  const [amountInput, setAmountInput] = useState<string>("");

  const [localMessage, setLocalMessage] = useState<string>("");
  const [localMemo, setLocalMemo] = useState<string>("");
  const [localLabel, setLocalLabel] = useState<string>("");

  const [loading, setLoading] = useState<boolean>(false);
  const [hash, setHash] = useState<string>("");
  const [error, setError] = useState<string>("");
  const { publicKey } = wallet;

  const handleChangeAmount = () => {
    let newAmount = new BigNumber(amountInput ? amountInput : 0);
    setAmountInput(newAmount.toString());
  };

  const handlePay = async () => {
    setLoading(true);
    try {
      const hash = await payWithWallet();
      setHash(hash);
    } catch (e: any) {
      console.error(e);
      setError(e.message ?? "Something went wrong :(");
      setLoading(false);
    }
  };

  useEffect(() => {
    if (status === PaymentStatus.Confirmed) {
      setLoading(true);
    } else if (status === PaymentStatus.Finalized) {
      setLoading(false);
      setHash(signature ?? "");
    }
  }, [status, signature]);

  const handleReset = () => {
    reset();
    setAmountInput("1");
    setHash("");
    setError("");
    setLoading(false);
  };

  const handleGenerateLink = async () => {
    setLoading(true);
    reset();
    let newAmount = new BigNumber(amountInput ? amountInput : 0);
    setAmountInput(newAmount.toString());

    const url = encodeURL({
      recipient: new PublicKey(userDetails.wallet ?? ""),
      amount: newAmount,
      splToken,
      reference,
      label: localLabel,
      message: "",
      memo: "",
    });
    const paymentRow: PaymentDetails = {
      id: JSON.parse(JSON.stringify(reference))[0],
      url,
      user_id: user.id,
    };

    try {
      await insertPaymentDetails(paymentRow);
    } catch (error: any) {
      setError(error);
    }
    setGeneratedLinks((prevState: any) => [...prevState, url]);
    setLoading(false);
    setIsOpen(false);
    // setLocalUrl(url);
    // setIsQRModalOpen(true);
  };

  return (
    <div className="flex flex-col justify-center">
      <div className="flex items-center justify-center">
        <SolanaPayLogo height={66} width={180} />
      </div>
      <div className="mt-10 flex flex-col items-center justify-center px-10">
        <div className="mx-24 mb-3 flex w-full items-center rounded-lg border ">
          <input
            className="w-full rounded-l-lg bg-white px-6 py-3 text-lg font-bold dark:bg-dark"
            placeholder="0"
            value={amountInput}
            onChange={(e) => setAmountInput(e.target.value)}
          />
          <div className="flex w-1/2 justify-center border-l">
            <Text className="text-lg font-extrabold">SOL</Text>
          </div>
        </div>
        <div className="mx-24 mb-3 flex w-full items-center rounded-lg border ">
          <input
            className="w-full rounded-lg bg-white px-6 py-3 text-lg font-bold dark:bg-dark"
            placeholder="label"
            value={localLabel}
            onChange={(e) => setLocalLabel(e.target.value)}
          />
        </div>
        <div className="mx-24 mb-3 flex w-full items-center rounded-lg border ">
          <input
            className="w-full rounded-lg bg-white px-6 py-3 text-lg font-bold dark:bg-dark"
            placeholder="message"
            value={localMessage}
            onChange={(e) => setLocalMessage(e.target.value)}
          />
        </div>
        <div className="mx-24 mb-3 flex w-full items-center rounded-lg border ">
          <input
            className="w-full rounded-lg bg-white px-6 py-3 text-lg font-bold dark:bg-dark"
            placeholder="memo"
            value={localMemo}
            onChange={(e) => setLocalMemo(e.target.value)}
          />
        </div>
        <div className="mx-24 mb-3 flex w-full items-center justify-center">
          <LegacyButton
            className="w-full"
            onClick={handleGenerateLink}
            loading={loading}
            disabled={amountInput === "" || localLabel === ""}
          >
            Generate Link
          </LegacyButton>
        </div>
      </div>
    </div>
  );
};

export default GenerateLink;
