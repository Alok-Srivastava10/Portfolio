import { z } from "zod";

export const ProfileValidator = z.object({
  name: z.string().min(1, "Name is required"),
  role: z.string().min(1, "Role is required"),
  tagline: z.string().min(1, "Tagline is required"),
  summary: z.string().min(1, "Summary is required"),
  email: z.string().email("Invalid email address"),
  phone: z.string().min(1, "Phone is required"),
  location: z.string().optional(),
  socials: z.object({
    linkedin: z.string().url().or(z.string().length(0)).optional(),
    github: z.string().url().or(z.string().length(0)).optional(),
    leetcode: z.string().url().or(z.string().length(0)).optional(),
    gfg: z.string().url().or(z.string().length(0)).optional(),
    twitter: z.string().url().or(z.string().length(0)).optional(),
  }),
  profileImageUrl: z.string().optional(),
  resumeUrl: z.string().optional(),
  accentColor: z.string().regex(/^#[0-9A-Fa-f]{6}$/, "Invalid hex color").optional(),
  secondaryAccentColor: z.string().regex(/^#[0-9A-Fa-f]{6}$/, "Invalid hex color").optional(),
});

export const ExperienceValidator = z.object({
  company: z.string().min(1, "Company is required"),
  role: z.string().min(1, "Role is required"),
  startDate: z.string().min(1, "Start date is required"),
  endDate: z.string().min(1, "End date is required"),
  techTags: z.array(z.string()).default([]),
  bullets: z.array(z.string()).default([]),
  order: z.number().int().optional(),
});

export const ProjectValidator = z.object({
  title: z.string().min(1, "Title is required"),
  techTags: z.array(z.string()).default([]),
  bullets: z.array(z.string()).default([]),
  githubUrl: z.string().url().or(z.string().length(0)).optional(),
  liveUrl: z.string().url().or(z.string().length(0)).optional(),
  featured: z.boolean().default(false),
  order: z.number().int().optional(),
});

export const SkillCategoryValidator = z.object({
  category: z.string().min(1, "Category is required"),
  skills: z.array(z.string()).default([]),
  order: z.number().int().optional(),
});

export const AchievementValidator = z.object({
  text: z.string().min(1, "Achievement text is required"),
  order: z.number().int().optional(),
});

export const EducationValidator = z.object({
  institution: z.string().min(1, "Institution is required"),
  degree: z.string().min(1, "Degree is required"),
  field: z.string().min(1, "Field is required"),
  cgpaOrGrade: z.string().optional(),
  location: z.string().optional(),
  startDate: z.string().min(1, "Start date is required"),
  endDate: z.string().min(1, "End date is required"),
  order: z.number().int().optional(),
});

export const LoginValidator = z.object({
  email: z.string().email("Invalid email address"),
  password: z.string().min(1, "Password is required"),
});
