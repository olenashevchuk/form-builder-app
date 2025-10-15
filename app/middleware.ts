import { NextResponse, NextRequest } from "next/server";
import { verify } from "jsonwebtoken";

export function middleware(request: NextRequest) {
  const token = request.cookies.get("token")?.value;
  const { pathname } = new URL(request.url);

  if (!token) {
    if (pathname.startsWith("/auth")) {
      return NextResponse.next();
    }
    return NextResponse.redirect(new URL("/auth/login", request.url));
  }

  try {
    verify(token, process.env.JWT_SECRET!);

    if (pathname === "/" || pathname.startsWith("/auth")) {
      return NextResponse.redirect(new URL("/forms", request.url));
    }

    return NextResponse.next();
  } catch {
    const response = NextResponse.redirect(new URL("/auth/login", request.url));
    response.cookies.delete("token");
    return response;
  }
}

export const config = {
  matcher: ["/((?!api|_next/static|_next/image|favicon.ico).*)"],
};
