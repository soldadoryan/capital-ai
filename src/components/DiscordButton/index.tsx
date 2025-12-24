"use client";

import { signIn } from "next-auth/react";
import { RiDiscordFill } from "react-icons/ri";

export const DiscordButton = () => {
  return (
    <button
      onClick={() => signIn("discord")}
      className="bg-[#585ad7] text-white font-bold uppercase px-4 py-2 rounded mt-4 flex gap-2 items-center hover:bg-[#333182] transition-colors cursor-pointer"
    >
      <RiDiscordFill /> Logar Com Discord
    </button>
  );
};
