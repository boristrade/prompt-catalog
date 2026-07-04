export const metadata = { title: "Вход" };

export default function LoginPage() {
  return (
    <section className="flex min-h-[60vh] items-center justify-center py-24">
      <div className="w-full max-w-md rounded-[10px] border border-graphite bg-onyx p-8 text-center">
        <h1 className="font-display text-[28px] text-white">Вход</h1>
        {/* Формы входа/регистрации подключаются к Supabase Auth в Фазе 3 */}
        <p className="mt-4 text-sm text-fog">
          Авторизация через Supabase появится в Фазе 3.
        </p>
      </div>
    </section>
  );
}
