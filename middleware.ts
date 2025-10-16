import { verify } from "crypto";
import { NextResponse, NextRequest } from "next/server";
import checkIsTokenValid from "helpers/checkIsTokenValid";

export function middleware(request: NextRequest) {
  const token = request.cookies.get("token")?.value;
  const pathname = request.nextUrl.pathname;

  const protectedPaths = ["/forms/create", "/forms/edit"];
  const authPaths = ["/auth/login", "/auth/sign-up"];

  const valid = checkIsTokenValid(token);

  if (authPaths.some((path) => pathname.startsWith(path))) {
    if (valid) {
      return NextResponse.redirect(new URL("/", request.url));
    }
    return NextResponse.next();
  }

  if (protectedPaths.some((path) => pathname.startsWith(path))) {
    if (!valid) {
      return NextResponse.redirect(new URL("/auth/login", request.url));
    }
    return NextResponse.next();
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/forms/create", "/forms/edit/:path*", "/auth/login"],
  runtime: "nodejs",
};
