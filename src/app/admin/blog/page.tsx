"use client";

import { useEffect, useState, FormEvent, DragEvent, ChangeEvent } from "react";
import styles from "./page.module.css";
import { parseBlogDate } from "@/data/blogData";

type BlogSectionItem = {
  heading: string;
  body: string[];
  quote?: string;
};

type BlogPostItem = {
  id: string;
  slug: string;
  title: string;
  subtitle?: string;
  day: string;
  month: string;
  year: string;
  dateString: string;
  author: string;
  authorRole?: string;
  comments: number;
  readTime: string;
  category: string;
  image?: string;
  excerpt: string;
  content: {
    intro: string;
    keyTakeaways?: string[];
    sections: BlogSectionItem[];
    conclusion: string;
  };
  tags: string[];
  isPublished: boolean;
  isFeaturedOnHome: boolean;
  createdAt?: string;
  updatedAt?: string;
};

const DEFAULT_CATEGORIES = ["University Updates", "Career Guidance", "Education Trends", "Exams & Results", "General"];

export default function AdminBlogPage() {
  const [posts, setPosts] = useState<BlogPostItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [statusMessage, setStatusMessage] = useState<{ type: "success" | "error"; text: string } | null>(null);

  // Search & Filter
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("ALL");

  // Modal & Confirm State
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [deleteConfirmId, setDeleteConfirmId] = useState<string | null>(null);

  // Form State
  const [formData, setFormData] = useState<{
    id?: string;
    slug: string;
    title: string;
    subtitle: string;
    day: string;
    month: string;
    year: string;
    dateString: string;
    isoDate: string;
    author: string;
    authorRole: string;
    readTime: string;
    category: string;
    image: string;
    excerpt: string;
    intro: string;
    keyTakeaways: string[];
    sections: { heading: string; bodyText: string; quote: string }[];
    conclusion: string;
    tagsInput: string;
    isPublished: boolean;
    isFeaturedOnHome: boolean;
  }>({
    slug: "",
    title: "",
    subtitle: "",
    day: "",
    month: "",
    year: "",
    dateString: "",
    isoDate: "",
    author: "TIMS Academic Desk",
    authorRole: "Senior Academic Coordinator",
    readTime: "5 min read",
    category: "University Updates",
    image: "",
    excerpt: "",
    intro: "",
    keyTakeaways: [""],
    sections: [{ heading: "", bodyText: "", quote: "" }],
    conclusion: "",
    tagsInput: "TIMS Education, Distance Education",
    isPublished: true,
    isFeaturedOnHome: false,
  });

  const [isDragging, setIsDragging] = useState(false);

  const fetchBlogPosts = async () => {
    try {
      const res = await fetch("/api/blog");
      const data = await res.json();
      if (data.posts && Array.isArray(data.posts)) {
        setPosts(data.posts);
      }
    } catch (error) {
      console.error("Failed to load blog posts:", error);
      setStatusMessage({ type: "error", text: "Failed to load blog posts from database." });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBlogPosts();
  }, []);

  const handleDatePickerChange = (isoVal: string) => {
    const parsed = parseBlogDate(isoVal);
    setFormData((prev) => ({
      ...prev,
      isoDate: isoVal,
      day: parsed.day,
      month: parsed.month,
      year: parsed.year,
      dateString: parsed.dateString,
    }));
  };

  const handleDateStringChange = (val: string) => {
    const parsed = parseBlogDate(val);
    setFormData((prev) => ({
      ...prev,
      dateString: val,
      day: parsed.day,
      month: parsed.month,
      year: parsed.year,
      isoDate: parsed.isoDate,
    }));
  };

  const openCreateModal = () => {
    const parsed = parseBlogDate();

    setFormData({
      title: "",
      slug: "",
      subtitle: "",
      day: parsed.day,
      month: parsed.month,
      year: parsed.year,
      dateString: parsed.dateString,
      isoDate: parsed.isoDate,
      author: "TIMS Academic Desk",
      authorRole: "Senior Academic Coordinator",
      readTime: "5 min read",
      category: "University Updates",
      image: "",
      excerpt: "",
      intro: "",
      keyTakeaways: [""],
      sections: [{ heading: "Overview", bodyText: "", quote: "" }],
      conclusion: "",
      tagsInput: "TIMS Education, Distance Education",
      isPublished: true,
      isFeaturedOnHome: false,
    });
    setIsModalOpen(true);
  };

  const openEditModal = (item: BlogPostItem) => {
    const parsed = parseBlogDate(item.dateString || `${item.year}-${item.month}-${item.day}`);
    setFormData({
      id: item.id,
      slug: item.slug,
      title: item.title,
      subtitle: item.subtitle || "",
      day: parsed.day,
      month: parsed.month,
      year: parsed.year,
      dateString: item.dateString || parsed.dateString,
      isoDate: parsed.isoDate,
      author: item.author || "TIMS Academic Desk",
      authorRole: item.authorRole || "Senior Academic Coordinator",
      readTime: item.readTime || "5 min read",
      category: item.category || "University Updates",
      image: item.image || "",
      excerpt: item.excerpt || "",
      intro: item.content?.intro || "",
      keyTakeaways: item.content?.keyTakeaways && item.content.keyTakeaways.length > 0 ? item.content.keyTakeaways : [""],
      sections:
        item.content?.sections && item.content.sections.length > 0
          ? item.content.sections.map((sec) => ({
              heading: sec.heading || "",
              bodyText: Array.isArray(sec.body) ? sec.body.join("\n\n") : "",
              quote: sec.quote || "",
            }))
          : [{ heading: "", bodyText: "", quote: "" }],
      conclusion: item.content?.conclusion || "",
      tagsInput: Array.isArray(item.tags) ? item.tags.join(", ") : "",
      isPublished: Boolean(item.isPublished),
      isFeaturedOnHome: Boolean(item.isFeaturedOnHome),
    });
    setIsModalOpen(true);
  };


  const uploadFile = async (file: File) => {
    if (!file.type.startsWith("image/")) {
      setStatusMessage({ type: "error", text: "Please upload an image file (PNG, JPG, WEBP, etc.)." });
      return;
    }

    setUploading(true);
    const body = new FormData();
    body.append("file", file);

    try {
      const res = await fetch("/api/upload", {
        method: "POST",
        body,
      });

      const data = await res.json();
      if (res.ok && data.url) {
        setFormData((prev) => ({
          ...prev,
          image: data.url,
        }));
        setStatusMessage({ type: "success", text: "Cover image uploaded successfully!" });
      } else {
        setStatusMessage({ type: "error", text: data.error || "Failed to upload image." });
      }
    } catch (err) {
      console.error("Upload failed:", err);
      setStatusMessage({ type: "error", text: "Failed to upload image." });
    } finally {
      setUploading(false);
    }
  };

  const handleDragOver = (e: DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = (e: DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(false);
  };

  const handleDrop = (e: DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      uploadFile(e.dataTransfer.files[0]);
    }
  };

  const handleFileChange = (e: ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      uploadFile(e.target.files[0]);
    }
  };

  // Dynamic Key Takeaways Helpers
  const addTakeaway = () => {
    setFormData((prev) => ({ ...prev, keyTakeaways: [...prev.keyTakeaways, ""] }));
  };

  const updateTakeaway = (index: number, val: string) => {
    setFormData((prev) => {
      const next = [...prev.keyTakeaways];
      next[index] = val;
      return { ...prev, keyTakeaways: next };
    });
  };

  const removeTakeaway = (index: number) => {
    setFormData((prev) => {
      const next = prev.keyTakeaways.filter((_, i) => i !== index);
      return { ...prev, keyTakeaways: next.length > 0 ? next : [""] };
    });
  };

  // Dynamic Section Helpers
  const addSection = () => {
    setFormData((prev) => ({
      ...prev,
      sections: [...prev.sections, { heading: "", bodyText: "", quote: "" }],
    }));
  };

  const updateSectionField = (index: number, field: "heading" | "bodyText" | "quote", val: string) => {
    setFormData((prev) => {
      const next = [...prev.sections];
      next[index] = { ...next[index], [field]: val };
      return { ...prev, sections: next };
    });
  };

  const removeSection = (index: number) => {
    setFormData((prev) => {
      const next = prev.sections.filter((_, i) => i !== index);
      return { ...prev, sections: next.length > 0 ? next : [{ heading: "", bodyText: "", quote: "" }] };
    });
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setStatusMessage(null);

    if (!formData.title.trim()) {
      setStatusMessage({ type: "error", text: "Article title is required." });
      setSaving(false);
      return;
    }

    const formattedSections = formData.sections
      .filter((sec) => sec.heading.trim() || sec.bodyText.trim())
      .map((sec) => ({
        heading: sec.heading.trim(),
        body: sec.bodyText
          .split("\n\n")
          .map((p) => p.trim())
          .filter(Boolean),
        quote: sec.quote.trim() || undefined,
      }));

    const formattedTakeaways = formData.keyTakeaways.map((t) => t.trim()).filter(Boolean);
    const tagsArray = formData.tagsInput
      .split(",")
      .map((t) => t.trim())
      .filter(Boolean);

    const payload = {
      title: formData.title,
      slug: formData.slug,
      subtitle: formData.subtitle,
      day: formData.day,
      month: formData.month,
      year: formData.year,
      dateString: formData.dateString,
      author: formData.author,
      authorRole: formData.authorRole,
      readTime: formData.readTime,
      category: formData.category,
      image: formData.image,
      excerpt: formData.excerpt || formData.intro.slice(0, 160),
      content: {
        intro: formData.intro,
        keyTakeaways: formattedTakeaways,
        sections: formattedSections,
        conclusion: formData.conclusion,
      },
      tags: tagsArray,
      isPublished: formData.isPublished,
      isFeaturedOnHome: formData.isFeaturedOnHome,
    };

    try {
      const isEditing = Boolean(formData.id);
      const url = isEditing ? `/api/blog/${formData.id}` : "/api/blog";
      const method = isEditing ? "PUT" : "POST";

      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || "Failed to save blog article.");
      }

      setStatusMessage({
        type: "success",
        text: isEditing ? "Blog article updated successfully!" : "New blog article published successfully!",
      });

      setIsModalOpen(false);
      fetchBlogPosts();
    } catch (error: any) {
      console.error("Save error:", error);
      setStatusMessage({ type: "error", text: error.message || "Failed to save blog article." });
    } finally {
      setSaving(false);
    }
  };

  const handleTogglePublish = async (item: BlogPostItem) => {
    try {
      const res = await fetch(`/api/blog/${item.id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ isPublished: !item.isPublished }),
      });

      if (res.ok) {
        setPosts((prev) =>
          prev.map((post) => (post.id === item.id ? { ...post, isPublished: !post.isPublished } : post))
        );
      }
    } catch (err) {
      console.error("Failed to toggle publish status:", err);
    }
  };

  const handleToggleFeature = async (item: BlogPostItem) => {
    try {
      const res = await fetch(`/api/blog/${item.id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ isFeaturedOnHome: !item.isFeaturedOnHome }),
      });

      if (res.ok) {
        setPosts((prev) =>
          prev.map((post) => (post.id === item.id ? { ...post, isFeaturedOnHome: !post.isFeaturedOnHome } : post))
        );
      }
    } catch (err) {
      console.error("Failed to toggle feature status:", err);
    }
  };

  const handleDelete = async (id: string) => {
    try {
      const res = await fetch(`/api/blog/${id}`, { method: "DELETE" });
      if (res.ok) {
        setStatusMessage({ type: "success", text: "Blog article deleted successfully." });
        setPosts((prev) => prev.filter((post) => post.id !== id));
      } else {
        const data = await res.json();
        setStatusMessage({ type: "error", text: data.error || "Failed to delete blog article." });
      }
    } catch (err) {
      console.error("Failed to delete article:", err);
      setStatusMessage({ type: "error", text: "Failed to delete blog article." });
    } finally {
      setDeleteConfirmId(null);
    }
  };

  // Filtered Posts
  const filteredPosts = posts.filter((post) => {
    const matchesSearch =
      post.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      post.category.toLowerCase().includes(searchTerm.toLowerCase()) ||
      post.author.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCat = selectedCategory === "ALL" || post.category === selectedCategory;
    return matchesSearch && matchesCat;
  });

  const categoriesList = Array.from(new Set(posts.map((p) => p.category).filter(Boolean)));

  return (
    <div className={styles.container}>
      {/* Header Row */}
      <div className={styles.headerRow}>
        <div className={styles.titleGroup}>
          <h1>Blog Articles &amp; News</h1>
          <p className={styles.subtitle}>
            Create, edit, publish, or remove blog posts, exam news, and select articles to feature on the homepage.
          </p>
        </div>
        <button type="button" className={styles.createBtn} onClick={openCreateModal}>
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
            <path d="M12 5v14M5 12h14" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
          Create New Article
        </button>
      </div>

      {/* Status Alert Message */}
      {statusMessage && (
        <div
          style={{
            padding: "0.85rem 1.25rem",
            borderRadius: "12px",
            marginBottom: "1.5rem",
            fontWeight: 700,
            fontSize: "0.9rem",
            background: statusMessage.type === "success" ? "#dcfce7" : "#fee2e2",
            color: statusMessage.type === "success" ? "#15803d" : "#b91c1c",
            border: statusMessage.type === "success" ? "1px solid #86efac" : "1px solid #fca5a5",
          }}
        >
          {statusMessage.text}
        </div>
      )}

      {/* Dashboard Stats */}
      <div className={styles.statsRow}>
        <div className={styles.statCard}>
          <div>
            <div className={styles.statLabel}>Total Articles</div>
            <div className={styles.statValue}>{posts.length}</div>
          </div>
          <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="#ff5a4e" strokeWidth="2">
            <path d="M19 20H5a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2h10l5 5v11a2 2 0 0 1-2 2z" />
            <polyline points="14 4 14 9 19 9" />
          </svg>
        </div>

        <div className={styles.statCard}>
          <div>
            <div className={styles.statLabel}>Featured on Home</div>
            <div className={styles.statValue}>{posts.filter((p) => p.isFeaturedOnHome).length}</div>
          </div>
          <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="#eab308" strokeWidth="2">
            <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
          </svg>
        </div>

        <div className={styles.statCard}>
          <div>
            <div className={styles.statLabel}>Published</div>
            <div className={styles.statValue}>{posts.filter((p) => p.isPublished).length}</div>
          </div>
          <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="#22c55e" strokeWidth="2">
            <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" />
            <polyline points="22 4 12 14.01 9 11.01" />
          </svg>
        </div>
      </div>

      {/* Search Controls */}
      <div className={styles.controlsRow}>
        <div className={styles.searchBox}>
          <svg className={styles.searchIcon} width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <circle cx="11" cy="11" r="8" />
            <line x1="21" y1="21" x2="16.65" y2="16.65" />
          </svg>
          <input
            type="text"
            className={styles.searchInput}
            placeholder="Search article by title, author, or keyword..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>

        <select
          className={styles.categorySelect}
          value={selectedCategory}
          onChange={(e) => setSelectedCategory(e.target.value)}
        >
          <option value="ALL">All Categories ({posts.length})</option>
          {categoriesList.map((cat) => (
            <option key={cat} value={cat}>
              {cat}
            </option>
          ))}
        </select>
      </div>

      {/* Blog Cards Grid */}
      {loading ? (
        <div style={{ textAlign: "center", padding: "4rem 0", color: "#64748b" }}>Loading blog articles...</div>
      ) : filteredPosts.length === 0 ? (
        <div className={styles.emptyState}>
          <h3 className={styles.emptyTitle}>No Blog Articles Found</h3>
          <p className={styles.emptySub}>No articles match your current search or category filter. Create a new article to populate the blog.</p>
          <button type="button" className={styles.createBtn} onClick={openCreateModal}>
            Create First Article
          </button>
        </div>
      ) : (
        <div className={styles.grid}>
          {filteredPosts.map((post) => (
            <div key={post.id} className={styles.cardItem}>
              <div className={styles.imageWrapper}>
                {post.image ? (
                  <img src={post.image} alt={post.title} className={styles.postImg} />
                ) : (
                  <div className={styles.imageFallback}>
                    <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                      <rect x="3" y="4" width="18" height="18" rx="2" />
                      <circle cx="8.5" cy="8.5" r="1.5" />
                      <polyline points="21 15 16 10 5 21" />
                    </svg>
                    <span>No Cover Image</span>
                  </div>
                )}

                <span className={styles.categoryTag}>{post.category}</span>
                {post.isFeaturedOnHome && (
                  <span className={styles.homeFeaturedBadge}>★ On Home</span>
                )}
                <span
                  className={`${styles.statusBadge} ${post.isPublished ? styles.statusPublished : styles.statusDraft}`}
                >
                  {post.isPublished ? "Published" : "Draft"}
                </span>
              </div>

              <div className={styles.cardContent}>
                <h3 className={styles.postTitle}>{post.title}</h3>
                <div className={styles.postMetaRow}>
                  <span>{post.dateString || `${post.month} ${post.day}, ${post.year}`}</span>
                  <span>•</span>
                  <span>{post.readTime}</span>
                </div>
                <p className={styles.postExcerpt}>{post.excerpt || post.content?.intro?.slice(0, 120)}</p>

                <div className={styles.cardActions}>
                  <button type="button" className={styles.editBtn} onClick={() => openEditModal(post)}>
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7" />
                      <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z" />
                    </svg>
                    Edit
                  </button>

                  <button
                    type="button"
                    className={`${styles.featureBtn} ${post.isFeaturedOnHome ? styles.featureActiveBtn : ""}`}
                    onClick={() => handleToggleFeature(post)}
                    title={post.isFeaturedOnHome ? "Remove from Homepage" : "Show on Homepage"}
                  >
                    {post.isFeaturedOnHome ? "★ On Home" : "+ Feature"}
                  </button>

                  <button
                    type="button"
                    className={styles.toggleBtn}
                    onClick={() => handleTogglePublish(post)}
                  >
                    {post.isPublished ? "Unpublish" : "Publish"}
                  </button>

                  <button
                    type="button"
                    className={styles.deleteBtn}
                    onClick={() => setDeleteConfirmId(post.id)}
                  >
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <polyline points="3 6 5 6 21 6" />
                      <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2" />
                    </svg>
                    Delete
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}


      {/* Add / Edit Article Modal */}
      {isModalOpen && (
        <div className={styles.modalOverlay} onClick={() => setIsModalOpen(false)}>
          <div className={styles.modalContent} onClick={(e) => e.stopPropagation()}>
            <div className={styles.modalHeader}>
              <h2>{formData.id ? "Edit Article" : "Create New Article"}</h2>
              <button type="button" className={styles.closeBtn} onClick={() => setIsModalOpen(false)}>
                &times;
              </button>
            </div>

            <form onSubmit={handleSubmit} className={styles.formGrid}>
              {/* Section 1: Basic Info */}
              <div className={styles.sectionDivider}>1. Article Information</div>

              <div className={styles.fieldRow}>
                <div className={styles.field}>
                  <label className={styles.label}>
                    Article Title <span style={{ color: "#dc2626" }}>*</span>
                  </label>
                  <input
                    type="text"
                    className={styles.input}
                    placeholder="e.g. SVSU December 2025 Session Exam Results Published"
                    value={formData.title}
                    onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                    required
                  />
                </div>

                <div className={styles.field}>
                  <label className={styles.label}>Category</label>
                  <input
                    type="text"
                    list="categories-list"
                    className={styles.input}
                    placeholder="e.g. University Updates"
                    value={formData.category}
                    onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                  />
                  <datalist id="categories-list">
                    {DEFAULT_CATEGORIES.map((c) => (
                      <option key={c} value={c} />
                    ))}
                  </datalist>
                </div>
              </div>

              <div className={styles.field}>
                <label className={styles.label}>Subtitle / Brief Catchphrase</label>
                <input
                  type="text"
                  className={styles.input}
                  placeholder="Optional catchy tagline under the hero title..."
                  value={formData.subtitle}
                  onChange={(e) => setFormData({ ...formData, subtitle: e.target.value })}
                />
              </div>

              {/* Cover Image Upload Area */}
              <div className={styles.sectionDivider}>2. Article Cover Image</div>
              <div className={styles.field}>
                <div
                  className={`${styles.dropZone} ${isDragging ? styles.dropZoneHover : ""}`}
                  onDragOver={handleDragOver}
                  onDragLeave={handleDragLeave}
                  onDrop={handleDrop}
                  onClick={() => document.getElementById("blog-cover-input")?.click()}
                >
                  <input
                    id="blog-cover-input"
                    type="file"
                    accept="image/*"
                    className={styles.fileInput}
                    onChange={handleFileChange}
                  />
                  <svg className={styles.dropZoneIcon} width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
                    <polyline points="17 8 12 3 7 8" />
                    <line x1="12" y1="3" x2="12" y2="15" />
                  </svg>
                  <p className={styles.dropZoneText}>
                    {uploading ? "Uploading cover image..." : "Drag & Drop cover photo here, or click to browse"}
                  </p>
                  <p className={styles.dropZoneSubtext}>PNG, JPG, WEBP formats supported</p>
                </div>

                <div style={{ marginTop: "0.5rem" }}>
                  <input
                    type="text"
                    className={styles.input}
                    placeholder="Or paste cover image URL (e.g. /images/blog/svsu-results.jpg)"
                    value={formData.image}
                    onChange={(e) => setFormData({ ...formData, image: e.target.value })}
                  />
                </div>

                {formData.image && (
                  <div className={styles.imagePreviewBox}>
                    <img src={formData.image} alt="Preview" className={styles.previewImg} />
                  </div>
                )}
              </div>

              {/* Author & Meta */}
              <div className={styles.sectionDivider}>3. Author &amp; Publication Details</div>
              <div className={styles.fieldRow}>
                <div className={styles.field}>
                  <label className={styles.label}>Author Name</label>
                  <input
                    type="text"
                    className={styles.input}
                    value={formData.author}
                    onChange={(e) => setFormData({ ...formData, author: e.target.value })}
                  />
                </div>

                <div className={styles.field}>
                  <label className={styles.label}>Author Designation / Role</label>
                  <input
                    type="text"
                    className={styles.input}
                    value={formData.authorRole}
                    onChange={(e) => setFormData({ ...formData, authorRole: e.target.value })}
                  />
                </div>
              </div>

              <div className={styles.fieldRow}>
                <div className={styles.field}>
                  <label className={styles.label}>Publish Date Picker</label>
                  <input
                    type="date"
                    className={styles.input}
                    value={formData.isoDate}
                    onChange={(e) => handleDatePickerChange(e.target.value)}
                  />
                </div>

                <div className={styles.field}>
                  <label className={styles.label}>Publish Date Display String</label>
                  <input
                    type="text"
                    className={styles.input}
                    placeholder="e.g. September 7, 2026 or 07 SEP 2026"
                    value={formData.dateString}
                    onChange={(e) => handleDateStringChange(e.target.value)}
                  />
                </div>

                <div className={styles.field}>
                  <label className={styles.label}>Estimated Read Time</label>
                  <input
                    type="text"
                    className={styles.input}
                    placeholder="e.g. 5 min read"
                    value={formData.readTime}
                    onChange={(e) => setFormData({ ...formData, readTime: e.target.value })}
                  />
                </div>
              </div>

              {/* Article Content Builder */}
              <div className={styles.sectionDivider}>4. Article Content Builder</div>

              <div className={styles.field}>
                <label className={styles.label}>Introduction Paragraph</label>
                <textarea
                  className={styles.textarea}
                  rows={3}
                  placeholder="Opening introduction paragraph for the article..."
                  value={formData.intro}
                  onChange={(e) => setFormData({ ...formData, intro: e.target.value })}
                />
              </div>

              {/* Key Takeaways */}
              <div className={styles.field}>
                <div className={styles.fieldHeaderBetween}>
                  <label className={styles.label}>Key Highlights / Takeaways</label>
                  <button type="button" className={styles.addSmallBtn} onClick={addTakeaway}>
                    + Add Highlight Point
                  </button>
                </div>
                {formData.keyTakeaways.map((takeaway, idx) => (
                  <div key={idx} className={styles.arrayRow}>
                    <input
                      type="text"
                      className={styles.input}
                      placeholder={`Highlight point #${idx + 1}...`}
                      value={takeaway}
                      onChange={(e) => updateTakeaway(idx, e.target.value)}
                    />
                    {formData.keyTakeaways.length > 1 && (
                      <button
                        type="button"
                        className={styles.removeSmallBtn}
                        onClick={() => removeTakeaway(idx)}
                      >
                        &times;
                      </button>
                    )}
                  </div>
                ))}
              </div>

              {/* Dynamic Content Sections */}
              <div className={styles.field}>
                <div className={styles.fieldHeaderBetween}>
                  <label className={styles.label}>Article Content Sections</label>
                  <button type="button" className={styles.addSmallBtn} onClick={addSection}>
                    + Add Section Block
                  </button>
                </div>

                {formData.sections.map((section, idx) => (
                  <div key={idx} className={styles.sectionBlockCard}>
                    <div className={styles.sectionBlockHeader}>
                      <span>Section #{idx + 1}</span>
                      {formData.sections.length > 1 && (
                        <button
                          type="button"
                          className={styles.removeBlockBtn}
                          onClick={() => removeSection(idx)}
                        >
                          Remove Section
                        </button>
                      )}
                    </div>

                    <div className={styles.field} style={{ marginBottom: "0.75rem" }}>
                      <label className={styles.labelSmall}>Section Heading</label>
                      <input
                        type="text"
                        className={styles.input}
                        placeholder="e.g. How to Check Your Examination Results"
                        value={section.heading}
                        onChange={(e) => updateSectionField(idx, "heading", e.target.value)}
                      />
                    </div>

                    <div className={styles.field} style={{ marginBottom: "0.75rem" }}>
                      <label className={styles.labelSmall}>Paragraphs (Separate multiple paragraphs with double Enter)</label>
                      <textarea
                        className={styles.textarea}
                        rows={4}
                        placeholder="Write body text for this section..."
                        value={section.bodyText}
                        onChange={(e) => updateSectionField(idx, "bodyText", e.target.value)}
                      />
                    </div>

                    <div className={styles.field}>
                      <label className={styles.labelSmall}>Featured Callout Quote (Optional)</label>
                      <input
                        type="text"
                        className={styles.input}
                        placeholder="e.g. Timely result verification ensures smooth progression..."
                        value={section.quote}
                        onChange={(e) => updateSectionField(idx, "quote", e.target.value)}
                      />
                    </div>
                  </div>
                ))}
              </div>

              <div className={styles.field}>
                <label className={styles.label}>Conclusion / Final Thoughts</label>
                <textarea
                  className={styles.textarea}
                  rows={3}
                  placeholder="Closing summary paragraph..."
                  value={formData.conclusion}
                  onChange={(e) => setFormData({ ...formData, conclusion: e.target.value })}
                />
              </div>

              <div className={styles.fieldRow}>
                <div className={styles.field}>
                  <label className={styles.label}>Tags (Comma separated)</label>
                  <input
                    type="text"
                    className={styles.input}
                    placeholder="e.g. SVSU, Exam Results, Distance Education"
                    value={formData.tagsInput}
                    onChange={(e) => setFormData({ ...formData, tagsInput: e.target.value })}
                  />
                </div>

                <div className={styles.field} style={{ justifyContent: "center", gap: "0.5rem" }}>
                  <label className={styles.checkboxLabel}>
                    <input
                      type="checkbox"
                      className={styles.checkbox}
                      checked={formData.isPublished}
                      onChange={(e) => setFormData({ ...formData, isPublished: e.target.checked })}
                    />
                    Publish article live on website
                  </label>

                  <label className={styles.checkboxLabel} style={{ color: "#d97706" }}>
                    <input
                      type="checkbox"
                      className={styles.checkbox}
                      checked={formData.isFeaturedOnHome}
                      onChange={(e) => setFormData({ ...formData, isFeaturedOnHome: e.target.checked })}
                    />
                    ★ Show on Landing Page (Featured Section)
                  </label>
                </div>

              </div>

              <div className={styles.modalFooter}>
                <button type="button" className={styles.cancelBtn} onClick={() => setIsModalOpen(false)}>
                  Cancel
                </button>
                <button type="submit" className={styles.saveBtn} disabled={saving || uploading}>
                  {saving ? "Saving Article..." : formData.id ? "Update Article" : "Publish Article"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {deleteConfirmId && (
        <div className={styles.modalOverlay} onClick={() => setDeleteConfirmId(null)}>
          <div className={styles.modalContent} style={{ maxWidth: "440px" }} onClick={(e) => e.stopPropagation()}>
            <h3 style={{ margin: "0 0 0.5rem", fontSize: "1.2rem", fontWeight: 800 }}>Confirm Deletion</h3>
            <p style={{ color: "#64748b", fontSize: "0.9rem", margin: "0 0 1.5rem" }}>
              Are you sure you want to delete this blog article? This action will permanently remove it from the site.
            </p>
            <div className={styles.modalFooter}>
              <button type="button" className={styles.cancelBtn} onClick={() => setDeleteConfirmId(null)}>
                Cancel
              </button>
              <button
                type="button"
                className={styles.saveBtn}
                style={{ background: "#dc2626", color: "#ffffff" }}
                onClick={() => handleDelete(deleteConfirmId)}
              >
                Delete Article
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
