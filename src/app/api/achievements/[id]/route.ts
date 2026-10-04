import { NextRequest, NextResponse } from "next/server";
import { dbConnect } from "@/lib/db";
import Achievement from "@/models/Achievement";
import { getAuthUser } from "@/lib/auth";
import { AchievementValidator } from "@/lib/validators";

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

    const validation = AchievementValidator.safeParse(body);
    if (!validation.success) {
      return NextResponse.json(
        { success: false, error: validation.error.issues[0].message },
        { status: 400 }
      );
    }

    const achievement = await Achievement.findByIdAndUpdate(id, validation.data, {
      new: true,
      runValidators: true,
    });

    if (!achievement) {
      return NextResponse.json({ success: false, error: "Achievement not found" }, { status: 404 });
    }

    return NextResponse.json({ success: true, data: achievement });
  } catch (error: any) {
    console.error("Achievement PUT by ID error:", error);
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

    const achievement = await Achievement.findByIdAndDelete(id);
    if (!achievement) {
      return NextResponse.json({ success: false, error: "Achievement not found" }, { status: 404 });
    }

    return NextResponse.json({ success: true, message: "Achievement deleted successfully" });
  } catch (error: any) {
    console.error("Achievement DELETE error:", error);
    return NextResponse.json({ success: false, error: "Database error" }, { status: 500 });
  }
}
