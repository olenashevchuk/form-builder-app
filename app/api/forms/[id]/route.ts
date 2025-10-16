import { NextResponse } from "next/server";
import { verify } from "jsonwebtoken";
import { connectToDatabase } from "@/lib/db";
import Form from "@/models/Form";
import { Field, JwtPayload } from "types";

export async function GET(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    await connectToDatabase();

    const form = await Form.findById(id);

    if (!form) {
      return NextResponse.json({ error: "Form not found" }, { status: 404 });
    }

    return NextResponse.json(
      {
        id: form._id,
        title: form.title,
        fields: form.fields,
        userId: form.userId,
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error fetching form:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

export async function PUT(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;

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

    const form = await Form.findOne({ _id: id });

    if (!form) {
      return NextResponse.json(
        { error: "Form not found or you don't have permission" },
        { status: 404 }
      );
    }

    form.title = title;
    form.fields = fields?.map((field: Field) => ({
      ...field,
      label: field.label?.trim() ? field.label : "Unnamed field",
    }));

    await form.save();

    return NextResponse.json(
      { message: "Form updated successfully", formId: form._id },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error updating form:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

export async function DELETE(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;

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

    await connectToDatabase();

    const form = await Form.findOne({ _id: id });

    if (!form) {
      return NextResponse.json(
        { error: "Form not found or you don't have permission" },
        { status: 404 }
      );
    }

    if (form.userId.toString() !== userId) {
      return NextResponse.json(
        {
          error:
            "You don't have permission to delete this form, this form is created by other user",
        },
        { status: 403 }
      );
    }

    await form.deleteOne();

    return NextResponse.json(
      { message: "Form deleted successfully" },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error deleting form:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
