"use client";

import { useState } from "react";
import type { FormEvent } from "react";

type Status = "idle" | "submitting" | "success" | "error";

export function useEnquiryForm(source: string) {
  const [status, setStatus] = useState<Status>("idle");
  const [errorMessage, setErrorMessage] = useState("");

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const form = event.currentTarget;
    const formData = new FormData(form);

    const payload = {
      firstName: (formData.get("firstName") || formData.get("name") || "").toString().trim(),
      lastName: (formData.get("lastName") || "").toString().trim(),
      phoneNumber: (formData.get("phoneNumber") || formData.get("phone") || "").toString().trim(),
      email: (formData.get("email") || "").toString().trim(),
      company: (formData.get("company") || "").toString().trim(),
      enquiry: (formData.get("enquiry") || formData.get("message") || formData.get("preference") || "").toString().trim(),
      source,
    };

    setStatus("submitting");
    setErrorMessage("");

    try {
      const response = await fetch("/api/enquiries", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      if (!response.ok) {
        const data = await response.json().catch(() => ({}));
        throw new Error(data.error || "Something went wrong. Please try again.");
      }

      setStatus("success");
      form.reset();
    } catch (error) {
      setStatus("error");
      setErrorMessage(error instanceof Error ? error.message : "Something went wrong. Please try again.");
    }
  };

  return { status, errorMessage, handleSubmit };
}
