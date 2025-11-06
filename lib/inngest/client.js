import { Inngest } from "inngest";

//initializes an Inngest client
export const inngest = new Inngest({
  id: "career-coach", // Unique app ID
  name: "Career Coach",
  //passes API key to Inngest for later use of ai in functions to allow AI calls later.
  credentials: {
    gemini: {
      apiKey: process.env.GEMINI_API_KEY,
    },
  },
});
