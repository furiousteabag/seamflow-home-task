"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { CheckCircle2 } from "lucide-react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import type { ReactElement } from "react";
import { cloneElement, useId, useState, useTransition } from "react";
import { useForm } from "react-hook-form";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { submitLead } from "./actions";
import { companySizes, interests, type LeadInput, leadInput } from "./schema";

const selectClass =
  "h-9 w-full rounded-md border border-input bg-transparent px-3 text-sm shadow-xs outline-none focus-visible:border-ring focus-visible:ring-[3px] focus-visible:ring-ring/50";

export function ContactForm() {
  const params = useSearchParams();
  const interestParam = params.get("interest");
  const plan = params.get("plan");
  const industry = params.get("industry");
  const role = params.get("role");
  const [done, setDone] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [pending, startTransition] = useTransition();

  const prefill = [
    plan && `Interested in the ${plan.replace(/-/g, " ")} plan.`,
    industry && `Industry: ${industry.replace(/-/g, " ")}.`,
    role && `Applying for: ${role}.`,
  ]
    .filter(Boolean)
    .join(" ");

  const form = useForm<LeadInput>({
    resolver: zodResolver(leadInput),
    defaultValues: {
      name: "",
      email: "",
      company: "",
      jobTitle: "",
      companySize: "",
      interest:
        interestParam && interestParam in interests
          ? (interestParam as LeadInput["interest"])
          : "demo",
      message: prefill,
      website: "",
    },
  });
  const errors = form.formState.errors;

  const onSubmit = form.handleSubmit((values) =>
    startTransition(async () => {
      setError(null);
      const result = await submitLead(values);
      if (result.ok) setDone(true);
      else setError(result.error);
    }),
  );

  if (done) {
    return (
      <div className="flex flex-col items-center rounded-xl border bg-card p-10 text-center">
        <CheckCircle2 className="size-12 text-emerald-600" />
        <h2 className="mt-4 text-2xl font-semibold tracking-tight">
          Thanks, we've got it
        </h2>
        <p className="mt-2 max-w-sm text-muted-foreground">
          A SeeFood account executive will reach out within one business day. In
          the meantime, you can start classifying right away.
        </p>
        <div className="mt-6 flex flex-wrap justify-center gap-3">
          <Link
            href="/app"
            className="rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground"
          >
            Open the workspace
          </Link>
          <Link
            href="/customers"
            className="rounded-md border px-4 py-2 text-sm font-medium"
          >
            Read customer stories
          </Link>
        </div>
      </div>
    );
  }

  return (
    <form
      onSubmit={onSubmit}
      noValidate
      className="flex flex-col gap-4 rounded-xl border bg-card p-6 shadow-sm sm:p-8"
    >
      <div className="grid gap-4 sm:grid-cols-2">
        <Field label="Full name" error={errors.name?.message}>
          <Input {...form.register("name")} autoComplete="name" />
        </Field>
        <Field label="Work email" error={errors.email?.message}>
          <Input
            {...form.register("email")}
            type="email"
            autoComplete="email"
          />
        </Field>
        <Field label="Company" error={errors.company?.message}>
          <Input {...form.register("company")} autoComplete="organization" />
        </Field>
        <Field label="Job title (optional)">
          <Input
            {...form.register("jobTitle")}
            autoComplete="organization-title"
          />
        </Field>
        <Field label="Company size (optional)">
          <select {...form.register("companySize")} className={selectClass}>
            <option value="">Select…</option>
            {companySizes.map((s) => (
              <option key={s} value={s}>
                {s} employees
              </option>
            ))}
          </select>
        </Field>
        <Field label="How can we help?">
          <select {...form.register("interest")} className={selectClass}>
            {Object.entries(interests).map(([k, v]) => (
              <option key={k} value={k}>
                {v}
              </option>
            ))}
          </select>
        </Field>
      </div>
      <Field label="Tell us about your hot dog program (optional)">
        <Textarea {...form.register("message")} rows={4} />
      </Field>
      <input
        {...form.register("website")}
        tabIndex={-1}
        autoComplete="off"
        aria-hidden
        className="hidden"
      />
      {error && <p className="text-sm text-destructive">{error}</p>}
      <Button type="submit" size="lg" disabled={pending}>
        {pending ? "Sending…" : "Contact sales"}
      </Button>
      <p className="text-xs text-muted-foreground">
        By submitting, you agree to our{" "}
        <Link href="/privacy" className="underline">
          Privacy Policy
        </Link>
        . We'll only use your details to respond to this request.
      </p>
    </form>
  );
}

function Field({
  label,
  error,
  children,
}: {
  label: string;
  error?: string;
  children: ReactElement<{ id?: string; "aria-invalid"?: boolean }>;
}) {
  const id = useId();
  return (
    <div className="flex flex-col gap-1.5">
      <Label htmlFor={id}>{label}</Label>
      {cloneElement(children, { id, "aria-invalid": !!error })}
      {error && <p className="text-xs text-destructive">{error}</p>}
    </div>
  );
}
