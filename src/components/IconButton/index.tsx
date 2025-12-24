"use client";

export type IconButtonProps = React.ButtonHTMLAttributes<HTMLButtonElement>;

export const IconButton = ({ children, onClick, ...rest }: IconButtonProps) => {
  return (
    <button
      {...rest}
      onClick={onClick}
      className={`flex items-center bg-gray-900/50 border border-gray-900 text-sm text-neutral-400 font-semibold px-4 py-2 rounded mt-4 gap-2 hover:bg-gray-900 transition-colors cursor-pointer ${rest.className}`}
    >
      {children}
    </button>
  );
};
