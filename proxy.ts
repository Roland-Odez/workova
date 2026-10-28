import { auth } from "@/lib/server";

export default auth.middleware({ loginUrl: "/login" });

export const config = {
  matcher: [
    {
      source: "/",
      has: [{ type: "query", key: "neon_auth_session_verifier" }],
    },
    {
      source: "/create-workspace",
      has: [{ type: "query", key: "neon_auth_session_verifier" }],
    },
  ],
};
