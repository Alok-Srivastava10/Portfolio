"use client";

import { useState, useEffect } from "react";
import { Plus, Edit2, Trash2, ArrowUp, ArrowDown, Save, X, BookOpen, CheckCircle, AlertCircle } from "lucide-react";

interface EducationItem {
  _id: string;
  institution: string;
  degree: string;
  field: string;
  cgpaOrGrade?: string;
  location?: string;
  startDate: string;
  endDate: string;
  order: number;
}

export default function EducationDashboard() {
  const [education, setEducation] = useState<EducationItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [message, setMessage] = useState<{ type: "success" | "error"; text: string } | null>(null);

  // Form states
  const [institution, setInstitution] = useState("");
  const [degree, setDegree] = useState("");
  const [field, setField] = useState("");
  const [cgpaOrGrade, setCgpaOrGrade] = useState("");
  const [location, setLocation] = useState("");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");

  const [saving, setSaving] = useState(false);

  const fetchEducation = async () => {
    try {
      const res = await fetch("/api/education");
      const data = await res.json();
      if (data.success) {
        setEducation(data.data || []);
      }
    } catch (err) {
      console.error("Error fetching education:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchEducation();
  }, []);

  const resetForm = () => {
    setInstitution("");
    setDegree("");
    setField("");
    setCgpaOrGrade("");
    setLocation("");
    setStartDate("");
    setEndDate("");
    setEditingId(null);
  };

  const handleEdit = (item: EducationItem) => {
    setEditingId(item._id);
    setInstitution(item.institution);
    setDegree(item.degree);
    setField(item.field);
    setCgpaOrGrade(item.cgpaOrGrade || "");
    setLocation(item.location || "");
    setStartDate(item.startDate);
    setEndDate(item.endDate);
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setMessage(null);

    const payload = {
      institution,
      degree,
      field,
      cgpaOrGrade: cgpaOrGrade || undefined,
      location: location || undefined,
      startDate,
      endDate,
    };

    try {
      let res;
      if (editingId) {
        // Update
        res = await fetch(`/api/education/${editingId}`, {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload),
        });
      } else {
        // Create
        res = await fetch("/api/education", {
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
          text: editingId ? "Education entry updated successfully!" : "Education entry added successfully!",
        });
        resetForm();
        fetchEducation();
      }
    } catch (err: any) {
      setMessage({ type: "error", text: "Save error: " + err.message });
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this education entry?")) return;
    setMessage(null);

    try {
      const res = await fetch(`/api/education/${id}`, {
        method: "DELETE",
      });
      const data = await res.json();

      if (!res.ok || !data.success) {
        setMessage({ type: "error", text: data.error || "Delete failed" });
      } else {
        setMessage({ type: "success", text: "Education entry deleted successfully!" });
        fetchEducation();
      }
    } catch (err: any) {
      setMessage({ type: "error", text: "Delete error: " + err.message });
    }
  };

  const handleMove = async (index: number, direction: "up" | "down") => {
    const newIdx = direction === "up" ? index - 1 : index + 1;
    if (newIdx < 0 || newIdx >= education.length) return;

    const itemA = education[index];
    const itemB = education[newIdx];

    // Swap orders locally
    const tempOrder = itemA.order;
    itemA.order = itemB.order;
    itemB.order = tempOrder;

    try {
      await Promise.all([
        fetch(`/api/education/${itemA._id}`, {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ ...itemA }),
        }),
        fetch(`/api/education/${itemB._id}`, {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ ...itemB }),
        }),
      ]);

      fetchEducation();
    } catch (err) {
      console.error("Reorder error:", err);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[300px] text-gray-500 font-sans">
        Loading education dashboard...
      </div>
    );
  }

  return (
    <div className="space-y-6 font-sans">
      <div>
        <h1 className="text-2xl font-serif font-bold text-gray-900">Education</h1>
        <p className="text-sm text-gray-500 mt-1">
          Manage details of college degrees, grades, duration, and institution.
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
            <BookOpen size={16} className="text-indigo-600" />
            {editingId ? "Edit Education" : "Add Education"}
          </h3>

          <form onSubmit={handleSave} className="space-y-4">
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-gray-500 mb-1">
                Institution Name
              </label>
              <input
                type="text"
                value={institution}
                onChange={(e) => setInstitution(e.target.value)}
                required
                className="w-full px-3 py-2 rounded-lg border border-[#E0E0DC] text-sm focus:outline-none focus:border-indigo-500 bg-gray-50/50"
                placeholder="e.g. JSS Academy of Technical Education"
              />
            </div>

            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-gray-500 mb-1">
                Degree (e.g. Bachelor of Technology)
              </label>
              <input
                type="text"
                value={degree}
                onChange={(e) => setDegree(e.target.value)}
                required
                className="w-full px-3 py-2 rounded-lg border border-[#E0E0DC] text-sm focus:outline-none focus:border-indigo-500 bg-gray-50/50"
                placeholder="e.g. Bachelor of Technology"
              />
            </div>

            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-gray-500 mb-1">
                Field of Study (e.g. Information Technology)
              </label>
              <input
                type="text"
                value={field}
                onChange={(e) => setField(e.target.value)}
                required
                className="w-full px-3 py-2 rounded-lg border border-[#E0E0DC] text-sm focus:outline-none focus:border-indigo-500 bg-gray-50/50"
                placeholder="e.g. Information Technology"
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-gray-500 mb-1">
                  Grade / CGPA
                </label>
                <input
                  type="text"
                  value={cgpaOrGrade}
                  onChange={(e) => setCgpaOrGrade(e.target.value)}
                  className="w-full px-3 py-2 rounded-lg border border-[#E0E0DC] text-sm focus:outline-none focus:border-indigo-500 bg-gray-50/50"
                  placeholder="e.g. 8.0 CGPA"
                />
              </div>
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-gray-500 mb-1">
                  Location
                </label>
                <input
                  type="text"
                  value={location}
                  onChange={(e) => setLocation(e.target.value)}
                  className="w-full px-3 py-2 rounded-lg border border-[#E0E0DC] text-sm focus:outline-none focus:border-indigo-500 bg-gray-50/50"
                  placeholder="e.g. Noida, UP"
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-gray-500 mb-1">
                  Start Date
                </label>
                <input
                  type="text"
                  value={startDate}
                  onChange={(e) => setStartDate(e.target.value)}
                  required
                  className="w-full px-3 py-2 rounded-lg border border-[#E0E0DC] text-sm focus:outline-none focus:border-indigo-500 bg-gray-50/50"
                  placeholder="e.g. Nov 2021"
                />
              </div>
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-gray-500 mb-1">
                  End Date
                </label>
                <input
                  type="text"
                  value={endDate}
                  onChange={(e) => setEndDate(e.target.value)}
                  required
                  className="w-full px-3 py-2 rounded-lg border border-[#E0E0DC] text-sm focus:outline-none focus:border-indigo-500 bg-gray-50/50"
                  placeholder="e.g. May 2025"
                />
              </div>
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
                {education.length} total
              </span>
            </div>

            <div className="divide-y divide-gray-150">
              {education.map((edu, idx) => (
                <div key={edu._id} className="p-6 flex items-center justify-between gap-4 group">
                  <div className="space-y-1 flex-1 min-w-0">
                    <h4 className="text-sm font-bold text-gray-900 truncate">
                      {edu.degree} &mdash; {edu.field}
                    </h4>
                    <p className="text-xs font-medium text-indigo-600">{edu.institution}</p>
                    <p className="text-xs text-gray-400">
                      {edu.startDate} &ndash; {edu.endDate} {edu.cgpaOrGrade ? `(${edu.cgpaOrGrade})` : ""}
                    </p>
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
                      disabled={idx === education.length - 1}
                      className="p-1.5 rounded-lg border border-gray-200 text-gray-400 hover:text-gray-950 hover:bg-gray-50 disabled:opacity-30 transition-colors"
                      title="Move Down"
                    >
                      <ArrowDown size={14} />
                    </button>

                    {/* CRUD Operations */}
                    <button
                      onClick={() => handleEdit(edu)}
                      className="p-1.5 rounded-lg border border-gray-200 text-gray-400 hover:text-indigo-600 hover:bg-indigo-50 transition-colors ml-2"
                      title="Edit"
                    >
                      <Edit2 size={14} />
                    </button>
                    <button
                      onClick={() => handleDelete(edu._id)}
                      className="p-1.5 rounded-lg border border-gray-200 text-gray-400 hover:text-red-600 hover:bg-red-50 transition-colors"
                      title="Delete"
                    >
                      <Trash2 size={14} />
                    </button>
                  </div>
                </div>
              ))}

              {education.length === 0 && (
                <div className="p-8 text-center text-gray-400 text-sm italic">
                  No education details. Use the form to add some!
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
