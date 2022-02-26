import "../styles/globals.css";

import { FC, ReactNode } from "react";

import type { AppProps } from "next/app";
import { ThemeProvider } from "next-themes";
import { Toaster } from "react-hot-toast";
import dynamic from "next/dynamic";
import { UserContextProvider } from "utils/useUser";
import Navbar from "components/ui/Navbar";
import { PaymentProvider } from "providers/PaymentProvider";
import { ConfigProvider } from "providers/ConfigProvider";
import { PublicKey } from "@solana/web3.js";
import SolanaPayLogo from "components/Images/SolanaPayLogo";

const RECIPIENT = new PublicKey(process.env.NEXT_PUBLIC_RECIPIENT_KEY ?? "");

const WalletConnectionProvider = dynamic<{ children: ReactNode }>(
  () =>
    import("providers/WalletConnectionProvider").then(
      ({ WalletConnectionProvider }) => WalletConnectionProvider,
    ),
  {
    ssr: false,
  },
);

const App: FC<AppProps> = ({ Component, pageProps }: AppProps) => {
  return (
    <WalletConnectionProvider>
      <UserContextProvider>
        <ConfigProvider
          recipient={RECIPIENT}
          label={"Solpay"}
          symbol="SOL"
          icon={<SolanaPayLogo />}
          decimals={9}
          minDecimals={1}
        >
          <PaymentProvider>
            <ThemeProvider attribute="class" defaultTheme="dark">
              <Navbar />
              <Component {...pageProps} />
            </ThemeProvider>
            <Toaster position="bottom-center" />
          </PaymentProvider>
        </ConfigProvider>
      </UserContextProvider>
    </WalletConnectionProvider>
  );
};

export default App;
