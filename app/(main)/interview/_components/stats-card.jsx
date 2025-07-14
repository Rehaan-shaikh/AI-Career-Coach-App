"use client";
import React from "react";
import { Brain, Target, Trophy } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

const StatsCards = (assessments) => {
  // console.log(assessments.assessments);
  const allAssesments = assessments.assessments;
  // console.log(allAssesments);

  let latestScore = 0;

  const getAvg = () => {
    if (!allAssesments?.length) return 0;
    let sum = 0;
    for (let i = 0; i < allAssesments.length; i++) {
      if (i == allAssesments.length - 1) {
        latestScore = allAssesments[i].quizScore;
      }
      sum = sum + allAssesments[i].quizScore;
    }
    return (sum / allAssesments.length).toFixed(1);
  };
  // console.log(getAvg());
  // console.log(latestScore);

  const getTotalQuestions = () => {
    if (!allAssesments?.length) return 0;
    let total = 0;
    for (let i = 0; i < allAssesments.length; i++) {
      total = total + allAssesments[i].questions.length;
    }
    return total;
  };
  // console.log(getTotalQuestions());

  return (
    <div className="grid gap-4 md:grid-cols-3">
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Average Score</CardTitle>
          <Trophy className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{getAvg() || 0}%</div>
          <p className="text-xs text-muted-foreground">
            Across all assessments
          </p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">
            Questions Practiced
          </CardTitle>
          <Brain className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{getTotalQuestions() || 0}</div>
          <p className="text-xs text-muted-foreground">Total questions</p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Latest Score</CardTitle>
          <Target className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">
            {latestScore.toFixed(1) || 0}%
          </div>
          <p className="text-xs text-muted-foreground">Most recent quiz</p>
        </CardContent>
      </Card>
    </div>
  );
};

export default StatsCards;
