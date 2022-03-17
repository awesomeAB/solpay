import { useRouter } from "next/router";
import React, { useEffect, useState } from "react";
import { getIndividualPayment } from "utils/supabase-client";
import PayPage from "components/Pages/PayPage";
import LoadingDots from "components/ui/LoadingDots";

const Pay = () => {
  const router = useRouter();
  const { id } = router.query;
  console.log(id);

  const [url, setUrl] = useState<string>("");
  const [isUrlFetched, setIsUrlFetched] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      const data = await getIndividualPayment(id);
      if (data && data.length > 0) {
        setUrl(data[0]?.url);
        setIsUrlFetched(true);
      } else {
        setError("Invalid URL");
      }
    };
    fetchData();
  }, [id]);

  return (
    <div className="flex items-center justify-center pt-32">
      {isUrlFetched ? (
        <PayPage url={url} />
      ) : error ? (
        <span className="text-lg text-red-600">Invalid reference</span>
      ) : (
        <LoadingDots />
      )}
    </div>
  );
};

export default Pay;
