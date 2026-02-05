import { clerkMiddleware, createRouteMatcher } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";
import { UserRole, canAccessRoute, getRedirectUrlByRole } from "@/lib/rbac";

// Define public routes that don't require authentication
const isPublicRoute = createRouteMatcher([
  "/",
  "/sign-in(.*)",
  "/sign-up(.*)",
  "/onboarding",
  "/api/webhooks(.*)",
  "/about",
  "/academics(.*)",
  "/admissions",
  "/placements",
  "/contact",
  "/news(.*)",
  "/facilities",
]);

// Define admin routes
const isAdminRoute = createRouteMatcher([
  "/admin(.*)",
]);

// Define faculty routes
const isFacultyRoute = createRouteMatcher([
  "/faculty(.*)",
]);

// Define student routes
const isStudentRoute = createRouteMatcher([
  "/student(.*)",
]);

export default clerkMiddleware(async (auth, req) => {
  const { userId, sessionClaims } = await auth();
  const { pathname } = req.nextUrl;

  // Allow public routes
  if (isPublicRoute(req)) {
    return NextResponse.next();
  }

  // Require authentication for protected routes
  if (!userId) {
    const signInUrl = new URL("/sign-in", req.url);
    signInUrl.searchParams.set("redirect_url", pathname);
    return NextResponse.redirect(signInUrl);
  }

  // Get user role from session claims (set via Clerk unsafeMetadata)
  const userRole = (sessionClaims?.unsafeMetadata as { role?: UserRole })?.role;

  // If no role is set and not already on onboarding, redirect to onboarding
  if (!userRole && pathname !== "/onboarding") {
    return NextResponse.redirect(new URL("/onboarding", req.url));
  }

  // Allow onboarding page without role
  if (pathname === "/onboarding") {
    return NextResponse.next();
  }

  // Check admin route access
  if (isAdminRoute(req)) {
    if (userRole !== UserRole.SUPER_ADMIN && userRole !== UserRole.EXAM_COORDINATOR) {
      // userRole must be defined here due to earlier check
      const redirectUrl = userRole ? getRedirectUrlByRole(userRole) : "/";
      return NextResponse.redirect(new URL(redirectUrl, req.url));
    }

    // Check specific admin route permissions
    if (userRole && !canAccessRoute(userRole, pathname)) {
      return NextResponse.redirect(new URL("/admin/dashboard", req.url));
    }
  }

  // Check faculty route access
  if (isFacultyRoute(req)) {
    if (userRole !== UserRole.FACULTY) {
      const redirectUrl = userRole ? getRedirectUrlByRole(userRole) : "/";
      return NextResponse.redirect(new URL(redirectUrl, req.url));
    }
  }

  // Check student route access
  if (isStudentRoute(req)) {
    if (userRole !== UserRole.STUDENT) {
      const redirectUrl = userRole ? getRedirectUrlByRole(userRole) : "/";
      return NextResponse.redirect(new URL(redirectUrl, req.url));
    }
  }

  return NextResponse.next();
});

export const config = {
  matcher: [
    // Skip Next.js internals and all static files, unless found in search params
    "/((?!_next|[^?]*\\.(?:html?|css|js(?!on)|jpe?g|webp|png|gif|svg|ttf|woff2?|ico|csv|docx?|xlsx?|zip|webmanifest)).*)",
    // Always run for API routes
    "/(api|trpc)(.*)",
  ],
};
