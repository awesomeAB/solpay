import { createQROptions } from "@solana/pay";
import QRCodeStyling from "@solana/qr-code-styling";
import React, { FC, useLayoutEffect, useMemo, useRef, useState } from "react";
import { useTheme } from "next-themes";

interface Props {
  url: string;
}

const MIN_WIDTH = 300;

export const QRCode: FC<Props> = ({ url }) => {
  const [size, setSize] = useState(() =>
    typeof window === "undefined"
      ? MIN_WIDTH
      : Math.min(window.screen.availWidth, MIN_WIDTH),
  );
  useLayoutEffect(() => {
    const listener = () =>
      setSize(Math.min(window.screen.availWidth, MIN_WIDTH));

    window.addEventListener("resize", listener);
    return () => window.removeEventListener("resize", listener);
  }, []);
  const { theme } = useTheme();
  const barcodeColor = theme === "light" ? "#2a2a2a" : "#ffffff";

  const options = useMemo(
    () => createQROptions(url, size, "transparent", barcodeColor),
    [url, size, barcodeColor],
  );

  const qr = useMemo(() => new QRCodeStyling(), []);
  useLayoutEffect(() => qr.update(options), [qr, options]);

  const ref = useRef<HTMLDivElement>(null);
  useLayoutEffect(() => {
    if (ref.current) {
      qr.append(ref.current);
    }
  }, [ref, qr]);

  return <div ref={ref} className="flex w-full justify-center" />;
};
