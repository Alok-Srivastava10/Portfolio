"use client";

import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence, useMotionValue, useSpring, useTransform } from "framer-motion";
import {
  Mail,
  Phone,
  FileText,
  ExternalLink,
  Award,
  BookOpen,
  Briefcase,
  ChevronRight,
  Code,
  MapPin,
  Sparkles,
  Home,
  User,
  Settings,
} from "lucide-react";

// Brand Icon SVGs
const Github = ({ size = 18 }: { size?: number }) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width={size}
    height={size}
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <path d="M15 22v-4a4.8 4.8 0 0 0-1-3.5c3 0 6-2 6-5.5.08-1.25-.27-2.48-1-3.5.28-1.15.28-2.35 0-3.5 0 0-1 0-3 1.5-2.64-.5-5.36-.5-8 0C6 2 5 2 5 2c-.3 1.15-.3 2.35 0 3.5A5.403 5.403 0 0 0 4 9c0 3.5 3 5.5 6 5.5-.39.49-.68 1.05-.85 1.65-.17.6-.22 1.23-.15 1.85v4" />
    <path d="M9 18c-4.51 2-5-2-7-2" />
  </svg>
);

const Linkedin = ({ size = 18 }: { size?: number }) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width={size}
    height={size}
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z" />
    <rect width="4" height="12" x="2" y="9" />
    <circle cx="4" cy="4" r="2" />
  </svg>
);

// Stat Counter Component using requestAnimationFrame for smooth counting
function Counter({ value, suffix = "", duration = 1.5 }: { value: number; suffix?: string; duration?: number }) {
  const [count, setCount] = useState(0);
  const ref = useRef<HTMLSpanElement>(null);
  const [hasStarted, setHasStarted] = useState(false);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setHasStarted(true);
        }
      },
      { threshold: 0.1 }
    );

    if (ref.current) {
      observer.observe(ref.current);
    }

    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    if (!hasStarted) return;

    let startTimestamp: number | null = null;
    const step = (timestamp: number) => {
      if (!startTimestamp) startTimestamp = timestamp;
      const progress = Math.min((timestamp - startTimestamp) / (duration * 1000), 1);

      // Easing function: easeOutExpo
      const easeProgress = progress === 1 ? 1 : 1 - Math.pow(2, -10 * progress);

      setCount(Math.floor(easeProgress * value));

      if (progress < 1) {
        window.requestAnimationFrame(step);
      } else {
        setCount(value);
      }
    };
    window.requestAnimationFrame(step);
  }, [hasStarted, value, duration]);

  return <span ref={ref}>{count.toLocaleString()}{suffix}</span>;
}

interface PortfolioProps {
  data: {
    profile: any;
    experiences: any[];
    projects: any[];
    skills: any[];
    achievements: any[];
    education: any[];
  };
}

export default function PortfolioClient({ data }: PortfolioProps) {
  const { profile, experiences, projects, skills, achievements, education } = data;

  const [activeSection, setActiveSection] = useState("home");
  const [scrolled, setScrolled] = useState(false);

  // Motion values for spotlight mouse tracking
  const mouseX = useMotionValue(-200);
  const mouseY = useMotionValue(-200);
  const springX = useSpring(mouseX, { stiffness: 50, damping: 15 });
  const springY = useSpring(mouseY, { stiffness: 50, damping: 15 });

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      mouseX.set(e.clientX - 96);
      mouseY.set(e.clientY - 96);
    };
    window.addEventListener("mousemove", handleMouseMove);
    return () => window.removeEventListener("mousemove", handleMouseMove);
  }, [mouseX, mouseY]);

  // Monitor scroll for header background & active section
  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);

      const sections = ["home", "about", "experience", "projects", "skills", "achievements", "education"];
      const scrollPosition = window.scrollY + 250;

      for (const section of sections) {
        const el = document.getElementById(section);
        if (el) {
          const top = el.offsetTop;
          const height = el.offsetHeight;
          if (scrollPosition >= top && scrollPosition < top + height) {
            setActiveSection(section);
            break;
          }
        }
      }
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const dockLinks = [
    { id: "home", label: "Home", icon: <Home size={18} /> },
    { id: "about", label: "About", icon: <User size={18} /> },
    { id: "experience", label: "Work", icon: <Briefcase size={18} /> },
    { id: "projects", label: "Builds", icon: <Code size={18} /> },
    { id: "skills", label: "Skills", icon: <Settings size={18} /> },
    { id: "achievements", label: "Honors", icon: <Award size={18} /> },
    { id: "education", label: "Studies", icon: <BookOpen size={18} /> },
  ];

  const scrollTo = (id: string) => {
    const el = document.getElementById(id);
    if (el) {
      el.scrollIntoView({ behavior: "smooth" });
    }
  };

  // Framer Motion presets
  const fadeInUp = {
    initial: { opacity: 0, y: 50 },
    whileInView: { opacity: 1, y: 0 },
    viewport: { once: true, margin: "-60px" },
    transition: { duration: 0.7, ease: [0.16, 1, 0.3, 1] },
  } as const;

  const staggerContainer = {
    initial: { opacity: 0 },
    whileInView: { opacity: 1 },
    viewport: { once: true, margin: "-80px" },
    transition: { staggerChildren: 0.12 },
  } as const;

  return (
    <div
      className="relative min-h-screen bg-[#FAFAF8] text-[#1A1A1A] font-sans bg-noise pb-28 selection:bg-accent/15 selection:text-accent"
      style={{
        "--accent-primary": profile?.accentColor || "#3730A3",
        "--accent-secondary": profile?.secondaryAccentColor || "#C2703D",
      } as React.CSSProperties}
    >
      {/* Floating macOS-Style Navigation Dock */}
      <div className="fixed bottom-6 left-1/2 -translate-x-1/2 z-50 flex items-center gap-3 md:gap-4.5 px-6 py-3 rounded-full glassmorphism shadow-lg border border-white/40 max-w-[95%] overflow-x-auto">
        {dockLinks.map((item) => (
          <button
            key={item.id}
            onClick={() => scrollTo(item.id)}
            className={`relative p-3 rounded-2xl transition-all duration-300 flex items-center justify-center shrink-0 ${activeSection === item.id
              ? "bg-accent text-white scale-110 shadow-md shadow-accent/20"
              : "text-gray-400 hover:text-accent hover:bg-gray-100/50 hover:scale-105"
              }`}
            title={item.label}
          >
            {item.icon}
            {activeSection === item.id && (
              <motion.span
                layoutId="activeDockDot"
                className="absolute -bottom-1 left-1/2 -translate-x-1/2 w-1.5 h-1.5 rounded-full bg-accent-secondary"
                transition={{ type: "spring", stiffness: 350, damping: 25 }}
              />
            )}
          </button>
        ))}

        {profile?.resumeUrl && (
          <div className="h-6 w-[1px] bg-gray-200/80 shrink-0 self-center mx-1 md:mx-2" />
        )}

        {profile?.resumeUrl && (
          <a
            href={profile.resumeUrl}
            target="_blank"
            rel="noreferrer"
            className="p-3 rounded-2xl text-accent hover:bg-accent/5 hover:scale-105 transition-all shrink-0 flex items-center justify-center border border-accent/10"
            title="Resume"
          >
            <FileText size={18} />
          </a>
        )}
      </div>

      {/* Background Matrix Grid & Ambient Glow Orbs */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none z-0">
        {/* Square Matrix Grid Pattern */}
        <div className="absolute inset-0 bg-grid-matrix opacity-75" />

        {/* Vibrant Ambient Glowing Color Orbs (Cyan, Indigo, Amber, Teal) */}
        <div className="absolute -top-16 right-[2%] w-[600px] h-[600px] rounded-full bg-cyan-400/20 filter blur-[140px] animate-blob-1" />
        <div className="absolute top-[12%] -left-20 w-[500px] h-[500px] rounded-full bg-indigo-500/15 filter blur-[130px] animate-blob-2" />
        <div className="absolute top-[38%] -right-20 w-[550px] h-[550px] rounded-full bg-amber-400/10 filter blur-[140px] animate-blob-1" />
        <div className="absolute top-[68%] left-[2%] w-[550px] h-[550px] rounded-full bg-emerald-400/15 filter blur-[140px] animate-blob-2" />

        {/* Mouse cursor-tracking background blob */}
        <motion.div
          className="fixed w-96 h-96 rounded-full filter blur-[120px] opacity-[0.07] hidden md:block"
          style={{
            x: springX,
            y: springY,
            backgroundColor: "var(--accent-primary)",
          }}
        />
      </div>

      {/* Standard top logo/branding row */}
      <header className="absolute top-0 left-0 w-full z-30 py-6">
        <div className="max-w-6xl mx-auto px-6 flex items-center justify-between">
          <button onClick={() => scrollTo("home")} className="text-xl font-serif font-black tracking-tight text-gradient">
            {profile?.name || "Alok Srivastava"}
          </button>
        </div>
      </header>

      {/* 1. Hero Section */}
      <section
        id="home"
        className="min-h-screen flex flex-col justify-center relative max-w-6xl mx-auto px-6 pt-28 md:pt-0"
      >
        {/* Decorative mesh blob animations */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none z-0">
          <div
            className="absolute top-[20%] left-[10%] w-96 h-96 rounded-full filter blur-[110px] opacity-[0.09] animate-blob-1"
            style={{ backgroundColor: "var(--accent-primary)" }}
          />
          <div
            className="absolute bottom-[20%] right-[10%] w-[450px] h-[450px] rounded-full filter blur-[130px] opacity-[0.08] animate-blob-2"
            style={{ backgroundColor: "var(--accent-secondary)" }}
          />
        </div>

        <motion.div
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
          className="max-w-4xl space-y-6 relative z-10"
        >
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full text-xs font-bold bg-accent/5 border border-accent/10 text-accent">
            <Sparkles size={13} className="animate-pulse" />
            <span>Full-Stack Software Engineer</span>
          </div>

          <h1 className="text-6.5xl md:text-9xl font-serif font-black tracking-tight leading-[1] text-gradient">
            {profile?.name || "Alok Srivastava"}
          </h1>

          <p className="text-lg md:text-2.5xl font-medium text-gray-700 leading-relaxed font-sans max-w-3xl font-light">
            Crafting high-performance <span className="font-semibold text-accent">reactive microservices</span> and database systems serving 100,000+ users.
          </p>

          <div className="flex flex-wrap items-center gap-4 pt-4">
            <button
              onClick={() => scrollTo("projects")}
              className="px-8 py-4 rounded-full text-xs uppercase tracking-wider font-bold bg-accent text-white hover:opacity-95 transition-all shadow-md shadow-accent/15 hover:shadow-accent/25 hover:-translate-y-0.5 active:translate-y-0"
            >
              View Work
            </button>

            <a
              href="mailto:alok27141@gmail.com"
              className="inline-flex items-center gap-2 px-8 py-4 rounded-full text-xs uppercase tracking-wider font-bold bg-white border border-gray-250 text-gray-700 hover:bg-gray-50 transition-all shadow-sm hover:-translate-y-0.5 active:translate-y-0"
            >
              Contact Me
            </a>
          </div>
        </motion.div>
      </section>

      {/* Infinite Horizontal Marquee Ticker */}
      <div className="relative w-full overflow-hidden border-y border-gray-200/50 py-8 my-6 bg-white/20 backdrop-blur-sm z-10 select-none">
        <div className="animate-marquee flex whitespace-nowrap gap-12 text-6xl md:text-8xl font-serif font-black uppercase tracking-wider text-gray-250/70">
          <span className="flex items-center gap-12">
            <span>Java</span>
            <span className="text-accent">•</span>
            <span>Spring Boot</span>
            <span className="text-accent-secondary">•</span>
            <span>Microservices</span>
            <span className="text-accent">•</span>
            <span>React</span>
            <span className="text-accent-secondary">•</span>
            <span>System Design</span>
            <span className="text-accent">•</span>
          </span>
          <span className="flex items-center gap-12" aria-hidden="true">
            <span>Java</span>
            <span className="text-accent-secondary">•</span>
            <span>Spring Boot</span>
            <span className="text-accent">•</span>
            <span>Microservices</span>
            <span className="text-accent-secondary">•</span>
            <span>React</span>
            <span className="text-accent">•</span>
            <span>System Design</span>
          </span>
        </div>
      </div>

      {/* 2. About Section */}
      <section id="about" className="py-32 border-t border-[#F0F0EE] bg-[#FDFDFB] relative overflow-hidden">
        <div className="max-w-6xl mx-auto px-6">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">

            {/* Left side text column */}
            <motion.div {...fadeInUp} className="lg:col-span-7 space-y-6">
              <h2 className="text-xs font-bold tracking-widest text-accent uppercase flex items-center gap-2">
                <Sparkles size={14} className="text-accent-secondary" />
                01 / Story
              </h2>
              <h3 className="text-4xl md:text-5xl font-serif font-bold text-gray-900 leading-[1.1]">
                Bridging architectural engineering and user experiences.
              </h3>
              <p className="text-lg text-gray-600 leading-relaxed font-sans font-light">
                {profile?.summary ||
                  "Backend Developer with experience building backend systems. Skilled in Java, Spring Boot, and database systems."}
              </p>

              {/* Stat figures within About */}
              <div className="grid grid-cols-2 gap-6 pt-6 border-t border-gray-100">
                <div className="space-y-1">
                  <div className="text-4xl font-serif font-black text-accent">
                    <Counter value={1884} />
                  </div>
                  <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">LeetCode Peak Rating</p>
                </div>
                <div className="space-y-1">
                  <div className="text-4xl font-serif font-black text-accent-secondary">
                    <Counter value={1000} suffix="+" />
                  </div>
                  <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">DSA Problems Solved</p>
                </div>
              </div>
            </motion.div>

            {/* Right side contact bento card layout */}
            <motion.div {...fadeInUp} className="lg:col-span-5 space-y-6">
              <div className="p-7 rounded-3xl bg-white border border-gray-200/80 shadow-layered hover:shadow-layered-hover hover:-translate-y-1 transition-all duration-300 space-y-6">
                <h4 className="text-sm font-bold uppercase tracking-wider text-gray-400">Get in Touch</h4>

                <div className="space-y-4">
                  <a href={`mailto:${profile?.email}`} className="flex items-center gap-3.5 group p-2.5 rounded-2xl hover:bg-accent/5 transition-colors">
                    <div className="p-2.5 rounded-xl bg-accent/5 text-accent group-hover:bg-accent group-hover:text-white transition-all shadow-sm">
                      <Mail size={16} />
                    </div>
                    <span className="text-sm font-medium text-gray-700 truncate">{profile?.email}</span>
                  </a>

                  <a href={`tel:${profile?.phone}`} className="flex items-center gap-3.5 group p-2.5 rounded-2xl hover:bg-accent-secondary/5 transition-colors">
                    <div className="p-2.5 rounded-xl bg-accent-secondary/5 text-accent-secondary group-hover:bg-accent-secondary group-hover:text-white transition-all shadow-sm">
                      <Phone size={16} />
                    </div>
                    <span className="text-sm font-medium text-gray-700">{profile?.phone}</span>
                  </a>

                  {profile?.location && (
                    <div className="flex items-center gap-3.5 p-2.5">
                      <div className="p-2.5 rounded-xl bg-gray-50 border border-gray-100 text-gray-400">
                        <MapPin size={16} />
                      </div>
                      <span className="text-sm font-medium text-gray-600">{profile.location}</span>
                    </div>
                  )}
                </div>

                <div className="flex items-center gap-3 pt-2">
                  {profile?.socials?.linkedin && (
                    <a
                      href={profile.socials.linkedin}
                      target="_blank"
                      rel="noreferrer"
                      className="p-3.5 rounded-2xl border border-gray-200 text-gray-400 hover:text-accent hover:border-accent hover:scale-105 transition-all shadow-sm bg-white"
                      title="LinkedIn"
                    >
                      <Linkedin size={16} />
                    </a>
                  )}
                  {profile?.socials?.github && (
                    <a
                      href={profile.socials.github}
                      target="_blank"
                      rel="noreferrer"
                      className="p-3.5 rounded-2xl border border-gray-200 text-gray-400 hover:text-accent hover:border-accent hover:scale-105 transition-all shadow-sm bg-white"
                      title="GitHub"
                    >
                      <Github size={16} />
                    </a>
                  )}
                </div>
              </div>
            </motion.div>

          </div>
        </div>
      </section>

      {/* 3. Experience Section */}
      <section id="experience" className="py-32 border-t border-[#F0F0EE]">
        <div className="max-w-6xl mx-auto px-6">
          <motion.div {...fadeInUp} className="space-y-16">
            <div className="space-y-2">
              <h2 className="text-xs font-bold tracking-widest text-accent uppercase">02 / Placements</h2>
              <h3 className="text-3.5xl md:text-4.5xl font-serif font-bold text-gray-900">Career History</h3>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-12 gap-8 max-w-5xl">
              {experiences.map((exp, idx) => (
                <motion.div
                  key={exp._id || idx}
                  {...fadeInUp}
                  className="md:col-span-12 relative group bg-white border border-gray-250 rounded-3xl p-8 shadow-layered hover:shadow-layered-hover hover:-translate-y-1.5 transition-all duration-300"
                >
                  <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-gray-100 pb-5 mb-5">
                    <div>
                      <h4 className="text-xl font-bold text-gray-950 font-serif">{exp.role}</h4>
                      <p className="text-sm font-semibold text-accent-secondary mt-0.5">{exp.company}</p>
                    </div>
                    <span className="inline-block text-xs font-bold uppercase tracking-wider px-4 py-2 rounded-full bg-accent/5 border border-accent/10 text-accent self-start md:self-auto shadow-sm">
                      {exp.startDate} – {exp.endDate || "Present"}
                    </span>
                  </div>

                  <div className="space-y-4">
                    {exp.techTags && exp.techTags.length > 0 && (
                      <div className="flex flex-wrap gap-2">
                        {exp.techTags.map((tag: string, tIdx: number) => (
                          <span
                            key={tIdx}
                            className="px-2.5 py-1 rounded-xl text-[10px] font-bold uppercase tracking-wider bg-gray-50 border border-gray-150 text-gray-500 hover:border-accent hover:text-accent transition-colors"
                          >
                            {tag}
                          </span>
                        ))}
                      </div>
                    )}

                    <ul className="space-y-3.5 text-sm text-gray-500 leading-relaxed list-disc pl-4 font-sans font-light">
                      {exp.bullets.map((bullet: string, bIdx: number) => (
                        <li key={bIdx}>{bullet}</li>
                      ))}
                    </ul>
                  </div>
                </motion.div>
              ))}

              {experiences.length === 0 && (
                <p className="text-gray-400 italic md:col-span-12">No experience entries added yet.</p>
              )}
            </div>
          </motion.div>
        </div>
      </section>

      {/* 4. Projects Section (Uniform Landscape Gallery) */}
      <section id="projects" className="py-32 border-t border-[#F0F0EE]">
        <div className="max-w-6xl mx-auto px-6">
          <motion.div {...fadeInUp} className="space-y-16">
            <div className="space-y-2">
              <h2 className="text-xs font-bold tracking-widest text-accent uppercase">03 / Builds</h2>
              <h3 className="text-3.5xl md:text-4.5xl font-serif font-bold text-gray-900">Projects Gallery</h3>
            </div>

            <motion.div
              variants={staggerContainer}
              className="grid grid-cols-1 gap-8 max-w-5xl"
            >
              {projects.map((project, idx) => {
                const isFeatured = project.featured;

                return (
                  <motion.div
                    key={project._id || idx}
                    variants={fadeInUp}
                    className={`group flex flex-col justify-between p-8 bg-white border rounded-3xl shadow-layered hover:shadow-layered-hover hover:-translate-y-1.5 transition-all duration-300 relative overflow-hidden ${isFeatured
                      ? "border-accent/20 ring-1 ring-accent/5"
                      : "border-gray-250 hover:border-accent-secondary/35"
                      }`}
                  >
                    {isFeatured && (
                      <div className="absolute top-0 left-0 w-full h-[3.5px] bg-gradient-to-r from-accent to-accent-secondary" />
                    )}

                    <div className="space-y-5">
                      <div className="flex items-start justify-between gap-4">
                        <div>
                          <span className="text-[9px] font-bold uppercase tracking-widest text-accent-secondary">
                            {isFeatured ? "Featured Project" : "Application build"}
                          </span>
                          <h4 className="text-xl font-bold text-gray-950 group-hover:text-accent transition-colors font-serif mt-0.5 truncate">
                            {project.title}
                          </h4>
                        </div>

                        <div className="flex items-center gap-1.5 shrink-0 mt-0.5">
                          {project.githubUrl && (
                            <a
                              href={project.githubUrl}
                              target="_blank"
                              rel="noreferrer"
                              className="p-2 rounded-xl text-gray-400 hover:text-gray-950 hover:bg-gray-50 transition-colors border border-transparent hover:border-gray-200"
                              title="Repo"
                            >
                              <Github size={16} />
                            </a>
                          )}
                          {project.liveUrl && (
                            <a
                              href={project.liveUrl}
                              target="_blank"
                              rel="noreferrer"
                              className="p-2 rounded-xl text-gray-400 hover:text-accent hover:bg-accent/5 transition-colors border border-transparent hover:border-accent/20"
                              title="Live URL"
                            >
                              <ExternalLink size={16} />
                            </a>
                          )}
                        </div>
                      </div>

                      {project.techTags && project.techTags.length > 0 && (
                        <div className="flex flex-wrap gap-1.5">
                          {project.techTags.map((tag: string, tIdx: number) => (
                            <span
                              key={tIdx}
                              className="px-2.5 py-0.5 rounded-lg text-[9px] font-bold uppercase tracking-wider bg-accent/5 border border-accent/10 text-accent"
                            >
                              {tag}
                            </span>
                          ))}
                        </div>
                      )}

                      <ul className="space-y-2.5 text-xs text-gray-500 list-disc pl-4 leading-relaxed font-sans font-light">
                        {project.bullets.map((bullet: string, bIdx: number) => (
                          <li key={bIdx}>{bullet}</li>
                        ))}
                      </ul>
                    </div>

                    {project.githubUrl && (
                      <a
                        href={project.githubUrl}
                        target="_blank"
                        rel="noreferrer"
                        className="inline-flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-accent-secondary mt-8 hover:text-accent transition-all group-hover:underline"
                      >
                        Explore source code <ChevronRight size={14} />
                      </a>
                    )}
                  </motion.div>
                );
              })}

              {projects.length === 0 && (
                <p className="text-gray-400 italic">No projects added yet.</p>
              )}
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* 5. Skills Section */}
      <section id="skills" className="py-32 border-t border-[#F0F0EE]">
        <div className="max-w-6xl mx-auto px-6">
          <motion.div {...fadeInUp} className="space-y-16">
            <div className="space-y-2">
              <h2 className="text-xs font-bold tracking-widest text-accent uppercase">04 / Skills</h2>
              <h3 className="text-3.5xl md:text-4.5xl font-serif font-bold text-gray-900">Technical Stack</h3>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {skills.map((cat, idx) => (
                <motion.div
                  key={cat._id || idx}
                  {...fadeInUp}
                  className="space-y-5 p-7 bg-white border border-gray-250 hover:border-accent-secondary/35 rounded-3xl shadow-layered hover:shadow-layered-hover hover:-translate-y-1.5 transition-all duration-300 relative overflow-hidden group"
                >
                  <h4 className="text-xs font-bold text-gray-900 tracking-widest uppercase flex items-center gap-2">
                    <span className="w-2 h-2 rounded-full bg-accent-secondary"></span>
                    {cat.category}
                  </h4>

                  <div className="flex flex-wrap gap-2 pt-1">
                    {cat.skills.map((skill: string, sIdx: number) => (
                      <span
                        key={sIdx}
                        className="px-3.5 py-2 rounded-xl text-xs font-medium bg-gray-50/80 border border-gray-200/80 text-gray-700 hover:border-accent hover:text-accent hover:bg-accent/5 hover:scale-[1.03] transition-all duration-200 cursor-default"
                      >
                        {skill}
                      </span>
                    ))}
                  </div>
                </motion.div>
              ))}

              {skills.length === 0 && (
                <p className="text-gray-400 italic col-span-3">No skill groups added yet.</p>
              )}
            </div>
          </motion.div>
        </div>
      </section>

      {/* 6. Achievements Section */}
      <section id="achievements" className="py-32 border-t border-[#F0F0EE]">
        <div className="max-w-6xl mx-auto px-6">
          <motion.div {...fadeInUp} className="space-y-16">
            <div className="space-y-2">
              <h2 className="text-xs font-bold tracking-widest text-accent uppercase">05 / Achievements</h2>
              <h3 className="text-3.5xl md:text-4.5xl font-serif font-bold text-gray-900">Contests & Honors</h3>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-4xl">
              {achievements.map((ach, idx) => (
                <motion.div
                  key={ach._id || idx}
                  {...fadeInUp}
                  className="flex items-start gap-4.5 p-7 bg-white border border-gray-250 hover:border-accent-secondary/35 rounded-3xl shadow-layered hover:shadow-layered-hover hover:-translate-y-1.5 transition-all duration-300 relative overflow-hidden group"
                >
                  <div className="p-3 rounded-2xl bg-accent/5 text-accent shrink-0 shadow-sm group-hover:bg-accent group-hover:text-white transition-all">
                    <Award size={18} />
                  </div>
                  <p className="text-sm font-medium text-gray-700 pt-1 leading-relaxed font-sans font-light">
                    {ach.text}
                  </p>
                </motion.div>
              ))}

              {achievements.length === 0 && (
                <p className="text-gray-400 italic col-span-2">No achievements added yet.</p>
              )}
            </div>
          </motion.div>
        </div>
      </section>

      {/* 7. Education Section */}
      <section id="education" className="py-32 border-t border-[#F0F0EE]">
        <div className="max-w-6xl mx-auto px-6">
          <motion.div {...fadeInUp} className="space-y-16">
            <div className="space-y-2">
              <h2 className="text-xs font-bold tracking-widest text-accent uppercase">06 / Education</h2>
              <h3 className="text-3.5xl md:text-4.5xl font-serif font-bold text-gray-900">Academic Background</h3>
            </div>

            <div className="max-w-3xl space-y-6">
              {education.map((edu, idx) => (
                <motion.div
                  key={edu._id || idx}
                  {...fadeInUp}
                  className="p-8 bg-white border border-gray-250 rounded-3xl flex flex-col md:flex-row justify-between gap-6 shadow-layered relative overflow-hidden group hover:border-accent/40 transition-all duration-300"
                >
                  <div className="absolute left-0 top-0 bottom-0 w-[4px] bg-accent group-hover:bg-accent-secondary transition-colors" />

                  <div className="space-y-3 pl-2">
                    <div className="flex items-center gap-2 text-accent-secondary font-bold">
                      <BookOpen size={16} />
                      <span className="text-xs uppercase tracking-widest font-black">Academics</span>
                    </div>

                    <div>
                      <h4 className="text-lg font-bold text-gray-950 font-serif">{edu.degree} — {edu.field}</h4>
                      <p className="text-sm font-medium text-gray-500 mt-0.5">{edu.institution}</p>
                    </div>

                    {edu.location && (
                      <p className="text-xs text-gray-400 font-light flex items-center gap-1">
                        <MapPin size={12} />
                        <span>{edu.location}</span>
                      </p>
                    )}
                  </div>

                  <div className="flex flex-col md:items-end justify-between gap-4 shrink-0 pl-2 md:pl-0">
                    <span className="inline-block text-xs font-bold uppercase tracking-wider px-4 py-2 rounded-full bg-gray-50 border border-gray-150 text-gray-500 self-start md:self-auto shadow-sm">
                      {edu.startDate} – {edu.endDate}
                    </span>

                    {edu.cgpaOrGrade && (
                      <div className="text-sm font-bold text-accent">
                        Grade: {edu.cgpaOrGrade}
                      </div>
                    )}
                  </div>
                </motion.div>
              ))}

              {education.length === 0 && (
                <p className="text-gray-400 italic">No education details added yet.</p>
              )}
            </div>
          </motion.div>
        </div>
      </section>

      {/* 8. Contact & Footer */}
      <section id="contact" className="py-28 border-t border-gray-900 bg-gray-950 text-white relative overflow-hidden">
        {/* Decorative footer blobs */}
        <div className="absolute top-[20%] left-[-10%] w-[350px] h-[350px] rounded-full filter blur-[130px] opacity-[0.06] bg-accent pointer-events-none" />
        <div className="absolute bottom-[20%] right-[-10%] w-[350px] h-[350px] rounded-full filter blur-[130px] opacity-[0.06] bg-accent-secondary pointer-events-none" />

        <div className="max-w-6xl mx-auto px-6 flex flex-col md:flex-row justify-between items-start md:items-center gap-10 relative z-10">
          <div className="space-y-4">
            <h2 className="text-3xl font-serif font-black tracking-tight leading-none text-white">Alok Srivastava</h2>
            <p className="text-sm text-gray-400 max-w-sm font-sans font-light leading-relaxed">
              Backend Developer focusing on high-performance Java microservices and optimized architectures.
            </p>
          </div>

          <div className="flex flex-col gap-3 text-sm text-gray-400">
            <span className="text-xs uppercase tracking-widest text-gray-600 font-bold">Contact</span>
            <a href={`mailto:${profile?.email}`} className="hover:text-white transition-colors">
              {profile?.email}
            </a>
            <a href={`tel:${profile?.phone}`} className="hover:text-white transition-colors">
              {profile?.phone}
            </a>
          </div>
        </div>

        <div className="max-w-6xl mx-auto px-6 border-t border-gray-900 mt-16 pt-7 flex flex-col md:flex-row justify-between items-center text-xs text-gray-500 gap-4 relative z-10">
          <span>&copy; {new Date().getFullYear()} Alok Srivastava. All rights reserved.</span>
          <div className="flex gap-6 items-center flex-wrap">
            {profile?.socials?.linkedin && (
              <a href={profile.socials.linkedin} target="_blank" rel="noreferrer" className="hover:text-white transition-colors">
                LinkedIn
              </a>
            )}
            {profile?.socials?.github && (
              <a href={profile.socials.github} target="_blank" rel="noreferrer" className="hover:text-white transition-colors">
                GitHub
              </a>
            )}
            {profile?.socials?.leetcode && (
              <a href={profile.socials.leetcode} target="_blank" rel="noreferrer" className="hover:text-white transition-colors">
                LeetCode
              </a>
            )}
          </div>
        </div>
      </section>
    </div>
  );
}
