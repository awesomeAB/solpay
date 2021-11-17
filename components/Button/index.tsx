import { FC, ReactElement } from "react";

import Text from "components/Text";
import cn from "classnames";

interface Props {
  label: string;
  onClick: () => void;
  leftIcon?: string;
}

const Button: FC<Props> = ({ label, onClick, leftIcon }) => {
  return (
    <button
      className="flex items-center px-8 py-4 leading-none focus:outline-none bg-gray-900 rounded-xl"
      onClick={onClick}
    >
      {leftIcon ? <i className={cn("text-2xl", leftIcon)} /> : null}
      <span className="px-6 text-primary">{label}</span>
      {leftIcon ? <i className={cn("text-2xl", leftIcon)} /> : null}
    </button>
  );
};

export default Button;
