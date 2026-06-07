import NextAuth from "next-auth";
import authConfig from "./auth.config";

const { auth } = NextAuth(authConfig);
export { auth as proxy };

export const config = {
  // Matcher ignoring /api, /_next/static, /_next/image, and all files with an extension (e.g. .png, .css)
  matcher: ["/((?!api|_next/static|_next/image|.*\\..*).*)"],
};
