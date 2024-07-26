import { NextResponse } from "next/server";
import Groq from "groq-sdk";
import { z } from "zod";
import { zfd } from "zod-form-data";
import { LangObj } from "@/types/lang";

const groq = new Groq();

const schema = zfd.formData({
  audio: z.union([zfd.text(), zfd.file()]),
  config: z.string(),
});

export async function POST(req: Request) {
  if (req.method !== "POST") {
    return NextResponse.json({ error: "Method not allowed" }, { status: 405 });
  }

  try {
    console.time("transcribe " + req.headers.get("x-vercel-id") || "local");

    const { data, success } = schema.safeParse(await req.formData());
    if (!success) return new Response("Invalid request", { status: 400 });

    const transcript = await getTranscript(data.audio, JSON.parse(data.config));
    if (!transcript) return new Response("Invalid audio", { status: 400 });

    const translation = await translateText(
      transcript,
      JSON.parse(data.config)
    );

    return NextResponse.json({ translation });
  } catch (error) {
    console.error("Error in translation API:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

async function getTranscript(input: string | File, config: LangObj) {
  if (typeof input === "string") return input;

  try {
    const { text } = await groq.audio.transcriptions.create({
      file: input,
      model: "whisper-large-v3",
      temperature: 0.1,
      language: config.fromLanguage.symbol.toLowerCase(),
    });

    return text.trim() || null;
  } catch {
    return null;
  }
}

async function translateText(text: string, config: LangObj): Promise<string> {
  try {
    const chatCompletion = await groq.chat.completions.create({
      messages: [
        {
          role: "user",
          content: `Translate the given text from ${config.fromLanguage.englishName} language to ${config.toLanguage.englishName}: "${text}"
          Translated text in ${config.toLanguage.englishName}:-`,
        },
      ],
      model: "llama-3.1-70b-versatile",
      temperature: 0.7,
      max_tokens: 1024,
      top_p: 1,
      stream: true,
      stop: null,
    });

    let str = "";
    for await (const chunk of chatCompletion) {
      str = `${str} ${chunk.choices[0]?.delta?.content || ""}`;
    }
    return str;
  } catch (error) {
    console.error("Error in translation:", error);
    return "";
  }
}
