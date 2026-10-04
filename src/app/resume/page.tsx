import { redirect } from "next/navigation";
import { dbConnect } from "@/lib/db";
import Profile from "@/models/Profile";

export const dynamic = "force-dynamic";

export default async function ResumeRedirectPage() {
  try {
    await dbConnect();
    const profile = await Profile.findOne({});

    if (profile?.resumeUrl) {
      redirect(profile.resumeUrl);
    }
  } catch (error) {
    console.error("Resume redirect error:", error);
  }

  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-6 text-center font-sans bg-[#FAFAF8]">
      <h1 className="text-2xl font-serif font-bold text-gray-900 mb-2">Resume Not Found</h1>
      <p className="text-[#555] mb-6">The resume PDF has not been uploaded to the dashboard yet.</p>
      <a
        href="/"
        className="px-5 py-2.5 rounded-full text-xs font-semibold bg-indigo-600 hover:bg-indigo-700 text-white shadow-sm transition-colors"
      >
        Return to Home
      </a>
    </div>
  );
}
