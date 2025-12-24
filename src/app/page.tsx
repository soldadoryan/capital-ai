import Image from "next/image";
import { DiscordButton } from "@/components/DiscordButton";

export default function Home() {
  return (
    <section className="relative flex w-full h-screen flex-col justify-center items-center gap-2 overflow-hidden">
      <Image
        src="/bg.png"
        alt="Background"
        fill
        className="object-cover z-0"
        priority
      />
      <div className="z-10 flex flex-col justify-center items-center gap-2 w-full h-screen bg-gray-950/95 relative">
        <div className="w-full bg-zinc-950/30 flex flex-col justify-center items-center py-10">
          <Image
            src="/logo.png"
            alt="Logo"
            width={150}
            height={150}
            className="w-32 h-32 md:w-[150px] md:h-[150px]"
          />
          <h1 className="text-3xl md:text-5xl font-bold text-white mb-6 text-center">
            Chat<span className="text-cyan-500">CPT</span>
          </h1>
          <DiscordButton />
          <span className="text-white absolute bottom-4 font-semibold text-xs md:text-sm tracking-wider text-center w-full">
            Desenvolvido por{" "}
            <a
              href="https://ryandrumond.com"
              target="_blank"
              className="text-cyan-500 hover:underline"
            >
              an4log
            </a>
          </span>
        </div>
      </div>
    </section>
  );
}
