"use client";

import { useState, useMemo, useEffect, Suspense } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import styles from "./sslc-cards.module.css";
import RichTextHighlightEditor from "@/components/AdminSslcCardEditor/RichTextHighlightEditor";

// Card type definition
export interface SslcContentCard {
  id: string;
  section: "admission" | "on-demand" | "course-structure";
  number: string;
  heading: string;
  image: string;
  descriptionHtml: string;
  status: "Published" | "Draft";
  order: number;
  lastUpdated: string;
}

// Initial cards state (empty dataset, fetched from database)
const INITIAL_CARDS: SslcContentCard[] = [];

const SAMPLE_IMAGES = [
  "https://images.unsplash.com/photo-1523240795612-9a054b0db644?w=800&auto=format&fit=crop&q=80",
  "https://images.unsplash.com/photo-1544717305-2782549b5136?w=800&auto=format&fit=crop&q=80",
  "https://images.unsplash.com/photo-1516321318423-f06f85e504b3?w=800&auto=format&fit=crop&q=80",
  "https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?w=800&auto=format&fit=crop&q=80",
];

// Helper to extract text from HTML for preview snippet
function extractPlainText(html: string) {
  if (!html) return "";
  return html.replace(/<[^>]+>/g, "").replace(/&nbsp;/g, " ").trim();
}

// Helper to extract highlighted snippets deterministically on both SSR and client
function extractHighlights(html: string): string[] {
  if (!html) return [];
  const matches = html.match(/<(mark|span)[^>]*>([\s\S]*?)<\/(mark|span)>/gi) || [];
  const results: string[] = [];
  matches.forEach((m) => {
    const text = m.replace(/<[^>]+>/g, "").replace(/&nbsp;/g, " ").trim();
    if (text) results.push(text);
  });
  return results;
}

function SslcContentCardsAdminPage() {
  const searchParams = useSearchParams();
  const sectionParam = searchParams.get("section");

  const [cards, setCards] = useState<SslcContentCard[]>(INITIAL_CARDS);
  const [activeSection, setActiveSection] = useState<"admission" | "on-demand" | "course-structure">("admission");
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState<"All" | "Published" | "Draft">("All");
  const [sortBy, setSortBy] = useState<"order" | "heading" | "updated">("order");
  
  // Editor Drawer state
  const [isEditorOpen, setIsEditorOpen] = useState(false);
  const [editingCardId, setEditingCardId] = useState<string | null>(null);

  // Form Fields
  const [formSection, setFormSection] = useState<"admission" | "on-demand" | "course-structure">("admission");
  const [formHeading, setFormHeading] = useState("");
  const [formImage, setFormImage] = useState("");
  const [formDescriptionHtml, setFormDescriptionHtml] = useState("");
  const [formStatus, setFormStatus] = useState<"Published" | "Draft">("Published");
  const [formOrder, setFormOrder] = useState(1);

  // Confirmation Modal & Toast state
  const [deleteCandidate, setDeleteCandidate] = useState<SslcContentCard | null>(null);
  const [toastMessage, setToastMessage] = useState<string | null>(null);
  const [isUploading, setIsUploading] = useState(false);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3000);
  };

  // Load cards from API or localStorage on mount
  useEffect(() => {
    try {
      const cached = localStorage.getItem("tims_sslc_cards");
      if (cached) {
        const parsed = JSON.parse(cached);
        if (Array.isArray(parsed) && parsed.length > 0) {
          setCards(parsed);
        }
      }
    } catch {}

    fetch("/api/sslc-content-cards")
      .then((res) => res.json())
      .then((data) => {
        if (Array.isArray(data.cards)) {
          setCards(data.cards);
          try {
            localStorage.setItem("tims_sslc_cards", JSON.stringify(data.cards));
          } catch {}
        }
      })
      .catch((err) => console.error("Failed to load cards from DB:", err));
  }, []);

  // Sync state changes to localStorage
  useEffect(() => {
    if (cards.length > 0) {
      try {
        localStorage.setItem("tims_sslc_cards", JSON.stringify(cards));
      } catch {}
    }
  }, [cards]);

  // Sync active section from URL query param if present
  useEffect(() => {
    if (sectionParam === "admission" || sectionParam === "on-demand" || sectionParam === "course-structure") {
      setActiveSection(sectionParam);
    }
  }, [sectionParam]);

  // Filter & Sort cards for active tab
  const sectionCards = useMemo(() => {
    return cards.filter((c) => c.section === activeSection);
  }, [cards, activeSection]);

  const filteredCards = useMemo(() => {
    return sectionCards
      .filter((card) => {
        const matchesSearch =
          card.heading.toLowerCase().includes(searchQuery.toLowerCase()) ||
          extractPlainText(card.descriptionHtml).toLowerCase().includes(searchQuery.toLowerCase());
        const matchesStatus = statusFilter === "All" || card.status === statusFilter;
        return matchesSearch && matchesStatus;
      })
      .sort((a, b) => {
        if (sortBy === "heading") return a.heading.localeCompare(b.heading);
        if (sortBy === "updated") return b.lastUpdated.localeCompare(a.lastUpdated);
        return a.order - b.order;
      });
  }, [sectionCards, searchQuery, statusFilter, sortBy]);

  // Section details map for page header
  const sectionDetails = {
    admission: {
      title: "Admission",
      breadcrumbLabel: "Admission",
      subtitle: "Manage the content cards displayed on the SSLC / Plus Two admission page.",
    },
    "on-demand": {
      title: "On Demand Exam & Certification",
      breadcrumbLabel: "On Demand Exam",
      subtitle: "Manage the content cards displayed on the On Demand Examination & Certification page.",
    },
    "course-structure": {
      title: "Course Structure",
      breadcrumbLabel: "Course Structure",
      subtitle: "Manage the content cards displayed on the SSLC / Plus Two Course Structure page.",
    },
  };

  const currentMeta = sectionDetails[activeSection];

  // Stats calculation
  const publishedCount = sectionCards.filter((c) => c.status === "Published").length;
  const draftCount = sectionCards.filter((c) => c.status === "Draft").length;

  // Image upload handlers
  const handleFileUpload = async (file: File) => {
    if (!file) return;
    if (!file.type.startsWith("image/")) {
      alert("Please select a valid image file (PNG, JPG, WEBP, GIF, SVG).");
      return;
    }
    setIsUploading(true);
    try {
      const formData = new FormData();
      formData.append("file", file);
      const res = await fetch("/api/upload", {
        method: "POST",
        body: formData,
      });
      const data = await res.json();
      if (res.ok && data.url) {
        setFormImage(data.url);
        showToast("Card image uploaded successfully");
      } else {
        alert(data.error || "Failed to upload image.");
      }
    } catch (err) {
      console.error("Upload error:", err);
      alert("An error occurred while uploading the image.");
    } finally {
      setIsUploading(false);
    }
  };

  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleFileUpload(e.dataTransfer.files[0]);
    }
  };

  const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
  };

  // Actions
  const handleOpenAddModal = () => {
    setEditingCardId(null);
    setFormSection(activeSection);
    setFormHeading("");
    setFormImage("");
    setFormDescriptionHtml(`Type description here and select text to <mark class="${styles.yellowHighlight}">highlight key phrases</mark>.`);
    setFormStatus("Published");
    setFormOrder(sectionCards.length + 1);
    setIsEditorOpen(true);
  };

  const handleOpenEditModal = (card: SslcContentCard) => {
    setEditingCardId(card.id);
    setFormSection(card.section);
    setFormHeading(card.heading);
    setFormImage(card.image);
    setFormDescriptionHtml(card.descriptionHtml);
    setFormStatus(card.status);
    setFormOrder(card.order);
    setIsEditorOpen(true);
  };

  const handleSaveCard = async (statusOverride?: "Published" | "Draft") => {
    if (!formHeading.trim()) {
      alert("Please enter a card heading.");
      return;
    }

    const finalStatus = statusOverride || formStatus;
    const payload = {
      section: formSection,
      heading: formHeading.trim(),
      image: formImage,
      descriptionHtml: formDescriptionHtml,
      status: finalStatus,
      order: Number(formOrder),
    };

    if (editingCardId) {
      // Optimistic update
      setCards((prev) =>
        prev.map((c) =>
          c.id === editingCardId
            ? { ...c, ...payload, lastUpdated: "Today" }
            : c
        )
      );

      try {
        const res = await fetch(`/api/sslc-content-cards/${editingCardId}`, {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload),
        });
        const data = await res.json();
        if (data.card) {
          setCards((prev) => prev.map((c) => (c.id === editingCardId ? data.card : c)));
        }
        showToast(`Updated "${formHeading.trim()}" in Database`);
      } catch (err) {
        console.error("Failed to update card in DB:", err);
      }
    } else {
      try {
        const res = await fetch("/api/sslc-content-cards", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload),
        });
        const data = await res.json();
        if (data.id) {
          setCards((prev) => [data, ...prev]);
        } else {
          // Fallback if offline
          const fallback: SslcContentCard = {
            id: `card-local-${Date.now()}`,
            number: String(sectionCards.length + 1).padStart(2, "0"),
            ...payload,
            lastUpdated: "Today",
          };
          setCards((prev) => [fallback, ...prev]);
        }
        showToast(`Created new card "${formHeading.trim()}" in Database`);
      } catch (err) {
        console.error("Failed to create card in DB:", err);
      }
    }

    setIsEditorOpen(false);
  };

  const handleDuplicateCard = async (card: SslcContentCard) => {
    const payload = {
      section: card.section,
      heading: `${card.heading} Copy`,
      image: card.image,
      descriptionHtml: card.descriptionHtml,
      status: card.status,
      order: card.order + 1,
    };

    try {
      const res = await fetch("/api/sslc-content-cards", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      const data = await res.json();
      if (data.id) {
        setCards((prev) => [data, ...prev]);
      } else {
        setCards((prev) => [
          { id: `card-copy-${Date.now()}`, number: "01", ...payload, lastUpdated: "Today" },
          ...prev,
        ]);
      }
      showToast(`Duplicated "${card.heading}" in Database`);
    } catch (err) {
      console.error("Failed to duplicate card in DB:", err);
    }
  };

  const handleTogglePublish = async (card: SslcContentCard) => {
    const newStatus = card.status === "Published" ? "Draft" : "Published";
    setCards((prev) =>
      prev.map((c) => (c.id === card.id ? { ...c, status: newStatus } : c))
    );

    try {
      await fetch(`/api/sslc-content-cards/${card.id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...card, status: newStatus }),
      });
      showToast(`Card is now ${newStatus}`);
    } catch (err) {
      console.error("Failed to update status in DB:", err);
    }
  };

  const handleConfirmDelete = async () => {
    if (!deleteCandidate) return;
    const targetId = deleteCandidate.id;
    const targetHeading = deleteCandidate.heading;
    setCards((prev) => prev.filter((c) => c.id !== targetId));
    setDeleteCandidate(null);

    try {
      await fetch(`/api/sslc-content-cards/${targetId}`, {
        method: "DELETE",
      });
      showToast(`Deleted "${targetHeading}" from Database`);
    } catch (err) {
      console.error("Failed to delete card from DB:", err);
    }
  };

  // Reorder up/down
  const handleMoveOrder = async (cardId: string, direction: "up" | "down") => {
    const index = sectionCards.findIndex((c) => c.id === cardId);
    if (index < 0) return;
    const targetIndex = direction === "up" ? index - 1 : index + 1;
    if (targetIndex < 0 || targetIndex >= sectionCards.length) return;

    const updated = [...sectionCards];
    const tempOrder = updated[index].order;
    updated[index].order = updated[targetIndex].order;
    updated[targetIndex].order = tempOrder;

    // Swap in array
    const tempCard = updated[index];
    updated[index] = updated[targetIndex];
    updated[targetIndex] = tempCard;

    // Merge back
    const otherCards = cards.filter((c) => c.section !== activeSection);
    setCards([...otherCards, ...updated]);
    showToast("Reordered cards");

    // Persist updated order in MongoDB
    try {
      await Promise.all([
        fetch(`/api/sslc-content-cards/${updated[index].id}`, {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(updated[index]),
        }),
        fetch(`/api/sslc-content-cards/${updated[targetIndex].id}`, {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(updated[targetIndex]),
        }),
      ]);
    } catch (err) {
      console.error("Failed to persist reorder in DB:", err);
    }
  };

  return (
    <div className={styles.container}>
      {/* Breadcrumb Navigation */}
      <nav className={styles.breadcrumb} aria-label="Breadcrumb">
        <Link href="/admin" className={styles.breadcrumbLink}>
          Dashboard
        </Link>
        <span className={styles.breadcrumbSeparator}>/</span>
        <span className={styles.breadcrumbActive}>SSLC &amp; Plus Two</span>
        <span className={styles.breadcrumbSeparator}>/</span>
        <span className={styles.breadcrumbActive}>{currentMeta.breadcrumbLabel}</span>
      </nav>

      {/* Top SSLC & Plus Two Section Switcher */}
      <div style={{ display: "flex", gap: "0.75rem", flexWrap: "wrap" }}>
        <Link
          href="/admin/courses/sslc-plus-two"
          className={styles.secondaryBtn}
          style={{ background: "#14161c", color: "#ffffff", borderColor: "#14161c", textDecoration: "none" }}
        >
          🎴 Content Cards
        </Link>
        <Link
          href="/admin/courses/sslc-plus-two/verified-documents"
          className={styles.secondaryBtn}
          style={{ textDecoration: "none" }}
        >
          📄 Verified Documents &amp; Recognitions
        </Link>
      </div>

      {/* Page Header */}
      <div className={styles.headerBar}>
        <div className={styles.headerMain}>
          <h1 className={styles.heading}>{currentMeta.title}</h1>
          <p className={styles.subtitle}>{currentMeta.subtitle}</p>
        </div>
        <button type="button" className={styles.primaryBtn} onClick={handleOpenAddModal}>
          <span style={{ fontSize: "1.2rem", lineHeight: 1 }}>+</span> Add New Card
        </button>
      </div>

      {/* Top Summary Stats */}
      <div className={styles.statsRow}>
        <div className={styles.statCard}>
          <span className={styles.statLabel}>Total Cards</span>
          <span className={styles.statValue}>{sectionCards.length}</span>
        </div>
        <div className={styles.statCard}>
          <span className={styles.statLabel}>Published</span>
          <span className={styles.statValue} style={{ color: "#16a34a" }}>
            {publishedCount}
          </span>
        </div>
        <div className={styles.statCard}>
          <span className={styles.statLabel}>Drafts</span>
          <span className={styles.statValue} style={{ color: "#d97706" }}>
            {draftCount}
          </span>
        </div>
      </div>

      {/* Top-Level Section Tabs */}
      <div className={styles.tabsWrapper} role="tablist">
        <button
          type="button"
          role="tab"
          aria-selected={activeSection === "admission"}
          className={`${styles.tabBtn} ${activeSection === "admission" ? styles.tabActive : ""}`}
          onClick={() => setActiveSection("admission")}
        >
          <span>Admission</span>
          <span className={styles.tabBadge}>
            {cards.filter((c) => c.section === "admission").length}
          </span>
        </button>

        <button
          type="button"
          role="tab"
          aria-selected={activeSection === "on-demand"}
          className={`${styles.tabBtn} ${activeSection === "on-demand" ? styles.tabActive : ""}`}
          onClick={() => setActiveSection("on-demand")}
        >
          <span>On Demand Exam &amp; Certification</span>
          <span className={styles.tabBadge}>
            {cards.filter((c) => c.section === "on-demand").length}
          </span>
        </button>

        <button
          type="button"
          role="tab"
          aria-selected={activeSection === "course-structure"}
          className={`${styles.tabBtn} ${activeSection === "course-structure" ? styles.tabActive : ""}`}
          onClick={() => setActiveSection("course-structure")}
        >
          <span>Course Structure</span>
          <span className={styles.tabBadge}>
            {cards.filter((c) => c.section === "course-structure").length}
          </span>
        </button>
      </div>

      {/* Toolbar (Search, Filter, Sort) */}
      <div className={styles.toolbar}>
        <div className={styles.searchGroup}>
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#6b7686" strokeWidth="2">
            <circle cx="11" cy="11" r="8" />
            <line x1="21" y1="21" x2="16.65" y2="16.65" />
          </svg>
          <input
            type="text"
            className={styles.searchInput}
            placeholder="Search by heading or description..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>

        <div className={styles.filterGroup}>
          <select
            className={styles.selectControl}
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value as "All" | "Published" | "Draft")}
            aria-label="Filter by Status"
          >
            <option value="All">All Status</option>
            <option value="Published">Published</option>
            <option value="Draft">Draft</option>
          </select>

          <select
            className={styles.selectControl}
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value as "order" | "heading" | "updated")}
            aria-label="Sort Order"
          >
            <option value="order">Display Order</option>
            <option value="heading">Heading (A-Z)</option>
            <option value="updated">Last Updated</option>
          </select>

          {(searchQuery || statusFilter !== "All") && (
            <button
              type="button"
              className={styles.secondaryBtn}
              onClick={() => {
                setSearchQuery("");
                setStatusFilter("All");
              }}
              style={{ padding: "0.45rem 0.75rem", fontSize: "0.8rem" }}
            >
              Reset Filters
            </button>
          )}
        </div>
      </div>

      {/* Cards List Container */}
      <div className={styles.cardListContainer}>
        <div className={styles.cardListHeader}>
          <span className={styles.cardListTitle}>
            Content Cards ({filteredCards.length})
          </span>
          <span style={{ fontSize: "0.8125rem", color: "#6b7686" }}>
            Section: <strong>{currentMeta.title}</strong>
          </span>
        </div>

        {filteredCards.length > 0 ? (
          <div className={styles.cardsGrid}>
            {filteredCards.map((card, idx) => {
              const plainSnippet = extractPlainText(card.descriptionHtml);
              const highlights = extractHighlights(card.descriptionHtml);

              return (
                <div key={card.id} className={styles.cardItem}>
                  {/* Reorder Up/Down Controls */}
                  <div className={styles.dragHandle}>
                    <button
                      type="button"
                      style={{ background: "none", border: "none", cursor: "pointer", padding: 0 }}
                      onClick={() => handleMoveOrder(card.id, "up")}
                      disabled={idx === 0}
                      title="Move Up"
                    >
                      ▲
                    </button>
                    <span style={{ fontSize: "0.7rem", fontWeight: 700 }}>{card.order}</span>
                    <button
                      type="button"
                      style={{ background: "none", border: "none", cursor: "pointer", padding: 0 }}
                      onClick={() => handleMoveOrder(card.id, "down")}
                      disabled={idx === filteredCards.length - 1}
                      title="Move Down"
                    >
                      ▼
                    </button>
                  </div>

                  {/* Thumbnail Image */}
                  <div className={styles.thumbBox}>
                    {card.image ? (
                      <img src={card.image} alt={card.heading} className={styles.thumbImg} />
                    ) : (
                      <span className={styles.thumbFallback}>No Image</span>
                    )}
                  </div>

                  {/* Card Main Info */}
                  <div className={styles.cardMainInfo}>
                    <h3 className={styles.cardTitle}>{card.heading}</h3>
                    <p className={styles.cardSnippet}>{plainSnippet}</p>
                  </div>

                  {/* Highlighted Content Preview */}
                  <div className={styles.highlightsBox}>
                    {highlights.length > 0 ? (
                      highlights.slice(0, 2).map((hl, hIdx) => (
                        <span key={hIdx} className={styles.highlightChip}>
                          {hl}
                        </span>
                      ))
                    ) : (
                      <span style={{ fontSize: "0.75rem", color: "#94a3b8", fontStyle: "italic" }}>
                        No highlights
                      </span>
                    )}
                  </div>

                  {/* Status Badge */}
                  <div>
                    <span
                      className={`${styles.badge} ${
                        card.status === "Published" ? styles.badgePublished : styles.badgeDraft
                      }`}
                    >
                      <span
                        style={{
                          width: "6px",
                          height: "6px",
                          borderRadius: "50%",
                          background: card.status === "Published" ? "#16a34a" : "#d97706",
                        }}
                      />
                      {card.status}
                    </span>
                  </div>

                  {/* Last Updated */}
                  <span className={styles.updatedText}>{card.lastUpdated}</span>

                  {/* Row Actions */}
                  <div className={styles.actionsGroup}>
                    <button
                      type="button"
                      className={styles.secondaryBtn}
                      style={{ padding: "0.4rem 0.75rem", fontSize: "0.8rem" }}
                      onClick={() => handleOpenEditModal(card)}
                    >
                      Edit
                    </button>

                    <button
                      type="button"
                      className={styles.iconBtn}
                      onClick={() => handleDuplicateCard(card)}
                      title="Duplicate card"
                    >
                      📋 Copy
                    </button>

                    <button
                      type="button"
                      className={styles.iconBtn}
                      onClick={() => handleTogglePublish(card)}
                      title={card.status === "Published" ? "Unpublish to draft" : "Publish card"}
                    >
                      {card.status === "Published" ? "👁️" : "🚀"}
                    </button>

                    <button
                      type="button"
                      className={styles.dangerBtn}
                      onClick={() => setDeleteCandidate(card)}
                      title="Delete card"
                    >
                      🗑️
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        ) : (
          /* Empty State */
          <div className={styles.emptyState}>
            <div className={styles.emptyIcon}>📁</div>
            <h3 className={styles.emptyTitle}>No cards yet</h3>
            <p className={styles.emptyText}>
              Create your first content card for the <strong>{currentMeta.title}</strong> section.
            </p>
            <button type="button" className={styles.primaryBtn} onClick={handleOpenAddModal}>
              + Add New Card
            </button>
          </div>
        )}
      </div>

      {/* ==================================================
          ADD / EDIT CARD UI (Two Column Drawer Layout)
          ================================================== */}
      {isEditorOpen && (
        <div className={styles.editorOverlay} onClick={() => setIsEditorOpen(false)}>
          <div className={styles.editorDrawer} onClick={(e) => e.stopPropagation()}>
            {/* Drawer Header */}
            <div className={styles.editorHeader}>
              <div>
                <span style={{ fontSize: "0.75rem", fontWeight: 700, color: "#E91D24", textTransform: "uppercase" }}>
                  Card Editor
                </span>
                <h2 className={styles.editorTitle}>
                  {editingCardId ? `Edit Card: ${formHeading || "Untitled"}` : "Add New Card"}
                </h2>
              </div>
              <button
                type="button"
                className={styles.closeBtn}
                onClick={() => setIsEditorOpen(false)}
                aria-label="Close Editor"
              >
                &times;
              </button>
            </div>

            {/* Drawer Body (Two Columns) */}
            <div className={styles.editorBody}>
              {/* LEFT COLUMN: Content Editing Form */}
              <div className={styles.formCol}>
                <div className={styles.formCard}>
                  {/* Section Selector */}
                  <div className={styles.fieldGroup}>
                    <label className={styles.fieldLabel}>Section</label>
                    <select
                      className={styles.inputControl}
                      value={formSection}
                      onChange={(e) => setFormSection(e.target.value as any)}
                    >
                      <option value="admission">Admission</option>
                      <option value="on-demand">On Demand Exam &amp; Certification</option>
                      <option value="course-structure">Course Structure</option>
                    </select>
                  </div>

                  {/* Card Heading */}
                  <div className={styles.fieldGroup}>
                    <label className={styles.fieldLabel}>Card Heading *</label>
                    <input
                      type="text"
                      className={styles.inputControl}
                      placeholder="e.g. SSLC (Secondary Course)"
                      value={formHeading}
                      onChange={(e) => setFormHeading(e.target.value)}
                    />
                    <span className={styles.fieldHelper}>Keep the heading short and clear.</span>
                  </div>

                  {/* Card Image */}
                  <div className={styles.fieldGroup}>
                    <label className={styles.fieldLabel}>Card Image</label>
                    <input
                      id="sslc-card-image-file-input"
                      type="file"
                      accept="image/*"
                      style={{ display: "none" }}
                      onChange={(e) => {
                        if (e.target.files && e.target.files[0]) {
                          handleFileUpload(e.target.files[0]);
                        }
                      }}
                    />

                    {formImage ? (
                      <div>
                        <div className={styles.previewImageWrap}>
                          <img src={formImage} alt="Card Image Preview" className={styles.previewImg} />
                        </div>
                        <div className={styles.imageActions} style={{ flexWrap: "wrap" }}>
                          <button
                            type="button"
                            className={styles.secondaryBtn}
                            onClick={() => document.getElementById("sslc-card-image-file-input")?.click()}
                            disabled={isUploading}
                          >
                            {isUploading ? "Uploading..." : "📤 Upload New Image"}
                          </button>
                          <button
                            type="button"
                            className={styles.secondaryBtn}
                            onClick={() => {
                              const currentIdx = SAMPLE_IMAGES.indexOf(formImage);
                              const nextIdx = currentIdx >= 0 ? (currentIdx + 1) % SAMPLE_IMAGES.length : 0;
                              setFormImage(SAMPLE_IMAGES[nextIdx]);
                            }}
                          >
                            🔄 Sample Choice
                          </button>
                          <button
                            type="button"
                            className={styles.dangerBtn}
                            onClick={() => setFormImage("")}
                          >
                            Remove Image
                          </button>
                        </div>
                      </div>
                    ) : (
                      <div
                        className={styles.dropzone}
                        onClick={() => document.getElementById("sslc-card-image-file-input")?.click()}
                        onDragOver={handleDragOver}
                        onDrop={handleDrop}
                      >
                        <div className={styles.uploadIcon}>{isUploading ? "⏳" : "↑"}</div>
                        <span style={{ fontSize: "0.9rem", fontWeight: 700, color: "#14161c" }}>
                          {isUploading ? "Uploading image..." : "Click to select card image or drag & drop"}
                        </span>
                        <span style={{ fontSize: "0.78rem", color: "#6b7686" }}>
                          PNG, JPG, WEBP, GIF, SVG • Recommended 800x450 dimensions
                        </span>
                        <button
                          type="button"
                          className={styles.secondaryBtn}
                          onClick={(e) => {
                            e.stopPropagation();
                            setFormImage(SAMPLE_IMAGES[0]);
                          }}
                          style={{ marginTop: "0.5rem", fontSize: "0.78rem", padding: "0.3rem 0.65rem" }}
                        >
                          Or pick sample image
                        </button>
                      </div>
                    )}
                  </div>

                  {/* Description & Rich-Text Highlight Editor */}
                  <div className={styles.fieldGroup}>
                    <label className={styles.fieldLabel}>Description &amp; Highlights *</label>
                    <RichTextHighlightEditor
                      value={formDescriptionHtml}
                      onChange={(html) => setFormDescriptionHtml(html)}
                    />
                  </div>

                  {/* Status & Display Order */}
                  <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "1rem" }}>
                    <div className={styles.fieldGroup}>
                      <label className={styles.fieldLabel}>Status</label>
                      <select
                        className={styles.inputControl}
                        value={formStatus}
                        onChange={(e) => setFormStatus(e.target.value as "Published" | "Draft")}
                      >
                        <option value="Published">Published</option>
                        <option value="Draft">Draft</option>
                      </select>
                    </div>

                    <div className={styles.fieldGroup}>
                      <label className={styles.fieldLabel}>Display Order</label>
                      <input
                        type="number"
                        className={styles.inputControl}
                        min="1"
                        value={formOrder}
                        onChange={(e) => setFormOrder(Number(e.target.value))}
                      />
                    </div>
                  </div>
                </div>
              </div>

              {/* RIGHT COLUMN: Live Frontend Card Preview */}
              <div className={styles.previewCol}>
                <div className={styles.previewHeader}>
                  <span>LIVE FRONTEND CARD PREVIEW</span>
                </div>

                {/* Replica of existing frontend card style */}
                <div className={styles.previewCardFrame}>
                  <div className={styles.previewCardMedia}>
                    <span className={styles.previewCardNumber}>
                      {String(formOrder).padStart(2, "0")}
                    </span>
                    {formImage ? (
                      <img src={formImage} alt="Card Media" className={styles.previewCardMediaImg} />
                    ) : (
                      <>
                        <span style={{ fontSize: "1.5rem" }}>🖼️</span>
                        <span style={{ fontSize: "0.75rem", fontWeight: 600 }}>Card Image Banner</span>
                      </>
                    )}
                  </div>

                  <div className={styles.previewCardBody}>
                    <h3 className={styles.previewCardHeading}>
                      {formHeading.trim() || "Card Heading Placeholder"}
                    </h3>
                    <div
                      className={styles.previewCardText}
                      dangerouslySetInnerHTML={{
                        __html: formDescriptionHtml || "Card description text will appear here...",
                      }}
                    />
                  </div>
                </div>

                <div style={{ background: "#ffffff", padding: "1rem", borderRadius: "12px", border: "1px solid #e3e6ee" }}>
                  <span style={{ fontSize: "0.78rem", color: "#6b7686", display: "block" }}>
                    ℹ️ Yellow highlight elements (<code>&lt;mark class=&quot;yellowHighlight&quot;&gt;</code>) in the description render in real-time with frontend style.
                  </span>
                </div>
              </div>
            </div>

            {/* Drawer Footer Actions */}
            <div className={styles.editorFooter}>
              <button
                type="button"
                className={styles.secondaryBtn}
                onClick={() => setIsEditorOpen(false)}
              >
                Cancel
              </button>

              <div style={{ display: "flex", gap: "0.75rem" }}>
                <button
                  type="button"
                  className={styles.secondaryBtn}
                  onClick={() => handleSaveCard("Draft")}
                >
                  Save as Draft
                </button>
                <button
                  type="button"
                  className={styles.primaryBtn}
                  onClick={() => handleSaveCard(editingCardId ? formStatus : "Published")}
                >
                  {editingCardId ? "Save Changes" : "Publish Card"}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ==================================================
          DELETE CONFIRMATION DIALOG
          ================================================== */}
      {deleteCandidate && (
        <div className={styles.modalOverlay} onClick={() => setDeleteCandidate(null)}>
          <div className={styles.confirmModal} onClick={(e) => e.stopPropagation()}>
            <h3 className={styles.confirmTitle}>Delete card?</h3>
            <p className={styles.confirmText}>
              Are you sure you want to delete &quot;<strong>{deleteCandidate.heading}</strong>&quot;? This action cannot be undone.
            </p>
            <div className={styles.confirmActions}>
              <button
                type="button"
                className={styles.secondaryBtn}
                onClick={() => setDeleteCandidate(null)}
              >
                Cancel
              </button>
              <button
                type="button"
                className={styles.primaryBtn}
                style={{ background: "#dc2626" }}
                onClick={handleConfirmDelete}
              >
                Delete Card
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Toast Notification */}
      {toastMessage && (
        <div className={styles.toast}>
          <span>✓</span> {toastMessage}
        </div>
      )}
    </div>
  );
}

export default function SslcContentCardsAdminPageWrapper() {
  return (
    <Suspense fallback={<div style={{ padding: "2rem", color: "#6b7686" }}>Loading SSLC Content Cards...</div>}>
      <SslcContentCardsAdminPage />
    </Suspense>
  );
}
