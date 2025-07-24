import { getResume } from "@/actions/resume";
import ResumeBuilder from "./_components/resume-builder";

export default async function ResumePage() {
  const resume = await getResume();
  // if(resume.length){
  //   return <div  className="text-center py-10 text-muted"> ypu dont have reusme to render</div>
  // } 

  // if (!resume) {
  //   // Optional: redirect to login or show message
  //   return <p className="text-center py-10 text-muted">Please log in to view your resume.</p>;
  // }

  return (
    <div className="container mx-auto py-6">
      <ResumeBuilder initialContent={resume?.content} />
    </div>
  );
}

