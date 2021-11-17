import Head from "next/head";
import type { NextPage } from "next";
import Text from "components/Text";

const Home: NextPage = () => {
  return (
    <div className="h-screen flex justify-center dark:bg-dark">
      <Head>
        <title>Solpay</title>
        <meta name="description" content="Start accepting Solana payments today!" />
      </Head>

      <main className="container flex flex-col items-center">
        <section className="my-16">
          <Text className="text-5xl">Start accepting Solana payments today!</Text>
          <Text>It'll only take two minutes to set up.</Text>
        </section>
      </main>
    </div>
  );
};

export default Home;
