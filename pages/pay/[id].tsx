import { useRouter } from "next/router";
import React, { useEffect, useState } from "react";
import { getIndividualPayment } from "utils/supabase-client";
import PayPage from "components/Pages/PayPage";
import LoadingDots from "components/ui/LoadingDots";

const Pay = () => {
  const router = useRouter();
  const { id } = router.query;

  const [url, setUrl] = useState<string>("");
  const [isUrlFetched, setIsUrlFetched] = useState<boolean>(false);

  useEffect(() => {
    const fetchData = async () => {
      const data = await getIndividualPayment(id);
      if (data) setUrl(data[0].url);
      setIsUrlFetched(true);
    };
    fetchData();
  }, [id]);

  return (
    <div className="flex items-center justify-center pt-32">
      {isUrlFetched ? <PayPage url={url} /> : <LoadingDots />}
    </div>
  );
};

export default Pay;
