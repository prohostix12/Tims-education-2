export const COURSE_PREFERENCE_LABELS: Record<string, string> = {
  "sslc-plus-two": "SSLC / Plus Two",
  "online-degree": "Online Degree",
  "post-graduation": "Post Graduation",
  "btech-mtech": "Btech / Mtech",
  diploma: "Diploma",
};

export function preferenceLabel(value: string): string {
  if (!value) return "—";
  return COURSE_PREFERENCE_LABELS[value] || value;
}
