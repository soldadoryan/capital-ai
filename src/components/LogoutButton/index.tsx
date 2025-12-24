"use client";

import { signOut } from "next-auth/react";
import { FiLogOut } from "react-icons/fi";
import { IconButton } from "../IconButton";

export const LogoutButton = () => {
  return (
    <IconButton onClick={() => signOut()}>
      <FiLogOut /> Log Out
    </IconButton>
  );
};
