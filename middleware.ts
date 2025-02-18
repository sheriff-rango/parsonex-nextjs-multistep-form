import { clerkMiddleware, createRouteMatcher } from "@clerk/nextjs/server";
import { PrivateMetadata } from "@/types";

const isProtectedRoute = createRouteMatcher(["/dashboard(.*)"]);
const isAdminRoute = createRouteMatcher([
  "/dashboard/admin(.*)",
  "/dashboard/(admin)/(.*)",
]);

export default clerkMiddleware(async (auth, req) => {
  if (isProtectedRoute(req)) {
    await auth.protect();

    if (isAdminRoute(req)) {
      const { sessionClaims } = await auth();
      const privateMetadata = sessionClaims?.privateMetadata as PrivateMetadata;
      const isAdmin = privateMetadata?.role === "admin";
      if (!isAdmin) {
        return new Response("Unauthorized", { status: 401 });
      }
    }
  }
});

export const config = {
  matcher: ["/((?!.*\\..*|_next).*)", "/", "/(api|trpc)(.*)"],
};
