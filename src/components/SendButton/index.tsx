import { LuSendHorizontal } from "react-icons/lu";

export type SendButtonProps = React.ButtonHTMLAttributes<HTMLButtonElement> & {
  loading?: boolean;
};

export const SendButton = ({ children, loading, ...rest }: SendButtonProps) => {
  return (
    <button
      className="w-12 bg-gray-900/50 border border-gray-900 hover:bg-gray-900 rounded flex justify-center items-center transition-colors text-white text-xl cursor-pointer disabled:opacity-10"
      disabled={loading}
      {...rest}
    >
      <LuSendHorizontal />
    </button>
  );
};
