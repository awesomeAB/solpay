import { FC } from "react";

interface Props {
  label: string;
  onClick: () => void;
}

const Button: FC<Props> = ({ label, onClick }) => {
  return (
    <div className="group relative">
      <div className="absolute inset-0.5 rounded-xl bg-gradient-to-r from-solanaGreen to-purple-600 opacity-80 blur-lg filter transition duration-200 group-hover:opacity-100" />
      <button
        className="relative flex items-center rounded-2xl bg-white px-12 py-3 leading-none focus:outline-none dark:bg-dark"
        onClick={onClick}
      >
        <i className="ri-wallet-3-fill bg-gradient-to-br from-solanaGreen to-purple-600 bg-clip-text pr-6 text-3xl text-transparent" />
        <span className="pr-6 font-bold leading-6">{label}</span>
      </button>
    </div>
  );
};

export default Button;
