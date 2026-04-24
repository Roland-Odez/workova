import { getAuthContext } from "@/lib/auth";

import LoginForm from "./LoginForm";
import { redirect } from "next/navigation";

const LoginPage = async () => {
  const context = await getAuthContext();
  
    if (!context.isAuthenticated) {
      redirect('/')
    }

  return <LoginForm />;
};

export default LoginPage;
