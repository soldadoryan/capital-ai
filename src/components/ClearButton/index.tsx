"use client";
import { IconButton } from "../IconButton";
import { FaTrashAlt } from "react-icons/fa";

export const ClearButton = () => {
  return (
    <IconButton
      onClick={() => {
        window.location.reload();
      }}
    >
      <FaTrashAlt />
      Limpar Chat
    </IconButton>
  );
};
