// Shared collaboration-inquiry contract between the Contact section,
// the existing AI chat widget, and App-level orchestration.
// NOTE: api/chat.ts keeps its own copy of the category whitelist (it is compiled
// separately as a serverless function) — keep both lists in sync.

export const INQUIRY_CATEGORIES = [
  "Website or Web Application",
  "Mobile Application",
  "Business or Management System",
  "UI/UX or Frontend Development",
  "Backend or API Development",
  "Internship / OJT Opportunity",
  "Other Collaboration",
] as const;

export type InquiryCategory = (typeof INQUIRY_CATEGORIES)[number];

export interface CollaborationInquiry {
  categories: InquiryCategory[];
  description: string;
}

export const INQUIRY_DESCRIPTION_MAX = 1200;

/** Contact section → App: open the existing AI assistant with inquiry context. */
export const OPEN_AI_INQUIRY_EVENT = "open-ai-inquiry";

/** AI assistant → Contact section: visitor wants to continue to the message form. */
export const INQUIRY_CONTINUE_TO_FORM_EVENT = "inquiry-continue-to-form";

export interface InquiryTransferPayload {
  refinedDescription?: string;
}

export function formatInquirySubject(inquiry: CollaborationInquiry): string {
  if (inquiry.categories.length === 0) {
    return inquiry.description.trim() ? "Project Collaboration Inquiry" : "";
  }
  if (inquiry.categories.length === 1) {
    return `Inquiry: ${inquiry.categories[0]}`;
  }
  return `Inquiry: ${inquiry.categories[0]} + ${inquiry.categories.length - 1} more`;
}

export function formatInquiryHeader(inquiry: CollaborationInquiry): string {
  const sections: string[] = [];
  if (inquiry.categories.length > 0) {
    sections.push(`I'm interested in:\n${inquiry.categories.join(", ")}`);
  }
  const desc = inquiry.description.trim();
  if (desc) {
    sections.push(`Project description:\n${desc}`);
  }
  return sections.join("\n\n");
}

export function formatInquiryMessage(inquiry: CollaborationInquiry): string {
  const header = formatInquiryHeader(inquiry);
  if (!header) return "";
  return `${header}\n\nAdditional message:\n`;
}

