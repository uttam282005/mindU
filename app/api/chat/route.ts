
// app/api/chatbot/route.ts
import Groq from "groq-sdk";
import { NextRequest, NextResponse } from "next/server";

const groq = new Groq({ apiKey: process.env.GROQ_API_KEY! });

export async function GET() {
  return NextResponse.json({
    message: "HI"
  })
}
export async function POST(req: NextRequest) {
  try {
    const { query } = await req.json(); // Parse request body

    if (!query) {
      return NextResponse.json({ error: "Query is required" }, { status: 400 });
    }

    const chatCompletion = await groq.chat.completions.create({
      messages: [
        {
          role: "system",
          content: "You are a child mental health advisor",
        },
        {
          role: "user",
          content: query,
        },
      ],
      model: "llama-3.1-8b-instant",
    });

    return NextResponse.json({
      response: chatCompletion.choices[0]?.message?.content || "",
    }, { status: 200 });
  } catch (error) {
    console.error("Error fetching LLM response:", error);
    return NextResponse.json({ error: "Failed to get response from LLM" }, { status: 500 });
  }
}

export async function OPTIONS() {
  // Allow POST method only
  return NextResponse.json({}, { status: 204, headers: { Allow: 'POST' } });
}

