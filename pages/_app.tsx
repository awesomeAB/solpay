import "../styles/globals.css";

import { FC, ReactNode } from "react";

import type { AppProps } from "next/app";
import { ThemeProvider } from "next-themes";
import { Toaster } from "react-hot-toast";
import dynamic from "next/dynamic";
import { UserContextProvider } from "utils/useUser";
import Navbar from "components/ui/Navbar";

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
        <ThemeProvider attribute="class" defaultTheme="dark">
          <Navbar />
          <Component {...pageProps} />
        </ThemeProvider>
        <Toaster position="bottom-center" />
      </UserContextProvider>
    </WalletConnectionProvider>
  );
};

export default App;
