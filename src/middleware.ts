export { default } from "next-auth/middleware";

// Apply NextAuth middleware only to protected routes.
// Sign-in, NextAuth callbacks (/api/auth/**), webhooks, and static files are public.
export const config = {
  matcher: [
    "/dashboard/:path*",
    "/presentation/:path*",
    "/create-page/:path*",
    "/settings/:path*",
    "/trash/:path*",
    "/templates/:path*",
    "/share/:path*",
    "/callback",
  ],
};
