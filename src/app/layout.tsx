import type { Metadata } from "next";
import { Ubuntu } from "next/font/google";
import { Providers } from "./providers";
import "./globals.css";

const ubuntu = Ubuntu({
  variable: "--font-ubuntu",
  weight: ["300", "400", "500", "700"],
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "ChatCPT - Ferramenta de Suporte",
  description: "by an4log",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="pt-br">
      <body className={`${ubuntu.variable} antialiased`}>
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
