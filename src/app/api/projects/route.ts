import { NextRequest, NextResponse } from "next/server";
import { dbConnect } from "@/lib/db";
import Project from "@/models/Project";
import { getAuthUser } from "@/lib/auth";
import { ProjectValidator } from "@/lib/validators";

export async function GET() {
  try {
    await dbConnect();
    const projects = await Project.find({}).sort({ order: 1 });
    return NextResponse.json({ success: true, data: projects });
  } catch (error: any) {
    console.error("Project GET error:", error);
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

    const validation = ProjectValidator.safeParse(body);
    if (!validation.success) {
      return NextResponse.json(
        { success: false, error: validation.error.issues[0].message },
        { status: 400 }
      );
    }

    // Set order if not provided
    let order = validation.data.order;
    if (order === undefined) {
      const lastProj = await Project.findOne({}).sort({ order: -1 });
      order = lastProj ? lastProj.order + 1 : 1;
    }

    const project = await Project.create({
      ...validation.data,
      order,
    });

    return NextResponse.json({ success: true, data: project }, { status: 201 });
  } catch (error: any) {
    console.error("Project POST error:", error);
    return NextResponse.json({ success: false, error: "Database error" }, { status: 500 });
  }
}
