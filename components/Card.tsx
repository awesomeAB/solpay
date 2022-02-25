import { FC, ReactNode } from "react";
import { Text } from "components";

interface Props {
  title: string;
  description?: string;
  footer?: ReactNode;
  children: ReactNode;
}

const Card: FC<Props> = ({ title, description, footer, children }: Props) => {
  return (
    <div className="p m-auto my-8 w-full max-w-3xl rounded-md border border-zinc-700">
      <div className="px-5 py-4">
        <h3 className="mb-1 text-2xl font-medium text-dark dark:text-white">
          {title}
        </h3>
        <Text>{description}</Text>
        {children}
      </div>
      <div className="rounded-b-md border-t border-zinc-700 bg-zinc-200 p-4 text-zinc-500 dark:bg-zinc-900">
        {footer}
      </div>
    </div>
  );
};

export default Card;
