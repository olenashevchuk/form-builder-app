import { NextResponse, NextRequest } from "next/server";
import { verify } from "jsonwebtoken";

export function middleware(request: NextRequest) {
  const token = request.cookies.get("token")?.value;

  const protectedPaths = ["/forms/create", "/forms/edit"];
  const authPaths = ["/auth/login", "/auth/sign-up"];

  const isTokenValid = (token: string | undefined) => {
    if (!token) return false;
    try {
      const payload = verify(token, process.env.JWT_SECRET!);
      return !!payload;
    } catch {
      return false;
    }
  };

  const valid = isTokenValid(token);

  // Перевірка захищених шляхів (/forms/create та /forms/edit/*)
  if (
    protectedPaths.some((path) => request.nextUrl.pathname.startsWith(path))
  ) {
    if (!valid) {
      return NextResponse.redirect(new URL("/auth/login", request.url));
    }
    return NextResponse.next();
  }

  // Перевірка сторінок авторизації
  if (authPaths.some((path) => request.nextUrl.pathname.startsWith(path))) {
    if (valid) {
      return NextResponse.redirect(new URL("/", request.url));
    }
    return NextResponse.next();
  }

  // Дозволяємо доступ до всіх інших сторінок, включаючи /
  return NextResponse.next();
}

export const config = {
  matcher: [
    "/forms/create/:path*",
    "/forms/edit/:path*",
    "/auth/login",
    "/auth/sign-up",
  ],
  runtime: "nodejs",
};
