import { FC } from "react";
import c from "classnames";

interface Props {
  className?: string;
  color?: string;
}

const Text: FC<Props> = ({
  children,
  className,
  color = "text-dark dark:text-snow",
}) => {
  return (
    <p className={c("font-solpay cursor-default", className, color)}>
      {children}
    </p>
  );
};

export default Text;
