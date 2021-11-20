import { useEffect, useState } from "react";

const URL = "https://serum-api.bonfida.com/orderbooks/SOLUSDT";

const REFRESH_MS = 2000;

export default function useMarketRate() {
  const [marketRate, setMarketRate] = useState(0);

  useEffect(() => {
    const fetchMarketRate = async () => {
      try {
        const response = await fetch(URL);
        const data = await response.json();

        if (data.success) {
          const { asks } = data.data;
          if (asks.length > 0) {
            setMarketRate(asks[0].price);
          }
        }
      } catch (e) {
        console.error(e);
      }
    };

    fetchMarketRate();

    const interval = setInterval(() => {
      fetchMarketRate();
    }, REFRESH_MS);

    return () => clearInterval(interval);
  }, []);

  return {
    marketRate,
  };
}
