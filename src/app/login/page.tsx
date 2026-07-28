import Link from "next/link";
import { redirect } from "next/navigation";
import { isSupabaseConfigured } from "@/lib/supabase/config";
import { getCurrentUser } from "@/lib/supabase/server";
import GoogleSignIn from "@/components/GoogleSignIn";

export const metadata = { title: "Вход" };

const ERRORS: Record<string, string> = {
  config: "Авторизация ещё не настроена. Загляните позже.",
  exchange: "Вход не завершился. Попробуйте ещё раз.",
};

export default async function LoginPage({
  searchParams,
}: {
  searchParams: Promise<{ error?: string; next?: string }>;
}) {
  const { error, next } = await searchParams;

  // Уже вошедшего пользователя незачем держать на странице входа.
  const user = await getCurrentUser();
  if (user) redirect("/");

  const configured = isSupabaseConfigured();
  const safeNext = next?.startsWith("/") && !next.startsWith("//") ? next : "/";

  return (
    <section className="flex min-h-[70vh] items-center justify-center py-16">
      <div className="w-full max-w-sm">
        <div className="rounded-card border border-line bg-surface p-7">
          <h1 className="font-display text-[24px] text-ink">Вход</h1>
          <p className="mt-2 text-[13.5px] leading-relaxed text-muted">
            Войдите, чтобы сохранять промты в избранное и открыть доступ к
            PRO-подборкам.
          </p>

          <div className="mt-6">
            {configured ? (
              <GoogleSignIn next={safeNext} />
            ) : (
              <div className="rounded-chip border border-dashed border-line-strong px-4 py-4 text-center text-[13px] leading-relaxed text-muted">
                Вход через Google подключается — осталось задать ключи Supabase
                в переменных окружения.
              </div>
            )}
          </div>

          {error && ERRORS[error] && (
            <p className="mt-4 text-[13px] text-[#f87171]" role="alert">
              {ERRORS[error]}
            </p>
          )}

          <p className="mt-6 text-[12px] leading-relaxed text-faint">
            Продолжая, вы соглашаетесь с условиями использования и политикой
            конфиденциальности.
          </p>
        </div>

        <p className="mt-5 text-center text-[13px] text-muted">
          <Link
            href="/"
            className="transition-colors duration-200 hover:text-accent"
          >
            Вернуться в каталог
          </Link>
        </p>
      </div>
    </section>
  );
}
