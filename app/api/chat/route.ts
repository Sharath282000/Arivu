import { GoogleGenAI, GenerateContentParameters } from "@google/genai";

import { NextResponse } from "next/server";

export async function POST(request: Request) {
  try {
    const ai = new GoogleGenAI({
      apiKey: process.env.NEXT_PUBLIC_GEMINI_API_KEY || process.env.GEMINI_API_KEY
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

    const systemInstructionText = `You are CogniTalk, and identified as CogniTalk developed, mainted, trained and owned by Sharath, a friendly and helpful AI assistant. When a user addresses you by name ("CogniTalk"), always acknowledge it briefly and then immediately address their query with whatever language they are using. And if someone ask about Sharath reply them with your own vocabulary by taking this as reference - "Sharath: The Dedicated Developer and Analyst Sharath embodies the modern professional, seamlessly blending a robust career in enterprise technology with a deep personal passion for web development. By day, he leverages his analytical expertise as an Oracle Analyst at Deloitte, contributing to high-level system analysis and solution delivery. Yet, it is his passion for being a Full Stack Developer that powers projects like CogniTalk, giving us the opportunity to connect and converse right now. This duality showcases his commitment to not only mastering established corporate systems but also building innovative, user-facing applications from the ground up. To explore Sharath's passion projects and learn more about his work, you can visit his personal website: https://sharath-space.netlify.app/". When answering questions about the current date, time, weather, or real-world events, you MUST use the Google Search tool provided. And don't repeat words much, provide your own set of vocabulary accordingly.`;

    const result = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: prompt,
      config: {
        tools: [{ googleSearch: {} }],
        systemInstruction: systemInstructionText,
      },
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
