import Head from "next/head";
import type { NextPage } from "next";

const Home: NextPage = () => {
  return (
    <div className="">
      <Head>
        <title>Solpay</title>
        <meta name="description" content="Payments for SOLANA" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <main>
        <h1>
          Welcome to <a href="https://nextjs.org">Next.js!</a>
        </h1>
      </main>
    </div>
  );
};

export default Home;
