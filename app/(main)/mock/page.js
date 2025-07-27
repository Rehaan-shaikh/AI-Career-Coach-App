import Link from "next/link";
import Image from "next/image";
import { Button } from "@/components/ui/button";

export default async function MockInterviewHomePage() {

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
    </div>
  );
}
