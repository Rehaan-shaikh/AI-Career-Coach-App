"use server";

import { db } from "@/lib/prisma";
import { GoogleGenerativeAI } from "@google/generative-ai";
import { revalidatePath } from "next/cache";
import { getCurrentUser } from "./auth"; // ✅ your custom auth

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

export async function saveResume(content) {
  const user = await getCurrentUser();
  if (!user) throw new Error("Unauthorized");

  try {
    const resume = await db.resume.upsert({  //it updates the fiel if exist otherwise creates it
      where: {
        userId: user.id,
      },
      update: {
        content,
      },
      create: {
        userId: user.id,
        content,
      },
    });

    revalidatePath("/resume");
    return resume;
  } catch (error) {
    console.error("Error saving resume:", error);
    throw new Error("Failed to save resume");
  }
}

export async function getResume() {
  const user = await getCurrentUser();
  if (!user) throw new Error("Unauthorized");

  return await db.resume.findUnique({
    where: {
      userId: user.id,
    },
  });
}


export async function improveWithAI({ current, type }) {  //the type reffers to type of content u are improving ie. experience / skills / summery
  const user = await getCurrentUser();

  const userData = await db.user.findUnique({
    where: { id: user.id },
    include: {
      industryInsight: true,
    },
  });

  if (!userData) throw new Error("User not found");

  const prompt = `
    As an expert resume writer, improve the following ${type} description for a ${userData.industry} professional.
    Make it more impactful, quantifiable, and aligned with industry standards.
    Current content: "${current}"

    Requirements:
    1. Use action verbs
    2. Include metrics and results where possible
    3. Highlight relevant technical skills
    4. Keep it concise but detailed
    5. Focus on achievements over responsibilities
    6. Use industry-specific keywords

    Format the response as a single paragraph without any additional text or explanations.
  `;

  try {
    const result = await model.generateContent(prompt);
    const response = result.response;
    const improvedContent = response.text().trim();
    return improvedContent;
  } catch (error) {
    console.error("Error improving content:", error);
    throw new Error("Failed to improve content");
  }
}
