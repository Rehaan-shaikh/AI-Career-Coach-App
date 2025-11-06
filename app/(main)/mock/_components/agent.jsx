"use client";

import Image from "next/image";
import { useRouter } from "next/navigation";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Phone } from "lucide-react";
import { useEffect, useState } from "react";
import { vapi } from "@/app/lib/vapi.sdk";

//vapi is your Voice AI SDK instance (imported from @/app/lib/vapi.sdk).
// It connects your React app to the Vapi voice AI backend, which can start calls, stream audio, and send events during a live call

const CallStatus = {
  INACTIVE: "INACTIVE",
  CONNECTING: "CONNECTING",
  ACTIVE: "ACTIVE",
  FINISHED: "FINISHED",
};

const Agent = ({userName}) => {
  
  const router = useRouter(); 

  const [callStatus, setCallStatus] = useState(CallStatus.INACTIVE);
  const [messages, setMessages] = useState([]); // Array to store transcript messages
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [lastMessage, setLastMessage] = useState("");

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

    // Attach Vapi event listeners using vapi.on
    // Syntax : vapi.on(eventName, callback)
    // ➡️ means “when this event happens, run this callback function.”
    // just like : button.addEventListener("click", handleClick);
    //so vapi.on attaches event listeners to the callbacks defined above
    // (and this "call-start" and all are bydefault events provided by vapi sdk)
    vapi.on("call-start", onCallStart); 
    vapi.on("call-end", onCallEnd);
    vapi.on("message", onMessage);  //message handlers are used to process incoming messages during the call
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
    if (callStatus === CallStatus.FINISHED) {
        router.push("/mock");
    }
  }, [messages, callStatus, router]);


  // Function to handle starting the Vapi call
  const handleCall = async () => {
    const vapiWebToken = process.env.NEXT_PUBLIC_VAPI_WEB_TOKEN;
    const vapiWorkflowId = process.env.NEXT_PUBLIC_VAPI_WORKFLOW_ID;


    setCallStatus(CallStatus.CONNECTING);

    try {
        //starting vapi call with your workflow id , in that workflow i have set the vapi commands which fllows the interview process
        await vapi.start(vapiWorkflowId);
        setCallStatus(CallStatus.ACTIVE)
        console.log("Vapi.start() called successfully (awaiting server response)...");
    }catch (err) {
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
            {isSpeaking && (
              <span className="absolute bottom-0 right-0 w-4.5 h-4.5 bg-green-500 rounded-full animate-ping" />
            )}
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