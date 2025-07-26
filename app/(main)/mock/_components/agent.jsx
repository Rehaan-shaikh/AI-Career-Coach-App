"use client";

import Image from "next/image";
import { useRouter } from "next/navigation";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Phone } from "lucide-react";
import { useEffect, useState } from "react";
import { vapi } from "@/app/lib/vapi.sdk";

// import { cn } from "@/lib/utils"; // If you used 'cn' in your original TSX for styling, consider adding it back
// import { interviewer } from "@/constants"; // Uncomment if you enable the 'else' branch in handleCall
// import { createFeedback } from "@/lib/actions/general.action"; // Keep commented as per request

const CallStatus = {
  INACTIVE: "INACTIVE",
  CONNECTING: "CONNECTING",
  ACTIVE: "ACTIVE",
  FINISHED: "FINISHED",
};

const Agent = ({
  // These props are here in the signature but will be overridden by hardcoded values below,
  // reflecting your original JS code's behavior.
  // If you later decide to truly pass these as props, you would remove the hardcoded lines.
  // userName,
  // userId,
  // interviewId,
  // feedbackId,
  // type,
  // questions,
}) => {
  // --- Keeping these hardcoded as per your original JS code's structure ---
  const userName = "John Doe";
  const userId = "12345";
  const type = "generate"; // This will always make the Vapi call use the 'generate' path
  // const interviewId = "67890"; // Commented out, but was present in your original JS structure
  // const feedbackId = "abcde";   // Commented out, but was present in your original JS structure
  // const questions = ["What is your greatest strength?", "How do you handle stress?"]; // Commented out
  // ----------------------------------------------------------------------

  console.log(userName, userId, type); // Keep this log for visibility

  const router = useRouter(); // This was commented out in your original JS, but is needed.

  const [callStatus, setCallStatus] = useState(CallStatus.INACTIVE);
  const [messages, setMessages] = useState([]); // Array to store transcript messages
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [lastMessage, setLastMessage] = useState("");

  // Placeholder values for variables your Vapi workflow expects.
  // These are hardcoded *for now* to get the Vapi call to work
  // with the `variableValues` requirement from your Vapi dashboard.
  // You will need to replace these with dynamic values based on your app's needs.
  const interviewRole = "Frontend Developer";
  const interviewLevel = "Entry-level";
  const interviewAmount = "75000";
  const interviewTechstack = "JavaScript, React, CSS";


  // Effect hook for Vapi event listeners (call start, end, message, speech, error)
  useEffect(() => {
    const onCallStart = () => {
      console.log("Vapi Call Started");
      setCallStatus(CallStatus.ACTIVE);
    };

    const onCallEnd = () => {
      console.log("Vapi Call Ended");
      setCallStatus(CallStatus.FINISHED);
    };

    const onMessage = (message) => {
      console.log("Received message:", message);
      if (message.type === "transcript" && message.transcriptType === "final") {
        const newMessage = { role: message.role, content: message.transcript };
        setMessages((prev) => [...prev, newMessage]);
      }
    };

    const onSpeechStart = () => {
      console.log("Speech Start");
      setIsSpeaking(true);
    };

    const onSpeechEnd = () => {
      console.log("Speech End");
      setIsSpeaking(false);
    };

    const onError = (error) => {
      console.error("Vapi Error:", error);
      console.error("Detailed Vapi Error Object in onError:", JSON.stringify(error, null, 2));
      setCallStatus(CallStatus.INACTIVE); // Revert status on error
    };

    // Attach Vapi event listeners
    vapi.on("call-start", onCallStart);
    vapi.on("call-end", onCallEnd);
    vapi.on("message", onMessage);
    vapi.on("speech-start", onSpeechStart);
    vapi.on("speech-end", onSpeechEnd);
    vapi.on("error", onError);

    // Cleanup function: detach listeners when component unmounts
    return () => {
      vapi.off("call-start", onCallStart);
      vapi.off("call-end", onCallEnd);
      vapi.off("message", onMessage);
      vapi.off("speech-start", onSpeechStart);
      vapi.off("speech-end", onSpeechEnd);
      vapi.off("error", onError);
    };
  }, []); // Empty dependency array for listeners

  // Effect hook for updating last message and handling call finished state
  useEffect(() => {
    if (messages.length > 0) {
      setLastMessage(messages[messages.length - 1].content);
    }

    // Feedback generation logic is commented out as per your request
    /*
    const handleGenerateFeedback = async (currentMessages) => {
      // ... feedback logic here ...
    };
    */

    if (callStatus === CallStatus.FINISHED) {
      if (type === "generate") { // `type` is hardcoded as 'generate' here
        router.push("/");
      }
      /*
      // The `else` branch for feedback is commented out as requested.
      else {
        handleGenerateFeedback(messages);
      }
      */
    }
    // Updated dependency array:
    // `router` and `type` are included because they are used inside this effect.
    // If you uncomment feedback, `interviewId`, `userId`, `feedbackId` would also need to be here.
  }, [messages, callStatus, router, type]);


  // Function to handle starting the Vapi call
  const handleCall = async () => {
    const vapiWebToken = process.env.NEXT_PUBLIC_VAPI_WEB_TOKEN;
    const vapiWorkflowId = process.env.NEXT_PUBLIC_VAPI_WORKFLOW_ID;

    // Log the variables that will be used, including the hardcoded ones
    console.log("Attempting to start Vapi call...");
    console.log("VAPI Web Token (runtime read):", vapiWebToken);
    console.log("VAPI Workflow ID (runtime read):", vapiWorkflowId);
    console.log("Hardcoded User Name:", userName);
    console.log("Hardcoded User ID:", userId);
    console.log("Hardcoded Type:", type);
    console.log("Vapi Metadata (sending):", {
      username: userName,
      userid: userId,
      role: interviewRole,
      level: interviewLevel,
      amount: interviewAmount,
      techstack: interviewTechstack,
    });


    // Basic validation to ensure keys and hardcoded values are present
    if (!vapiWebToken || !vapiWorkflowId || !userName || !userId || !interviewRole || !interviewLevel || !interviewAmount || !interviewTechstack) {
      console.error("Missing required data for Vapi call: Environment variables or hardcoded user/workflow metadata are incomplete.");
      setCallStatus(CallStatus.INACTIVE);
      return;
    }

    setCallStatus(CallStatus.CONNECTING);

    try {
      if (type === "generate") {
        // This is the CRITICAL FIX:
        // Using the TS code's `vapi.start(workflowId, { variableValues: { ... } })` signature
        // to pass the required metadata from your Vapi workflow configuration.
        await vapi.start(vapiWorkflowId, {
          variableValues: {
            username: userName, // Using the hardcoded userName
            userid: userId,     // Using the hardcoded userId
            // Include all other variables your Vapi workflow expects from its 'Referenced Variables'
            role: interviewRole,
            level: interviewLevel,
            amount: interviewAmount,
            techstack: interviewTechstack,
          },
        });
        console.log("Vapi.start() called successfully (awaiting server response)...");
      }
      // The `else` branch for other `type` values (e.g., custom interview types)
      // remains commented out as it was in your original JS and per request.
      /*
      else {
        let formattedQuestions = "";
        if (questions) { // 'questions' would need to be passed as a prop if this path is active
          formattedQuestions = questions
            .map((question) => `- ${question}`)
            .join("\n");
        }
        await vapi.start(interviewer, { // 'interviewer' constant would need to be imported
          variableValues: {
            questions: formattedQuestions,
          },
        });
        console.warn("Vapi call for non-generate type is currently commented out.");
      }
      */
    } catch (err) {
      console.error("Failed to start Vapi call caught in handleCall:", err);
      console.error("Detailed Vapi Error Object:", JSON.stringify(err, null, 2));
      setCallStatus(CallStatus.INACTIVE);
    }
  };

  // Function to handle disconnecting the Vapi call
  const handleDisconnect = () => {
    setCallStatus(CallStatus.FINISHED);
    vapi.stop();
  };

  return (
    <div className="min-h-screen w-full bg-zinc-950 px-4 py-16 flex flex-col items-center">
      {/* Interview Cards */}
      <div className="flex flex-col md:flex-row justify-center gap-12 items-center mb-12 border border-zinc-800 bg-zinc-900/60 rounded-2xl p-8 shadow-inner">
        {/* AI Card */}
        <div className="bg-zinc-900 rounded-3xl border border-zinc-800 p-12 text-center w-96 shadow-2xl hover:shadow-3xl transition">
          <div className="relative w-32 h-32 mx-auto mb-6">
            <Image
              src="/unnamed(2).png" // Your current image path
              alt="AI Interviewer"
              fill
              className="rounded-full object-cover"
            />
            {isSpeaking && (
              <span className="absolute bottom-0 right-0 w-4.5 h-4.5 bg-green-500 rounded-full animate-ping" />
            )}
          </div>
          <h3 className="text-white text-3xl font-semibold tracking-tight">AI Interviewer</h3>
          <p className="text-base text-muted-foreground mt-1">Virtual Assistant</p>
        </div>

        {/* User Card */}
        <div className="bg-zinc-900 rounded-3xl border border-zinc-800 p-12 text-center w-96 shadow-2xl hover:shadow-3xl transition">
          <Avatar className="w-32 h-32 mx-auto mb-6 text-4xl font-bold">
            {/* <AvatarImage src="/user-avatar.png" alt={userName} /> */}
            <AvatarFallback>
              {userName
                .split(" ")
                .map((n) => n[0])
                .join("")
                .slice(0, 2)
                .toUpperCase()}
            </AvatarFallback>
          </Avatar>
          <h3 className="text-white text-3xl font-semibold tracking-tight">{userName}</h3>
          <p className="text-base text-muted-foreground mt-1">You</p>
        </div>
      </div>

      {/* Transcript Box */}
      {lastMessage && (
        <div className="bg-zinc-800/50 text-white rounded-xl border border-zinc-700 px-6 py-4 max-w-md w-fit text-center mb-10 shadow-sm backdrop-blur-sm">
          <p className="text-base opacity-50">{lastMessage}</p>
        </div>
      )}

      {/* Buttons */}
      <div className="flex justify-center mt-4">
        {callStatus !== CallStatus.ACTIVE ? (
          <Button
            variant="outline"
            className="gap-2 px-6 py-3 text-base font-medium"
            onClick={handleCall}
            disabled={callStatus === CallStatus.CONNECTING} // Disable button while connecting
          >
            <Phone className="w-4 h-4" />
            {callStatus === CallStatus.CONNECTING ? "Connecting..." : "Start Interview"}
          </Button>
        ) : (
          <Button
            variant="destructive"
            className="gap-2 px-6 py-3 text-base font-medium"
            onClick={handleDisconnect}
          >
            <Phone className="w-4 h-4" />
            End Interview
          </Button>
        )}
      </div>
    </div>
  );
};

export default Agent;