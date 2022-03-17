import { Text } from "components";
import type { NextPage } from "next";
import Head from "next/head";
import { useUser } from "utils/useUser";
import { useEffect, useState } from "react";
import { useRouter } from "next/router";
import { Card } from "components";
import Button from "components/ui/Button";
import { usePayment } from "hooks/usePayment";
import enforceAuthenticated from "utils/enforce-authenticated";
import PaymentLink from "components/Payment";
import { useWallet } from "@solana/wallet-adapter-react";
import Table from "components/ui/Table";
import QRModal from "components/Payment/QRModal";
import { getPaymentDetails } from "utils/supabase-client";

const products = [
  {
    id: 1,
    name: "Payment Link",
    description:
      "Create a generic payment link with fixed or variable amount of SOL/USDC.",
    disable: false,
  },
  {
    id: 2,
    name: "Product Checkout",
    description: "Create a multi-use product checkout link with a fixed price.",
    disable: true,
  },
  {
    id: 3,
    name: "Subscription",
    description: "Create a subscription checkout link with a fixed price.",
    disable: true,
  },
];
const Dashboard: NextPage = () => {
  const { user } = useUser();
  const router = useRouter();
  const pay = usePayment();

  const [isPaymentModalOpen, setIsPaymentModalOpen] = useState<boolean>(false);
  const [generatedLinks, setGeneratedLinks] = useState<any>([]);
  const [paymentData, setPaymentData] = useState<any>([]);

  const [isQRModalOpen, setIsQRModalOpen] = useState<boolean>(false);
  const [localUrl, setLocalUrl] = useState<string | null>(null);

  const wallet = useWallet();

  useEffect(() => {
    if (!user) router.replace("/signin");
  }, [router, user]);

  useEffect(() => {
    if (user) {
      const fetchdata = async () => {
        try {
          const data = await getPaymentDetails(user);
          setPaymentData(data);
        } catch (error) {
          console.log(error);
        }
      };
      fetchdata();
    }
  }, [generatedLinks, user]);

  return (
    <section className="h-screen bg-white dark:bg-dark">
      <Head>
        <title>Solpay | Dashboard</title>
      </Head>
      <div className="pt-32">
        <div className="mt-24 space-y-4 px-4 sm:mt-16 sm:grid sm:grid-cols-2 sm:gap-6 sm:space-y-0 lg:mx-auto lg:max-w-4xl xl:mx-auto xl:max-w-6xl xl:grid-cols-3">
          {products.map((product) => {
            return (
              <div
                key={product.id}
                className={
                  "divide-y divide-zinc-600 rounded-lg bg-snow shadow-sm dark:bg-zinc-900"
                }
              >
                <div className="p-6">
                  <Text className="text-2xl font-semibold leading-6">
                    {product.name}
                  </Text>
                  <Text className="mt-4">{product.description}</Text>

                  <Button
                    variant="slim"
                    type="button"
                    disabled={product.disable}
                    loading={false}
                    // onClick={() => pay.generate()}
                    onClick={() => setIsPaymentModalOpen(true)}
                    className="mt-8 block w-full py-2 text-center text-sm font-semibold text-white hover:bg-zinc-900"
                  >
                    {product.disable ? "Coming Soon" : "Get Started"}
                  </Button>
                </div>
              </div>
            );
          })}
          <PaymentLink
            isOpen={isPaymentModalOpen}
            setIsOpen={setIsPaymentModalOpen}
            wallet={wallet}
            setGeneratedLinks={setGeneratedLinks}
            setIsQRModalOpen={setIsQRModalOpen}
            setLocalUrl={setLocalUrl}
          />
          {localUrl && (
            <QRModal
              isOpen={isQRModalOpen}
              setIsOpen={setIsQRModalOpen}
              url={localUrl}
            />
          )}
        </div>
      </div>
      <div className="mt-10 flex items-center justify-center">
        <Table
          paymentData={paymentData}
          isQRModalOpen={isQRModalOpen}
          setLocalUrl={setLocalUrl}
          setIsQRModalOpen={setIsQRModalOpen}
        />
      </div>
    </section>
  );
};

export default Dashboard;

//export const getServerSideProps = enforceAuthenticated();
