import { getCurrentUser } from "@/actions/auth";
import Agent from "../_components/agent";

const InterviewPage = async () => {

  const user = await getCurrentUser();
  // console.log("user", user);
  

  return (
    <div className="space-y-8 px-6 py-4">
      <h1 className="text-4xl md:text-5xl font-bold gradient-title text-center">
        Interview Generation
      </h1>
      <Agent
      userName={user?.name}
      userId={user?.id}
      // profileImage={user?.profileURL}
      type="generate"
      />
    </div>
  );
};

export default InterviewPage;
