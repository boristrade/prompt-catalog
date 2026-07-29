"use client";

import { useState } from "react";
import { ArrowUpRight } from "lucide-react";
import type { PeriodId } from "@/lib/billing";

export default function PayButton({
  period,
  amount,
  payLabel,
  preparingLabel,
  errInvoice,
  errUnavailable,
}: {
  period: PeriodId;
  amount: number;
  payLabel: string;
  preparingLabel: string;
  errInvoice: string;
  errUnavailable: string;
}) {
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function pay() {
    if (busy) return;
    setBusy(true);
    setError(null);

    try {
      const response = await fetch("/api/billing/checkout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ period }),
      });
      const json = (await response.json()) as { url?: string; error?: string };

      if (!response.ok || !json.url) {
        setError(errInvoice);
        setBusy(false);
        return;
      }

      // Уходим на страницу оплаты. Состояние не сбрасываем:
      // кнопка должна остаться неактивной, пока браузер переходит.
      window.location.href = json.url;
    } catch {
      setError(errUnavailable);
      setBusy(false);
    }
  }

  return (
    <div>
      <button
        type="button"
        onClick={pay}
        disabled={busy}
        className="grad-fill inline-flex w-full items-center justify-center gap-2 rounded-chip px-5 py-3.5 text-[14px] font-semibold shadow-[0_6px_20px_-8px_var(--glow)] transition-[opacity,transform] duration-200 hover:opacity-90 active:scale-[0.98] disabled:opacity-60"
      >
        {busy ? preparingLabel : `${payLabel} $${amount}`}
        {!busy && <ArrowUpRight size={15} />}
      </button>

      {error && (
        <p className="mt-3 text-[13px] text-[#f87171]" role="alert">
          {error}
        </p>
      )}
    </div>
  );
}
