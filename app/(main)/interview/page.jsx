import { getAssessments } from "@/actions/interview";
import StatsCards from "./_components/stats-card";
import PerformanceChart from "./_components/performance-chart";
import QuizList from "./_components/quiz-list";
import { redirect } from "next/navigation";
import { getUserOnboardingStatus } from "@/actions/user";

export default async function InterviewPrepPage() {
    const { isOnboarded } = await getUserOnboardingStatus();
  
    // If not onboarded, redirect to onboarding page
    // Skip this check if already on the onboarding page
    if (!isOnboarded) {
      redirect("/onboarding");
    }
  
  const assessments = await getAssessments();
  
  return (
    <div>
      <div className="flex items-center justify-between mb-5">
        <h1 className="text-6xl font-bold gradient-title">
          Interview Preparation
        </h1>
      </div>
      <div className="space-y-6">
        <StatsCards assessments={assessments} />
        <PerformanceChart assessments={assessments} />
        <QuizList assessments={assessments} />
      </div>
    </div>
  );
}
