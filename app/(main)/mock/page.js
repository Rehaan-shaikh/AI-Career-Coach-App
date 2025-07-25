import Link from "next/link";
import Image from "next/image";
import { Button } from "@/components/ui/button";

// import {
//   getInterviewsByUserId,
//   getLatestInterviews,
// } from "@/lib/actions/general.action";
import InterviewCard from "./_components/interview-card";
import { getCurrentUser } from "@/actions/auth";
import { dummyInterviews } from "@/lib/data";

export default async function MockInterviewHomePage() {
  const user = await getCurrentUser();

  //   const [userInterviews, allInterview] = await Promise.all([
  //     getInterviewsByUserId(user?.id),
  //     getLatestInterviews({ userId: user?.id }),
  //   ]);

  const userInterviews = dummyInterviews;
  const allInterview = dummyInterviews;

  const hasPastInterviews = userInterviews?.length > 0;
  const hasUpcomingInterviews = allInterview?.length > 0;

  return (
    <div className="container mx-auto py-6 space-y-10">
      {/* CTA Section */}
      <section className="relative mx-2 overflow-hidden rounded-xl bg-gray-900 shadow-lg">
        {/* Overlay */}
        <div className="absolute inset-0 bg-black bg-opacity-60 backdrop-blur-sm"></div>

        {/* Content */}
        <div className="relative z-10 px-6 py-12 sm:px-10 flex flex-col sm:flex-row items-center justify-between gap-10">
          {/* Text */}
          <div className="flex flex-col gap-6 max-w-2xl text-white">
            <h1 className="text-5xl md:text-6xl font-bold gradient-title">
              Get Interview-Ready with AI Practice
            </h1>
            <p className="text-lg text-gray-300">
              Practice real interview questions & get instant feedback
            </p>
            <Button
              asChild
              className="w-full max-w-xs sm:w-auto bg-white text-black hover:bg-gray-300 hover:scale-95 transition-all duration-200 ease-in-out"
            >
              <Link href="/mock/start">Start an Interview</Link>
            </Button>
          </div>

          {/* right-side image */}
          <div className="hidden sm:flex sm:justify-end sm:w-1/2">
            <Image
              src="/unnamed.png"
              alt="AI Mock Interview"
              width={600}
              height={600}
              className="rounded-lg object-cover w-full h-auto max-w-[600px] drop-shadow-xl transition-transform duration-300 hover:scale-105"
              priority
            />
          </div>
        </div>
      </section>

      {/* Past Interviews */}
      <section className="mx-2 rounded-xl bg-[#111111] border border-border shadow-md p-6 space-y-4">
        <h2 className="text-3xl md:text-4xl font-bold gradient-title text-white">
          Your Past Interviews
        </h2>

        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {hasPastInterviews ? (
            userInterviews.map((interview) => (
              <InterviewCard
                key={interview.id}
                userId={user?.id}
                interviewId={interview.id}
                role={interview.role}
                type={interview.type}
                techstack={interview.techstack}
                createdAt={interview.createdAt}
              />
            ))
          ) : (
            <p className="text-sm text-gray-400">
              You haven&apos;t taken any interviews yet.
            </p>
          )}
        </div>
      </section>

      {/* Suggested Interviews */}
      <section className="mx-2 rounded-xl bg-[#111111] border border-border shadow-md p-6 space-y-4">
        <h2 className="text-3xl md:text-4xl font-bold gradient-title text-white">
          Suggested Practice Interviews
        </h2>

        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {hasUpcomingInterviews ? (
            allInterview.map((interview) => (
              <InterviewCard
                key={interview.id}
                userId={user?.id}
                interviewId={interview.id}
                role={interview.role}
                type={interview.type}
                techstack={interview.techstack}
                createdAt={interview.createdAt}
              />
            ))
          ) : (
            <p className="text-sm text-gray-400">
              There are no interviews available at the moment.
            </p>
          )}
        </div>
      </section>
    </div>
  );
}
