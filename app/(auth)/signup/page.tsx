
import { redirect } from "next/navigation";
import SignUpForm from "./SignUpForm";
import { getAuthContext } from "@/lib/auth";

const SignUpPage = async () => {
  const context = await getAuthContext();

  if (context.isAuthenticated) {
    redirect('/')
  }

  return <SignUpForm />;
};

export default SignUpPage;
