import { GoogleGenAI, GenerateContentParameters } from "@google/genai";

import { NextResponse } from "next/server";

export async function POST(request: Request) {
  try {
    const ai = new GoogleGenAI({
      apiKey: process.env.NEXT_PUBLIC_GEMINI_API_KEY,
    });

    const { prompt } = (await request.json()) as { prompt: string };

    if (!prompt) {
      return NextResponse.json(
        {
          message: "Prompt is required",
        },
        { status: 400 }
      );
    }

    const result = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: prompt,
      tools: [{ googleSearch: {} }],
    } as GenerateContentParameters);

    const text = result.text;

    return NextResponse.json(
      {
        text,
      },
      { status: 200 }
    );
  } catch (error) {
    return NextResponse.json(
      {
        message: "An error occurred while communicating with the AI.",
        error: (error as Error).message,
      },
      { status: 500 }
    );
  }
}
