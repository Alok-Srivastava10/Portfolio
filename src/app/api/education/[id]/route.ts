import { NextRequest, NextResponse } from "next/server";
import { dbConnect } from "@/lib/db";
import Education from "@/models/Education";
import { getAuthUser } from "@/lib/auth";
import { EducationValidator } from "@/lib/validators";

export async function PUT(
  req: NextRequest,
  { params }: { params: any }
) {
  try {
    const user = getAuthUser(req);
    if (!user) {
      return NextResponse.json({ success: false, error: "Unauthorized" }, { status: 401 });
    }

    const { id } = await params;
    await dbConnect();
    const body = await req.json();

    const validation = EducationValidator.safeParse(body);
    if (!validation.success) {
      return NextResponse.json(
        { success: false, error: validation.error.issues[0].message },
        { status: 400 }
      );
    }

    const education = await Education.findByIdAndUpdate(id, validation.data, {
      new: true,
      runValidators: true,
    });

    if (!education) {
      return NextResponse.json({ success: false, error: "Education not found" }, { status: 404 });
    }

    return NextResponse.json({ success: true, data: education });
  } catch (error: any) {
    console.error("Education PUT by ID error:", error);
    return NextResponse.json({ success: false, error: "Database error" }, { status: 500 });
  }
}

export async function DELETE(
  req: NextRequest,
  { params }: { params: any }
) {
  try {
    const user = getAuthUser(req);
    if (!user) {
      return NextResponse.json({ success: false, error: "Unauthorized" }, { status: 401 });
    }

    const { id } = await params;
    await dbConnect();

    const education = await Education.findByIdAndDelete(id);
    if (!education) {
      return NextResponse.json({ success: false, error: "Education not found" }, { status: 404 });
    }

    return NextResponse.json({ success: true, message: "Education deleted successfully" });
  } catch (error: any) {
    console.error("Education DELETE error:", error);
    return NextResponse.json({ success: false, error: "Database error" }, { status: 500 });
  }
}
