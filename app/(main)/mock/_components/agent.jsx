"use client";

import Image from "next/image";
import { useRouter } from "next/navigation";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Phone } from "lucide-react";

// import { vapi } from "@/lib/vapi.sdk";
// import { interviewer } from "@/constants";
// import { createFeedback } from "@/lib/actions/general.action";

const CallStatus = {
  INACTIVE: "INACTIVE",
  CONNECTING: "CONNECTING",
  ACTIVE: "ACTIVE",
  FINISHED: "FINISHED",
};

const Agent = ({
  //   userName,
  //   userId,
  //   interviewId,
  //   feedbackId,
  //   type,
  //   questions,
}) => {
  const userName = "John Doe";
  const userId = "12345";
  const interviewId = "67890";
  const feedbackId = "abcde";
  const type = "technical";
  const questions = ["What is your greatest strength?", "How do you handle stress?"];

  const messages = [
    "Hello, how can I assist you today?",
    "I am here to help you prepare for your interview.",
  ];
  const lastMessage = messages[messages.length - 1];
  const router = useRouter();
  const isSpeaking = true;
  const callStatus = CallStatus.INACTIVE;

  //   const [callStatus, setCallStatus] = useState(CallStatus.INACTIVE);
  //   const [messages, setMessages] = useState([]);
  //   const [isSpeaking, setIsSpeaking] = useState(false);
  //   const [lastMessage, setLastMessage] = useState("");

  //   useEffect(() => {
  //     const onCallStart = () => setCallStatus(CallStatus.ACTIVE);
  //     const onCallEnd = () => setCallStatus(CallStatus.FINISHED);

  //     const onMessage = (message) => {
  //       if (message.type === "transcript" && message.transcriptType === "final") {
  //         const newMessage = { role: message.role, content: message.transcript };
  //         setMessages((prev) => [...prev, newMessage]);
  //       }
  //     };

  //     const onSpeechStart = () => setIsSpeaking(true);
  //     const onSpeechEnd = () => setIsSpeaking(false);
  //     const onError = (error) => console.log("Error:", error);

  //     vapi.on("call-start", onCallStart);
  //     vapi.on("call-end", onCallEnd);
  //     vapi.on("message", onMessage);
  //     vapi.on("speech-start", onSpeechStart);
  //     vapi.on("speech-end", onSpeechEnd);
  //     vapi.on("error", onError);

  //     return () => {
  //       vapi.off("call-start", onCallStart);
  //       vapi.off("call-end", onCallEnd);
  //       vapi.off("message", onMessage);
  //       vapi.off("speech-start", onSpeechStart);
  //       vapi.off("speech-end", onSpeechEnd);
  //       vapi.off("error", onError);
  //     };
  //   }, []);

  //   useEffect(() => {
  //     if (messages.length > 0) {
  //       setLastMessage(messages[messages.length - 1].content);
  //     }

  //     const handleGenerateFeedback = async () => {
  //       const { success, feedbackId: id } = await createFeedback({
  //         interviewId,
  //         userId,
  //         transcript: messages,
  //         feedbackId,
  //       });

  //       if (success && id) {
  //         router.push(`/interview/${interviewId}/feedback`);
  //       } else {
  //         router.push("/");
  //       }
  //     };

  //     if (callStatus === CallStatus.FINISHED) {
  //       if (type === "generate") {
  //         router.push("/");
  //       } else {
  //         handleGenerateFeedback();
  //       }
  //     }
  //   }, [messages, callStatus]);

  //   const handleCall = async () => {
  //     setCallStatus(CallStatus.CONNECTING);

  //     if (type === "generate") {
  //       await vapi.start(process.env.NEXT_PUBLIC_VAPI_WORKFLOW_ID, {
  //         variableValues: {
  //           username: userName,
  //           userid: userId,
  //         },
  //       });
  //     } else {
  //       const formattedQuestions = questions?.map((q) => `- ${q}`).join("\n") || "";

  //       await vapi.start(interviewer, {
  //         variableValues: { questions: formattedQuestions },
  //       });
  //     }
  //   };

  //   const handleDisconnect = () => {
  //     setCallStatus(CallStatus.FINISHED);
  //     vapi.stop();
  //   };

  return (
    <div className="min-h-screen w-full bg-zinc-950 px-4 py-16 flex flex-col items-center">
      {/* Interview Cards */}
<div className="flex flex-col md:flex-row justify-center gap-12 items-center mb-12 border border-zinc-800 bg-zinc-900/60 rounded-2xl p-8 shadow-inner">
  {/* AI Card */}
  <div className="bg-zinc-900 rounded-3xl border border-zinc-800 p-12 text-center w-96 shadow-2xl hover:shadow-3xl transition">
    <div className="relative w-32 h-32 mx-auto mb-6">
      <Image
        src="/unnamed(2).png"
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
            // onClick={handleCall}
          >
            <Phone className="w-4 h-4" />
            {callStatus === CallStatus.CONNECTING ? "Connecting..." : "Start Interview"}
          </Button>
        ) : (
          <Button
            variant="destructive"
            className="gap-2 px-6 py-3 text-base font-medium"
            // onClick={handleDisconnect}
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
