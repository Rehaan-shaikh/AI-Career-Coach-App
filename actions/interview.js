"use server";

import { db } from "@/lib/prisma";
import { GoogleGenerativeAI } from "@google/generative-ai";
import { getCurrentUser } from "./auth"; // 👈 custom user getter

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

export async function generateQuiz() {
  const user = await getCurrentUser(); 
  if (!user) throw new Error("Unauthorized");

  const fullUser = await db.user.findUnique({
    where: { id: user.id },
    select: {
      industry: true,
      skills: true,
    },
  });

  if (!fullUser) throw new Error("User not found");

  const prompt = `
    Generate 10 technical interview questions for a ${fullUser.industry} professional${
    fullUser.skills?.length ? ` with expertise in ${fullUser.skills.join(", ")}` : ""
  }.
    
    Each question should be multiple choice with 4 options.
    
    Return the response in this JSON format only, no additional text:
    {
      "questions": [
        {
          "question": "string",
          "options": ["string", "string", "string", "string"],
          "correctAnswer": "string",
          "explanation": "string"
        }
      ]
    }
  `;

  try {
    const result = await model.generateContent(prompt);
    const response = result.response;
    const text = response.text();
    const cleanedText = text.replace(/```(?:json)?\n?/g, "").trim();
    const quiz = JSON.parse(cleanedText);
    return quiz.questions;
  } catch (error) {
    console.error("Error generating quiz:", error);
    throw new Error("Failed to generate quiz questions");
  }
}

export async function saveQuizResult(questions, answers, score) {
  const user = await getCurrentUser(); 
  if (!user) throw new Error("Unauthorized");

  const fullUser = await db.user.findUnique({
    where: { id: user.id },
  });

  if (!fullUser) throw new Error("User not found");

  //questions is obj with "question, options, correctAnswer, explanation" keys along with thier values
  const questionResults = questions.map((q, index) => ({
    question: q.question,
    answer: q.correctAnswer,
    userAnswer: answers[index],
    isCorrect: q.correctAnswer === answers[index],
    explanation: q.explanation,
  }));

  // Get wrong answers 
  const wrongAnswers = questionResults.filter((q) => !q.isCorrect);

  // Only generate improvement tips if there are wrong answers
  let improvementTip = null;
  if (wrongAnswers.length > 0) {
    const wrongQuestionsText = wrongAnswers.map((q) =>
      `Question: "${q.question}"\nCorrect Answer: "${q.answer}"\nUser Answer: "${q.userAnswer}"`
    ).join("\n\n");

    const improvementPrompt = `
      The user got the following ${fullUser.industry} technical interview questions wrong:

      ${wrongQuestionsText}

      Based on these mistakes, provide a concise, specific improvement tip.
      Focus on the knowledge gaps revealed by these wrong answers.
      Keep the response under 2 sentences and make it encouraging.
      Don't explicitly mention the mistakes, instead focus on what to learn/practice.
    `;

    try {
      const tipResult = await model.generateContent(improvementPrompt);
      improvementTip = tipResult.response.text().trim();
    } catch (error) {
      console.error("Error generating improvement tip:", error);
      // Continue without improvement tip if generation fails
    }
  }

  try {
    const assessment = await db.assessment.create({
      data: {
        userId: fullUser.id,
        quizScore: score,
        questions: questionResults,
        category: "Technical",   //by default
        improvementTip,
      },
    });

    return assessment;
  } catch (error) {
    console.error("Error saving quiz result:", error);
    throw new Error("Failed to save quiz result");
  }
}

export async function getAssessments() {
  const user = await getCurrentUser(); 
  if (!user) throw new Error("Unauthorized");

  const fullUser = await db.user.findUnique({
    where: { id: user.id },
  });

  if (!fullUser) throw new Error("User not found");

  try {
    const assessments = await db.assessment.findMany({
      where: {
        userId: fullUser.id,
      },
      orderBy: {
        createdAt: "asc",
      },
    });

    return assessments;
  } catch (error) {
    console.error("Error fetching assessments:", error);
    throw new Error("Failed to fetch assessments");
  }
}
