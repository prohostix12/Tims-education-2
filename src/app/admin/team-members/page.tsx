"use client";

import { useEffect, useState, FormEvent, ChangeEvent } from "react";
import styles from "./page.module.css";

type TeamMemberItem = {
  id: string;
  name: string;
  role: string;
  image?: string;
  accentBg?: string;
  bio?: string;
  order: number;
  isPublished: boolean;
  createdAt?: string;
  updatedAt?: string;
};

export default function AdminTeamMembersPage() {
  const [teamMembers, setTeamMembers] = useState<TeamMemberItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [statusMessage, setStatusMessage] = useState<{ type: "success" | "error"; text: string } | null>(null);

  // Modal State
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingItem, setEditingItem] = useState<TeamMemberItem | null>(null);

  // Form State
  const [formData, setFormData] = useState({
    name: "",
    role: "",
    image: "",
    accentBg: "#2563eb",
    bio: "",
    order: 0,
    isPublished: true,
  });

  const fetchTeamMembers = async () => {
    try {
      setLoading(true);
      const res = await fetch("/api/team-members");
      const data = await res.json();
      if (data.teamMembers && Array.isArray(data.teamMembers)) {
        setTeamMembers(data.teamMembers);
      }
    } catch (err) {
      console.error("Failed to load team members:", err);
      setStatusMessage({ type: "error", text: "Failed to load team members from database." });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTeamMembers();
  }, []);

  const openCreateModal = () => {
    setEditingItem(null);
    setFormData({
      name: "",
      role: "",
      image: "",
      accentBg: "#2563eb",
      bio: "",
      order: teamMembers.length,
      isPublished: true,
    });
    setIsModalOpen(true);
  };

  const openEditModal = (item: TeamMemberItem) => {
    setEditingItem(item);
    setFormData({
      name: item.name,
      role: item.role,
      image: item.image || "",
      accentBg: item.accentBg || "#2563eb",
      bio: item.bio || "",
      order: typeof item.order === "number" ? item.order : 0,
      isPublished: Boolean(item.isPublished),
    });
    setIsModalOpen(true);
  };

  const handleFileUpload = async (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    try {
      setUploading(true);
      const body = new FormData();
      body.append("file", file);

      const res = await fetch("/api/upload", {
        method: "POST",
        body,
      });

      const data = await res.json();
      if (data.url) {
        setFormData((prev) => ({ ...prev, image: data.url }));
        setStatusMessage({ type: "success", text: "Image uploaded successfully to GridFS!" });
      } else {
        throw new Error(data.error || "Upload failed.");
      }
    } catch (err: any) {
      console.error("Upload error:", err);
      setStatusMessage({ type: "error", text: err.message || "Failed to upload image." });
    } finally {
      setUploading(false);
    }
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    if (!formData.name.trim() || !formData.role.trim()) {
      setStatusMessage({ type: "error", text: "Please provide both Full Name and Designation." });
      return;
    }

    try {
      setSaving(true);
      let res: Response;

      if (editingItem) {
        res = await fetch(`/api/team-members/${editingItem.id}`, {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(formData),
        });
      } else {
        res = await fetch("/api/team-members", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(formData),
        });
      }

      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Failed to save team member.");

      setStatusMessage({
        type: "success",
        text: editingItem
          ? "Team member updated successfully!"
          : "New team member added successfully!",
      });

      setIsModalOpen(false);
      fetchTeamMembers();
    } catch (err: any) {
      console.error("Save error:", err);
      setStatusMessage({ type: "error", text: err.message || "Failed to save team member." });
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this team member profile?")) return;

    try {
      const res = await fetch(`/api/team-members/${id}`, { method: "DELETE" });
      if (!res.ok) throw new Error("Delete failed.");

      setStatusMessage({ type: "success", text: "Team member deleted successfully." });
      fetchTeamMembers();
    } catch (err) {
      console.error("Delete error:", err);
      setStatusMessage({ type: "error", text: "Failed to delete team member." });
    }
  };

  const toggleStatus = async (item: TeamMemberItem) => {
    try {
      const res = await fetch(`/api/team-members/${item.id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ isPublished: !item.isPublished }),
      });
      if (!res.ok) throw new Error("Status toggle failed.");
      fetchTeamMembers();
    } catch (err) {
      console.error("Status toggle error:", err);
    }
  };

  return (
    <div className={styles.adminPage}>
      {/* Header */}
      <div className={styles.headerRow}>
        <div>
          <span className={styles.eyebrow}>OUR DEDICATED TEAM</span>
          <h1 className={styles.title}>Team Members Management</h1>
          <p className={styles.subtitle}>
            Add, edit, and organize staff &amp; academic team profiles shown on the homepage.
          </p>
        </div>
        <button type="button" onClick={openCreateModal} className={styles.addBtn}>
          + Add Team Member
        </button>
      </div>

      {statusMessage && (
        <div
          className={`${styles.alert} ${
            statusMessage.type === "success" ? styles.alertSuccess : styles.alertError
          }`}
        >
          {statusMessage.text}
        </div>
      )}

      {/* Grid List */}
      {loading ? (
        <div className={styles.emptyState}>Loading team members...</div>
      ) : teamMembers.length === 0 ? (
        <div className={styles.emptyState}>
          No team members found. Click &quot;+ Add Team Member&quot; above to create one.
        </div>
      ) : (
        <div className={styles.grid}>
          {teamMembers.map((member) => (
            <div
              key={member.id}
              className={`${styles.card} ${!member.isPublished ? styles.cardDraft : ""}`}
            >
              <div className={styles.cardPhotoArea}>
                {member.image ? (
                  <img src={member.image} alt={member.name} className={styles.cardImg} />
                ) : (
                  <span className={styles.cardPlaceholder}>No Photo</span>
                )}
              </div>
              <div className={styles.cardBody}>
                <span className={styles.cardRole}>{member.role}</span>
                <h3 className={styles.cardName}>{member.name}</h3>

                <div className={styles.cardFooter}>
                  <button
                    type="button"
                    onClick={() => toggleStatus(member)}
                    className={`${styles.statusPill} ${
                      member.isPublished ? styles.statusPublished : styles.statusDraft
                    }`}
                  >
                    {member.isPublished ? "✓ Published" : "Hidden"}
                  </button>
                  <div className={styles.actionBtns}>
                    <button
                      type="button"
                      onClick={() => openEditModal(member)}
                      className={styles.editBtn}
                    >
                      Edit
                    </button>
                    <button
                      type="button"
                      onClick={() => handleDelete(member.id)}
                      className={styles.deleteBtn}
                    >
                      Delete
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Modal */}
      {isModalOpen && (
        <div className={styles.modalBackdrop} onClick={() => setIsModalOpen(false)}>
          <div className={styles.modalContent} onClick={(e) => e.stopPropagation()}>
            <h2 className={styles.modalTitle}>
              {editingItem ? "Edit Team Member" : "Add New Team Member"}
            </h2>

            <form onSubmit={handleSubmit}>
              <div className={styles.formGroup}>
                <label className={styles.label}>Full Name *</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Sujith Kumar"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className={styles.input}
                />
              </div>

              <div className={styles.formGroup}>
                <label className={styles.label}>Designation / Role *</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Senior Academic Counselor"
                  value={formData.role}
                  onChange={(e) => setFormData({ ...formData, role: e.target.value })}
                  className={styles.input}
                />
              </div>

              <div className={styles.formGroup}>
                <label className={styles.label}>Photo Upload (GridFS Database)</label>
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleFileUpload}
                  className={styles.input}
                />
                {uploading && <small style={{ color: "#2563eb" }}>Uploading photo...</small>}
                {formData.image && (
                  <div style={{ marginTop: "8px" }}>
                    <img
                      src={formData.image}
                      alt="Preview"
                      style={{ width: "80px", height: "95px", objectFit: "cover", borderRadius: "8px" }}
                    />
                  </div>
                )}
              </div>

              <div className={styles.formGroup}>
                <label className={styles.label}>Display Order</label>
                <input
                  type="number"
                  value={formData.order}
                  onChange={(e) => setFormData({ ...formData, order: Number(e.target.value) })}
                  className={styles.input}
                />
              </div>

              <div className={styles.formActions}>
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className={styles.cancelBtn}
                >
                  Cancel
                </button>
                <button type="submit" disabled={saving} className={styles.saveBtn}>
                  {saving ? "Saving..." : editingItem ? "Update Member" : "Create Member"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
