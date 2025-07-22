'use server'

import { db } from "@/lib/prisma";
import { GoogleGenerativeAI } from "@google/generative-ai";
import { getCurrentUser } from "./auth";

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

export async function generateCoverLetter(data) {
  const user = await getCurrentUser(); // 🔁 replaced auth
  if (!user) throw new Error("Unauthorized");

  const fullUser = await db.user.findUnique({
    where: { id: user.id },
    include: {
      industryInsight: true
    }
  });

  if (!fullUser) throw new Error("User not found");

  const prompt = `
    Write a professional cover letter for a ${data.jobTitle} position at ${data.companyName}.
    
    About the candidate:
    - Industry: ${fullUser.industry}
    - Years of Experience: ${fullUser.experience}
    - Skills: ${fullUser.skills?.join(", ")}
    - Professional Background: ${fullUser.bio}
    
    Job Description:
    ${data.jobDescription}
    
    Requirements:
    1. Use a professional, enthusiastic tone
    2. Highlight relevant skills and experience
    3. Show understanding of the company's needs
    4. Keep it concise (max 400 words)
    5. Use proper business letter formatting in markdown
    6. Include specific examples of achievements
    7. Relate candidate's background to job requirements
    
    Format the letter in markdown.
  `;

  try {
    const result = await model.generateContent(prompt);
    const content = result.response.text().trim();

    const coverLetter = await db.coverLetter.create({
      data: {
        userId: fullUser.id,
        content,
        jobDescription: data.jobDescription,
        companyName: data.companyName,
        jobTitle: data.jobTitle,
        status: 'completed'
      }
    });
    // console.log(coverLetter);
    return coverLetter;
  } catch (error) {
    console.error("Error generating cover letter:", error.message);
    throw new Error("Failed to generate cover letter");
  }
}

export async function getCoverLetters() {
  const user = await getCurrentUser(); // 🔁 replaced auth
  if (!user) throw new Error("Unauthorized");

  return await db.coverLetter.findMany({
    where: {
      userId: user.id,
    },
    orderBy: {
      createdAt: "desc",
    },
  });
}

export async function deleteCoverLetter(id) {
  const user = await getCurrentUser(); // 🔁 replaced auth
  if (!user) throw new Error("Unauthorized");

  const deleted = await db.coverLetter.delete({
    where: {
      id,
      userId: user.id
    }
  });
  return deleted;
}

export async function getCoverLetter(id) {
  const user = await getCurrentUser(); // 🔁 replaced auth
  if (!user) throw new Error("Unauthorized");

  const letter = await db.coverLetter.findUnique({
    where: {
      id,
      userId: user.id
    }
  });
  return letter;
}
