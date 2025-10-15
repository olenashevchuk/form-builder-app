import { NextResponse } from "next/server";
import { verify } from "jsonwebtoken";

export async function GET(request: Request) {
  const token = request.headers.get("authorization")?.replace("Bearer ", "");
  if (!token) {
    return NextResponse.json({ error: "No token provided" }, { status: 401 });
  }

  try {
    verify(token, process.env.JWT_SECRET!);
    return NextResponse.json({ valid: true }, { status: 200 });
  } catch {
    return NextResponse.json({ error: "Invalid token" }, { status: 401 });
  }
}
