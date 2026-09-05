"use client";

import { useEffect, useState, FormEvent } from "react";

type NewsEventItem = {
  id: string;
  type: "news" | "event";
  tag: string;
  title: string;
  description: string;
  eventDate?: string;
  isMarquee: boolean;
  createdAt?: string;
  updatedAt?: string;
};

export default function AdminNewsPage() {
  const [items, setItems] = useState<NewsEventItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [statusMessage, setStatusMessage] = useState<{ type: "success" | "error"; text: string } | null>(null);

  // Filters & Search
  const [filterType, setFilterType] = useState<"all" | "news" | "event" | "marquee">("all");
  const [searchTerm, setSearchTerm] = useState("");

  // Modal State
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingItem, setEditingItem] = useState<{
    id?: string;
    type: "news" | "event";
    tag: string;
    title: string;
    description: string;
    eventDate: string;
    isMarquee: boolean;
  } | null>(null);

  const fetchItems = async () => {
    try {
      const res = await fetch("/api/news-events");
      const data = await res.json();
      if (data.items) {
        setItems(data.items);
      }
    } catch (error) {
      console.error("Failed to load news & events:", error);
      setStatusMessage({ type: "error", text: "Failed to load news & events." });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchItems();
  }, []);

  const openCreateModal = () => {
    setEditingItem({
      type: "news",
      tag: "ADMISSIONS",
      title: "",
      description: "",
      eventDate: "",
      isMarquee: true,
    });
    setIsModalOpen(true);
  };

  const openEditModal = (item: NewsEventItem) => {
    setEditingItem({
      id: item.id,
      type: item.type,
      tag: item.tag,
      title: item.title,
      description: item.description,
      eventDate: item.eventDate || "",
      isMarquee: item.isMarquee,
    });
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setEditingItem(null);
  };

  const handleSaveItem = async (e: FormEvent) => {
    e.preventDefault();
    if (!editingItem) return;

    if (!editingItem.title.trim()) {
      alert("Main heading (title) is required.");
      return;
    }
    if (!editingItem.description.trim()) {
      alert("Description is required.");
      return;
    }

    setSaving(true);
    setStatusMessage(null);

    const isEdit = Boolean(editingItem.id);
    const endpoint = isEdit ? `/api/news-events/${editingItem.id}` : "/api/news-events";
    const method = isEdit ? "PUT" : "POST";

    try {
      const res = await fetch(endpoint, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          type: editingItem.type,
          tag: editingItem.tag,
          title: editingItem.title,
          description: editingItem.description,
          eventDate: editingItem.eventDate,
          isMarquee: editingItem.isMarquee,
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || "Failed to save item.");
      }

      setStatusMessage({
        type: "success",
        text: isEdit ? "Item updated successfully!" : "New item created successfully!",
      });

      closeModal();
      await fetchItems();
    } catch (error: any) {
      console.error("Save error:", error);
      alert(error.message || "Failed to save. Please try again.");
    } finally {
      setSaving(false);
    }
  };

  const handleToggleMarquee = async (item: NewsEventItem) => {
    try {
      const res = await fetch(`/api/news-events/${item.id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ isMarquee: !item.isMarquee }),
      });

      if (!res.ok) {
        throw new Error("Failed to update marquee status.");
      }

      setItems((prev) =>
        prev.map((i) => (i.id === item.id ? { ...i, isMarquee: !i.isMarquee } : i))
      );
    } catch (error: any) {
      alert(error.message || "Could not update status.");
    }
  };

  const handleDeleteItem = async (id: string, title: string) => {
    if (!confirm(`Are you sure you want to delete "${title}"? This action cannot be undone.`)) {
      return;
    }

    try {
      const res = await fetch(`/api/news-events/${id}`, { method: "DELETE" });
      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || "Failed to delete item.");
      }

      setStatusMessage({ type: "success", text: `"${title}" deleted successfully.` });
      await fetchItems();
    } catch (error: any) {
      console.error("Delete error:", error);
      alert(error.message || "Failed to delete item.");
    }
  };

  // Filtered List
  const filteredItems = items.filter((item) => {
    if (filterType === "news" && item.type !== "news") return false;
    if (filterType === "event" && item.type !== "event") return false;
    if (filterType === "marquee" && !item.isMarquee) return false;

    if (searchTerm.trim().length > 0) {
      const query = searchTerm.toLowerCase();
      return (
        item.title.toLowerCase().includes(query) ||
        item.tag.toLowerCase().includes(query) ||
        item.description.toLowerCase().includes(query)
      );
    }

    return true;
  });

  const newsCount = items.filter((i) => i.type === "news").length;
  const eventCount = items.filter((i) => i.type === "event").length;
  const marqueeCount = items.filter((i) => i.isMarquee).length;

  if (loading) {
    return (
      <div>
        <div className="tims-admin-page-header">
          <span className="tims-admin-eyebrow">Content & Events</span>
          <h1 className="tims-admin-heading">News &amp; Events Management</h1>
          <p className="tims-admin-subtitle">Loading news and events...</p>
        </div>
      </div>
    );
  }

  return (
    <div>
      <div className="tims-admin-page-header">
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", flexWrap: "wrap", gap: "1rem" }}>
          <div>
            <span className="tims-admin-eyebrow">Content &amp; Announcements</span>
            <h1 className="tims-admin-heading">News &amp; Events Management</h1>
            <p className="tims-admin-subtitle">
              Manage updates, event schedules, admission notices, and control items featured on the Hero marquee.
            </p>
          </div>
          <button type="button" className="tims-admin-save-button" onClick={openCreateModal}>
            + Add News / Event
          </button>
        </div>
      </div>

      {statusMessage && (
        <div
          className={
            statusMessage.type === "success" ? "tims-admin-alert-success" : "tims-admin-alert-error"
          }
        >
          {statusMessage.text}
        </div>
      )}

      {/* Overview Stat Cards */}
      <div className="tims-admin-stats">
        <div className="tims-admin-stat-card">
          <span className="tims-admin-stat-label">Total Collection Items</span>
          <span className="tims-admin-stat-value">{items.length}</span>
        </div>
        <div className="tims-admin-stat-card">
          <span className="tims-admin-stat-label">News Updates</span>
          <span className="tims-admin-stat-value">{newsCount}</span>
        </div>
        <div className="tims-admin-stat-card">
          <span className="tims-admin-stat-label">Events &amp; Drives</span>
          <span className="tims-admin-stat-value">{eventCount}</span>
        </div>
        <div className="tims-admin-stat-card">
          <span className="tims-admin-stat-label">Featured in Hero Marquee</span>
          <span className="tims-admin-stat-value" style={{ color: "#2563eb" }}>
            {marqueeCount}
          </span>
        </div>
      </div>

      {/* Filter and Search Controls */}
      <div className="tims-admin-card" style={{ marginBottom: "1.25rem", padding: "1rem 1.25rem" }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: "1rem" }}>
          <div style={{ display: "flex", gap: "0.5rem" }}>
            <button
              type="button"
              className={filterType === "all" ? "tims-admin-save-button" : "tims-admin-secondary-button"}
              style={{ padding: "0.45rem 0.9rem", fontSize: "0.8125rem" }}
              onClick={() => setFilterType("all")}
            >
              All ({items.length})
            </button>
            <button
              type="button"
              className={filterType === "news" ? "tims-admin-save-button" : "tims-admin-secondary-button"}
              style={{ padding: "0.45rem 0.9rem", fontSize: "0.8125rem" }}
              onClick={() => setFilterType("news")}
            >
              News ({newsCount})
            </button>
            <button
              type="button"
              className={filterType === "event" ? "tims-admin-save-button" : "tims-admin-secondary-button"}
              style={{ padding: "0.45rem 0.9rem", fontSize: "0.8125rem" }}
              onClick={() => setFilterType("event")}
            >
              Events ({eventCount})
            </button>
            <button
              type="button"
              className={filterType === "marquee" ? "tims-admin-save-button" : "tims-admin-secondary-button"}
              style={{ padding: "0.45rem 0.9rem", fontSize: "0.8125rem" }}
              onClick={() => setFilterType("marquee")}
            >
              Hero Marquee ({marqueeCount})
            </button>
          </div>

          <div style={{ flex: 1, maxWidth: "320px" }}>
            <input
              type="text"
              placeholder="Search by heading or tag..."
              className="tims-admin-input"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              style={{ padding: "0.45rem 0.8rem", fontSize: "0.875rem" }}
            />
          </div>
        </div>
      </div>

      {/* Main Data Table */}
      {filteredItems.length === 0 ? (
        <div className="tims-admin-card" style={{ textAlign: "center", padding: "3rem 1.5rem" }}>
          <h3 style={{ margin: "0 0 0.5rem", fontSize: "1.1rem" }}>No News or Events Found</h3>
          <p className="tims-admin-subtitle" style={{ marginBottom: "1.5rem" }}>
            {searchTerm ? "No items match your search filter." : "Get started by adding your first news or event update."}
          </p>
          {!searchTerm && (
            <button type="button" className="tims-admin-save-button" onClick={openCreateModal}>
              + Add First Item
            </button>
          )}
        </div>
      ) : (
        <div className="tims-admin-card" style={{ padding: 0, overflow: "hidden" }}>
          <div className="tims-admin-table-wrap">
            <table className="tims-admin-table">
              <thead>
                <tr>
                  <th>Type &amp; Tag</th>
                  <th>Main Heading</th>
                  <th>Description</th>
                  <th>Event Date</th>
                  <th>Hero Marquee</th>
                  <th style={{ textAlign: "right" }}>Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredItems.map((item) => (
                  <tr key={item.id}>
                    <td>
                      <div style={{ display: "flex", flexDirection: "column", gap: "0.25rem", alignItems: "flex-start" }}>
                        <span
                          className="tims-admin-badge"
                          style={{
                            background: item.type === "event" ? "rgba(147, 51, 234, 0.12)" : "rgba(37, 99, 235, 0.12)",
                            color: item.type === "event" ? "#7e22ce" : "#1d4ed8",
                            fontSize: "0.7rem",
                            textTransform: "uppercase",
                          }}
                        >
                          {item.type}
                        </span>
                        <span
                          style={{
                            fontSize: "0.75rem",
                            fontWeight: 700,
                            color: "#b45309",
                            background: "#fef3c7",
                            padding: "0.1rem 0.4rem",
                            borderRadius: "4px",
                          }}
                        >
                          {item.tag}
                        </span>
                      </div>
                    </td>
                    <td style={{ maxWidth: "260px" }}>
                      <strong style={{ color: "var(--aa-navy)", display: "block", fontSize: "0.9375rem" }}>
                        {item.title}
                      </strong>
                    </td>
                    <td style={{ maxWidth: "340px", color: "var(--aa-muted)", fontSize: "0.875rem" }}>
                      <p style={{ margin: 0, display: "-webkit-box", WebkitLineClamp: 2, WebkitBoxOrient: "vertical", overflow: "hidden" }}>
                        {item.description}
                      </p>
                    </td>
                    <td style={{ whiteSpace: "nowrap", fontSize: "0.875rem", color: "var(--aa-muted)" }}>
                      {item.eventDate || "—"}
                    </td>
                    <td>
                      <button
                        type="button"
                        onClick={() => handleToggleMarquee(item)}
                        style={{
                          background: "none",
                          border: "none",
                          cursor: "pointer",
                          padding: 0,
                        }}
                      >
                        {item.isMarquee ? (
                          <span className="tims-admin-badge" style={{ background: "rgba(34, 197, 94, 0.15)", color: "#15803d" }}>
                            ✓ Active
                          </span>
                        ) : (
                          <span className="tims-admin-badge tims-admin-badge-muted">
                            Hidden
                          </span>
                        )}
                      </button>
                    </td>
                    <td style={{ textAlign: "right", whiteSpace: "nowrap" }}>
                      <div style={{ display: "flex", gap: "0.4rem", justifyContent: "flex-end" }}>
                        <button
                          type="button"
                          className="tims-admin-secondary-button"
                          style={{ padding: "0.35rem 0.75rem", fontSize: "0.8125rem" }}
                          onClick={() => openEditModal(item)}
                        >
                          Edit
                        </button>
                        <button
                          type="button"
                          className="tims-admin-danger-button"
                          onClick={() => handleDeleteItem(item.id, item.title)}
                        >
                          Delete
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Modal for Create / Edit */}
      {isModalOpen && editingItem && (
        <div className="tims-admin-modal-overlay">
          <div className="tims-admin-modal" style={{ maxWidth: "600px" }}>
            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                marginBottom: "1.25rem",
                paddingBottom: "0.75rem",
                borderBottom: "1px solid var(--aa-border)",
              }}
            >
              <h2 style={{ margin: 0, fontSize: "1.25rem", fontWeight: 800 }}>
                {editingItem.id ? "Edit News / Event" : "Add News or Event Item"}
              </h2>
              <button
                type="button"
                onClick={closeModal}
                style={{
                  background: "none",
                  border: "none",
                  fontSize: "1.5rem",
                  cursor: "pointer",
                  color: "var(--aa-muted)",
                }}
              >
                &times;
              </button>
            </div>

            <form onSubmit={handleSaveItem}>
              <div className="tims-admin-grid-2" style={{ marginBottom: "1.1rem" }}>
                <div className="tims-admin-field" style={{ margin: 0 }}>
                  <label className="tims-admin-label" htmlFor="news-type">
                    Category Type *
                  </label>
                  <select
                    id="news-type"
                    className="tims-admin-input"
                    value={editingItem.type}
                    onChange={(e) =>
                      setEditingItem((prev) =>
                        prev ? { ...prev, type: e.target.value as "news" | "event" } : null
                      )
                    }
                  >
                    <option value="news">News Notice</option>
                    <option value="event">Event Drive</option>
                  </select>
                </div>

                <div className="tims-admin-field" style={{ margin: 0 }}>
                  <label className="tims-admin-label" htmlFor="news-tag">
                    Tag / Category Header *
                  </label>
                  <input
                    id="news-tag"
                    type="text"
                    className="tims-admin-input"
                    placeholder="e.g. ADMISSIONS, SPOT DRIVE, SCHOLARSHIP"
                    value={editingItem.tag}
                    onChange={(e) =>
                      setEditingItem((prev) => (prev ? { ...prev, tag: e.target.value } : null))
                    }
                    required
                  />
                </div>
              </div>

              <div className="tims-admin-field">
                <label className="tims-admin-label" htmlFor="news-title">
                  Main Heading (Title) *
                </label>
                <input
                  id="news-title"
                  type="text"
                  className="tims-admin-input"
                  placeholder="e.g. 2026 Admissions Open for SSLC & Degree"
                  value={editingItem.title}
                  onChange={(e) =>
                    setEditingItem((prev) => (prev ? { ...prev, title: e.target.value } : null))
                  }
                  required
                />
              </div>

              <div className="tims-admin-field">
                <label className="tims-admin-label" htmlFor="news-description">
                  Description *
                </label>
                <textarea
                  id="news-description"
                  rows={4}
                  className="tims-admin-textarea"
                  placeholder="Enter news announcement or event details..."
                  value={editingItem.description}
                  onChange={(e) =>
                    setEditingItem((prev) => (prev ? { ...prev, description: e.target.value } : null))
                  }
                  required
                />
              </div>

              <div className="tims-admin-field">
                <label className="tims-admin-label" htmlFor="news-event-date">
                  Event Date / Announcement Date (Optional)
                </label>
                <input
                  id="news-event-date"
                  type="text"
                  className="tims-admin-input"
                  placeholder="e.g. 15 March 2026 or 2026-03-15"
                  value={editingItem.eventDate}
                  onChange={(e) =>
                    setEditingItem((prev) => (prev ? { ...prev, eventDate: e.target.value } : null))
                  }
                />
              </div>

              <div style={{ margin: "1.25rem 0", display: "flex", alignItems: "center", gap: "0.6rem" }}>
                <input
                  id="news-is-marquee"
                  type="checkbox"
                  checked={editingItem.isMarquee}
                  onChange={(e) =>
                    setEditingItem((prev) => (prev ? { ...prev, isMarquee: e.target.checked } : null))
                  }
                  style={{ width: "18px", height: "18px", cursor: "pointer" }}
                />
                <label htmlFor="news-is-marquee" className="tims-admin-label" style={{ margin: 0, cursor: "pointer" }}>
                  Show in Hero Marquee (Horizontal ticker bar under main hero section)
                </label>
              </div>

              <div
                style={{
                  marginTop: "1.75rem",
                  display: "flex",
                  justifyContent: "flex-end",
                  gap: "0.75rem",
                }}
              >
                <button
                  type="button"
                  className="tims-admin-secondary-button"
                  onClick={closeModal}
                  disabled={saving}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="tims-admin-save-button"
                  disabled={saving}
                >
                  {saving ? "Saving..." : editingItem.id ? "Update Item" : "Create Item"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
