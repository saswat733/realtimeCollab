import { clerkMiddleware } from "@clerk/nextjs/server";

export default clerkMiddleware({
  // Specify your Clerk configuration here
});

export const config = {
  // Allow catch-all routes for <OrganizationProfile/>
  matcher: ["/((?!.*\\..*|_next).*)", "/[[...rest]]", "/(api|trpc)(.*)"],
};
