
import { NextRequest, NextResponse } from "next/server";
import { groq } from "@/lib/groq";

export async function GET() {
  return NextResponse.json({
    message: "HI",
  });
}

export async function POST(req: NextRequest) {
  try {
    const categories = await req.json(); // Parse request body
    console.log(categories);

    if (!categories || typeof categories !== 'object') {
      return NextResponse.json(
        { error: "Category-wise scores are required and must be an object" },
        { status: 400 }
      );
    }

    // Prepare the query to send to the LLM (Large Language Model)
    const chatCompletion = await groq.chat.completions.create({
      messages: [
        {
          role: "system",
          content: `You are a child mental health advisor. Respond only in JSON format. The format should be:
          {
            "action": "<action suggestions & string>",
            "feedback": "<overall feedback && string>",
            "tag": "<normal / needs help / critical>"
          }`,
        },
        {
          role: "user",
          content: `Based on the following category-wise scores: ${JSON.stringify(categories)}, provide feedback, actionable suggestions, and a tag (normal / needs help / critical) based on the severity.`,
        },
      ],
      model: "meta-llama/llama-4-scout-17b-16e-instruct", // Make sure the model exists and is configured correctly
    });

    // Log the LLM response for debugging purposes
    const llmResponse = chatCompletion.choices[0]?.message?.content;
    console.log(llmResponse);

    return NextResponse.json(
      {
        response: llmResponse || "No response received from LLM",
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error fetching LLM response:", error);
    return NextResponse.json(
      { error: "Failed to get response from LLM" },
      { status: 500 }
    );
  }
}

export async function OPTIONS() {
  // Allow only POST method
  return NextResponse.json({}, { status: 204, headers: { Allow: "POST" } });
}

