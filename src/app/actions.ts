"use server";
import fs from "node:fs";
import path from "node:path";

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

  try {
    console.log(AGENT_PROMPT);
    const response = await client.responses.create({
      model: "gpt-4o",
      instructions: AGENT_PROMPT,
      input: message,
      tools: [
        {
          type: "file_search",
          vector_store_ids: [process.env.OPENAI_VECTOR_STORE_ID!],
        },
      ],
    });

    return response.output_text;
  } catch (error) {
    console.error("Error calling OpenAI:", error);
    throw new Error("Failed to get response from AI");
  }
}
