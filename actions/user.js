"use server";

import { db } from "@/lib/prisma";
import { revalidatePath } from "next/cache";
import { generateAIInsights } from "./dashboard";
import { getCurrentUser } from "./auth";

// ✅ Update User with IndustryInsight
export async function updateUser(data) {
  const user = await getCurrentUser(); 
  if (!user)
  { res.json ({ error: "Unauthorized" })}

  try {
    const result = await db.$transaction(
      async (tx) => {
        let industryInsight = await tx.industryInsight.findUnique({
          where: { industry: data.industry },
        });

        if (!industryInsight) {
          const insights = await generateAIInsights(data.industry);

          industryInsight = await db.industryInsight.create({
            data: {
              industry: data.industry,
              ...insights,
              nextUpdate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
            },
          });
        }

        const updatedUser = await tx.user.update({
          where: { id: user.id },
          data: {
            industry: data.industry,
            experience: data.experience,
            bio: data.bio,
            skills: data.skills,
          },
        });

        return { updatedUser, industryInsight };
      },
      // { timeout: 10000 }
    );

    revalidatePath("/");
    return result.updatedUser; // ✅ FIXED
  } catch (error) {
    console.error("Error updating user and industry:", error.message);
    throw new Error("Failed to update profile");
  }
}

// ✅ Check if user is onboarded
export async function getUserOnboardingStatus() {
  const user = await getCurrentUser();
  if (!user) throw new Error("Unauthorized");

  try {
    const dbUser = await db.user.findUnique({
      where: { id: user.id },
      select: { industry: true },
    });

    return {
      isOnboarded: !!dbUser?.industry,
    };
  } catch (error) {
    console.error("Error checking onboarding status:", error);
    return { isOnboarded: false }; // 👈 prevent app break on failure
  }
}

