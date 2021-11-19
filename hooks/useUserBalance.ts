import { useConnection, useWallet } from "@solana/wallet-adapter-react";
import { useEffect, useState } from "react";

import { fromLamports } from "utils";

const REFRESH_MS = 2000;

export default function useUserBalance() {
  const [balanceLamports, setBalanceLamports] = useState(0);
  const { connection } = useConnection();
  const { publicKey } = useWallet();

  useEffect(() => {
    const fetchBalance = () => {
      if (publicKey) {
        connection
          .getBalance(publicKey)
          .then((lamports) => {
            setBalanceLamports(lamports);
          })
          .catch((e) => console.error(e));
      } else {
        setBalanceLamports(0);
      }
    };

    try {
      fetchBalance();
    } catch (e) {
      console.error(e);
    }

    const interval = setInterval(() => {
      fetchBalance();
    }, REFRESH_MS);

    return () => clearInterval(interval);
  }, [connection, publicKey]);

  return {
    balanceLamports,
    balance: fromLamports(balanceLamports),
  };
}
