import { NextRequest, NextResponse } from "next/server";
import { dbConnect } from "@/lib/db";
import Experience from "@/models/Experience";
import { getAuthUser } from "@/lib/auth";
import { ExperienceValidator } from "@/lib/validators";

export async function GET() {
  try {
    await dbConnect();
    const experiences = await Experience.find({}).sort({ order: 1 });
    return NextResponse.json({ success: true, data: experiences });
  } catch (error: any) {
    console.error("Experience GET error:", error);
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

    const validation = ExperienceValidator.safeParse(body);
    if (!validation.success) {
      return NextResponse.json(
        { success: false, error: validation.error.issues[0].message },
        { status: 400 }
      );
    }

    // Set order if not provided
    let order = validation.data.order;
    if (order === undefined) {
      const lastExp = await Experience.findOne({}).sort({ order: -1 });
      order = lastExp ? lastExp.order + 1 : 1;
    }

    const experience = await Experience.create({
      ...validation.data,
      order,
    });

    return NextResponse.json({ success: true, data: experience }, { status: 201 });
  } catch (error: any) {
    console.error("Experience POST error:", error);
    return NextResponse.json({ success: false, error: "Database error" }, { status: 500 });
  }
}
