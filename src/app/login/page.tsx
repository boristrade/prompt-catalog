export const metadata = { title: "Вход" };

export default function LoginPage() {
  return (
    <section className="flex min-h-[60vh] items-center justify-center py-20">
      <div className="w-full max-w-sm rounded-card border border-line bg-surface p-7 text-center">
        <h1 className="font-display text-[22px] text-ink">Вход</h1>
        {/* Формы входа/регистрации подключаются к Supabase Auth в Фазе 3 */}
        <p className="mt-3 text-[13.5px] leading-relaxed text-muted">
          Авторизация через Supabase появится в Фазе 3.
        </p>
      </div>
    </section>
  );
}
