import { dbConnect } from "@/lib/db";
import Profile from "@/models/Profile";
import Experience from "@/models/Experience";
import Project from "@/models/Project";
import SkillCategory from "@/models/SkillCategory";
import Achievement from "@/models/Achievement";
import Education from "@/models/Education";
import PortfolioClient from "@/components/public/PortfolioClient";

export const dynamic = "force-dynamic";
export const revalidate = 0;

async function getPortfolioData() {
  try {
    await dbConnect();

    const [profile, experiences, projects, skills, achievements, education] = await Promise.all([
      Profile.findOne({}),
      Experience.find({}).sort({ order: 1 }),
      Project.find({}).sort({ order: 1 }),
      SkillCategory.find({}).sort({ order: 1 }),
      Achievement.find({}).sort({ order: 1 }),
      Education.find({}).sort({ order: 1 }),
    ]);

    // Serialize MongoDB/Mongoose structures to plain JSON objects for client component compatibility
    return JSON.parse(
      JSON.stringify({
        profile: profile || null,
        experiences: experiences || [],
        projects: projects || [],
        skills: skills || [],
        achievements: achievements || [],
        education: education || [],
      })
    );
  } catch (error) {
    console.error("Error fetching portfolio data from DB:", error);
    // Return empty fallback content so that the server renders even if database is offline
    return {
      profile: {
        name: "Alok Srivastava",
        role: "Backend Developer",
        tagline: "Building scalable backend services and reactive microservices.",
        summary: "Backend Developer specializing in Java, Spring Boot, React, and MongoDB.",
        email: "alok27141@gmail.com",
        phone: "+91 7380888600",
        location: "Noida, India",
        socials: {
          linkedin: "",
          github: "",
          leetcode: "",
        },
      },
      experiences: [],
      projects: [],
      skills: [],
      achievements: [],
      education: [],
    };
  }
}

export default async function HomePage() {
  const data = await getPortfolioData();

  return <PortfolioClient data={data} />;
}
