import { NextRequest, NextResponse } from "next/server";
import { dbConnect } from "@/lib/db";
import Profile from "@/models/Profile";
import { getAuthUser } from "@/lib/auth";
import { ProfileValidator } from "@/lib/validators";

export async function GET() {
  try {
    await dbConnect();
    let profile = await Profile.findOne({});
    if (!profile) {
      // Return a blank default profile so UI doesn't crash before seeding
      return NextResponse.json({
        success: true,
        data: {
          name: "Alok Srivastava",
          role: "Backend Engineer",
          tagline: "Building scalable, high-performance backends and reactive microservices.",
          summary: "",
          email: "alok27141@gmail.com",
          phone: "+91 7380888600",
          socials: {},
        },
      });
    }
    return NextResponse.json({ success: true, data: profile });
  } catch (error: any) {
    console.error("Profile GET error:", error);
    return NextResponse.json({ success: false, error: "Database error" }, { status: 500 });
  }
}

export async function PUT(req: NextRequest) {
  try {
    // Authenticate
    const user = getAuthUser(req);
    if (!user) {
      return NextResponse.json({ success: false, error: "Unauthorized" }, { status: 401 });
    }

    await dbConnect();
    const body = await req.json();

    // Validate
    const validation = ProfileValidator.safeParse(body);
    if (!validation.success) {
      return NextResponse.json(
        { success: false, error: validation.error.issues[0].message },
        { status: 400 }
      );
    }

    // Update or Create
    let profile = await Profile.findOne({});
    if (profile) {
      Object.assign(profile, validation.data, { updatedAt: new Date() });
      await profile.save();
    } else {
      profile = await Profile.create(validation.data);
    }

    return NextResponse.json({ success: true, data: profile });
  } catch (error: any) {
    console.error("Profile PUT error:", error);
    return NextResponse.json({ success: false, error: "Database error" }, { status: 500 });
  }
}
