"use client";

import { useState, useEffect } from "react";
import { Plus, Edit2, Trash2, ArrowUp, ArrowDown, Save, X, Briefcase, PlusCircle, CheckCircle, AlertCircle } from "lucide-react";

interface ExperienceItem {
  _id: string;
  company: string;
  role: string;
  startDate: string;
  endDate: string;
  techTags: string[];
  bullets: string[];
  order: number;
}

export default function ExperienceDashboard() {
  const [experiences, setExperiences] = useState<ExperienceItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [message, setMessage] = useState<{ type: "success" | "error"; text: string } | null>(null);

  // Form states
  const [company, setCompany] = useState("");
  const [role, setRole] = useState("");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("Present");
  const [techTagsStr, setTechTagsStr] = useState("");
  const [bulletsStr, setBulletsStr] = useState("");

  const [saving, setSaving] = useState(false);

  const fetchExperiences = async () => {
    try {
      const res = await fetch("/api/experience");
      const data = await res.json();
      if (data.success) {
        setExperiences(data.data || []);
      }
    } catch (err) {
      console.error("Error fetching experiences:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchExperiences();
  }, []);

  const resetForm = () => {
    setCompany("");
    setRole("");
    setStartDate("");
    setEndDate("Present");
    setTechTagsStr("");
    setBulletsStr("");
    setEditingId(null);
  };

  const handleEdit = (item: ExperienceItem) => {
    setEditingId(item._id);
    setCompany(item.company);
    setRole(item.role);
    setStartDate(item.startDate);
    setEndDate(item.endDate);
    setTechTagsStr(item.techTags.join(", "));
    setBulletsStr(item.bullets.join("\n"));
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setMessage(null);

    const techTags = techTagsStr
      .split(",")
      .map((tag) => tag.trim())
      .filter((tag) => tag.length > 0);
    const bullets = bulletsStr
      .split("\n")
      .map((b) => b.trim())
      .filter((b) => b.length > 0);

    const payload = {
      company,
      role,
      startDate,
      endDate,
      techTags,
      bullets,
    };

    try {
      let res;
      if (editingId) {
        // Update
        res = await fetch(`/api/experience/${editingId}`, {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload),
        });
      } else {
        // Create
        res = await fetch("/api/experience", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload),
        });
      }

      const data = await res.json();

      if (!res.ok || !data.success) {
        setMessage({ type: "error", text: data.error || "Save failed" });
      } else {
        setMessage({
          type: "success",
          text: editingId ? "Experience updated successfully!" : "Experience added successfully!",
        });
        resetForm();
        fetchExperiences();
      }
    } catch (err: any) {
      setMessage({ type: "error", text: "Save error: " + err.message });
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this experience entry?")) return;
    setMessage(null);

    try {
      const res = await fetch(`/api/experience/${id}`, {
        method: "DELETE",
      });
      const data = await res.json();

      if (!res.ok || !data.success) {
        setMessage({ type: "error", text: data.error || "Delete failed" });
      } else {
        setMessage({ type: "success", text: "Experience entry deleted successfully!" });
        fetchExperiences();
      }
    } catch (err: any) {
      setMessage({ type: "error", text: "Delete error: " + err.message });
    }
  };

  const handleMove = async (index: number, direction: "up" | "down") => {
    const newIdx = direction === "up" ? index - 1 : index + 1;
    if (newIdx < 0 || newIdx >= experiences.length) return;

    const itemA = experiences[index];
    const itemB = experiences[newIdx];

    // Swap orders locally
    const tempOrder = itemA.order;
    itemA.order = itemB.order;
    itemB.order = tempOrder;

    try {
      // Put updates to API
      await Promise.all([
        fetch(`/api/experience/${itemA._id}`, {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ ...itemA }),
        }),
        fetch(`/api/experience/${itemB._id}`, {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ ...itemB }),
        }),
      ]);

      fetchExperiences();
    } catch (err) {
      console.error("Reorder error:", err);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[300px] text-gray-500 font-sans">
        Loading experience details...
      </div>
    );
  }

  return (
    <div className="space-y-6 font-sans">
      <div>
        <h1 className="text-2xl font-serif font-bold text-gray-900">Work Experience</h1>
        <p className="text-sm text-gray-500 mt-1">
          Add, modify, and sort work placements displayed on your portfolio timeline.
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

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
        {/* Editor Form */}
        <div className="lg:col-span-1 bg-white border border-gray-200 rounded-2xl p-6 shadow-sm">
          <h3 className="text-sm font-bold text-gray-900 border-b border-gray-100 pb-3 mb-4 flex items-center gap-1.5">
            <Briefcase size={16} className="text-indigo-600" />
            {editingId ? "Edit Experience" : "Add Experience"}
          </h3>

          <form onSubmit={handleSave} className="space-y-4">
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-gray-500 mb-1">Company</label>
              <input
                type="text"
                value={company}
                onChange={(e) => setCompany(e.target.value)}
                required
                className="w-full px-3 py-2 rounded-lg border border-[#E0E0DC] text-sm focus:outline-none focus:border-indigo-500 bg-gray-50/50"
                placeholder="e.g. Tata Consultancy Services"
              />
            </div>

            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-gray-500 mb-1">Role/Title</label>
              <input
                type="text"
                value={role}
                onChange={(e) => setRole(e.target.value)}
                required
                className="w-full px-3 py-2 rounded-lg border border-[#E0E0DC] text-sm focus:outline-none focus:border-indigo-500 bg-gray-50/50"
                placeholder="e.g. Backend Developer"
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-gray-500 mb-1">Start Date</label>
                <input
                  type="text"
                  value={startDate}
                  onChange={(e) => setStartDate(e.target.value)}
                  required
                  className="w-full px-3 py-2 rounded-lg border border-[#E0E0DC] text-sm focus:outline-none focus:border-indigo-500 bg-gray-50/50"
                  placeholder="e.g. July 2025"
                />
              </div>
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-gray-500 mb-1">End Date</label>
                <input
                  type="text"
                  value={endDate}
                  onChange={(e) => setEndDate(e.target.value)}
                  required
                  className="w-full px-3 py-2 rounded-lg border border-[#E0E0DC] text-sm focus:outline-none focus:border-indigo-500 bg-gray-50/50"
                  placeholder="e.g. Present or Dec 2026"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-gray-500 mb-1">
                Technology Tags (comma-separated)
              </label>
              <input
                type="text"
                value={techTagsStr}
                onChange={(e) => setTechTagsStr(e.target.value)}
                className="w-full px-3 py-2 rounded-lg border border-[#E0E0DC] text-sm focus:outline-none focus:border-indigo-500 bg-gray-50/50"
                placeholder="Java, Spring Boot, React.js"
              />
            </div>

            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-gray-500 mb-1">
                Bullets/Achievements (one per line)
              </label>
              <textarea
                value={bulletsStr}
                onChange={(e) => setBulletsStr(e.target.value)}
                required
                rows={6}
                className="w-full px-3 py-2 rounded-lg border border-[#E0E0DC] text-sm focus:outline-none focus:border-indigo-500 bg-gray-50/50"
                placeholder="Designed reactive RESTful APIs using Spring WebFlux..."
              />
            </div>

            <div className="flex gap-2 pt-2">
              <button
                type="submit"
                disabled={saving}
                className="flex-1 inline-flex items-center justify-center gap-1.5 bg-indigo-600 hover:bg-indigo-700 text-white py-2 rounded-xl text-xs font-bold transition-all shadow-sm"
              >
                <Save size={14} />
                {saving ? "Saving..." : "Save Entry"}
              </button>
              {editingId && (
                <button
                  type="button"
                  onClick={resetForm}
                  className="inline-flex items-center justify-center p-2 rounded-xl border border-gray-200 hover:bg-gray-50 text-gray-500"
                >
                  <X size={14} />
                </button>
              )}
            </div>
          </form>
        </div>

        {/* List View */}
        <div className="lg:col-span-2 space-y-4">
          <div className="bg-white border border-gray-200 rounded-2xl shadow-sm overflow-hidden">
            <div className="px-6 py-4 border-b border-gray-200 bg-gray-50/50 flex justify-between items-center">
              <span className="text-xs font-bold uppercase tracking-wider text-gray-400">Current History</span>
              <span className="text-xs font-semibold px-2 py-0.5 rounded-full bg-indigo-50 text-indigo-700 border border-indigo-100">
                {experiences.length} total
              </span>
            </div>

            <div className="divide-y divide-gray-150">
              {experiences.map((exp, idx) => (
                <div key={exp._id} className="p-6 flex items-center justify-between gap-4 group">
                  <div className="space-y-1.5 flex-1 min-w-0">
                    <div className="flex items-center gap-2 flex-wrap">
                      <h4 className="text-sm font-bold text-gray-900 truncate">{exp.role}</h4>
                      <span className="text-xs text-indigo-600 font-semibold bg-indigo-50 px-2 py-0.5 rounded-md">
                        {exp.company}
                      </span>
                    </div>
                    <p className="text-xs text-gray-400">
                      {exp.startDate} &ndash; {exp.endDate}
                    </p>
                    {exp.techTags && exp.techTags.length > 0 && (
                      <div className="flex flex-wrap gap-1">
                        {exp.techTags.map((tag, tIdx) => (
                          <span
                            key={tIdx}
                            className="px-1.5 py-0.5 rounded text-[10px] font-medium bg-gray-100 text-gray-600"
                          >
                            {tag}
                          </span>
                        ))}
                      </div>
                    )}
                  </div>

                  {/* Actions */}
                  <div className="flex items-center gap-1.5">
                    {/* Reordering */}
                    <button
                      onClick={() => handleMove(idx, "up")}
                      disabled={idx === 0}
                      className="p-1.5 rounded-lg border border-gray-200 text-gray-400 hover:text-gray-950 hover:bg-gray-50 disabled:opacity-30 transition-colors"
                      title="Move Up"
                    >
                      <ArrowUp size={14} />
                    </button>
                    <button
                      onClick={() => handleMove(idx, "down")}
                      disabled={idx === experiences.length - 1}
                      className="p-1.5 rounded-lg border border-gray-200 text-gray-400 hover:text-gray-950 hover:bg-gray-50 disabled:opacity-30 transition-colors"
                      title="Move Down"
                    >
                      <ArrowDown size={14} />
                    </button>

                    {/* CRUD Operations */}
                    <button
                      onClick={() => handleEdit(exp)}
                      className="p-1.5 rounded-lg border border-gray-200 text-gray-400 hover:text-indigo-600 hover:bg-indigo-50 transition-colors ml-2"
                      title="Edit"
                    >
                      <Edit2 size={14} />
                    </button>
                    <button
                      onClick={() => handleDelete(exp._id)}
                      className="p-1.5 rounded-lg border border-gray-200 text-gray-400 hover:text-red-600 hover:bg-red-50 transition-colors"
                      title="Delete"
                    >
                      <Trash2 size={14} />
                    </button>
                  </div>
                </div>
              ))}

              {experiences.length === 0 && (
                <div className="p-8 text-center text-gray-400 text-sm italic">
                  No experience entries. Use the form to add some!
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
