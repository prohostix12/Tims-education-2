"use client";

import { useState, useMemo, useEffect, Suspense } from "react";
import Link from "next/link";
import styles from "./verified-documents.module.css";

export interface VerifiedDocument {
  id: string;
  title: string;
  pdfUrl: string;
  fileName?: string;
  status: "Published" | "Draft";
  order: number;
  lastUpdated?: string;
}

function VerifiedDocumentsAdminPage() {
  const [documents, setDocuments] = useState<VerifiedDocument[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState<"All" | "Published" | "Draft">("All");

  // Editor Drawer state
  const [isEditorOpen, setIsEditorOpen] = useState(false);
  const [editingDocId, setEditingDocId] = useState<string | null>(null);

  // Form fields
  const [formTitle, setFormTitle] = useState("");
  const [formPdfUrl, setFormPdfUrl] = useState("");
  const [formFileName, setFormFileName] = useState("");
  const [formStatus, setFormStatus] = useState<"Published" | "Draft">("Published");
  const [formOrder, setFormOrder] = useState(1);
  const [isUploading, setIsUploading] = useState(false);

  // Confirmation & Toast state
  const [deleteCandidate, setDeleteCandidate] = useState<VerifiedDocument | null>(null);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3000);
  };

  // Load documents on mount
  useEffect(() => {
    try {
      const cached = localStorage.getItem("tims_verified_documents");
      if (cached) {
        const parsed = JSON.parse(cached);
        if (Array.isArray(parsed) && parsed.length > 0) {
          setDocuments(parsed);
        }
      }
    } catch {}

    fetch("/api/verified-documents")
      .then((res) => res.json())
      .then((data) => {
        if (Array.isArray(data.documents) && data.documents.length > 0) {
          setDocuments(data.documents);
          try {
            localStorage.setItem("tims_verified_documents", JSON.stringify(data.documents));
          } catch {}
        }
      })
      .catch((err) => console.error("Failed to fetch verified documents:", err));
  }, []);

  // Sync to local storage
  useEffect(() => {
    if (documents.length > 0) {
      try {
        localStorage.setItem("tims_verified_documents", JSON.stringify(documents));
      } catch {}
    }
  }, [documents]);

  // Filter & sort documents
  const filteredDocuments = useMemo(() => {
    return documents
      .filter((doc) => {
        const matchesSearch = doc.title.toLowerCase().includes(searchQuery.toLowerCase());
        const matchesStatus = statusFilter === "All" || doc.status === statusFilter;
        return matchesSearch && matchesStatus;
      })
      .sort((a, b) => a.order - b.order);
  }, [documents, searchQuery, statusFilter]);

  const publishedCount = documents.filter((d) => d.status === "Published").length;
  const draftCount = documents.filter((d) => d.status === "Draft").length;

  // Handlers
  const handleOpenAddModal = () => {
    setEditingDocId(null);
    setFormTitle("");
    setFormPdfUrl("");
    setFormFileName("");
    setFormStatus("Published");
    setFormOrder(documents.length + 1);
    setIsEditorOpen(true);
  };

  const handleOpenEditModal = (doc: VerifiedDocument) => {
    setEditingDocId(doc.id);
    setFormTitle(doc.title);
    setFormPdfUrl(doc.pdfUrl);
    setFormFileName(doc.fileName || doc.pdfUrl.split("/").pop() || "document.pdf");
    setFormStatus(doc.status);
    setFormOrder(doc.order);
    setIsEditorOpen(true);
  };

  const handleFileUpload = async (file: File) => {
    if (!file) return;
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
        setFormPdfUrl(data.url);
        setFormFileName(file.name);
        if (!formTitle) {
          // Auto-generate title from filename if empty
          const rawName = file.name.replace(/\.[^/.]+$/, "").replace(/[-_]/g, " ");
          const autoTitle = rawName.charAt(0).toUpperCase() + rawName.slice(1);
          setFormTitle(autoTitle);
        }
        showToast("PDF uploaded successfully");
      } else {
        alert(data.error || "Failed to upload PDF file.");
      }
    } catch (err) {
      console.error("PDF upload error:", err);
      alert("An error occurred while uploading the PDF document.");
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

  const handleSaveDoc = async (statusOverride?: "Published" | "Draft") => {
    if (!formTitle.trim()) {
      alert("Please enter a document title.");
      return;
    }
    if (!formPdfUrl.trim()) {
      alert("Please upload a PDF document or provide a file URL.");
      return;
    }

    const finalStatus = statusOverride || formStatus;
    const payload = {
      title: formTitle.trim(),
      pdfUrl: formPdfUrl.trim(),
      fileName: formFileName.trim() || formPdfUrl.split("/").pop() || "document.pdf",
      status: finalStatus,
      order: Number(formOrder),
    };

    if (editingDocId) {
      // Optimistic update
      setDocuments((prev) =>
        prev.map((d) =>
          d.id === editingDocId ? { ...d, ...payload, lastUpdated: "Today" } : d
        )
      );

      try {
        const res = await fetch(`/api/verified-documents/${editingDocId}`, {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload),
        });
        const data = await res.json();
        if (data.document) {
          setDocuments((prev) =>
            prev.map((d) => (d.id === editingDocId ? data.document : d))
          );
        }
        showToast(`Updated "${formTitle.trim()}" in Database`);
      } catch (err) {
        console.error("Failed to update document in DB:", err);
      }
    } else {
      try {
        const res = await fetch("/api/verified-documents", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload),
        });
        const data = await res.json();
        if (data.id) {
          setDocuments((prev) => [data, ...prev]);
        } else {
          const fallback: VerifiedDocument = {
            id: `doc-local-${Date.now()}`,
            ...payload,
            lastUpdated: "Today",
          };
          setDocuments((prev) => [fallback, ...prev]);
        }
        showToast(`Added document "${formTitle.trim()}" to Database`);
      } catch (err) {
        console.error("Failed to create document in DB:", err);
      }
    }

    setIsEditorOpen(false);
  };

  const handleDuplicateDoc = async (doc: VerifiedDocument) => {
    const payload = {
      title: `${doc.title} Copy`,
      pdfUrl: doc.pdfUrl,
      fileName: doc.fileName,
      status: doc.status,
      order: doc.order + 1,
    };

    try {
      const res = await fetch("/api/verified-documents", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      const data = await res.json();
      if (data.id) {
        setDocuments((prev) => [data, ...prev]);
      } else {
        setDocuments((prev) => [
          { id: `doc-copy-${Date.now()}`, ...payload, lastUpdated: "Today" },
          ...prev,
        ]);
      }
      showToast(`Duplicated "${doc.title}"`);
    } catch (err) {
      console.error("Failed to duplicate document:", err);
    }
  };

  const handleTogglePublish = async (doc: VerifiedDocument) => {
    const newStatus = doc.status === "Published" ? "Draft" : "Published";
    setDocuments((prev) =>
      prev.map((d) => (d.id === doc.id ? { ...d, status: newStatus } : d))
    );

    try {
      await fetch(`/api/verified-documents/${doc.id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...doc, status: newStatus }),
      });
      showToast(`Document is now ${newStatus}`);
    } catch (err) {
      console.error("Failed to update status:", err);
    }
  };

  const handleConfirmDelete = async () => {
    if (!deleteCandidate) return;
    const targetId = deleteCandidate.id;
    const targetTitle = deleteCandidate.title;
    setDocuments((prev) => prev.filter((d) => d.id !== targetId));
    setDeleteCandidate(null);

    try {
      await fetch(`/api/verified-documents/${targetId}`, {
        method: "DELETE",
      });
      showToast(`Deleted "${targetTitle}" from Database`);
    } catch (err) {
      console.error("Failed to delete document from DB:", err);
    }
  };

  const handleMoveOrder = async (docId: string, direction: "up" | "down") => {
    const index = documents.findIndex((d) => d.id === docId);
    if (index < 0) return;
    const targetIndex = direction === "up" ? index - 1 : index + 1;
    if (targetIndex < 0 || targetIndex >= documents.length) return;

    const updated = [...documents];
    const tempOrder = updated[index].order;
    updated[index].order = updated[targetIndex].order;
    updated[targetIndex].order = tempOrder;

    const tempDoc = updated[index];
    updated[index] = updated[targetIndex];
    updated[targetIndex] = tempDoc;

    setDocuments(updated);
    showToast("Reordered documents");

    try {
      await Promise.all([
        fetch(`/api/verified-documents/${updated[index].id}`, {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(updated[index]),
        }),
        fetch(`/api/verified-documents/${updated[targetIndex].id}`, {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(updated[targetIndex]),
        }),
      ]);
    } catch (err) {
      console.error("Failed to persist document reorder:", err);
    }
  };

  return (
    <div className={styles.container}>
      {/* Breadcrumbs */}
      <nav className={styles.breadcrumb} aria-label="Breadcrumb">
        <Link href="/admin" className={styles.breadcrumbLink}>
          Dashboard
        </Link>
        <span className={styles.breadcrumbSeparator}>/</span>
        <span className={styles.breadcrumbActive}>SSLC &amp; Plus Two</span>
        <span className={styles.breadcrumbSeparator}>/</span>
        <span className={styles.breadcrumbActive}>Verified Documents &amp; Recognitions</span>
      </nav>

      {/* Top SSLC & Plus Two Section Switcher */}
      <div style={{ display: "flex", gap: "0.75rem", flexWrap: "wrap" }}>
        <Link
          href="/admin/courses/sslc-plus-two"
          className={styles.secondaryBtn}
          style={{ textDecoration: "none" }}
        >
          🎴 Content Cards
        </Link>
        <Link
          href="/admin/courses/sslc-plus-two/verified-documents"
          className={styles.secondaryBtn}
          style={{ background: "#14161c", color: "#ffffff", borderColor: "#14161c", textDecoration: "none" }}
        >
          📄 Verified Documents &amp; Recognitions
        </Link>
      </div>

      {/* Header Bar */}
      <div className={styles.headerBar}>
        <div className={styles.headerMain}>
          <h1 className={styles.heading}>Verified Documents &amp; Recognitions</h1>
          <p className={styles.subtitle}>
            Manage official NIOS, NCTE, UGC &amp; State Board recognition PDF documents displayed on the Student Support section.
          </p>
        </div>
        <button type="button" className={styles.primaryBtn} onClick={handleOpenAddModal}>
          <span style={{ fontSize: "1.2rem", lineHeight: 1 }}>+</span> Add New PDF Document
        </button>
      </div>

      {/* Summary Stats */}
      <div className={styles.statsRow}>
        <div className={styles.statCard}>
          <span className={styles.statLabel}>Total Documents</span>
          <span className={styles.statValue}>{documents.length}</span>
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

      {/* Toolbar */}
      <div className={styles.toolbar}>
        <div className={styles.searchGroup}>
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#6b7686" strokeWidth="2">
            <circle cx="11" cy="11" r="8" />
            <line x1="21" y1="21" x2="16.65" y2="16.65" />
          </svg>
          <input
            type="text"
            className={styles.searchInput}
            placeholder="Search documents by title..."
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

      {/* Document Cards Container */}
      <div className={styles.cardListContainer}>
        <div className={styles.cardListHeader}>
          <span className={styles.cardListTitle}>
            PDF Recognition Documents ({filteredDocuments.length})
          </span>
          <span style={{ fontSize: "0.8125rem", color: "#6b7686" }}>
            Active on Frontend <strong>Student Support</strong> section
          </span>
        </div>

        {filteredDocuments.length > 0 ? (
          <div className={styles.docsGrid}>
            {filteredDocuments.map((doc, idx) => (
              <div key={doc.id} className={styles.docItem}>
                {/* Reorder Up/Down */}
                <div className={styles.dragHandle}>
                  <button
                    type="button"
                    style={{ background: "none", border: "none", cursor: "pointer", padding: 0 }}
                    onClick={() => handleMoveOrder(doc.id, "up")}
                    disabled={idx === 0}
                    title="Move Up"
                  >
                    ▲
                  </button>
                  <span style={{ fontSize: "0.7rem", fontWeight: 700 }}>{doc.order}</span>
                  <button
                    type="button"
                    style={{ background: "none", border: "none", cursor: "pointer", padding: 0 }}
                    onClick={() => handleMoveOrder(doc.id, "down")}
                    disabled={idx === filteredDocuments.length - 1}
                    title="Move Down"
                  >
                    ▼
                  </button>
                </div>

                {/* PDF Icon Badge */}
                <div className={styles.pdfIconBox}>
                  📄
                </div>

                {/* Document Main Info */}
                <div className={styles.docMainInfo}>
                  <h3 className={styles.docTitle}>{doc.title}</h3>
                  <span className={styles.docSubtext}>
                    {doc.fileName || doc.pdfUrl.split("/").pop()} &bull; PDF File
                  </span>
                </div>

                {/* Status Badge */}
                <div>
                  <span
                    className={`${styles.badge} ${
                      doc.status === "Published" ? styles.badgePublished : styles.badgeDraft
                    }`}
                  >
                    <span
                      style={{
                        width: "6px",
                        height: "6px",
                        borderRadius: "50%",
                        background: doc.status === "Published" ? "#16a34a" : "#d97706",
                      }}
                    />
                    {doc.status}
                  </span>
                </div>

                {/* Last Updated */}
                <span className={styles.updatedText}>{doc.lastUpdated || "Today"}</span>

                {/* Actions */}
                <div className={styles.actionsGroup}>
                  <a
                    href={doc.pdfUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className={styles.secondaryBtn}
                    style={{ padding: "0.4rem 0.75rem", fontSize: "0.8rem", textDecoration: "none" }}
                    title="View PDF file in new tab"
                  >
                    👁️ View
                  </a>

                  <button
                    type="button"
                    className={styles.secondaryBtn}
                    style={{ padding: "0.4rem 0.75rem", fontSize: "0.8rem" }}
                    onClick={() => handleOpenEditModal(doc)}
                  >
                    Edit
                  </button>

                  <button
                    type="button"
                    className={styles.iconBtn}
                    onClick={() => handleDuplicateDoc(doc)}
                    title="Duplicate document"
                  >
                    📋
                  </button>

                  <button
                    type="button"
                    className={styles.iconBtn}
                    onClick={() => handleTogglePublish(doc)}
                    title={doc.status === "Published" ? "Unpublish to draft" : "Publish document"}
                  >
                    {doc.status === "Published" ? "⏸️" : "🚀"}
                  </button>

                  <button
                    type="button"
                    className={styles.dangerBtn}
                    onClick={() => setDeleteCandidate(doc)}
                    title="Delete document"
                  >
                    🗑️
                  </button>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className={styles.emptyState}>
            <div className={styles.emptyIcon}>📄</div>
            <h3 className={styles.emptyTitle}>No verified documents found</h3>
            <p className={styles.emptyText}>
              Add your first PDF document to display under Verified Documents &amp; Recognitions.
            </p>
            <button type="button" className={styles.primaryBtn} onClick={handleOpenAddModal}>
              + Add New PDF Document
            </button>
          </div>
        )}
      </div>

      {/* Editor Drawer Modal */}
      {isEditorOpen && (
        <div className={styles.editorOverlay} onClick={() => setIsEditorOpen(false)}>
          <div className={styles.editorDrawer} onClick={(e) => e.stopPropagation()}>
            <div className={styles.editorHeader}>
              <div>
                <span style={{ fontSize: "0.75rem", fontWeight: 700, color: "#E91D24", textTransform: "uppercase" }}>
                  Document Editor
                </span>
                <h2 className={styles.editorTitle}>
                  {editingDocId ? `Edit Document: ${formTitle || "Untitled"}` : "Add New PDF Document"}
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

            <div className={styles.editorBody}>
              {/* Form Column */}
              <div className={styles.formCol}>
                <div className={styles.formCard}>
                  {/* Document Heading */}
                  <div className={styles.fieldGroup}>
                    <label className={styles.fieldLabel}>Document Heading *</label>
                    <input
                      type="text"
                      className={styles.inputControl}
                      placeholder="e.g. NIOS Recognition Certificate"
                      value={formTitle}
                      onChange={(e) => setFormTitle(e.target.value)}
                    />
                    <span className={styles.fieldHelper}>Official document title displayed on user side card.</span>
                  </div>

                  {/* Upload PDF Option */}
                  <div className={styles.fieldGroup}>
                    <label className={styles.fieldLabel}>PDF Document File *</label>
                    <input
                      id="verified-doc-pdf-input"
                      type="file"
                      accept=".pdf,application/pdf"
                      style={{ display: "none" }}
                      onChange={(e) => {
                        if (e.target.files && e.target.files[0]) {
                          handleFileUpload(e.target.files[0]);
                        }
                      }}
                    />

                    {formPdfUrl ? (
                      <div className={styles.previewPdfWrap}>
                        <div className={styles.previewPdfInfo}>
                          <span className={styles.pdfBadge}>📄</span>
                          <div>
                            <span className={styles.pdfName}>{formFileName || formPdfUrl.split("/").pop()}</span>
                            <span style={{ display: "block", fontSize: "0.75rem", color: "#16a34a", fontWeight: 600 }}>
                              ✓ PDF Attached &amp; Ready
                            </span>
                          </div>
                        </div>

                        <div style={{ display: "flex", gap: "0.5rem" }}>
                          <button
                            type="button"
                            className={styles.secondaryBtn}
                            onClick={() => document.getElementById("verified-doc-pdf-input")?.click()}
                            disabled={isUploading}
                            style={{ padding: "0.4rem 0.75rem", fontSize: "0.8rem" }}
                          >
                            {isUploading ? "Uploading..." : "📤 Replace PDF"}
                          </button>
                          <button
                            type="button"
                            className={styles.dangerBtn}
                            onClick={() => {
                              setFormPdfUrl("");
                              setFormFileName("");
                            }}
                          >
                            Remove
                          </button>
                        </div>
                      </div>
                    ) : (
                      <div
                        className={styles.dropzone}
                        onClick={() => document.getElementById("verified-doc-pdf-input")?.click()}
                        onDragOver={handleDragOver}
                        onDrop={handleDrop}
                      >
                        <div className={styles.uploadIcon}>{isUploading ? "⏳" : "↑"}</div>
                        <span style={{ fontSize: "0.9rem", fontWeight: 700, color: "#14161c" }}>
                          {isUploading ? "Uploading PDF..." : "Click to select PDF document or drag & drop"}
                        </span>
                        <span style={{ fontSize: "0.78rem", color: "#6b7686" }}>
                          Supports PDF documents up to 25MB
                        </span>
                      </div>
                    )}
                  </div>

                  {/* Manual PDF URL Input */}
                  <div className={styles.fieldGroup}>
                    <label className={styles.fieldLabel}>Or Enter PDF File URL directly</label>
                    <input
                      type="text"
                      className={styles.inputControl}
                      placeholder="/documents/nios-recognition-certificate.pdf"
                      value={formPdfUrl}
                      onChange={(e) => {
                        setFormPdfUrl(e.target.value);
                        setFormFileName(e.target.value.split("/").pop() || "document.pdf");
                      }}
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

              {/* User Side Card Live Preview */}
              <div className={styles.previewCol}>
                <div className={styles.previewHeader}>
                  <span>LIVE FRONTEND CARD PREVIEW</span>
                </div>

                <div className={styles.userCardPreview}>
                  <div className={styles.userCardBody}>
                    <div className={styles.userCardIcon}>
                      <svg viewBox="0 0 24 24" width="22" height="22" fill="none" aria-hidden="true">
                        <path
                          d="M6.5 3.5h7l4 4v12.5a1 1 0 0 1-1 1h-10a1 1 0 0 1-1-1v-15.5a1 1 0 0 1 1-1Z"
                          stroke="currentColor"
                          strokeWidth="1.6"
                          strokeLinejoin="round"
                        />
                        <path d="M13.5 3.5V8h4" stroke="currentColor" strokeWidth="1.6" strokeLinejoin="round" />
                        <path d="M8.5 13h6M8.5 16h4" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" />
                      </svg>
                    </div>
                    <div>
                      <h4 className={styles.userCardTitle}>
                        {formTitle.trim() || "Document Title Placeholder"}
                      </h4>
                      <span className={styles.userCardSub}>PDF Document</span>
                    </div>
                  </div>

                  <div className={styles.userCardAction}>
                    <span>View PDF</span>
                    <svg viewBox="0 0 24 24" width="16" height="16" fill="none" aria-hidden="true">
                      <path
                        d="M12 4.5v11M7.5 11.5 12 16l4.5-4.5M5.5 19.5h13"
                        stroke="currentColor"
                        strokeWidth="1.8"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                    </svg>
                  </div>
                </div>

                <div style={{ background: "#ffffff", padding: "1rem", borderRadius: "12px", border: "1px solid #e3e6ee" }}>
                  <span style={{ fontSize: "0.78rem", color: "#6b7686", display: "block" }}>
                    ℹ️ Clicking this card on the user-side Student Support section will open <code>{formPdfUrl || "attached PDF"}</code> in a new tab.
                  </span>
                </div>
              </div>
            </div>

            {/* Footer */}
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
                  onClick={() => handleSaveDoc("Draft")}
                >
                  Save as Draft
                </button>
                <button
                  type="button"
                  className={styles.primaryBtn}
                  onClick={() => handleSaveDoc(editingDocId ? formStatus : "Published")}
                >
                  {editingDocId ? "Save Changes" : "Publish Document"}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {deleteCandidate && (
        <div className={styles.modalOverlay} onClick={() => setDeleteCandidate(null)}>
          <div className={styles.confirmModal} onClick={(e) => e.stopPropagation()}>
            <h3 className={styles.confirmTitle}>Delete document?</h3>
            <p className={styles.confirmText}>
              Are you sure you want to delete &quot;<strong>{deleteCandidate.title}</strong>&quot;? This action cannot be undone.
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
                Delete Document
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

export default function VerifiedDocumentsAdminPageWrapper() {
  return (
    <Suspense fallback={<div style={{ padding: "2rem", color: "#6b7686" }}>Loading Verified Documents...</div>}>
      <VerifiedDocumentsAdminPage />
    </Suspense>
  );
}
