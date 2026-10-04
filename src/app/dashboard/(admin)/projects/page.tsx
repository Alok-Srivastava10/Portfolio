"use client";

import { useState, useEffect } from "react";
import { Plus, Edit2, Trash2, ArrowUp, ArrowDown, Save, X, FolderKanban, CheckCircle, AlertCircle } from "lucide-react";

interface ProjectItem {
  _id: string;
  title: string;
  techTags: string[];
  bullets: string[];
  githubUrl?: string;
  liveUrl?: string;
  featured: boolean;
  order: number;
}

export default function ProjectsDashboard() {
  const [projects, setProjects] = useState<ProjectItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [message, setMessage] = useState<{ type: "success" | "error"; text: string } | null>(null);

  // Form states
  const [title, setTitle] = useState("");
  const [techTagsStr, setTechTagsStr] = useState("");
  const [bulletsStr, setBulletsStr] = useState("");
  const [githubUrl, setGithubUrl] = useState("");
  const [liveUrl, setLiveUrl] = useState("");
  const [featured, setFeatured] = useState(false);

  const [saving, setSaving] = useState(false);

  const fetchProjects = async () => {
    try {
      const res = await fetch("/api/projects");
      const data = await res.json();
      if (data.success) {
        setProjects(data.data || []);
      }
    } catch (err) {
      console.error("Error fetching projects:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProjects();
  }, []);

  const resetForm = () => {
    setTitle("");
    setTechTagsStr("");
    setBulletsStr("");
    setGithubUrl("");
    setLiveUrl("");
    setFeatured(false);
    setEditingId(null);
  };

  const handleEdit = (item: ProjectItem) => {
    setEditingId(item._id);
    setTitle(item.title);
    setTechTagsStr(item.techTags.join(", "));
    setBulletsStr(item.bullets.join("\n"));
    setGithubUrl(item.githubUrl || "");
    setLiveUrl(item.liveUrl || "");
    setFeatured(item.featured);
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
      title,
      techTags,
      bullets,
      githubUrl: githubUrl || undefined,
      liveUrl: liveUrl || undefined,
      featured,
    };

    try {
      let res;
      if (editingId) {
        // Update
        res = await fetch(`/api/projects/${editingId}`, {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload),
        });
      } else {
        // Create
        res = await fetch("/api/projects", {
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
          text: editingId ? "Project updated successfully!" : "Project added successfully!",
        });
        resetForm();
        fetchProjects();
      }
    } catch (err: any) {
      setMessage({ type: "error", text: "Save error: " + err.message });
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this project?")) return;
    setMessage(null);

    try {
      const res = await fetch(`/api/projects/${id}`, {
        method: "DELETE",
      });
      const data = await res.json();

      if (!res.ok || !data.success) {
        setMessage({ type: "error", text: data.error || "Delete failed" });
      } else {
        setMessage({ type: "success", text: "Project deleted successfully!" });
        fetchProjects();
      }
    } catch (err: any) {
      setMessage({ type: "error", text: "Delete error: " + err.message });
    }
  };

  const handleMove = async (index: number, direction: "up" | "down") => {
    const newIdx = direction === "up" ? index - 1 : index + 1;
    if (newIdx < 0 || newIdx >= projects.length) return;

    const itemA = projects[index];
    const itemB = projects[newIdx];

    // Swap orders locally
    const tempOrder = itemA.order;
    itemA.order = itemB.order;
    itemB.order = tempOrder;

    try {
      await Promise.all([
        fetch(`/api/projects/${itemA._id}`, {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ ...itemA }),
        }),
        fetch(`/api/projects/${itemB._id}`, {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ ...itemB }),
        }),
      ]);

      fetchProjects();
    } catch (err) {
      console.error("Reorder error:", err);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[300px] text-gray-500 font-sans">
        Loading projects list...
      </div>
    );
  }

  return (
    <div className="space-y-6 font-sans">
      <div>
        <h1 className="text-2xl font-serif font-bold text-gray-900">Projects</h1>
        <p className="text-sm text-gray-500 mt-1">
          Manage repository links, live demos, description highlights, and tech stacks for your builds.
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
            <FolderKanban size={16} className="text-indigo-600" />
            {editingId ? "Edit Project" : "Add Project"}
          </h3>

          <form onSubmit={handleSave} className="space-y-4">
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-gray-500 mb-1">Project Title</label>
              <input
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                required
                className="w-full px-3 py-2 rounded-lg border border-[#E0E0DC] text-sm focus:outline-none focus:border-indigo-500 bg-gray-50/50"
                placeholder="e.g. Automobile Resale Platform"
              />
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
                placeholder="Java, Spring WebFlux, MongoDB"
              />
            </div>

            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-gray-500 mb-1">GitHub URL</label>
              <input
                type="url"
                value={githubUrl}
                onChange={(e) => setGithubUrl(e.target.value)}
                className="w-full px-3 py-2 rounded-lg border border-[#E0E0DC] text-sm focus:outline-none focus:border-indigo-500 bg-gray-50/50"
                placeholder="https://github.com/alok/project"
              />
            </div>

            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-gray-500 mb-1">Live URL (Demo)</label>
              <input
                type="url"
                value={liveUrl}
                onChange={(e) => setLiveUrl(e.target.value)}
                className="w-full px-3 py-2 rounded-lg border border-[#E0E0DC] text-sm focus:outline-none focus:border-indigo-500 bg-gray-50/50"
                placeholder="https://project-demo.com"
              />
            </div>

            <div className="flex items-center gap-2 py-1">
              <input
                type="checkbox"
                id="featured-checkbox"
                checked={featured}
                onChange={(e) => setFeatured(e.target.checked)}
                className="w-4 h-4 text-indigo-600 border-[#E0E0DC] rounded focus:ring-indigo-500"
              />
              <label htmlFor="featured-checkbox" className="text-xs font-bold uppercase tracking-wider text-gray-600">
                Featured Build (Show on Home)
              </label>
            </div>

            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-gray-500 mb-1">
                Key Bullet Points (one per line)
              </label>
              <textarea
                value={bulletsStr}
                onChange={(e) => setBulletsStr(e.target.value)}
                required
                rows={5}
                className="w-full px-3 py-2 rounded-lg border border-[#E0E0DC] text-sm focus:outline-none focus:border-indigo-500 bg-gray-50/50"
                placeholder="Built scalable microservices serving 50,000+ users..."
              />
            </div>

            <div className="flex gap-2 pt-2">
              <button
                type="submit"
                disabled={saving}
                className="flex-1 inline-flex items-center justify-center gap-1.5 bg-indigo-600 hover:bg-indigo-700 text-white py-2 rounded-xl text-xs font-bold transition-all shadow-sm"
              >
                <Save size={14} />
                {saving ? "Saving..." : "Save Project"}
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
              <span className="text-xs font-bold uppercase tracking-wider text-gray-400">Current builds</span>
              <span className="text-xs font-semibold px-2 py-0.5 rounded-full bg-indigo-50 text-indigo-700 border border-indigo-100">
                {projects.length} total
              </span>
            </div>

            <div className="divide-y divide-gray-150">
              {projects.map((project, idx) => (
                <div key={project._id} className="p-6 flex items-center justify-between gap-4 group">
                  <div className="space-y-1.5 flex-1 min-w-0">
                    <div className="flex items-center gap-2 flex-wrap">
                      <h4 className="text-sm font-bold text-gray-900 truncate">{project.title}</h4>
                      {project.featured && (
                        <span className="text-[10px] font-bold uppercase tracking-wider bg-amber-50 border border-amber-200 text-amber-700 px-2 py-0.5 rounded-full">
                          Featured
                        </span>
                      )}
                    </div>

                    <div className="flex gap-4 text-xs text-gray-400 flex-wrap">
                      {project.githubUrl && <span className="truncate max-w-[150px]">GitHub: {project.githubUrl}</span>}
                      {project.liveUrl && <span className="truncate max-w-[150px]">Live: {project.liveUrl}</span>}
                    </div>

                    {project.techTags && project.techTags.length > 0 && (
                      <div className="flex flex-wrap gap-1">
                        {project.techTags.map((tag, tIdx) => (
                          <span
                            key={tIdx}
                            className="px-1.5 py-0.5 rounded text-[10px] font-medium bg-indigo-50 text-indigo-700"
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
                      disabled={idx === projects.length - 1}
                      className="p-1.5 rounded-lg border border-gray-200 text-gray-400 hover:text-gray-950 hover:bg-gray-50 disabled:opacity-30 transition-colors"
                      title="Move Down"
                    >
                      <ArrowDown size={14} />
                    </button>

                    {/* CRUD Operations */}
                    <button
                      onClick={() => handleEdit(project)}
                      className="p-1.5 rounded-lg border border-gray-200 text-gray-400 hover:text-indigo-600 hover:bg-indigo-50 transition-colors ml-2"
                      title="Edit"
                    >
                      <Edit2 size={14} />
                    </button>
                    <button
                      onClick={() => handleDelete(project._id)}
                      className="p-1.5 rounded-lg border border-gray-200 text-gray-400 hover:text-red-600 hover:bg-red-50 transition-colors"
                      title="Delete"
                    >
                      <Trash2 size={14} />
                    </button>
                  </div>
                </div>
              ))}

              {projects.length === 0 && (
                <div className="p-8 text-center text-gray-400 text-sm italic">
                  No projects. Use the form to add some!
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
