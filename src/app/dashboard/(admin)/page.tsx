import { dbConnect } from "@/lib/db";
import Profile from "@/models/Profile";
import Experience from "@/models/Experience";
import Project from "@/models/Project";
import SkillCategory from "@/models/SkillCategory";
import Achievement from "@/models/Achievement";
import Education from "@/models/Education";
import Link from "next/link";
import {
  User,
  Briefcase,
  FolderKanban,
  Award,
  BookOpen,
  Settings,
  ArrowRight,
} from "lucide-react";

export const dynamic = "force-dynamic";
export const revalidate = 0;

async function getStats() {
  try {
    await dbConnect();
    const [profile, expCount, projCount, skillCount, achCount, eduCount] = await Promise.all([
      Profile.findOne({}),
      Experience.countDocuments({}),
      Project.countDocuments({}),
      SkillCategory.countDocuments({}),
      Achievement.countDocuments({}),
      Education.countDocuments({}),
    ]);

    return {
      profileName: profile?.name || "Alok Srivastava",
      profileEmail: profile?.email || "alok27141@gmail.com",
      expCount,
      projCount,
      skillCount,
      achCount,
      eduCount,
    };
  } catch (error) {
    console.error("Dashboard overview stats error:", error);
    return {
      profileName: "Alok Srivastava",
      profileEmail: "alok27141@gmail.com",
      expCount: 0,
      projCount: 0,
      skillCount: 0,
      achCount: 0,
      eduCount: 0,
    };
  }
}

export default async function DashboardOverview() {
  const stats = await getStats();

  const cards = [
    {
      label: "Profile Info",
      count: stats.profileEmail,
      description: "Manage name, tags, summary, socials, profile image and resume.",
      href: "/dashboard/profile",
      icon: User,
      color: "bg-blue-50 text-blue-600 border-blue-100",
    },
    {
      label: "Work Experience",
      count: `${stats.expCount} entries`,
      description: "Manage your professional career history, responsibilities, and stacks.",
      href: "/dashboard/experience",
      icon: Briefcase,
      color: "bg-indigo-50 text-indigo-600 border-indigo-100",
    },
    {
      label: "Projects",
      count: `${stats.projCount} builds`,
      description: "Manage your projects, repositories, live links, and descriptions.",
      href: "/dashboard/projects",
      icon: FolderKanban,
      color: "bg-purple-50 text-purple-600 border-purple-100",
    },
    {
      label: "Skills & Keywords",
      count: `${stats.skillCount} groups`,
      description: "Manage grouping of your backend, frontend, database, and tool stack.",
      href: "/dashboard/skills",
      icon: Settings,
      color: "bg-amber-50 text-amber-600 border-amber-100",
    },
    {
      label: "Achievements",
      count: `${stats.achCount} items`,
      description: "Manage highlights such as LeetCode rank, DSA solved problems, etc.",
      href: "/dashboard/achievements",
      icon: Award,
      color: "bg-rose-50 text-rose-600 border-rose-100",
    },
    {
      label: "Education",
      count: `${stats.eduCount} entries`,
      description: "Manage details of college degrees, grades, duration, and institution.",
      href: "/dashboard/education",
      icon: BookOpen,
      color: "bg-emerald-50 text-emerald-600 border-emerald-100",
    },
  ];

  return (
    <div className="space-y-8 font-sans">
      <div>
        <h1 className="text-3xl font-serif font-bold text-gray-900">
          Welcome back, {stats.profileName}
        </h1>
        <p className="text-sm text-gray-500 mt-1">
          Here is a summary of the current contents published on your portfolio.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {cards.map((card, idx) => {
          const Icon = card.icon;

          return (
            <div
              key={idx}
              className="bg-white border border-gray-200 rounded-2xl p-6 shadow-sm flex flex-col justify-between hover:border-indigo-200 hover:shadow-md transition-all group"
            >
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div className={`p-2.5 rounded-xl border ${card.color} shrink-0`}>
                    <Icon size={20} />
                  </div>
                  <span className="text-xs font-semibold text-gray-400 bg-gray-50 px-2.5 py-0.5 rounded-full">
                    {card.count}
                  </span>
                </div>

                <div>
                  <h3 className="text-base font-bold text-gray-900">{card.label}</h3>
                  <p className="text-xs text-gray-500 mt-1 leading-relaxed">
                    {card.description}
                  </p>
                </div>
              </div>

              <Link
                href={card.href}
                className="inline-flex items-center gap-1 text-xs font-bold text-indigo-600 hover:text-indigo-800 transition-colors mt-6 group-hover:underline"
              >
                <span>Edit items</span>
                <ArrowRight size={14} className="group-hover:translate-x-0.5 transition-transform" />
              </Link>
            </div>
          );
        })}
      </div>

      <div className="bg-indigo-900 rounded-3xl p-8 text-white relative overflow-hidden shadow-md">
        <div className="relative z-10 space-y-3 max-w-lg">
          <h3 className="text-xl font-serif font-bold">Need to make updates live?</h3>
          <p className="text-sm text-indigo-200 leading-relaxed">
            All modifications you perform in this dashboard are immediately committed to MongoDB. They will reflect on the homepage on your next refresh.
          </p>
          <div className="pt-2">
            <Link
              href="/"
              target="_blank"
              className="inline-flex items-center gap-2 bg-white text-indigo-900 px-5 py-2.5 rounded-full text-xs font-bold hover:bg-indigo-50 transition-colors"
            >
              <span>View live website</span>
              <ArrowRight size={14} />
            </Link>
          </div>
        </div>
        <div className="absolute right-0 bottom-0 top-0 w-1/3 bg-radial-gradient opacity-10 pointer-events-none"></div>
      </div>
    </div>
  );
}
