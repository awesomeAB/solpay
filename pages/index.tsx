import { Button, Text, WalletConnectModal } from "components";

import Head from "next/head";
import type { NextPage } from "next";
import { useState } from "react";

const Home: NextPage = () => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="flex justify-center h-screen dark:bg-dark">
      <Head>
        <title>Solpay</title>
        <meta name="description" content="Start accepting Solana payments today!" />
      </Head>

      <main className="container flex flex-col items-center justify-center">
        <section className="px-4 mb-16 text-center">
          <Text className="my-4 text-5xl">Start accepting Solana payments today!</Text>
          <Text className="text-2xl ">It'll only take two minutes to set up.</Text>
        </section>
        <section>
          <Button label="Live Demo" onClick={() => setIsOpen(true)} />
        </section>
        <WalletConnectModal isOpen={isOpen} setIsOpen={setIsOpen} />
      </main>
    </div>
  );
};

export default Home;
