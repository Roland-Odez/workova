import { requireSignedOutUser } from "@/lib/auth";

import SignUpForm from "./SignUpForm";

const SignUpPage = async () => {
  await requireSignedOutUser();

  return <SignUpForm />;
};

export default SignUpPage;
