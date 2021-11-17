import { FC } from "react";
import Text from "components/Text";
import cn from "classnames";

interface Props {
  label: string;
}

const Button: FC<Props> = ({ label }) => {
  return (
    <div className="relative group">
      <div className="absolute inset-0.5 opacity-75 bg-gradient-to-r from-pink-600 to-purple-600 rounded-xl filter blur-lg animate-tilt group-hover:opacity-100 transition duration-200" />
      <button className="relative px-8 py-4 bg-dark rounded-xl leading-none flex items-center">
        <i className="ri-wallet-3-line text-2xl text-pink-600 pr-6" />
        <span className="text-primary pr-6">{label}</span>
        <span className="text-2xl text-indigo-100">&rarr;</span>
      </button>
    </div>
  );
};

export default Button;
