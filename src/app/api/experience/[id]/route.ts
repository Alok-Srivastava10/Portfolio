import { NextRequest, NextResponse } from "next/server";
import { dbConnect } from "@/lib/db";
import Experience from "@/models/Experience";
import { getAuthUser } from "@/lib/auth";
import { ExperienceValidator } from "@/lib/validators";

export async function PUT(
  req: NextRequest,
  { params }: { params: any }
) {
  try {
    const user = getAuthUser(req);
    if (!user) {
      return NextResponse.json({ success: false, error: "Unauthorized" }, { status: 401 });
    }

    const { id } = await params; // Compatible with Next.js 15+ async params
    await dbConnect();
    const body = await req.json();

    const validation = ExperienceValidator.safeParse(body);
    if (!validation.success) {
      return NextResponse.json(
        { success: false, error: validation.error.issues[0].message },
        { status: 400 }
      );
    }

    const experience = await Experience.findByIdAndUpdate(id, validation.data, {
      new: true,
      runValidators: true,
    });

    if (!experience) {
      return NextResponse.json({ success: false, error: "Experience not found" }, { status: 404 });
    }

    return NextResponse.json({ success: true, data: experience });
  } catch (error: any) {
    console.error("Experience PUT by ID error:", error);
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

    const experience = await Experience.findByIdAndDelete(id);
    if (!experience) {
      return NextResponse.json({ success: false, error: "Experience not found" }, { status: 404 });
    }

    return NextResponse.json({ success: true, message: "Experience deleted successfully" });
  } catch (error: any) {
    console.error("Experience DELETE error:", error);
    return NextResponse.json({ success: false, error: "Database error" }, { status: 500 });
  }
}
