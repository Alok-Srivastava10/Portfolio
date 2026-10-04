"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { User, FileText, Upload, Save, CheckCircle, AlertCircle } from "lucide-react";

export default function ProfileDashboard() {
  const router = useRouter();
  const [profile, setProfile] = useState<any>({
    name: "",
    role: "",
    tagline: "",
    summary: "",
    email: "",
    phone: "",
    location: "",
    socials: {
      linkedin: "",
      github: "",
      leetcode: "",
      gfg: "",
      twitter: "",
    },
    profileImageUrl: "",
    resumeUrl: "",
    accentColor: "#3730A3",
    secondaryAccentColor: "#C2703D",
  });

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState<{ type: "success" | "error"; text: string } | null>(null);

  // File upload state
  const [uploadingAvatar, setUploadingAvatar] = useState(false);
  const [uploadingResume, setUploadingResume] = useState(false);

  useEffect(() => {
    async function fetchProfile() {
      try {
        const res = await fetch("/api/profile");
        const data = await res.json();
        if (data.success && data.data) {
          // Merge with default values to prevent undefined values in inputs
          setProfile({
            ...profile,
            ...data.data,
            socials: {
              ...profile.socials,
              ...(data.data.socials || {}),
            },
          });
        }
      } catch (err) {
        console.error("Error fetching profile:", err);
      } finally {
        setLoading(false);
      }
    }
    fetchProfile();
  }, []);

  const handleTextChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setProfile((prev: any) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSocialChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setProfile((prev: any) => ({
      ...prev,
      socials: {
        ...prev.socials,
        [name]: value,
      },
    }));
  };

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>, type: "avatar" | "resume") => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (type === "avatar") setUploadingAvatar(true);
    else setUploadingResume(true);

    setMessage(null);

    try {
      const formData = new FormData();
      formData.append("file", file);

      const res = await fetch("/api/upload", {
        method: "POST",
        body: formData,
      });

      const data = await res.json();

      if (!res.ok || !data.success) {
        setMessage({ type: "error", text: data.error || "File upload failed" });
      } else {
        setProfile((prev: any) => ({
          ...prev,
          [type === "avatar" ? "profileImageUrl" : "resumeUrl"]: data.url,
        }));
        setMessage({ type: "success", text: `${type === "avatar" ? "Avatar" : "Resume"} uploaded successfully!` });
      }
    } catch (err: any) {
      setMessage({ type: "error", text: "Upload failed: " + (err.message || "Unknown error") });
    } finally {
      if (type === "avatar") setUploadingAvatar(false);
      else setUploadingResume(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setMessage(null);

    try {
      const res = await fetch("/api/profile", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(profile),
      });

      const data = await res.json();

      if (!res.ok || !data.success) {
        setMessage({ type: "error", text: data.error || "Failed to update profile settings" });
      } else {
        setMessage({ type: "success", text: "Profile updated successfully!" });
        router.refresh();
      }
    } catch (err: any) {
      setMessage({ type: "error", text: "Failed to update profile: " + err.message });
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[300px] text-gray-500 font-sans">
        Loading profile settings...
      </div>
    );
  }

  return (
    <div className="space-y-6 font-sans">
      <div>
        <h1 className="text-2xl font-serif font-bold text-gray-900">Profile Information</h1>
        <p className="text-sm text-gray-500 mt-1">
          Update your header details, contact points, avatar picture, and resume PDF.
        </p>
      </div>

      {message && (
        <div
          className={`p-4 rounded-xl border flex items-center gap-3 text-xs font-semibold ${
            message.type === "success"
              ? "bg-green-50 border-green-200 text-green-700"
              : "bg-red-50 border-red-200 text-red-700"
          }`}
        >
          {message.type === "success" ? <CheckCircle size={16} /> : <AlertCircle size={16} />}
          <span>{message.text}</span>
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-8 bg-white border border-gray-200 rounded-2xl p-6 md:p-8 shadow-sm">
        {/* Core details */}
        <div className="space-y-6">
          <h3 className="text-sm font-bold text-gray-900 border-b border-gray-100 pb-3 flex items-center gap-2">
            <User size={16} className="text-indigo-600" />
            Core Personal Information
          </h3>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-gray-500 mb-2">Name</label>
              <input
                type="text"
                name="name"
                value={profile.name}
                onChange={handleTextChange}
                required
                className="w-full px-4 py-2.5 rounded-xl border border-[#E0E0DC] text-sm focus:outline-none focus:border-indigo-500 bg-gray-50/50"
              />
            </div>
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-gray-500 mb-2">Role/Title</label>
              <input
                type="text"
                name="role"
                value={profile.role}
                onChange={handleTextChange}
                required
                className="w-full px-4 py-2.5 rounded-xl border border-[#E0E0DC] text-sm focus:outline-none focus:border-indigo-500 bg-gray-50/50"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-gray-500 mb-2">Tagline (Hero text)</label>
            <input
              type="text"
              name="tagline"
              value={profile.tagline}
              onChange={handleTextChange}
              required
              className="w-full px-4 py-2.5 rounded-xl border border-[#E0E0DC] text-sm focus:outline-none focus:border-indigo-500 bg-gray-50/50"
            />
          </div>

          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-gray-500 mb-2">About Summary (Paragraph)</label>
            <textarea
              name="summary"
              value={profile.summary}
              onChange={handleTextChange}
              required
              rows={5}
              className="w-full px-4 py-2.5 rounded-xl border border-[#E0E0DC] text-sm focus:outline-none focus:border-indigo-500 bg-gray-50/50"
            />
          </div>
        </div>

        {/* Contact and Location */}
        <div className="space-y-6">
          <h3 className="text-sm font-bold text-gray-900 border-b border-gray-100 pb-3">Contact details & Location</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-gray-500 mb-2">Email</label>
              <input
                type="email"
                name="email"
                value={profile.email}
                onChange={handleTextChange}
                required
                className="w-full px-4 py-2.5 rounded-xl border border-[#E0E0DC] text-sm focus:outline-none focus:border-indigo-500 bg-gray-50/50"
              />
            </div>
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-gray-500 mb-2">Phone</label>
              <input
                type="text"
                name="phone"
                value={profile.phone}
                onChange={handleTextChange}
                required
                className="w-full px-4 py-2.5 rounded-xl border border-[#E0E0DC] text-sm focus:outline-none focus:border-indigo-500 bg-gray-50/50"
              />
            </div>
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-gray-500 mb-2">Location</label>
              <input
                type="text"
                name="location"
                value={profile.location || ""}
                onChange={handleTextChange}
                className="w-full px-4 py-2.5 rounded-xl border border-[#E0E0DC] text-sm focus:outline-none focus:border-indigo-500 bg-gray-50/50"
              />
            </div>
          </div>
        </div>

        {/* Social Links */}
        <div className="space-y-6">
          <h3 className="text-sm font-bold text-gray-900 border-b border-gray-100 pb-3">Social Profiles</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-gray-500 mb-2">LinkedIn URL</label>
              <input
                type="url"
                name="linkedin"
                value={profile.socials.linkedin || ""}
                onChange={handleSocialChange}
                placeholder="https://linkedin.com/in/username"
                className="w-full px-4 py-2.5 rounded-xl border border-[#E0E0DC] text-sm focus:outline-none focus:border-indigo-500 bg-gray-50/50"
              />
            </div>
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-gray-500 mb-2">GitHub URL</label>
              <input
                type="url"
                name="github"
                value={profile.socials.github || ""}
                onChange={handleSocialChange}
                placeholder="https://github.com/username"
                className="w-full px-4 py-2.5 rounded-xl border border-[#E0E0DC] text-sm focus:outline-none focus:border-indigo-500 bg-gray-50/50"
              />
            </div>
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-gray-500 mb-2">LeetCode URL</label>
              <input
                type="url"
                name="leetcode"
                value={profile.socials.leetcode || ""}
                onChange={handleSocialChange}
                placeholder="https://leetcode.com/username"
                className="w-full px-4 py-2.5 rounded-xl border border-[#E0E0DC] text-sm focus:outline-none focus:border-indigo-500 bg-gray-50/50"
              />
            </div>
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-gray-500 mb-2">GeeksforGeeks URL</label>
              <input
                type="url"
                name="gfg"
                value={profile.socials.gfg || ""}
                onChange={handleSocialChange}
                placeholder="https://geeksforgeeks.org/user/username"
                className="w-full px-4 py-2.5 rounded-xl border border-[#E0E0DC] text-sm focus:outline-none focus:border-indigo-500 bg-gray-50/50"
              />
            </div>
          </div>
        </div>

        {/* Upload Assets */}
        <div className="space-y-6 border-t border-gray-100 pt-6">
          <h3 className="text-sm font-bold text-gray-900 border-b border-gray-100 pb-3 flex items-center gap-2">
            <FileText size={16} className="text-indigo-600" />
            Media & File Attachments
          </h3>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {/* Profile Avatar Upload */}
            <div className="p-5 border border-dashed border-[#E0E0DC] rounded-2xl flex flex-col items-center justify-center text-center space-y-4">
              <label className="block text-xs font-bold uppercase tracking-wider text-gray-500">
                Profile Photo
              </label>

              {profile.profileImageUrl ? (
                <div className="relative w-24 h-24 rounded-full overflow-hidden border border-gray-200">
                  <img src={profile.profileImageUrl} alt="Avatar Preview" className="w-full h-full object-cover" />
                </div>
              ) : (
                <div className="w-24 h-24 rounded-full bg-gray-100 border border-gray-200 flex items-center justify-center text-gray-400">
                  No Image
                </div>
              )}

              <div className="relative">
                <input
                  type="file"
                  accept="image/*"
                  onChange={(e) => handleFileUpload(e, "avatar")}
                  disabled={uploadingAvatar}
                  className="hidden"
                  id="avatar-file-input"
                />
                <label
                  htmlFor="avatar-file-input"
                  className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-semibold bg-gray-50 border border-gray-200 hover:bg-gray-100 text-gray-700 cursor-pointer shadow-sm disabled:opacity-50"
                >
                  <Upload size={14} />
                  {uploadingAvatar ? "Uploading..." : "Upload Photo"}
                </label>
              </div>
              <p className="text-[10px] text-gray-400">PNG, JPG or WEBP up to 5MB</p>
            </div>

            {/* Resume PDF Upload */}
            <div className="p-5 border border-dashed border-[#E0E0DC] rounded-2xl flex flex-col items-center justify-center text-center space-y-4">
              <label className="block text-xs font-bold uppercase tracking-wider text-gray-500">
                Resume PDF File
              </label>

              {profile.resumeUrl ? (
                <div className="flex items-center gap-2 p-3 bg-indigo-50 border border-indigo-100 text-indigo-700 rounded-xl text-xs font-medium">
                  <FileText size={16} />
                  <a href={profile.resumeUrl} target="_blank" rel="noreferrer" className="underline truncate max-w-[200px]">
                    View Uploaded Resume
                  </a>
                </div>
              ) : (
                <div className="p-3 bg-gray-50 border border-gray-100 text-gray-400 rounded-xl text-xs italic">
                  No resume PDF uploaded yet.
                </div>
              )}

              <div className="relative">
                <input
                  type="file"
                  accept="application/pdf"
                  onChange={(e) => handleFileUpload(e, "resume")}
                  disabled={uploadingResume}
                  className="hidden"
                  id="resume-file-input"
                />
                <label
                  htmlFor="resume-file-input"
                  className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-semibold bg-gray-50 border border-gray-200 hover:bg-gray-100 text-gray-700 cursor-pointer shadow-sm disabled:opacity-50"
                >
                  <Upload size={14} />
                  {uploadingResume ? "Uploading..." : "Upload PDF"}
                </label>
              </div>
              <p className="text-[10px] text-gray-400">PDF documents only, up to 10MB</p>
            </div>
          </div>
        </div>

        {/* Design & Color Tokens */}
        <div className="space-y-6 border-t border-gray-100 pt-6">
          <h3 className="text-sm font-bold text-gray-900 border-b border-gray-100 pb-3 flex items-center gap-2">
            <span className="w-1.5 h-1.5 rounded-full bg-indigo-600 animate-pulse"></span>
            Design & Color Customization
          </h3>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-gray-500 mb-2">Primary Accent Color</label>
              <div className="flex items-center gap-3">
                <input
                  type="color"
                  name="accentColor"
                  value={profile.accentColor || "#3730A3"}
                  onChange={handleTextChange}
                  className="w-12 h-10 rounded-xl border border-gray-200 cursor-pointer p-1"
                />
                <input
                  type="text"
                  name="accentColor"
                  value={profile.accentColor || "#3730A3"}
                  onChange={handleTextChange}
                  className="w-full px-3 py-2 rounded-lg border border-[#E0E0DC] text-sm focus:outline-none focus:border-indigo-500 bg-gray-50/50"
                  placeholder="#3730A3"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-gray-500 mb-2">Secondary Accent Color</label>
              <div className="flex items-center gap-3">
                <input
                  type="color"
                  name="secondaryAccentColor"
                  value={profile.secondaryAccentColor || "#C2703D"}
                  onChange={handleTextChange}
                  className="w-12 h-10 rounded-xl border border-gray-200 cursor-pointer p-1"
                />
                <input
                  type="text"
                  name="secondaryAccentColor"
                  value={profile.secondaryAccentColor || "#C2703D"}
                  onChange={handleTextChange}
                  className="w-full px-3 py-2 rounded-lg border border-[#E0E0DC] text-sm focus:outline-none focus:border-indigo-500 bg-gray-50/50"
                  placeholder="#C2703D"
                />
              </div>
            </div>
          </div>

          {/* Color Preview Swatch */}
          <div className="p-4 rounded-2xl border border-gray-150 flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-gray-50/50">
            <div className="space-y-1">
              <span className="text-xs font-bold text-gray-400 uppercase tracking-wider">Live Palette Combination Preview</span>
              <p className="text-xs text-gray-500">How your primary and secondary accents work together</p>
            </div>
            <div className="flex items-center gap-2">
              <span 
                className="px-4 py-2 rounded-xl text-xs font-semibold text-white shadow-sm"
                style={{ backgroundColor: profile.accentColor || '#3730A3' }}
              >
                Primary Accent
              </span>
              <span 
                className="px-4 py-2 rounded-xl text-xs font-semibold text-white shadow-sm"
                style={{ backgroundColor: profile.secondaryAccentColor || '#C2703D' }}
              >
                Secondary Accent
              </span>
            </div>
          </div>
        </div>

        {/* Action Button */}
        <div className="flex justify-end border-t border-gray-100 pt-6">
          <button
            type="submit"
            disabled={saving}
            className="inline-flex items-center gap-2 bg-indigo-600 hover:bg-indigo-700 text-white px-6 py-3 rounded-xl text-sm font-semibold shadow-sm transition-all disabled:opacity-50"
          >
            <Save size={16} />
            {saving ? "Saving Changes..." : "Save Settings"}
          </button>
        </div>
      </form>
    </div>
  );
}
