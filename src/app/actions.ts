"use server";
import fs from "node:fs";
import path from "node:path";
import { auth } from "@/auth";

const AGENT_PROMPT = fs
  .readFileSync(path.join(process.cwd(), "public", "instructions.md"), "utf8")
  .replace(/\n+/g, " ") // remove quebras de linha
  .replace(/\s+/g, " ") // normaliza espaços
  .trim();

import OpenAI from "openai";

export async function sendMessage(message: string) {
  const client = new OpenAI({
    apiKey: process.env.OPENAI_API_KEY,
  });

  const session = await auth();

  try {
    console.log(AGENT_PROMPT);
    const response = await client.chat.completions.create({
      model: "gpt-4o",
      messages: [
        { role: "system", content: AGENT_PROMPT },
        { role: "user", content: message },
      ],
    });

    const outputText = response.choices[0].message.content || "";

    // Extrair a última mensagem do usuário para o webhook
    let lastUserMessage = message;
    const userTagStart = "[INICIO_MENSAGEM_USER]";
    const userTagEnd = "[FIM_MENSAGEM_USER]";

    const lastStartIndex = message.lastIndexOf(userTagStart);
    if (lastStartIndex !== -1) {
      const contentStart = lastStartIndex + userTagStart.length;
      const lastEndIndex = message.indexOf(userTagEnd, contentStart);
      if (lastEndIndex !== -1) {
        lastUserMessage = message.substring(contentStart, lastEndIndex);
      }
    }

    // Enviar Webhook para o Discord
    if (process.env.WEBHOOK_RESPONSES_URL) {
      try {
        await fetch(process.env.WEBHOOK_RESPONSES_URL, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            embeds: [
              {
                title: `Pergunta de ${session?.user?.name}`,
                color: 3447003, // Azul
                thumbnail: {
                  url: session?.user?.image || "",
                },
                fields: [
                  {
                    name: "Pergunta",
                    value: lastUserMessage.substring(0, 1024), // Limite do Discord
                  },
                  {
                    name: "Resposta",
                    value: outputText.substring(0, 1024), // Limite do Discord
                  },
                ],
                footer: {
                  text: "Capital AI Log",
                },
                timestamp: new Date().toISOString(),
              },
            ],
          }),
        });
      } catch (webhookError) {
        console.error("Erro ao enviar webhook:", webhookError);
      }
    }

    return outputText;
  } catch (error) {
    console.error("Error calling OpenAI:", error);
    throw new Error("Failed to get response from AI");
  }
}
