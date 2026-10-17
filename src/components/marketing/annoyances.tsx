"use client";

import {
  BookOpen,
  Cookie,
  Megaphone,
  MessageSquare,
  ShieldCheck,
  X,
} from "lucide-react";
import Link from "next/link";
import { useCallback, useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

// The enterprise "experience layer": consent, promos, chat, nudges.
// Every choice is remembered in localStorage so nothing nags twice.

const KEYS = {
  consent: "sf.consent.v1",
  announcement: "sf.announcement.team26",
  privacy: "sf.privacy-notice.2026-10",
  report: "sf.report-promo",
  exit: "sf.exit-intent",
  chatTeaser: "sf.chat-teaser",
} as const;

const OPEN_COOKIE_SETTINGS = "seefood:open-cookie-settings";

type Consent = {
  necessary: true;
  analytics: boolean;
  marketing: boolean;
  personalization: boolean;
  hotDogTelemetry: boolean;
  decidedAt: string;
};

const categories: {
  key: Exclude<keyof Consent, "necessary" | "decidedAt">;
  title: string;
  body: string;
}[] = [
  {
    key: "analytics",
    title: "Performance & analytics",
    body: "Helps us measure how many people scroll past the hero to reach the pricing page, which is custom.",
  },
  {
    key: "marketing",
    title: "Marketing & advertising",
    body: "Lets us remind you about SeeFood on other websites while you are trying to read the news.",
  },
  {
    key: "personalization",
    title: "Personalization",
    body: "Remembers your industry so our account executives can open with a relevant hot dog anecdote.",
  },
  {
    key: "hotDogTelemetry",
    title: "Hot dog telemetry",
    body: "Shares anonymous statistics about how often you look at hot dogs. Strictly for science.",
  },
];

function read<T>(key: string): T | null {
  try {
    const raw = localStorage.getItem(key);
    return raw ? (JSON.parse(raw) as T) : null;
  } catch {
    return null;
  }
}

function write(key: string, value: unknown) {
  try {
    localStorage.setItem(key, JSON.stringify(value));
  } catch {
    // Storage blocked (private mode); the banner will simply ask again
  }
}

/** Dismissible event banner above the header. */
export function AnnouncementBar() {
  const [visible, setVisible] = useState(false);
  useEffect(() => setVisible(!read(KEYS.announcement)), []);
  if (!visible) return null;

  return (
    <div className="relative bg-gradient-to-r from-primary via-indigo-600 to-sky-600 text-white">
      <div className="mx-auto flex max-w-7xl items-center justify-center gap-2 px-10 py-2 text-center text-xs sm:text-sm">
        <Megaphone className="hidden size-4 shrink-0 sm:block" />
        <span>
          <strong>New:</strong> The State of Hot Dogs 2026 report is here. 73%
          of leaders say ambiguity is their #1 food risk.
        </span>
        <Link
          href="/resources/state-of-hot-dogs-2026"
          className="shrink-0 font-semibold underline underline-offset-2"
        >
          Read the report →
        </Link>
      </div>
      <button
        type="button"
        aria-label="Dismiss announcement"
        onClick={() => {
          write(KEYS.announcement, true);
          setVisible(false);
        }}
        className="absolute top-1/2 right-3 -translate-y-1/2 rounded p-1 hover:bg-white/15"
      >
        <X className="size-4" />
      </button>
    </div>
  );
}

/** Footer link that reopens the consent preferences. */
export function CookieSettingsLink({ className }: { className?: string }) {
  return (
    <button
      type="button"
      className={cn("text-left", className)}
      onClick={() => window.dispatchEvent(new Event(OPEN_COOKIE_SETTINGS))}
    >
      Cookie Settings
    </button>
  );
}

/** Mounted once per marketing page (inside the footer). */
export function Annoyances() {
  const [consent, setConsent] = useState<Consent | null | undefined>(undefined);
  const [settingsOpen, setSettingsOpen] = useState(false);

  useEffect(() => {
    setConsent(read<Consent>(KEYS.consent));
    const open = () => setSettingsOpen(true);
    window.addEventListener(OPEN_COOKIE_SETTINGS, open);
    return () => window.removeEventListener(OPEN_COOKIE_SETTINGS, open);
  }, []);

  const save = useCallback(
    (partial: Omit<Consent, "necessary" | "decidedAt">) => {
      const value: Consent = {
        necessary: true,
        ...partial,
        decidedAt: new Date().toISOString(),
      };
      write(KEYS.consent, value);
      setConsent(value);
      setSettingsOpen(false);
    },
    [],
  );

  if (consent === undefined) return null;
  const decided = consent !== null;

  return (
    <>
      {!decided && !settingsOpen && (
        <CookieBanner
          onAcceptAll={() =>
            save({
              analytics: true,
              marketing: true,
              personalization: true,
              hotDogTelemetry: true,
            })
          }
          onRejectAll={() =>
            save({
              analytics: false,
              marketing: false,
              personalization: false,
              hotDogTelemetry: false,
            })
          }
          onManage={() => setSettingsOpen(true)}
        />
      )}
      {settingsOpen && (
        <CookiePreferences
          initial={consent}
          onSave={save}
          onClose={() => setSettingsOpen(false)}
        />
      )}
      {decided && (
        <>
          <PrivacyNotice />
          <ReportSlideIn />
          <ExitIntent />
        </>
      )}
      <SalesChat delayTeaser={decided} />
    </>
  );
}

function CookieBanner({
  onAcceptAll,
  onRejectAll,
  onManage,
}: {
  onAcceptAll: () => void;
  onRejectAll: () => void;
  onManage: () => void;
}) {
  return (
    <div
      role="dialog"
      aria-label="Cookie consent"
      className="fixed inset-x-0 bottom-0 z-50 border-t bg-background shadow-[0_-8px_30px_rgba(0,0,0,0.12)]"
    >
      <div className="mx-auto flex max-w-7xl flex-col gap-4 px-4 py-5 lg:flex-row lg:items-center lg:gap-8">
        <div className="flex gap-3">
          <Cookie className="mt-0.5 size-5 shrink-0 text-primary" />
          <div className="text-sm">
            <p className="font-semibold">
              We value your privacy (and your hot dogs)
            </p>
            <p className="mt-1 text-muted-foreground">
              SeeFood Systems and our 4 partners use cookies and similar
              technologies to operate this site, analyse traffic, personalise
              content and measure hot dog interest. You can accept all, reject
              non-essential cookies, or choose by category. See our{" "}
              <Link href="/privacy" className="text-primary underline">
                Privacy Policy
              </Link>
              .
            </p>
          </div>
        </div>
        <div className="flex shrink-0 flex-wrap gap-2">
          <Button variant="ghost" onClick={onManage}>
            Manage preferences
          </Button>
          <Button variant="outline" onClick={onRejectAll}>
            Reject all
          </Button>
          <Button onClick={onAcceptAll}>Accept all cookies</Button>
        </div>
      </div>
    </div>
  );
}

function CookiePreferences({
  initial,
  onSave,
  onClose,
}: {
  initial: Consent | null;
  onSave: (c: Omit<Consent, "necessary" | "decidedAt">) => void;
  onClose: () => void;
}) {
  const [state, setState] = useState({
    analytics: initial?.analytics ?? false,
    marketing: initial?.marketing ?? false,
    personalization: initial?.personalization ?? false,
    hotDogTelemetry: initial?.hotDogTelemetry ?? false,
  });

  return (
    <div className="fixed inset-0 z-[60] flex items-end justify-center bg-black/50 p-0 sm:items-center sm:p-4">
      <div
        role="dialog"
        aria-modal="true"
        aria-label="Cookie preferences"
        className="flex max-h-[90svh] w-full max-w-lg flex-col overflow-hidden rounded-t-xl bg-background shadow-2xl sm:rounded-xl"
      >
        <div className="flex items-center justify-between border-b px-5 py-4">
          <p className="flex items-center gap-2 font-semibold">
            <ShieldCheck className="size-5 text-primary" /> Privacy Preference
            Center
          </p>
          <button
            type="button"
            aria-label="Close"
            onClick={onClose}
            className="rounded p-1 hover:bg-muted"
          >
            <X className="size-4" />
          </button>
        </div>
        <div className="flex flex-col gap-1 overflow-y-auto px-5 py-4 text-sm">
          <p className="mb-3 text-muted-foreground">
            When you visit any website, it may store or retrieve information on
            your browser. Choose which categories SeeFood may use. Strictly
            necessary cookies keep the site and your sign-in working and cannot
            be switched off.
          </p>
          <PrefRow
            title="Strictly necessary"
            body="Sign-in session, security and this consent choice."
            checked
            locked
          />
          {categories.map((c) => (
            <PrefRow
              key={c.key}
              title={c.title}
              body={c.body}
              checked={state[c.key]}
              onChange={(v) => setState((s) => ({ ...s, [c.key]: v }))}
            />
          ))}
        </div>
        <div className="flex flex-wrap justify-end gap-2 border-t bg-muted/40 px-5 py-4">
          <Button
            variant="outline"
            onClick={() =>
              onSave({
                analytics: false,
                marketing: false,
                personalization: false,
                hotDogTelemetry: false,
              })
            }
          >
            Reject all
          </Button>
          <Button variant="outline" onClick={() => onSave(state)}>
            Confirm my choices
          </Button>
          <Button
            onClick={() =>
              onSave({
                analytics: true,
                marketing: true,
                personalization: true,
                hotDogTelemetry: true,
              })
            }
          >
            Accept all
          </Button>
        </div>
      </div>
    </div>
  );
}

function PrefRow({
  title,
  body,
  checked,
  locked,
  onChange,
}: {
  title: string;
  body: string;
  checked: boolean;
  locked?: boolean;
  onChange?: (v: boolean) => void;
}) {
  const text = (
    <span>
      <span className="block font-medium">{title}</span>
      <span className="mt-0.5 block text-xs text-muted-foreground">{body}</span>
    </span>
  );
  const row = "flex items-start justify-between gap-4 rounded-md border p-3";
  if (locked) {
    return (
      <div className={row}>
        {text}
        <span className="shrink-0 text-xs font-medium text-primary">
          Always active
        </span>
      </div>
    );
  }
  return (
    <label className={row}>
      {text}
      <input
        type="checkbox"
        checked={checked}
        onChange={(e) => onChange?.(e.target.checked)}
        className="mt-1 size-4 shrink-0 accent-primary"
      />
    </label>
  );
}

/** One-time "we updated our policy" notice, top right. */
function PrivacyNotice() {
  const [visible, setVisible] = useState(false);
  useEffect(() => {
    if (read(KEYS.privacy)) return;
    const t = setTimeout(() => setVisible(true), 1500);
    return () => clearTimeout(t);
  }, []);
  if (!visible) return null;
  const dismiss = () => {
    write(KEYS.privacy, true);
    setVisible(false);
  };

  return (
    <div className="fixed top-20 right-4 z-50 w-80 max-w-[calc(100vw-2rem)] rounded-lg border bg-background p-4 text-sm shadow-xl">
      <div className="flex items-start justify-between gap-3">
        <p className="font-semibold">We've updated our Privacy Policy</p>
        <button
          type="button"
          aria-label="Dismiss"
          onClick={dismiss}
          className="rounded p-0.5 hover:bg-muted"
        >
          <X className="size-4" />
        </button>
      </div>
      <p className="mt-1 text-muted-foreground">
        Effective October 2026, we clarified how uploaded images are stored and
        which subprocessors analyse them.
      </p>
      <div className="mt-3 flex gap-2">
        <Link
          href="/privacy"
          onClick={dismiss}
          className="text-sm font-medium text-primary hover:underline"
        >
          Review changes
        </Link>
        <button
          type="button"
          onClick={dismiss}
          className="text-sm text-muted-foreground hover:text-foreground"
        >
          Got it
        </button>
      </div>
    </div>
  );
}

/** Gated-content slide-in after 25 s or 60% scroll. */
function ReportSlideIn() {
  const [visible, setVisible] = useState(false);
  useEffect(() => {
    if (read(KEYS.report)) return;
    const show = () => setVisible(true);
    const t = setTimeout(show, 25_000);
    const onScroll = () => {
      const progress =
        window.scrollY /
        Math.max(1, document.body.scrollHeight - window.innerHeight);
      if (progress > 0.6) show();
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => {
      clearTimeout(t);
      window.removeEventListener("scroll", onScroll);
    };
  }, []);
  if (!visible) return null;
  const dismiss = () => {
    write(KEYS.report, true);
    setVisible(false);
  };

  return (
    <div className="fixed bottom-4 left-4 z-40 w-80 max-w-[calc(100vw-6rem)] overflow-hidden rounded-lg border bg-background shadow-2xl">
      <div className="bg-gradient-to-br from-primary to-indigo-700 px-4 py-3 text-white">
        <p className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider">
          <BookOpen className="size-3.5" /> Free report
        </p>
        <p className="mt-1 font-semibold">The State of Hot Dogs 2026</p>
      </div>
      <div className="p-4 text-sm">
        <p className="text-muted-foreground">
          Benchmarks, verdict mix and why the industry is moving to binary
          classification.
        </p>
        <div className="mt-3 flex items-center gap-3">
          <Link
            href="/resources/state-of-hot-dogs-2026"
            onClick={dismiss}
            className="rounded-md bg-primary px-3 py-1.5 text-sm font-medium text-primary-foreground"
          >
            Get the report
          </Link>
          <button
            type="button"
            onClick={dismiss}
            className="text-muted-foreground hover:text-foreground"
          >
            No thanks
          </button>
        </div>
      </div>
    </div>
  );
}

/** Classic "wait, before you go" modal when the cursor leaves the viewport. */
function ExitIntent() {
  const [visible, setVisible] = useState(false);
  useEffect(() => {
    if (sessionStorageGet(KEYS.exit)) return;
    let armed = false;
    const arm = setTimeout(() => {
      armed = true;
    }, 15_000);
    const onLeave = (e: MouseEvent) => {
      if (armed && e.clientY <= 0) {
        sessionStorageSet(KEYS.exit);
        setVisible(true);
        document.removeEventListener("mouseout", onLeave);
      }
    };
    document.addEventListener("mouseout", onLeave);
    return () => {
      clearTimeout(arm);
      document.removeEventListener("mouseout", onLeave);
    };
  }, []);
  if (!visible) return null;

  return (
    <div className="fixed inset-0 z-[60] flex items-center justify-center bg-black/50 p-4">
      <div
        role="dialog"
        aria-modal="true"
        aria-label="Before you go"
        className="relative w-full max-w-md rounded-xl bg-background p-6 text-center shadow-2xl"
      >
        <button
          type="button"
          aria-label="Close"
          onClick={() => setVisible(false)}
          className="absolute top-3 right-3 rounded p-1 hover:bg-muted"
        >
          <X className="size-4" />
        </button>
        <p className="text-xs font-semibold uppercase tracking-wider text-primary">
          Wait! Before you go
        </p>
        <p className="mt-2 text-xl font-semibold tracking-tight">
          Get a complimentary Hot Dog Readiness Assessment
        </p>
        <p className="mt-2 text-sm text-muted-foreground">
          A SeeFood solutions engineer will benchmark your organization's hot
          dog ambiguity and estimate the ROI of binary classification.
        </p>
        <div className="mt-5 flex flex-col gap-2">
          <Link
            href="/contact-sales?interest=assessment"
            onClick={() => setVisible(false)}
            className="rounded-md bg-primary px-4 py-2.5 text-sm font-medium text-primary-foreground"
          >
            Claim my assessment
          </Link>
          <button
            type="button"
            onClick={() => setVisible(false)}
            className="text-xs text-muted-foreground hover:text-foreground"
          >
            No thanks, I enjoy uncertainty about hot dogs
          </button>
        </div>
      </div>
    </div>
  );
}

function sessionStorageGet(key: string) {
  try {
    return sessionStorage.getItem(key);
  } catch {
    return "blocked";
  }
}

function sessionStorageSet(key: string) {
  try {
    sessionStorage.setItem(key, "1");
  } catch {
    // ignore
  }
}

const chatReplies = [
  { label: "Book a demo", href: "/contact-sales?interest=demo" },
  { label: "How does pricing work?", href: "/pricing" },
  { label: "Is my photo a hot dog?", href: "/app" },
  { label: "Security questionnaire", href: "/security" },
  { label: "Talk to a human", href: "/contact-sales?interest=sales" },
];

/** "Chat with sales" launcher with a proactive teaser bubble. */
function SalesChat({ delayTeaser }: { delayTeaser: boolean }) {
  const [open, setOpen] = useState(false);
  const [teaser, setTeaser] = useState(false);

  useEffect(() => {
    if (!delayTeaser || read(KEYS.chatTeaser)) return;
    const t = setTimeout(() => setTeaser(true), 10_000);
    return () => clearTimeout(t);
  }, [delayTeaser]);

  const closeTeaser = () => {
    write(KEYS.chatTeaser, true);
    setTeaser(false);
  };

  return (
    <div className="fixed right-4 bottom-4 z-40 flex flex-col items-end gap-3">
      {open && (
        <div
          role="dialog"
          aria-label="Chat with SeeFood"
          className="w-80 max-w-[calc(100vw-2rem)] overflow-hidden rounded-xl border bg-background shadow-2xl"
        >
          <div className="flex items-center justify-between bg-primary px-4 py-3 text-primary-foreground">
            <div>
              <p className="text-sm font-semibold">SeeFood Sales</p>
              <p className="flex items-center gap-1.5 text-xs text-primary-foreground/80">
                <span className="size-2 rounded-full bg-emerald-400" />{" "}
                Typically replies in 1 business day
              </p>
            </div>
            <button
              type="button"
              aria-label="Close chat"
              onClick={() => setOpen(false)}
              className="rounded p-1 hover:bg-white/15"
            >
              <X className="size-4" />
            </button>
          </div>
          <div className="flex flex-col gap-3 p-4 text-sm">
            <div className="max-w-[85%] rounded-lg rounded-tl-none bg-muted px-3 py-2">
              Hi there 👋 I'm Hank, SeeFood's digital assistant. I can answer
              exactly one kind of question really well. What brings you here
              today?
            </div>
            <div className="flex flex-col items-end gap-2">
              {chatReplies.map((r) => (
                <Link
                  key={r.label}
                  href={r.href}
                  onClick={() => setOpen(false)}
                  className="rounded-full border border-primary px-3 py-1.5 text-xs font-medium text-primary hover:bg-primary hover:text-primary-foreground"
                >
                  {r.label}
                </Link>
              ))}
            </div>
          </div>
          <p className="border-t px-4 py-2 text-center text-[10px] text-muted-foreground">
            By chatting you agree to our{" "}
            <Link href="/privacy" className="underline">
              Privacy Policy
            </Link>
            . Powered by HankBot™.
          </p>
        </div>
      )}
      {teaser && !open && (
        <div className="relative w-64 rounded-lg border bg-background p-3 pr-8 text-sm shadow-xl">
          <button
            type="button"
            aria-label="Dismiss"
            onClick={closeTeaser}
            className="absolute top-2 right-2 rounded p-0.5 hover:bg-muted"
          >
            <X className="size-3.5" />
          </button>
          <p className="font-medium">Got a hot dog workload? 🌭</p>
          <p className="mt-0.5 text-muted-foreground">
            Our team can scope a rollout in one call.
          </p>
          <button
            type="button"
            onClick={() => {
              closeTeaser();
              setOpen(true);
            }}
            className="mt-2 text-xs font-semibold text-primary hover:underline"
          >
            Start a conversation →
          </button>
        </div>
      )}
      <button
        type="button"
        aria-label={open ? "Close chat" : "Chat with sales"}
        onClick={() => {
          closeTeaser();
          setOpen((v) => !v);
        }}
        className="flex size-14 items-center justify-center rounded-full bg-primary text-primary-foreground shadow-xl transition-transform hover:scale-105"
      >
        {open ? <X className="size-6" /> : <MessageSquare className="size-6" />}
      </button>
    </div>
  );
}
