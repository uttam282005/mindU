
// app/api/chatbot/route.ts
import { groq } from "@/lib/groq";
import { NextRequest, NextResponse } from "next/server";
// import { GoogleGenerativeAI } from "@google/generative-ai";

// export const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY!);
// console.log(process.env.NEXT_PUBLIC_GEMINI_API_KEY!)
// export const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

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

    // const result = await model.generateContent(query);
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
      model: "meta-llama/llama-4-scout-17b-16e-instruct",
    });
    return NextResponse.json({
      response: chatCompletion.choices[0]?.message?.content || "",
    }, { status: 200 });
    // return NextResponse.json({
    //   response: result.response.text()
    // }, { status: 200 })
  } catch (error) {
    console.error("Error fetching LLM response:", error);
    return NextResponse.json({ error: "Failed to get response from LLM" }, { status: 500 });
  }
}

export async function OPTIONS() {
  // Allow POST method only
  return NextResponse.json({}, { status: 204, headers: { Allow: 'POST' } });
}

