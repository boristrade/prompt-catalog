import Link from "next/link";
import { redirect } from "next/navigation";
import {
  isEmailAuthEnabled,
  isGoogleAuthEnabled,
  isSupabaseConfigured,
} from "@/lib/supabase/config";
import { getCurrentUser } from "@/lib/supabase/server";
import { pageLocale } from "@/lib/i18n";
import GoogleSignIn from "@/components/GoogleSignIn";
import EmailSignIn from "@/components/EmailSignIn";

export const dynamic = "force-dynamic";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { t } = await pageLocale(params);
  return { title: t.login.title };
}

export default async function LoginPage({
  params,
  searchParams,
}: {
  params: Promise<{ locale: string }>;
  searchParams: Promise<{ error?: string; next?: string }>;
}) {
  const { locale, t } = await pageLocale(params);
  const { error, next } = await searchParams;

  // Уже вошедшего пользователя незачем держать на странице входа.
  const user = await getCurrentUser();
  if (user) redirect(`/${locale}`);

  const configured = isSupabaseConfigured();
  const google = configured && isGoogleAuthEnabled();
  const email = configured && isEmailAuthEnabled();
  const safeNext =
    next?.startsWith("/") && !next.startsWith("//") ? next : `/${locale}`;

  const errors: Record<string, string> = {
    config: t.login.errConfig,
    exchange: t.login.errExchange,
  };

  return (
    <section className="flex min-h-[70vh] items-center justify-center py-16">
      <div className="w-full max-w-sm">
        <div className="rounded-card border border-line bg-surface p-7">
          <h1 className="font-display text-[24px] text-ink">{t.login.title}</h1>
          <p className="mt-2 text-[13.5px] leading-relaxed text-muted">
            {t.login.subtitle}
          </p>

          <div className="mt-6">
            {/* Google идёт первым: он в один клик и без писем. */}
            {google && (
              <GoogleSignIn
                next={safeNext}
                label={t.login.google}
                loadingLabel={t.login.googleLoading}
                errLabel={t.login.errGoogle}
                errUnavailable={t.login.errUnavailable}
              />
            )}

            {/* Разделитель нужен, только когда способов правда два. */}
            {google && email && (
              <div className="my-5 flex items-center gap-3">
                <span className="h-px flex-1 bg-line" />
                <span className="text-[12px] text-faint">{t.login.or}</span>
                <span className="h-px flex-1 bg-line" />
              </div>
            )}

            {email && <EmailSignIn next={safeNext} t={t} />}

            {/* Карточка без единого способа входа выглядела бы сломанной. */}
            {!google && !email && (
              <div className="rounded-chip border border-dashed border-line-strong px-4 py-4 text-center text-[13px] leading-relaxed text-muted">
                {configured ? t.login.disabled : t.login.notConfigured}
              </div>
            )}
          </div>

          {error && errors[error] && (
            <p className="mt-4 text-[13px] text-[#f87171]" role="alert">
              {errors[error]}
            </p>
          )}

          <p className="mt-6 text-[12px] leading-relaxed text-faint">
            {t.login.terms}
          </p>
        </div>

        <p className="mt-5 text-center text-[13px] text-muted">
          <Link
            href={`/${locale}`}
            className="transition-colors duration-200 hover:text-accent"
          >
            {t.login.back}
          </Link>
        </p>
      </div>
    </section>
  );
}
