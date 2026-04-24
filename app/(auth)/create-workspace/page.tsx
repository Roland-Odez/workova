import { getAuthContext } from "@/lib/auth";

import CreateWorkspaceForm from "./CreateWorkspaceForm";
import { redirect } from "next/navigation";

const CreateOrganisationPage = async () => {
    const context = await getAuthContext();

  if (!context.isAuthenticated) {
    redirect("/login");
  }

  return <CreateWorkspaceForm />;
};

export default CreateOrganisationPage;
