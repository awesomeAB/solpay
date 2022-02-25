import { useRouter } from "next/router";
import { useState, useEffect } from "react";

import LoadingDots from "components/ui/LoadingDots";
import Button from "components/ui/Button";
import { useUser } from "utils/useUser";
import { WalletConnectModal, Text, Card } from "components";
import { useWallet } from "@solana/wallet-adapter-react";
import Head from "next/head";
import { updateUserWallet } from "utils/supabase-client";
import sliceAddress from "utils/helpers";

export default function Account() {
  const [isOpen, setIsOpen] = useState<boolean>(false);

  const [loading, setLoading] = useState(false);
  const router = useRouter();
  const { userLoaded, user, userDetails, signOut } = useUser();
  const wallet = useWallet();
  const { publicKey } = wallet;

  useEffect(() => {
    if (!user) router.replace("/signin");
  }, [router, user]);

  useEffect(() => {
    if (publicKey && !userDetails.wallet) {
      setLoading(true);
      updateUserWallet(user, publicKey.toBase58())
        .then(() => setLoading(false))
        .catch((e) => {
          setLoading(false);
          console.error(e);
        });
    }
  }, [publicKey, userDetails, user]);
  const walletExists = !!userDetails?.wallet;
  return (
    <section className="h-screen bg-white dark:bg-dark">
      <Head>
        <title>Solpay | Account</title>
      </Head>
      <div className="mx-auto mt-8 max-w-6xl px-4 pt-16 pb-8 sm:px-6 sm:pt-24 lg:px-8">
        <div className="sm:align-center sm:flex sm:flex-col">
          <h1 className="text-2xl font-bold text-gray-600 dark:text-snow sm:text-center sm:text-4xl">
            Account
          </h1>
        </div>
      </div>
      <div className="p-4">
        <Card
          title="Merchant Wallet"
          description={"Your payments will be sent to this SOLANA wallet"}
          footer={
            <div className="flex flex-col items-start justify-between sm:flex-row sm:items-center">
              <p className="pb-4 sm:pb-0">
                {walletExists
                  ? "Wallet synced successfully."
                  : "Please connect using your Solana wallet to continue."}
              </p>
              {
                <Button
                  variant="slim"
                  disabled={walletExists || !userLoaded}
                  onClick={() => setIsOpen(true)}
                >
                  Connect Wallet
                </Button>
              }
            </div>
          }
        >
          <div className="mt-8 mb-4 text-xl font-semibold">
            {!loading && userLoaded ? (
              userDetails?.wallet ? (
                <Text color="text-green-400">
                  {sliceAddress(userDetails.wallet)}
                </Text>
              ) : (
                <Text color="text-red-300">Wallet not connected.</Text>
              )
            ) : (
              <LoadingDots />
            )}
          </div>
        </Card>

        <Card
          title="Account"
          description="You can set up a password or use a magic link to login."
          footer={
            <div className="flex flex-col items-start justify-between sm:flex-row sm:items-center">
              <p className="pb-4 sm:pb-0">
                You are currently on the FREE tier.
              </p>
              <Button variant="slim" onClick={() => signOut()}>
                Sign Out
              </Button>
            </div>
          }
        >
          <p className="mt-8 mb-4 text-xl font-semibold text-dark dark:text-white">
            {user ? user.email : undefined}
          </p>
        </Card>
      </div>

      <WalletConnectModal
        isOpen={isOpen}
        setIsOpen={setIsOpen}
        callback={() => setIsOpen(false)}
        wallet={wallet}
      />
    </section>
  );
}
