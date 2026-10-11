import fs from "fs";
import path from "path";
import mongoose from "mongoose";
import bcrypt from "bcryptjs";
import Admin from "../models/Admin";
import Profile from "../models/Profile";
import Experience from "../models/Experience";
import Project from "../models/Project";
import SkillCategory from "../models/SkillCategory";
import Achievement from "../models/Achievement";
import Education from "../models/Education";

// Manually load env variables from .env.local if not loaded (e.g. when running script standalone)
function loadEnv() {
  const envPath = path.resolve(process.cwd(), ".env.local");
  if (fs.existsSync(envPath)) {
    const envConfig = fs.readFileSync(envPath, "utf-8");
    envConfig.split("\n").forEach((line) => {
      const match = line.match(/^\s*([\w.-]+)\s*=\s*(.*)?\s*$/);
      if (match) {
        const key = match[1];
        let value = match[2] || "";
        if (value.startsWith('"') && value.endsWith('"')) {
          value = value.substring(1, value.length - 1);
        } else if (value.startsWith("'") && value.endsWith("'")) {
          value = value.substring(1, value.length - 1);
        }
        process.env[key] = value.trim();
      }
    });
  }
}

loadEnv();

const MONGODB_URI = process.env.MONGODB_URI;
const ADMIN_EMAIL = process.env.ADMIN_EMAIL;
const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD;

if (!MONGODB_URI) {
  console.error("Error: MONGODB_URI is not defined in environment.");
  process.exit(1);
}

if (!ADMIN_EMAIL || !ADMIN_PASSWORD) {
  console.error("Error: ADMIN_EMAIL and ADMIN_PASSWORD must be defined in .env.local.");
  process.exit(1);
}

async function seed() {
  try {
    console.log("Connecting to MongoDB...");
    await mongoose.connect(MONGODB_URI!);
    console.log("Connected to MongoDB successfully.");

    // 1. Clear existing collections
    console.log("Clearing existing database collections...");
    await Admin.deleteMany({});
    await Profile.deleteMany({});
    await Experience.deleteMany({});
    await Project.deleteMany({});
    await SkillCategory.deleteMany({});
    await Achievement.deleteMany({});
    await Education.deleteMany({});
    console.log("Database cleared.");

    // 2. Create Admin Account
    console.log("Creating Admin account...");
    const passwordHash = await bcrypt.hash(ADMIN_PASSWORD!, 10);
    const admin = await Admin.create({
      email: ADMIN_EMAIL!,
      passwordHash: passwordHash,
    });
    console.log(`Admin user created: ${admin.email}`);

    // 3. Create Profile (Singleton)
    console.log("Creating Profile...");
    const profile = await Profile.create({
      name: "Alok Srivastava",
      role: "Backend Developer",
      tagline: "Building reliable, well-tested backend systems with Java and Spring Boot.",
      summary:
        "Backend Developer at Tata Consultancy Services, specializing in Java, Spring Boot, and AEM (OSGi, Sling) with PostgreSQL. Experienced in building REST APIs and microservices, with JUnit and Mockito test coverage of 95-98%. Solved 1000+ DSA problems, with a LeetCode peak rating of 1884 (Top 5%) and a top 1% finish in TCS CodeVita 2024.",
      email: "alok27141@gmail.com",
      phone: "+91 7380888600",
      location: "Lucknow, Uttar Pradesh, India",
      socials: {
        linkedin: "https://www.linkedin.com/in/alok-srivastava-1651462b9",
        github: "https://github.com/Alok-Srivastava10",
        leetcode: "https://leetcode.com/u/ALOK_SRIVASTAVA/",
      },
      profileImageUrl: "",
      resumeUrl: "",
      accentColor: "#3730A3", // Deep Indigo
      secondaryAccentColor: "#C2703D", // Warm Terracotta/Amber
    });
    console.log(`Profile created for: ${profile.name}`);

    // 4. Create Skills (Grouped by Category)
    console.log("Creating Skills...");
    const skillsData = [
      {
        category: "Backend Development",
        skills: ["Java", "Spring Boot", "Spring Data JPA", "Spring Security", "REST APIs", "Microservices", "AEM", "OSGi", "Sling", "Node.js", "Express.js"],
        order: 1,
      },
      {
        category: "Frontend Development",
        skills: ["React.js", "JavaScript", "HTML", "CSS"],
        order: 2,
      },
      {
        category: "Database",
        skills: ["MySQL", "MongoDB", "PostgreSQL"],
        order: 3,
      },
      {
        category: "Tools & Practices",
        skills: ["Git", "GitHub", "GitLab", "Maven", "Postman", "Jenkins", "SonarQube"],
        order: 4,
      },
      {
        category: "Testing",
        skills: ["JUnit", "Mockito", "Postman API Testing"],
        order: 5,
      },
      {
        category: "CS Concepts",
        skills: ["OOP", "DSA", "DBMS", "CN", "OS"],
        order: 6,
      },
    ];
    await SkillCategory.insertMany(skillsData);
    console.log("Skills seeded.");

    // 5. Create Experience
    console.log("Creating Experience...");
    const experienceData = [
      {
        company: "Tata Consultancy Services",
        role: "Backend Developer",
        startDate: "April 2026",
        endDate: "Present",
        techTags: ["Java", "Spring Boot", "AEM", "PostgreSQL", "REST APIs", "SonarQube"],
        bullets: [
          "Developed AEM backend components with OSGi and Sling, implementing business logic, backend validation, and application enhancements.",
          "Worked with PostgreSQL for data retrieval, validation, and troubleshooting as part of backend development.",
          "Wrote JUnit and Mockito tests, cutting post-release issues and raising test coverage to 95-98%.",
          "Developed and maintained Java and Spring Boot microservices for the Marketing Tower, applying Spring Data JPA, multithreading, concurrency, and design patterns to improve performance.",
          "Led sprint planning, user story refinement, and cross-functional deliverables as Scrum Master (Backup PM), facilitating core Agile ceremonies to keep team velocity and delivery predictable.",
        ],
        order: 1,
      },
    ];
    await Experience.insertMany(experienceData);
    console.log("Experience seeded.");

    // 6. Create Projects
    console.log("Creating Projects...");
    const projectsData = [
      {
        title: "JWT Authentication System",
        techTags: ["Java", "Spring Boot", "Spring Security", "MySQL"],
        bullets: [
          "Designed and implemented a JWT-based authentication system with secure login/logout flow, reducing unauthorized access attempts by 50% in testing.",
          "Integrated token expiration and refresh logic, improving session security and API reliability.",
          "Conducted performance testing on 20+ API endpoints, keeping average response times under 200 ms.",
        ],
        githubUrl: "https://github.com/Alok-Srivastava10/Implementation-of-JWT-Authentication",
        liveUrl: "",
        featured: true,
        order: 1,
      },
      {
        title: "ScholarFusion",
        techTags: ["Node.js", "Express.js", "MongoDB", "JWT", "Nodemailer", "Cloudinary"],
        bullets: [
          "Implemented secure user authentication with JWT.",
          "Integrated Cloudinary for media uploads.",
          "Enabled email notifications and password recovery through Nodemailer.",
          "Built personalized dashboards for students and educators to manage uploaded content securely.",
        ],
        githubUrl: "https://github.com/Alok-Srivastava10/Scholar-Fusion",
        liveUrl: "",
        featured: true,
        order: 2,
      },
    ];
    await Project.insertMany(projectsData);
    console.log("Projects seeded.");

    // 7. Create Achievements
    console.log("Creating Achievements...");
    const achievementsData = [
      { text: "Ranked in the top 1% in TCS CodeVita 2024 among 550,000+ participants globally.", order: 1 },
      { text: "Peak rating: 1884 on LeetCode (Top 5%), 1407 (2★) on CodeChef.", order: 2 },
      { text: "Global Rank 220, 404 and 431 in LeetCode Contests among 40,000+ participants.", order: 3 },
      { text: "Solved 1000+ DSA problems across LeetCode, CodeChef, CodeForces and GeeksforGeeks.", order: 4 },
    ];
    await Achievement.insertMany(achievementsData);
    console.log("Achievements seeded.");

    // 8. Create Education
    console.log("Creating Education...");
    const educationData = [
      {
        institution: "Feroze Gandhi Institute of Engineering and Technology",
        degree: "Bachelor of Technology",
        field: "Computer Science and Engineering",
        cgpaOrGrade: "7.77 CGPA",
        location: "Raebareli, Uttar Pradesh",
        startDate: "August 2021",
        endDate: "June 2025",
        order: 1,
      },
    ];
    await Education.insertMany(educationData);
    console.log("Education seeded.");

    console.log("Database seeding completed successfully!");
    process.exit(0);
  } catch (error) {
    console.error("Seeding error:", error);
    process.exit(1);
  }
}

seed();