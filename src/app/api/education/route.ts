import { NextRequest, NextResponse } from "next/server";
import { dbConnect } from "@/lib/db";
import Education from "@/models/Education";
import { getAuthUser } from "@/lib/auth";
import { EducationValidator } from "@/lib/validators";

export async function GET() {
  try {
    await dbConnect();
    const education = await Education.find({}).sort({ order: 1 });
    return NextResponse.json({ success: true, data: education });
  } catch (error: any) {
    console.error("Education GET error:", error);
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

    const validation = EducationValidator.safeParse(body);
    if (!validation.success) {
      return NextResponse.json(
        { success: false, error: validation.error.issues[0].message },
        { status: 400 }
      );
    }

    // Set order if not provided
    let order = validation.data.order;
    if (order === undefined) {
      const lastEdu = await Education.findOne({}).sort({ order: -1 });
      order = lastEdu ? lastEdu.order + 1 : 1;
    }

    const education = await Education.create({
      ...validation.data,
      order,
    });

    return NextResponse.json({ success: true, data: education }, { status: 201 });
  } catch (error: any) {
    console.error("Education POST error:", error);
    return NextResponse.json({ success: false, error: "Database error" }, { status: 500 });
  }
}
