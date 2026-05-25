import { NextRequest, NextResponse } from "next/server";
import { geminiModel, SYSTEM_PROMPT } from "@/lib/gemini";

export async function POST(req: NextRequest) {
  try {
    const { messages } = await req.json();

    if (!process.env.GEMINI_API_KEY) {
      return NextResponse.json(
        {
          error: "GEMINI_API_KEY tidak ditemukan. Tambahkan di file .env.local",
        },
        { status: 500 },
      );
    }

    // Build chat history for Gemini (exclude system prompt injection)
    const history = messages
      .slice(0, -1)
      .map((m: { role: string; content: string }) => ({
        role: m.role === "user" ? "user" : "model",
        parts: [{ text: m.content }],
      }));

    const lastMessage = messages[messages.length - 1].content;

    const chat = geminiModel.startChat({
      history: [
        {
          role: "user",
          parts: [{ text: "Halo, siapakah kamu?" }],
        },
        {
          role: "model",
          parts: [
            {
              text:
                SYSTEM_PROMPT +
                "\n\nHalo! Aku MindCheck, teman curhat harianmu. Aku di sini untuk mendengarkan dan mendukungmu. Bagaimana perasaanmu hari ini? 💚",
            },
          ],
        },
        ...history,
      ],
    });

    const result = await chat.sendMessage(lastMessage);
    const response = await result.response;
    const text = response.text();

    return NextResponse.json({ text });
  } catch (error: unknown) {
    const msg = error instanceof Error ? error.message : String(error);
    console.error("Gemini API error:", msg);
    return NextResponse.json({ error: msg }, { status: 500 });
  }
}
