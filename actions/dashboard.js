"use server";

import { db } from "@/lib/prisma";
import { GoogleGenerativeAI } from "@google/generative-ai";
import { getCurrentUser } from "./auth"; // 👈 import your custom user helper

//initialize the Google Generative AI client
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
//selecting the model
const model = genAI.getGenerativeModel({ model: "gemini-2.5-flash" });

export async function generateAIInsights(industry) {
  //dynamic prompt creation
  const prompt = ` 
    Analyze the current state of the ${industry} industry and provide insights in ONLY the following JSON format without any additional notes or explanations:
    {
      "salaryRanges": [
        { "role": "string", "min": number, "max": number, "median": number, "location": "string" }
      ],
      "growthRate": number,
      "demandLevel": "High" | "Medium" | "Low",
      "topSkills": ["skill1", "skill2"],
      "marketOutlook": "Positive" | "Neutral" | "Negative",
      "keyTrends": ["trend1", "trend2"],
      "recommendedSkills": ["skill1", "skill2"]
    }

    IMPORTANT: Return ONLY the JSON. No additional text, notes, or markdown formatting.
    Include at least 5 common roles for salary ranges.
    Growth rate should be a percentage.
    Include at least 5 skills and trends.
  `;
  
  //call the model with the prompt using generateContent function
  const result = await model.generateContent(prompt);
  const response = result.response;
  const text = response.text();
  const cleanedText = text.replace(/```(?:json)?\n?/g, "").trim();

  return JSON.parse(cleanedText);
}

export async function getIndustryInsights() {
  const user = await getCurrentUser(); // 👈 use your token-based helper
  if (!user) throw new Error("Unauthorized");

  const fullUser = await db.user.findUnique({
    where: { id: user.id },
    include: {
      industryInsight: true,
    },
  });

  if (!fullUser) throw new Error("User not found");

  if (!fullUser.industryInsight) {
    const insights = await generateAIInsights(fullUser.industry);

    const industryInsight = await db.industryInsight.create({
      data: {
        industry: fullUser.industry,
        ...insights,
        nextUpdate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
      },
    });

    return industryInsight;
  }

  return fullUser.industryInsight;
}
