import Link from "next/link";
import { ArrowLeft, ArrowRight } from "lucide-react";

export function PageHeader({
  eyebrow,
  title,
  description,
  metric
}: {
  eyebrow: string;
  title: string;
  description: string;
  metric: string;
}) {
  return (
    <div className="flex flex-col justify-between gap-4 rounded-[24px] border border-[var(--color-border)] bg-[var(--color-surface-subtle)] p-5 md:flex-row md:items-end">
      <div className="max-w-3xl">
        <p className="text-xs font-bold uppercase tracking-[0.16em] text-[var(--anden-orange)]">
          {eyebrow}
        </p>
        <h1 className="brand-heading mt-3 text-4xl font-semibold leading-tight text-[var(--color-ink)]">
          {title}
        </h1>
        <p className="mt-3 max-w-2xl text-base leading-7 text-[var(--color-muted)]">
          {description}
        </p>
      </div>
      <div className="rounded-2xl bg-[var(--anden-lime)] px-4 py-3 text-sm font-bold text-[var(--anden-brown-dark)]">
        {metric}
      </div>
    </div>
  );
}

export function SelectFilter({
  label,
  name,
  value,
  options,
  allLabel = "All"
}: {
  label: string;
  name: string;
  value?: string;
  options: string[];
  allLabel?: string;
}) {
  return (
    <label className="grid gap-2 text-sm font-semibold text-[var(--color-ink)]">
      {label}
      <select
        name={name}
        defaultValue={value ?? "All"}
        className="h-11 min-w-40 rounded-xl border border-[var(--color-border)] bg-[var(--color-canvas)] px-3 text-sm font-medium text-[var(--color-ink)]"
      >
        <option value="All">{allLabel}</option>
        {options.map((option) => (
          <option key={option} value={option}>
            {option}
          </option>
        ))}
      </select>
    </label>
  );
}

export function Badge({
  children,
  tone = "neutral"
}: {
  children: React.ReactNode;
  tone?: "neutral" | "lime" | "orange" | "blue";
}) {
  const toneClass = {
    neutral:
      "border-[var(--color-border)] bg-[var(--color-canvas)] text-[var(--color-muted)]",
    lime: "border-transparent bg-[var(--anden-lime)] text-[var(--anden-brown-dark)]",
    orange:
      "border-transparent bg-[var(--anden-orange)] text-[var(--anden-brown-dark)]",
    blue: "border-transparent bg-[var(--anden-blue)] text-white"
  }[tone];

  return (
    <span
      className={`inline-flex rounded-lg border px-2.5 py-1 text-xs font-bold ${toneClass}`}
    >
      {children}
    </span>
  );
}

export function DetailLink({
  href,
  children
}: {
  href: string;
  children: React.ReactNode;
}) {
  return (
    <Link
      href={href}
      className="inline-flex items-center gap-2 text-sm font-semibold text-[var(--anden-blue)]"
    >
      {children}
      <ArrowRight size={15} aria-hidden />
    </Link>
  );
}

export function BackLink({
  href,
  children
}: {
  href: string;
  children: React.ReactNode;
}) {
  return (
    <Link
      href={href}
      className="inline-flex items-center gap-2 text-sm font-semibold text-[var(--color-muted)]"
    >
      <ArrowLeft size={15} aria-hidden />
      {children}
    </Link>
  );
}

export function EmptyState({ message }: { message: string }) {
  return (
    <div className="rounded-[24px] border border-dashed border-[var(--color-border-strong)] bg-[var(--color-surface-subtle)] p-8 text-center text-sm font-medium text-[var(--color-muted)]">
      {message}
    </div>
  );
}
