import { HeroButton, Text, WalletConnectModal } from "components";
import { useEffect, useState } from "react";

import Head from "next/head";
import Image from "next/image";
import type { NextPage } from "next";
import c from "classnames";
import { useTheme } from "next-themes";

function validateEmailRegex(email: string) {
  const re =
    /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
  return re.test(String(email).toLowerCase());
}

const ThemeToggle = () => {
  const { theme, setTheme } = useTheme();

  return theme === "dark" ? (
    <button onClick={() => setTheme("light")}>
      <i className="text-3xl text-dark dark:text-snow ri-sun-line" />
    </button>
  ) : (
    <button onClick={() => setTheme("dark")}>
      <i className="text-3xl text-dark dark:text-snow ri-moon-clear-line" />
    </button>
  );
};

const Home: NextPage = () => {
  const [isOpen, setIsOpen] = useState<boolean>(false);
  const [email, setEmail] = useState<string>("");
  const [submitting, setSubmitting] = useState<boolean>(false);
  const [isSubmitted, setIsSubmitted] = useState<boolean>(false);
  const [isValid, setIsValid] = useState(false);
  const [message, setMessage] = useState("");

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
    <div className="flex justify-center h-screen dark:bg-dark">
      <Head>
        <title>Solpay - Start accepting SOLANA payments today!</title>
        <meta
          name="description"
          content="Start accepting Solana payments today!"
        />
      </Head>
      <header className="absolute top-0 flex items-center justify-between w-full px-8 py-4">
        <i className="text-5xl text-transparent ri-wallet-3-fill bg-clip-text bg-gradient-to-br from-solanaGreen to-purple-600" />
        <ThemeToggle />
      </header>
      <main className="container flex flex-col items-center justify-center">
        <section className="px-4 mt-4 mb-16 text-center">
          <Text className="my-4 text-5xl">
            Start accepting{" "}
            <span className="font-extrabold text-transparent bg-clip-text bg-gradient-to-br from-solanaGreen to-purple-600">
              SOLANA
            </span>{" "}
            payments today!
          </Text>
          <Text className="text-2xl ">
            It'll only take a few minutes to set up.
          </Text>
        </section>
        <div className="flex flex-wrap items-center justify-center">
          <HeroButton label="Live Demo" onClick={() => setIsOpen(true)} />
          <form className="relative mx-8 my-12 group" onSubmit={onSubmit}>
            <div className="flex items-center h-16 w-72 p-0.5 bg-gradient-to-tr from-solanaGreen to-purple-600 rounded-2xl">
              <input
                type="email"
                placeholder="Get Early Access"
                autoComplete="off"
                onChange={(e) => setEmail(e.target.value)}
                value={email}
                className="w-full h-full p-4 leading-none text-dark dark:text-snow focus:outline-none dark:bg-dark rounded-2xl"
              />
              <button
                className="flex items-center h-full px-4 text-2xl text-snow"
                disabled={isSubmitted}
                type="submit"
              >
                {submitting ? (
                  <div className="flex items-center justify-center px-0.5">
                    <div className=" w-5 h-5 border-t-2 border-b-2 rounded-full border-snow animate-spin"></div>
                  </div>
                ) : isSubmitted ? (
                  <i className="ri-check-double-line"></i>
                ) : (
                  <i className="ri-arrow-right-line"></i>
                )}
              </button>
            </div>
            <span
              className={c("text-sm absolute left-2 text-red-500", {
                "text-solanaGreen": isValid || isSubmitted,
              })}
            >
              {message}
            </span>
          </form>
        </div>
        <WalletConnectModal isOpen={isOpen} setIsOpen={setIsOpen} />
      </main>
      <footer className="absolute flex justify-center w-full bottom-1">
        <Text className="text-md">Powered by</Text>
        <a
          className="flex items-center pl-2 cursor-pointer"
          href="https://solana.com"
          target="_blank"
          rel="noopener noreferrer"
        >
          <Image
            src="/solana-icon.svg"
            alt="solana logo"
            width={24}
            height={24}
          />
          <Text className="pl-2 cursor-pointer text-md">SOLANA</Text>
        </a>
      </footer>
    </div>
  );
};

export default Home;
