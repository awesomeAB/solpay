import Link from "next/link";
import { useRouter } from "next/router";
import { useEffect, useState, FormEvent } from "react";

import Button from "components/ui/Button";
import GitHub from "components/icons/GitHub";
import Input from "components/ui/Input";
import LoadingDots from "components/ui/LoadingDots";
import { Text } from "components";
import Logo from "components/icons/Logo";
import { useUser } from "utils/useUser";
import { Provider } from "@supabase/supabase-js";
import Head from "next/head";

const SignIn = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPasswordInput, setShowPasswordInput] = useState(false);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState<{ type?: string; content?: string }>({
    type: "",
    content: "",
  });
  const router = useRouter();
  const { user, signIn } = useUser();

  const handleSignin = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    setLoading(true);
    setMessage({});

    const { error } = await signIn({ email, password });
    if (error) {
      setMessage({ type: "error", content: error.message });
    }
    if (!password) {
      setMessage({
        type: "note",
        content: "Check your email for the magic link.",
      });
    }
    setLoading(false);
  };

  const handleOAuthSignIn = async (provider: Provider) => {
    setLoading(true);
    const { error } = await signIn({ provider });
    if (error) {
      setMessage({ type: "error", content: error.message });
    }
    setLoading(false);
  };

  useEffect(() => {
    if (user) {
      router.replace("/account");
    }
  }, [user]);

  if (!user)
    return (
      <div className="flex h-screen justify-center">
        <Head>
          <title>Solpay | Sign In</title>
        </Head>
        <div className="m-auto flex w-80 max-w-lg flex-col justify-between p-3 ">
          <div className="flex items-center justify-center pb-12">
            <Logo width="64px" height="64px" />
            <Text className="pl-2 text-xl font-bold">Sign In</Text>
          </div>
          <div className="flex flex-col space-y-4">
            {message.content && (
              <div
                className={`${
                  message.type === "error" ? "text-pink-500" : "text-green-500"
                } border ${
                  message.type === "error"
                    ? "border-pink-500"
                    : "border-green-500"
                } p-3`}
              >
                {message.content}
              </div>
            )}

            {!showPasswordInput && (
              <form onSubmit={handleSignin} className="flex flex-col space-y-4">
                <Input
                  type="email"
                  placeholder="Email"
                  value={email}
                  onChange={setEmail}
                  required
                />
                <Button
                  variant="slim"
                  type="submit"
                  loading={loading}
                  disabled={!email.length}
                >
                  Send magic link
                </Button>
              </form>
            )}

            {showPasswordInput && (
              <form onSubmit={handleSignin} className="flex flex-col space-y-4">
                <Input
                  type="email"
                  placeholder="Email"
                  value={email}
                  onChange={setEmail}
                  required
                />
                <Input
                  type="password"
                  placeholder="Password"
                  value={password}
                  onChange={setPassword}
                  required
                />
                <Button
                  className="mt-1"
                  variant="slim"
                  type="submit"
                  loading={loading}
                  disabled={!password.length || !email.length}
                >
                  Sign in
                </Button>
              </form>
            )}

            <span className="pt-1 text-center text-sm">
              <a
                href="#"
                className="text-accent-9 cursor-pointer text-zinc-200 hover:underline"
                onClick={() => {
                  if (showPasswordInput) setPassword("");
                  setShowPasswordInput(!showPasswordInput);
                  setMessage({});
                }}
              >
                {`Or sign in with ${
                  showPasswordInput ? "magic link" : "password"
                }.`}
              </a>
            </span>

            <span className="pt-1 text-center text-sm">
              <span className="text-zinc-200">Don't have an account?</span>
              {` `}
              <Link href="/signup">
                <a className="text-accent-9 cursor-pointer font-bold hover:underline">
                  Sign up.
                </a>
              </Link>
            </span>
          </div>

          <div className="my-6 flex items-center">
            <div
              className="mr-3 flex-grow border-t border-zinc-600"
              aria-hidden="true"
            ></div>
            <div className="text-zinc-400">Or</div>
            <div
              className="ml-3 flex-grow border-t border-zinc-600"
              aria-hidden="true"
            ></div>
          </div>

          <Button
            variant="slim"
            type="submit"
            disabled={loading}
            onClick={() => handleOAuthSignIn("github")}
          >
            <GitHub />
            <span className="ml-2">Continue with GitHub</span>
          </Button>
        </div>
      </div>
    );

  return (
    <div className="m-6">
      <LoadingDots />
    </div>
  );
};

export default SignIn;
