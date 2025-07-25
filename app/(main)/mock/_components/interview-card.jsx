import dayjs from "dayjs";
import Link from "next/link";
import Image from "next/image";

import { DisplayTechIcons } from "@/components/display";
import { getRandomInterviewCover } from "@/lib/data";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Calendar, Star } from "lucide-react";
import { Badge } from "@/components/ui/badge";

const InterviewCard = async ({
  interviewId,
  userId,
  role,
  type,
  techstack,
  createdAt,
}) => {
  const feedback = null; // Replace with actual feedback fetch logic

  const normalizedType = /mix/gi.test(type) ? "Mixed" : type;

  return (
    <Card className="relative bg-zinc-950 text-white w-[360px] max-sm:w-full shadow-md hover:bg-zinc-900 transition-colors rounded-2xl overflow-hidden border border-zinc-800">
      {/* Badge */}
      <Badge className="absolute top-3 right-3 px-3 py-1 rounded-full text-xs font-medium bg-zinc-800 text-white">
        {normalizedType}
      </Badge>

      <CardHeader className="flex flex-col items-center text-center pb-0">
        <Image
          src={getRandomInterviewCover()}
          alt="cover"
          width={90}
          height={90}
          className="rounded-full object-cover size-[90px] border border-zinc-700"
        />
        <CardTitle className="mt-4 text-lg capitalize">
          {role} Interview
        </CardTitle>
        <CardDescription className="text-white/60 mt-1 text-sm">
          <div className="flex items-center justify-center gap-4 mt-2">
            <div className="flex items-center gap-1">
              {/* <Image src="/calendar.svg" width={20} height={20} alt="calendar" /> */}
              <Calendar className="w-4 h-4" />
              <span>21st Jan 2025</span>
            </div>
            <div className="flex items-center gap-1">
              {/* <Image src="/star.svg" width={20} height={20} alt="star" /> */}
              <Star className="w-4 h-4" />
              <span>{feedback?.totalScore || "---"}/100</span>
            </div>
          </div>
        </CardDescription>
      </CardHeader>

      <div className="border-t border-zinc-800 my-4" />

      <CardContent className="space-y-4">
        <p className="text-sm text-muted-foreground line-clamp-2">
          {feedback?.finalAssessment ||
            "You haven't taken this interview yet. Take it now to improve your skills."}
        </p>

        <div className="flex items-center justify-between pt-4 border-t border-zinc-800">
          <DisplayTechIcons techStack={techstack} />

          <Button asChild className="btn-primary">
            <Link
              href={
                feedback
                  ? `/interview/${interviewId}/feedback`
                  : `/interview/start/${interviewId}`
              }
            >
              {feedback ? "Check Feedback" : "View Interview"}
            </Link>
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};

export default InterviewCard;
