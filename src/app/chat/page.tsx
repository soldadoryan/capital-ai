import { redirect } from "next/navigation";
import { auth } from "@/auth";
import { FaTrashAlt } from "react-icons/fa";
import { IconButton } from "@/components/IconButton";
import { LogoutButton } from "@/components/LogoutButton";
import Agent from "@/components/Agent";
import Image from "next/image";

export default async function Chat() {
  const session = await auth();

  if (!session) {
    redirect("/");
  }

  return (
    <section className="relative w-full h-screen flex flex-col items-center overflow-hidden">
      <Image
        src="/bg.png"
        alt="Background"
        fill
        className="object-cover z-0"
        priority
      />
      <div className="z-10 absolute top-0 left-0 w-full h-full bg-gray-950/95" />
      <div className="z-10 w-full max-w-5xl h-full flex flex-col py-4 px-4 gap-4">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-4 md:gap-0">
          <div className="flex flex-col">
            <h1 className="text-white text-2xl md:text-3xl font-bold">
              Chat<span className="text-cyan-500">CPT</span>
            </h1>
            <p className="text-neutral-400 text-sm md:text-base">
              Bem-vindo ao ChatCPT! Como posso ajudar você hoje?
            </p>
          </div>
          <div className="flex gap-2 self-end md:self-auto">
            <LogoutButton />
          </div>
        </div>
        <Agent />
      </div>
    </section>
  );
}
