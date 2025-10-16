import { NextRequest, NextResponse } from "next/server";
import { connectToDatabase } from "@/lib/db";
import SubmittedForm from "@/models/SubmittedForm";
import Form from "@/models/Form";

export async function GET(request: NextRequest) {
  try {
    const formId = request.nextUrl.searchParams.get("formId");
    if (!formId) {
      return NextResponse.json(
        { error: "Form ID is required" },
        { status: 400 }
      );
    }

    await connectToDatabase();

    const submissions = await SubmittedForm.find({ formId });

    return NextResponse.json(submissions, { status: 200 });
  } catch (error) {
    console.error("Error fetching submissions:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { formId, submittedFields, userId } = body;

    if (!formId) {
      return NextResponse.json(
        { error: "Form ID is required" },
        { status: 400 }
      );
    }

    if (
      !submittedFields ||
      !Array.isArray(submittedFields) ||
      submittedFields.length === 0
    ) {
      return NextResponse.json(
        { error: "Submitted fields are required" },
        { status: 400 }
      );
    }

    await connectToDatabase();

    const formExists = await Form.findById(formId);
    if (!formExists) {
      return NextResponse.json({ error: "Form not found" }, { status: 404 });
    }

    const newSubmission = new SubmittedForm({
      formId,
      submittedFields,
      userId,
    });

    await newSubmission.save();

    return NextResponse.json(
      {
        message: "Form submitted successfully",
        submissionId: newSubmission._id.toString(),
      },
      { status: 201 }
    );
  } catch (error) {
    console.error("Error submitting form:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
