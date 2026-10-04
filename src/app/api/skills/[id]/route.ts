import { NextRequest, NextResponse } from "next/server";
import { dbConnect } from "@/lib/db";
import SkillCategory from "@/models/SkillCategory";
import { getAuthUser } from "@/lib/auth";
import { SkillCategoryValidator } from "@/lib/validators";

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

    const validation = SkillCategoryValidator.safeParse(body);
    if (!validation.success) {
      return NextResponse.json(
        { success: false, error: validation.error.issues[0].message },
        { status: 400 }
      );
    }

    const skillCategory = await SkillCategory.findByIdAndUpdate(id, validation.data, {
      new: true,
      runValidators: true,
    });

    if (!skillCategory) {
      return NextResponse.json({ success: false, error: "Skill category not found" }, { status: 404 });
    }

    return NextResponse.json({ success: true, data: skillCategory });
  } catch (error: any) {
    console.error("SkillCategory PUT by ID error:", error);
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

    const skillCategory = await SkillCategory.findByIdAndDelete(id);
    if (!skillCategory) {
      return NextResponse.json({ success: false, error: "Skill category not found" }, { status: 404 });
    }

    return NextResponse.json({ success: true, message: "Skill category deleted successfully" });
  } catch (error: any) {
    console.error("SkillCategory DELETE error:", error);
    return NextResponse.json({ success: false, error: "Database error" }, { status: 500 });
  }
}
