import { Button, Text } from "components";
import { LAMPORTS_PER_SOL, PublicKey } from "@solana/web3.js";
import { formatAmount, shortenAddress } from "utils";

import { FC } from "react";
import toast from "react-hot-toast";
import { useConnection } from "@solana/wallet-adapter-react";
import useUserBalance from "hooks/useUserBalance";

interface Props {
  publicKey: PublicKey;
  handleDisconnect: () => Promise<void>;
  goBack: () => void;
  className?: string;
  balance: number;
}

const WalletDetails: FC<Props> = ({
  publicKey,
  handleDisconnect,
  goBack,
  balance,
}) => {
  const { connection } = useConnection();

  const requestAirdrop = async () => {
    toast
      .promise(connection.requestAirdrop(publicKey, LAMPORTS_PER_SOL), {
        loading: "Requesting Airdrop...",
        success: <b>Airdrop 1 SOL Successful!</b>,
        error: <b>Airdrop failed, please try again :(</b>,
      })
      .then();
  };

  return (
    <div className="px-8 pt-4 sm:px-16">
      <Text className="mx-8 mb-8 text-2xl">Wallet Connected</Text>
      <Text className="text-xl">
        Address: {shortenAddress(publicKey.toBase58())}
      </Text>
      <Text className="text-xl">Balance: {formatAmount(balance)} SOL</Text>
      <Text className="text-xl mb-36">Network: Devnet</Text>
      <Button label="Request 1 SOL" onClick={requestAirdrop} type="positive" />
      <Button
        label="Disconnect Wallet"
        onClick={handleDisconnect}
        type="negative"
      />
      <div className="absolute left-0 flex justify-center w-full text-sm bottom-4">
        <span
          className="cursor-pointer text-solanaGreen hover:underline"
          onClick={goBack}
        >
          Ready to go?
        </span>
      </div>
    </div>
  );
};

export default WalletDetails;
