import { NextRequest, NextResponse } from "next/server";
import { dbConnect } from "@/lib/db";
import SkillCategory from "@/models/SkillCategory";
import { getAuthUser } from "@/lib/auth";
import { SkillCategoryValidator } from "@/lib/validators";

export async function GET() {
  try {
    await dbConnect();
    const skills = await SkillCategory.find({}).sort({ order: 1 });
    return NextResponse.json({ success: true, data: skills });
  } catch (error: any) {
    console.error("SkillCategory GET error:", error);
    return NextResponse.json({ success: false, error: "Database error" }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const user = getAuthUser(req);
    if (!user) {
      return NextResponse.json({ success: false, error: "Unauthorized" }, { status: 401 });
    }

    await dbConnect();
    const body = await req.json();

    const validation = SkillCategoryValidator.safeParse(body);
    if (!validation.success) {
      return NextResponse.json(
        { success: false, error: validation.error.issues[0].message },
        { status: 400 }
      );
    }

    // Set order if not provided
    let order = validation.data.order;
    if (order === undefined) {
      const lastCategory = await SkillCategory.findOne({}).sort({ order: -1 });
      order = lastCategory ? lastCategory.order + 1 : 1;
    }

    const skillCategory = await SkillCategory.create({
      ...validation.data,
      order,
    });

    return NextResponse.json({ success: true, data: skillCategory }, { status: 201 });
  } catch (error: any) {
    console.error("SkillCategory POST error:", error);
    return NextResponse.json({ success: false, error: "Database error" }, { status: 500 });
  }
}
