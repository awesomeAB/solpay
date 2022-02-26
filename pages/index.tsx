import { HeroButton, Text, WalletConnectModal } from "components";
import { useEffect, useState } from "react";

import Head from "next/head";
import type { NextPage } from "next";
import c from "classnames";
import SolanaPayLogo from "components/Images/SolanaPayLogo";
import { useUser } from "utils/useUser";
import { useRouter } from "next/router";
import { useWallet } from "@solana/wallet-adapter-react";

function validateEmailRegex(email: string) {
  const re =
    /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
  return re.test(String(email).toLowerCase());
}

const Home: NextPage = () => {
  const [isOpen, setIsOpen] = useState<boolean>(false);
  const [email, setEmail] = useState<string>("");
  const [submitting, setSubmitting] = useState<boolean>(false);
  const [isSubmitted, setIsSubmitted] = useState<boolean>(false);
  const [isValid, setIsValid] = useState(false);
  const [message, setMessage] = useState("");
  const { user, signIn } = useUser();
  const router = useRouter();
  const wallet = useWallet();

  useEffect(() => {
    if (email === "") {
      setIsValid(false);
      setMessage("");
    } else if (validateEmailRegex(email)) {
      setIsValid(true);
      setMessage("Your email looks good.");
    } else {
      setIsValid(false);
      setMessage("Please enter a valid email address.");
    }
  }, [email]);

  useEffect(() => {
    if (user) {
      router.replace("/account");
    }
  }, [user]);

  const onSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (isSubmitted) {
      setMessage("Thanks! Email submitted Successfully!");
    } else if (isValid && !submitting && !isSubmitted) {
      setSubmitting(true);
      setMessage("Submitting...");
      const params = new URLSearchParams(window.location.search);

      fetch("/api/subscribe", {
        body: JSON.stringify({
          email,
          date: new Date().toUTCString(),
          ref: params.get("ref") ?? "",
        }),
        headers: {
          "Content-Type": "application/json",
        },
        method: "POST",
      }).then(() => {
        setIsSubmitted(true);
        setSubmitting(false);
        setMessage("Thanks! Email submitted successfully.");
        setTimeout(() => {
          setEmail("");
          setIsSubmitted(false);
          setMessage("");
        }, 5000);
      });
    } else if (isValid === false) {
      setMessage("Please enter a valid email address.");
    }
  };

  return (
    <section className="h-screen dark:bg-dark">
      <div className="flex h-full justify-center ">
        <Head>
          <title>Solpay - Future of payments powered by Solana pay!</title>
          <meta
            name="description"
            content="Start accepting Solana payments today!"
          />
        </Head>
        <main className="container mt-32 mb-8 flex flex-col items-center justify-center">
          <section className="mt-4 mb-16 px-4 text-center">
            <Text className="text-5xl ">
              Welcome to the{" "}
              <span className="bg-gradient-to-br from-solanaGreen to-purple-600 bg-clip-text font-extrabold text-transparent">
                FUTURE
              </span>{" "}
              of payments!
            </Text>
            <Text className="my-4 text-2xl">
              Instant settlements at virtually zero cost, powered by the
              blockchain.
            </Text>
          </section>
          <div className="flex flex-wrap items-center justify-center">
            <HeroButton label="Live Demo" onClick={() => setIsOpen(true)} />
            <form className="group relative mx-8 my-12" onSubmit={onSubmit}>
              <div className="flex h-16 w-72 items-center rounded-2xl bg-gradient-to-tr from-solanaGreen to-purple-600 p-0.5">
                <input
                  type="email"
                  placeholder="Get Early Access"
                  autoComplete="off"
                  onChange={(e) => setEmail(e.target.value)}
                  value={email}
                  className="h-full w-full rounded-2xl p-4 leading-none text-dark focus:outline-none dark:bg-dark dark:text-snow"
                />
                <button
                  className="flex h-full items-center px-4 text-2xl text-snow"
                  disabled={isSubmitted}
                  type="submit"
                >
                  {submitting ? (
                    <div className="flex items-center justify-center px-0.5">
                      <div className=" h-5 w-5 animate-spin rounded-full border-t-2 border-b-2 border-snow"></div>
                    </div>
                  ) : isSubmitted ? (
                    <i className="ri-check-double-line"></i>
                  ) : (
                    <i className="ri-arrow-right-line"></i>
                  )}
                </button>
              </div>
              <span
                className={c("absolute left-2 text-sm text-red-500", {
                  "text-solanaGreen": isValid || isSubmitted,
                })}
              >
                {message}
              </span>
            </form>
          </div>
          <WalletConnectModal
            isOpen={isOpen}
            setIsOpen={setIsOpen}
            wallet={wallet}
            showDemo
          />
        </main>
      </div>
      <footer className="bottom-2	flex w-full justify-center pt-8 pb-4 dark:bg-dark sm:fixed">
        <Text className="text-md mr-2">Powered by</Text>

        <SolanaPayLogo />
      </footer>
    </section>
  );
};

export default Home;
