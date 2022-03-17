import { PublicKey, TransactionSignature } from "@solana/web3.js";
import BigNumber from "bignumber.js";
import { createContext, useContext } from "react";
import { Confirmations } from "types";

export enum PaymentStatus {
  New = "New",
  Pending = "Pending",
  Confirmed = "Confirmed",
  Valid = "Valid",
  Invalid = "Invalid",
  Finalized = "Finalized",
}

export interface PaymentContextState {
  amount: BigNumber | undefined;
  setAmount(amount: BigNumber | undefined): void;
  message: string | undefined;
  setMessage(message: string | undefined): void;
  memo: string | undefined;
  setMemo(memo: string | undefined): void;
  reference: PublicKey | PublicKey[];
  signature: TransactionSignature | undefined;
  status: PaymentStatus;
  confirmations: Confirmations;
  progress: number;
  url: string;
  reset(): void;
  generate(): void;
  payWithWallet(): Promise<string>;
  label:string | undefined;
  setLabel(label: string | undefined): void;
}

export const PaymentContext = createContext<PaymentContextState>(
  {} as PaymentContextState,
);

export function usePayment(): PaymentContextState {
  return useContext(PaymentContext);
}
