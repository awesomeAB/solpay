import { useRouter } from "next/router";
import { useState, useEffect, ReactNode } from "react";

import LoadingDots from "components/ui/LoadingDots";
import Button from "components/ui/Button";
import { useUser } from "utils/useUser";
import { postData } from "utils/helpers";
import { WalletConnectModal, Text } from "components";
import { useWallet } from "@solana/wallet-adapter-react";
interface Props {
  title: string;
  description?: string;
  footer?: ReactNode;
  children: ReactNode;
}

function Card({ title, description, footer, children }: Props) {
  return (
    <div className="w-full max-w-3xl m-auto my-8 border border-zinc-700 p rounded-md">
      <div className="px-5 py-4">
        <h3 className="mb-1 text-2xl font-medium text-dark dark:text-white">
          {title}
        </h3>
        <Text>{description}</Text>
        {children}
      </div>
      <div className="p-4 border-t border-zinc-700 bg-zinc-200 dark:bg-zinc-900 text-zinc-500 rounded-b-md">
        {footer}
      </div>
    </div>
  );
}

export default function Account() {
  const [isOpen, setIsOpen] = useState<boolean>(false);

  const [loading, setLoading] = useState(false);
  const router = useRouter();
  const { userLoaded, user, session, userDetails, signOut } = useUser();
  const wallet = useWallet();

  useEffect(() => {
    if (!user) router.replace("/signin");
  }, [user]);

  return (
    <section className="h-screen bg-white dark:bg-dark">
      <div className="max-w-6xl px-4 pt-8 pb-8 mx-auto sm:pt-24 sm:px-6 lg:px-8">
        <div className="sm:flex sm:flex-col sm:align-center">
          <h1 className="text-4xl font-extrabold text-gray-600 dark:text-snow sm:text-center sm:text-6xl">
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
                {wallet.publicKey
                  ? "Please contact support if you want to update the Merchant Wallet*"
                  : "Please connect using your Solana wallet to continue."}
              </p>
              <Button
                variant="slim"
                disabled={!!wallet.publicKey}
                onClick={() => setIsOpen(true)}
              >
                Connect Wallet
              </Button>
            </div>
          }
        >
          <div className="mt-8 mb-4 text-xl font-semibold">
            {wallet.publicKey ? (
              <Text color="text-green-400">{wallet.publicKey.toBase58()}</Text>
            ) : (
              <Text color="text-red-300">Wallet not connected.</Text>
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