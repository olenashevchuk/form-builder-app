import { NextResponse } from "next/server";
import { verify } from "jsonwebtoken";
import { connectToDatabase } from "@/lib/db";
import Form from "@/models/Form";
import { Field, JwtPayload } from "types";

export async function GET() {
  try {
    await connectToDatabase();

    const forms = await Form.find().select("title _id");

    return NextResponse.json(
      forms.map((form) => ({
        id: form._id,
        title: form.title,
        userId: form.userId,
      })),
      { status: 200 }
    );
  } catch (error) {
    console.error("Error fetching forms:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

export async function POST(request: Request) {
  try {
    const token = request.headers.get("cookie")?.match(/token=([^;]+)/)?.[1];
    if (!token) {
      return NextResponse.json(
        { error: "Unauthorized: No token provided" },
        { status: 401 }
      );
    }

    let userId;
    try {
      const payload = verify(token, process.env.JWT_SECRET!);
      userId = (payload as JwtPayload).userId;
    } catch {
      return NextResponse.json(
        { error: "Unauthorized: Invalid token" },
        { status: 401 }
      );
    }

    const { title, fields } = await request.json();

    if (!title) {
      return NextResponse.json(
        { error: "Form title is required" },
        { status: 400 }
      );
    }

    if (!fields || !Array.isArray(fields) || fields.length === 0) {
      return NextResponse.json(
        { error: "At least one field is required" },
        { status: 400 }
      );
    }

    await connectToDatabase();

    const form = new Form({
      title,
      userId,
      fields: fields?.map((field: Field) => ({
        ...field,
        label: field.label?.trim() ? field.label : "Unnamed field",
      })),
    });

    await form.save();

    return NextResponse.json(
      { message: "Form created successfully", formId: form._id },
      { status: 201 }
    );
  } catch (error) {
    console.error("Error creating form:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
