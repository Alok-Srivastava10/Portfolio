"use client";

import { useState, useEffect } from "react";
import { Plus, Edit2, Trash2, ArrowUp, ArrowDown, Save, X, Settings, CheckCircle, AlertCircle } from "lucide-react";

interface SkillCategoryItem {
  _id: string;
  category: string;
  skills: string[];
  order: number;
}

export default function SkillsDashboard() {
  const [categories, setCategories] = useState<SkillCategoryItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [message, setMessage] = useState<{ type: "success" | "error"; text: string } | null>(null);

  // Form states
  const [category, setCategory] = useState("");
  const [skillsStr, setSkillsStr] = useState("");

  const [saving, setSaving] = useState(false);

  const fetchCategories = async () => {
    try {
      const res = await fetch("/api/skills");
      const data = await res.json();
      if (data.success) {
        setCategories(data.data || []);
      }
    } catch (err) {
      console.error("Error fetching skills:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCategories();
  }, []);

  const resetForm = () => {
    setCategory("");
    setSkillsStr("");
    setEditingId(null);
  };

  const handleEdit = (item: SkillCategoryItem) => {
    setEditingId(item._id);
    setCategory(item.category);
    setSkillsStr(item.skills.join(", "));
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setMessage(null);

    const skills = skillsStr
      .split(",")
      .map((skill) => skill.trim())
      .filter((skill) => skill.length > 0);

    const payload = {
      category,
      skills,
    };

    try {
      let res;
      if (editingId) {
        // Update
        res = await fetch(`/api/skills/${editingId}`, {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload),
        });
      } else {
        // Create
        res = await fetch("/api/skills", {
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
          text: editingId ? "Skill group updated successfully!" : "Skill group added successfully!",
        });
        resetForm();
        fetchCategories();
      }
    } catch (err: any) {
      setMessage({ type: "error", text: "Save error: " + err.message });
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this skill group?")) return;
    setMessage(null);

    try {
      const res = await fetch(`/api/skills/${id}`, {
        method: "DELETE",
      });
      const data = await res.json();

      if (!res.ok || !data.success) {
        setMessage({ type: "error", text: data.error || "Delete failed" });
      } else {
        setMessage({ type: "success", text: "Skill group deleted successfully!" });
        fetchCategories();
      }
    } catch (err: any) {
      setMessage({ type: "error", text: "Delete error: " + err.message });
    }
  };

  const handleMove = async (index: number, direction: "up" | "down") => {
    const newIdx = direction === "up" ? index - 1 : index + 1;
    if (newIdx < 0 || newIdx >= categories.length) return;

    const itemA = categories[index];
    const itemB = categories[newIdx];

    // Swap orders locally
    const tempOrder = itemA.order;
    itemA.order = itemB.order;
    itemB.order = tempOrder;

    try {
      await Promise.all([
        fetch(`/api/skills/${itemA._id}`, {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ ...itemA }),
        }),
        fetch(`/api/skills/${itemB._id}`, {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ ...itemB }),
        }),
      ]);

      fetchCategories();
    } catch (err) {
      console.error("Reorder error:", err);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[300px] text-gray-500 font-sans">
        Loading skills dashboard...
      </div>
    );
  }

  return (
    <div className="space-y-6 font-sans">
      <div>
        <h1 className="text-2xl font-serif font-bold text-gray-900">Skills & Tech Stack</h1>
        <p className="text-sm text-gray-500 mt-1">
          Organize your programming languages, libraries, environments, and certifications into grouped tags.
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
            <Settings size={16} className="text-indigo-600" />
            {editingId ? "Edit Skill Group" : "Add Skill Group"}
          </h3>

          <form onSubmit={handleSave} className="space-y-4">
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-gray-500 mb-1">
                Category Title
              </label>
              <input
                type="text"
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                required
                className="w-full px-3 py-2 rounded-lg border border-[#E0E0DC] text-sm focus:outline-none focus:border-indigo-500 bg-gray-50/50"
                placeholder="e.g. Backend Development"
              />
            </div>

            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-gray-500 mb-1">
                Individual Skills (comma-separated)
              </label>
              <textarea
                value={skillsStr}
                onChange={(e) => setSkillsStr(e.target.value)}
                required
                rows={5}
                className="w-full px-3 py-2 rounded-lg border border-[#E0E0DC] text-sm focus:outline-none focus:border-indigo-500 bg-gray-50/50"
                placeholder="Java, Spring Boot, Spring WebFlux, REST APIs"
              />
            </div>

            <div className="flex gap-2 pt-2">
              <button
                type="submit"
                disabled={saving}
                className="flex-1 inline-flex items-center justify-center gap-1.5 bg-indigo-600 hover:bg-indigo-700 text-white py-2 rounded-xl text-xs font-bold transition-all shadow-sm"
              >
                <Save size={14} />
                {saving ? "Saving..." : "Save Group"}
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
              <span className="text-xs font-bold uppercase tracking-wider text-gray-400">Current Categories</span>
              <span className="text-xs font-semibold px-2 py-0.5 rounded-full bg-indigo-50 text-indigo-700 border border-indigo-100">
                {categories.length} total
              </span>
            </div>

            <div className="divide-y divide-gray-150">
              {categories.map((cat, idx) => (
                <div key={cat._id} className="p-6 flex items-center justify-between gap-4 group">
                  <div className="space-y-2 flex-1 min-w-0">
                    <h4 className="text-sm font-bold text-gray-900 truncate">{cat.category}</h4>
                    <div className="flex flex-wrap gap-1.5">
                      {cat.skills.map((skill, sIdx) => (
                        <span
                          key={sIdx}
                          className="px-2 py-0.5 rounded-full text-[10px] font-medium bg-gray-100 text-gray-600 border border-gray-200"
                        >
                          {skill}
                        </span>
                      ))}
                    </div>
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
                      disabled={idx === categories.length - 1}
                      className="p-1.5 rounded-lg border border-gray-200 text-gray-400 hover:text-gray-950 hover:bg-gray-50 disabled:opacity-30 transition-colors"
                      title="Move Down"
                    >
                      <ArrowDown size={14} />
                    </button>

                    {/* CRUD Operations */}
                    <button
                      onClick={() => handleEdit(cat)}
                      className="p-1.5 rounded-lg border border-gray-200 text-gray-400 hover:text-indigo-600 hover:bg-indigo-50 transition-colors ml-2"
                      title="Edit"
                    >
                      <Edit2 size={14} />
                    </button>
                    <button
                      onClick={() => handleDelete(cat._id)}
                      className="p-1.5 rounded-lg border border-gray-200 text-gray-400 hover:text-red-600 hover:bg-red-50 transition-colors"
                      title="Delete"
                    >
                      <Trash2 size={14} />
                    </button>
                  </div>
                </div>
              ))}

              {categories.length === 0 && (
                <div className="p-8 text-center text-gray-400 text-sm italic">
                  No skills group. Use the form to add some!
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
