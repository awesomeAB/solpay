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
        <p className="text-zinc-300">{description}</p>
        {children}
      </div>
      <div className="p-4 border-t border-zinc-700 bg-zinc-900 text-zinc-500 rounded-b-md">
        {footer}
      </div>
    </div>
  );
}

export default function Account() {
  const [isOpen, setIsOpen] = useState<boolean>(false);

  const [loading, setLoading] = useState(false);
  const router = useRouter();
  const { userLoaded, user, session, userDetails, subscription } = useUser();
  // const { publicKey, disconnect } = useWallet();
  const publicKey = "a";
  useEffect(() => {
    if (!user) router.replace("/signin");
  }, [user]);

  const redirectToCustomerPortal = async () => {
    setLoading(true);
    try {
      const { url, error } = await postData({
        url: "/api/create-portal-link",
        token: session.access_token,
      });
      window.location.assign(url);
    } catch (error) {
      if (error) return alert((error as Error).message);
    }
    setLoading(false);
  };

  const subscriptionName =
    subscription && subscription?.prices?.products?.[0]?.name;
  const subscriptionPrice =
    subscription &&
    new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: subscription?.prices?.currency,
      minimumFractionDigits: 0,
    }).format((subscription?.prices?.unit_amount || 0) / 100);

  return (
    <section className="mb-32 bg-snow dark:bg-dark">
      <div className="max-w-6xl px-4 pt-8 pb-8 mx-auto sm:pt-24 sm:px-6 lg:px-8">
        <div className="sm:flex sm:flex-col sm:align-center">
          <h1 className="text-4xl font-extrabold text-gray-600 dark:text-snow sm:text-center sm:text-6xl">
            Account
          </h1>
        </div>
      </div>
      <div className="p-4">
        <Card
          title="Your Solana Account"
          // description={`Please connect using your Solana wallet to continue.`}
          footer={
            <div className="flex flex-col items-start justify-between sm:flex-row sm:items-center">
              <p className="pb-4 sm:pb-0">
                Please connect using your Solana wallet to continue.
              </p>
              <Button
                variant="slim"
                loading={loading}
                disabled={loading}
                onClick={() => setIsOpen(true)}
              >
                Connect Wallet
              </Button>
            </div>
          }
        >
          <div className="mt-8 mb-4 text-xl font-semibold">
            {publicKey && <Text>{publicKey}</Text>}
          </div>
        </Card>
        <Card
          title="Your Name"
          description="Please enter your full name, or a display name you are comfortable with."
          footer={<p>Please use 64 characters at maximum.</p>}
        >
          <div className="mt-8 mb-4 text-xl font-semibold">
            {userDetails ? (
              `${userDetails?.full_name ?? ""}`
            ) : (
              <div className="h-8 mb-6">
                <LoadingDots />
              </div>
            )}
          </div>
        </Card>
        <Card
          title="Your Email"
          description="Please enter the email address you want to use to login."
          footer={<p>We will email you to verify the change.</p>}
        >
          <p className="mt-8 mb-4 text-xl text-dark dark:text-white font-semibold">
            {user ? user.email : undefined}
          </p>
        </Card>
      </div>
      <WalletConnectModal isOpen={isOpen} setIsOpen={setIsOpen} showDemo />
    </section>
  );
}
