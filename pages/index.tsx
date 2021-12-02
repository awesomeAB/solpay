import { HeroButton, Text, WalletConnectModal } from "components";

import Head from "next/head";
import type { NextPage } from "next";
import { useState } from "react";

const Home: NextPage = () => {
  const [isOpen, setIsOpen] = useState<boolean>(false);
  const [email, setEmail] = useState<string>("");
  const [submitting, setSubmitting] = useState<boolean>(false);
  const [success, setSuccess] = useState<boolean>(false);

  const onSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    console.log(email);
    setSubmitting(true);
    setTimeout(() => {
      setSubmitting(false);
      setSuccess(true);
    }, 1000);
  };

  return (
    <div className="flex justify-center h-screen dark:bg-dark">
      <Head>
        <title>Solpay</title>
        <meta
          name="description"
          content="Start accepting Solana payments today!"
        />
      </Head>

      <main className="container flex flex-col items-center justify-center">
        <section className="px-4 mb-16 text-center">
          <Text className="my-4 text-5xl">
            Start accepting SOLANA payments today!
          </Text>
          <Text className="text-2xl ">
            It'll only take two minutes to set up.
          </Text>
        </section>
        <div className="flex flex-wrap items-center justify-center">
          <HeroButton label="Live Demo" onClick={() => setIsOpen(true)} />
          <form className="relative mx-8 my-12 group" onSubmit={onSubmit}>
            <div className="flex items-center h-16 w-72 p-0.5 bg-gradient-to-tr from-solanaGreen to-purple-600 rounded-2xl">
              <input
                type="email"
                placeholder="Enter Waitlist"
                autoComplete="off"
                onChange={(e) => setEmail(e.target.value)}
                value={email}
                className="w-full h-full p-4 leading-none text-dark dark:text-snow focus:outline-none dark:bg-dark rounded-2xl"
              />
              <button
                className="flex items-center h-full px-4 text-2xl text-snow"
                disabled={success}
                type="submit"
              >
                {submitting ? (
                  <div className="flex items-center justify-center px-0.5">
                    <div className=" w-5 h-5 border-t-2 border-b-2 rounded-full border-snow animate-spin"></div>
                  </div>
                ) : success ? (
                  <i className="ri-check-double-line"></i>
                ) : (
                  <i className="ri-arrow-right-line"></i>
                )}
              </button>
            </div>
          </form>
        </div>
        <WalletConnectModal isOpen={isOpen} setIsOpen={setIsOpen} />
      </main>
    </div>
  );
};

export default Home;
