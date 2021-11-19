import { FC, ReactElement } from "react";

import Text from "components/Text";
import cn from "classnames";

interface Props {
  label: string;
  onClick: () => void;
  leftIcon?: string;
  type: "positive" | "negative" | "neutral";
}

const borderColor = {
  positive: "border-solanaGreen hover:border-green-400",
  negative: "border-red-400 hover:border-red-500",
  neutral: "border",
};
const textColor = {
  positive: "text-green-500 group-hover:text-green-400",
  negative: "text-red-400 group-hover:text-red-500",
  neutral: "",
};

const Button: FC<Props> = ({ label, onClick, leftIcon, type }) => {
  return (
    <button
      onClick={onClick}
      className={cn(
        "flex justify-center w-full px-4 py-3 my-2 border cursor-pointer group sm:px-12 bg-dark rounded-2xl bg-black-100",
        borderColor[type],
      )}
    >
      <Text color={textColor[type]}>{label}</Text>
    </button>
  );
};

export default Button;
