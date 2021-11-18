import { FC } from "react";

interface Props {
  label: string;
  onClick: () => void;
}

const Button: FC<Props> = ({ label, onClick }) => {
  return (
    <div className="relative group">
      <div className="absolute opacity-75 inset-0.5 bg-gradient-to-r from-solanaGreen to-purple-600 rounded-xl filter blur-lg group-hover:opacity-100 transition duration-200" />
      <button
        className="relative flex items-center px-8 py-4 leading-none focus:outline-none bg-dark rounded-xl"
        onClick={onClick}
      >
        <i className="pr-6 text-2xl text-solanaGreen ri-wallet-3-line" />
        <span className="pr-6 text-primary">{label}</span>
        <span className="text-2xl text-indigo-100">&rarr;</span>
      </button>
    </div>
  );
};

export default Button;
