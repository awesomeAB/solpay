import { FC } from "react";
import c from "classnames";

interface Props {
  className?: string;
}

const Text: FC<Props> = ({ children, className }) => {
  return <p className={c("font-solpay text-gray-800 dark:text-snow", className)}>{children}</p>;
};

export default Text;
