import { generateText } from "ai";
import { google } from "@ai-sdk/google";
import { db } from "@/lib/prisma";
import { getCurrentUser } from "@/actions/auth";

export async function POST(request) {
  const { type, role, level, techstack, amount, userId } = await request.json();

  try {
    const { text: questions } = await generateText({
      model: google("gemini-2.0-flash-001"),
      prompt: `Prepare questions for a job interview.
        The job role is ${role}.
        The job experience level is ${level}.
        The tech stack used in the job is: ${techstack}.
        The focus between behavioural and technical questions should lean towards: ${type}.
        The amount of questions required is: ${amount}.
        Please return only the questions, without any additional text.
        The questions are going to be read by a voice assistant so do not use "/" or "*" or any other special characters which might break the voice assistant.
        Return the questions formatted like this:
        ["Question 1", "Question 2", "Question 3"]`
    });

    let parsedQuestions;
    try {
      parsedQuestions = JSON.parse(questions);
      if (!Array.isArray(parsedQuestions)) throw new Error("Not an array");
    } catch (err) {
      console.error("Failed to parse questions:", err);
      return Response.json({ success: false, error: "Invalid questions format" }, { status: 500 });
    }

    await db.mockInterview.create({
      data: {
        role,
        type,
        level,
        techstack: techstack.split(",").map((t) => t.trim()),
        Questions: parsedQuestions, // ✅ use correct field
        userId: userId,
        createdAt: new Date(),
      },
    });

    return Response.json({ success: true }, { status: 200 });
  } catch (error) {
    console.error("POST /api/vapi/generate error:", error);
    return Response.json({ success: false, error: error.message }, { status: 500 });
  }
}

export async function GET() {
  return Response.json({ success: true, data: "Thank you!" }, { status: 200 });
}
