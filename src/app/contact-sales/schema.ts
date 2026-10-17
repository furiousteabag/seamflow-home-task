import { z } from "zod";

export const interests = {
  demo: "Request a product demo",
  pricing: "Get enterprise pricing",
  assessment: "Hot Dog Readiness Assessment",
  sales: "Talk to sales",
  security: "Security & compliance review",
  partnership: "Partnerships",
  careers: "Careers",
} as const;

export const companySizes = [
  "1–49",
  "50–249",
  "250–999",
  "1,000–4,999",
  "5,000+",
] as const;

export const leadInput = z.object({
  name: z.string().trim().min(1, "Enter your name").max(120),
  email: z.email("Enter a valid work email").max(200),
  company: z.string().trim().min(1, "Enter your company").max(160),
  jobTitle: z.string().trim().max(120).optional(),
  companySize: z.string().max(20).optional(),
  interest: z.enum(Object.keys(interests) as [keyof typeof interests]),
  message: z.string().trim().max(2000).optional(),
  website: z.string().max(0).optional(),
});

export type LeadInput = z.infer<typeof leadInput>;
