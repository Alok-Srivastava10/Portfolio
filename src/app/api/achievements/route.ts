import { NextRequest, NextResponse } from "next/server";
import { dbConnect } from "@/lib/db";
import Achievement from "@/models/Achievement";
import { getAuthUser } from "@/lib/auth";
import { AchievementValidator } from "@/lib/validators";

export async function GET() {
  try {
    await dbConnect();
    const achievements = await Achievement.find({}).sort({ order: 1 });
    return NextResponse.json({ success: true, data: achievements });
  } catch (error: any) {
    console.error("Achievement GET error:", error);
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

    const validation = AchievementValidator.safeParse(body);
    if (!validation.success) {
      return NextResponse.json(
        { success: false, error: validation.error.issues[0].message },
        { status: 400 }
      );
    }

    // Set order if not provided
    let order = validation.data.order;
    if (order === undefined) {
      const lastAch = await Achievement.findOne({}).sort({ order: -1 });
      order = lastAch ? lastAch.order + 1 : 1;
    }

    const achievement = await Achievement.create({
      ...validation.data,
      order,
    });

    return NextResponse.json({ success: true, data: achievement }, { status: 201 });
  } catch (error: any) {
    console.error("Achievement POST error:", error);
    return NextResponse.json({ success: false, error: "Database error" }, { status: 500 });
  }
}
