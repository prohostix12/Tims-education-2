"use client";

import { useEffect, useState } from "react";
import styles from "./faq.module.css";

type FaqItem = {
  id: string;
  question: string;
  answer: string;
  createdAt?: string;
};

export default function AdminFaqPage() {
  const [faqs, setFaqs] = useState<FaqItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [loadError, setLoadError] = useState<string | null>(null);

  const [modalOpen, setModalOpen] = useState(false);
  const [editingFaq, setEditingFaq] = useState<FaqItem | null>(null);
  const [question, setQuestion] = useState("");
  const [answer, setAnswer] = useState("");

  const [submitting, setSubmitting] = useState(false);
  const [formError, setFormError] = useState<string | null>(null);
  const [deletingId, setDeletingId] = useState<string | null>(null);

  const loadFaqs = async () => {
    setLoading(true);
    setLoadError(null);
    try {
      const response = await fetch("/api/faqs");
      if (!response.ok) throw new Error("Could not load FAQs from database.");
      const data = await response.json();
      setFaqs(data.faqs || []);
    } catch (err) {
      setLoadError(err instanceof Error ? err.message : "Failed to load FAQs.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadFaqs();
  }, []);

  const handleOpenAdd = () => {
    setEditingFaq(null);
    setQuestion("");
    setAnswer("");
    setFormError(null);
    setModalOpen(true);
  };

  const handleOpenEdit = (faq: FaqItem) => {
    setEditingFaq(faq);
    setQuestion(faq.question);
    setAnswer(faq.answer);
    setFormError(null);
    setModalOpen(true);
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this FAQ?")) return;
    setDeletingId(id);
    try {
      const res = await fetch(`/api/faqs/${id}`, { method: "DELETE" });
      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error || "Failed to delete FAQ.");
      }
      setFaqs((prev) => prev.filter((item) => item.id !== id));
    } catch (err) {
      alert(err instanceof Error ? err.message : "Error deleting FAQ.");
    } finally {
      setDeletingId(null);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!question.trim() || !answer.trim()) return;

    setSubmitting(true);
    setFormError(null);

    try {
      if (editingFaq) {
        const res = await fetch(`/api/faqs/${editingFaq.id}`, {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ question, answer }),
        });
        if (!res.ok) {
          const data = await res.json();
          throw new Error(data.error || "Failed to update FAQ.");
        }
        setFaqs((prev) =>
          prev.map((item) =>
            item.id === editingFaq.id ? { ...item, question, answer } : item
          )
        );
      } else {
        const res = await fetch("/api/faqs", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ question, answer }),
        });
        if (!res.ok) {
          const data = await res.json();
          throw new Error(data.error || "Failed to create FAQ.");
        }
        const created = await res.json();
        setFaqs((prev) => [{ id: created.id, question, answer }, ...prev]);
      }

      setModalOpen(false);
    } catch (err) {
      setFormError(err instanceof Error ? err.message : "An error occurred.");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <div>
          <h1 className={styles.title}>
            <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="#E91D24" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
              <circle cx="12" cy="12" r="10" />
              <path d="M9.09 9a3 3 0 0 1 5.83 1c0 2-3 3-3 3" />
              <line x1="12" y1="17" x2="12.01" y2="17" />
            </svg>
            FAQ Management
          </h1>
          <p className={styles.subtitle}>
            Manage frequently asked questions stored directly in the database.
          </p>
        </div>

        <button type="button" className={styles.addBtn} onClick={handleOpenAdd}>
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
            <line x1="12" y1="5" x2="12" y2="19" />
            <line x1="5" y1="12" x2="19" y2="12" />
          </svg>
          Add New FAQ
        </button>
      </div>

      {loadError && (
        <div style={{ padding: "1rem", background: "rgba(239,68,68,0.15)", border: "1px solid #ef4444", borderRadius: "10px", color: "#f87171", marginBottom: "1.5rem" }}>
          {loadError}
        </div>
      )}

      {loading ? (
        <div style={{ textAlign: "center", padding: "4rem 0", color: "#94a3b8" }}>
          Loading FAQs from database...
        </div>
      ) : faqs.length === 0 ? (
        <div className={styles.emptyState}>
          <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
            <circle cx="12" cy="12" r="10" />
            <line x1="12" y1="8" x2="12" y2="12" />
            <line x1="12" y1="16" x2="12.01" y2="16" />
          </svg>
          <h3>No FAQs Found in Database</h3>
          <p>Click the "Add New FAQ" button above to insert your first FAQ into the database.</p>
        </div>
      ) : (
        <div className={styles.faqList}>
          {faqs.map((faq) => (
            <div key={faq.id} className={styles.faqCard}>
              <div className={styles.faqQuestionHeader}>
                <div>
                  <h3 className={styles.faqQuestion}>{faq.question}</h3>
                  <p className={styles.faqAnswer}>{faq.answer}</p>
                </div>

                <div className={styles.faqActions}>
                  <button
                    type="button"
                    className={styles.actionBtn}
                    onClick={() => handleOpenEdit(faq)}
                    title="Edit FAQ"
                    disabled={deletingId === faq.id}
                  >
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7" />
                      <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z" />
                    </svg>
                  </button>
                  <button
                    type="button"
                    className={`${styles.actionBtn} ${styles.deleteBtn}`}
                    onClick={() => handleDelete(faq.id)}
                    title="Delete FAQ"
                    disabled={deletingId === faq.id}
                  >
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <polyline points="3 6 5 6 21 6" />
                      <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2" />
                    </svg>
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {modalOpen && (
        <div className={styles.modalBackdrop} onClick={() => !submitting && setModalOpen(false)}>
          <div className={styles.modal} onClick={(e) => e.stopPropagation()}>
            <h2 className={styles.modalTitle}>
              {editingFaq ? "Edit FAQ" : "Add New FAQ"}
            </h2>

            {formError && (
              <div style={{ padding: "0.75rem 1rem", background: "rgba(239,68,68,0.15)", border: "1px solid #ef4444", borderRadius: "8px", color: "#f87171", marginBottom: "1rem", fontSize: "0.9rem" }}>
                {formError}
              </div>
            )}

            <form onSubmit={handleSubmit}>
              <div className={styles.formGroup}>
                <label className={styles.label}>Question</label>
                <input
                  type="text"
                  className={styles.input}
                  value={question}
                  onChange={(e) => setQuestion(e.target.value)}
                  placeholder="e.g. What degrees are offered?"
                  disabled={submitting}
                  required
                />
              </div>

              <div className={styles.formGroup}>
                <label className={styles.label}>Answer</label>
                <textarea
                  className={styles.textarea}
                  value={answer}
                  onChange={(e) => setAnswer(e.target.value)}
                  placeholder="Write the detailed answer here..."
                  disabled={submitting}
                  required
                />
              </div>

              <div className={styles.modalFooter}>
                <button
                  type="button"
                  className={styles.cancelBtn}
                  onClick={() => setModalOpen(false)}
                  disabled={submitting}
                >
                  Cancel
                </button>
                <button type="submit" className={styles.submitBtn} disabled={submitting}>
                  {submitting ? "Saving to Database..." : editingFaq ? "Update FAQ" : "Save FAQ"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
