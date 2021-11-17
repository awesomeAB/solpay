import Button from "components/Button";
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

      <main className="container flex flex-col items-center justify-center">
        <section className="mb-16 px-4 text-center">
          <Text className="text-5xl my-4">Start accepting Solana payments today!</Text>
          <Text className="text-2xl ">It'll only take two minutes to set up.</Text>
        </section>
        <section>
          <Button label="Live Demo" />
        </section>
      </main>
    </div>
  );
};

export default Home;
