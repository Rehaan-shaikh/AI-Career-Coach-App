import { getCurrentUser } from "@/actions/auth";
import { redirect } from "next/navigation";

const AuthLayout = async ({ children }) => {
  const user = await getCurrentUser();

  if (user) {
    redirect("/"); // ✅ This is a server-side redirect
  }

  return (
    <div className="flex items-center justify-center min-h-screen bg-background px-4">
      <div className="w-full max-w-md p-8">
        {children}
      </div>
    </div>
  );
};

export default AuthLayout;
