# PromptVault — каталог AI-промтов

Продакшн-каталог AI-промтов: Next.js (App Router) + TypeScript + Tailwind CSS v4, Supabase (Postgres, Auth, Storage, RLS), оплата через ЮKassa.

## Запуск локально

```bash
npm install
cp .env.example .env.local   # заполните ключи
npm run dev                  # http://localhost:3000
```

## Структура

```
src/
  app/            — страницы (App Router)
  components/     — UI-компоненты
  lib/            — категории, клиенты Supabase (Фаза 3), оплата (Фаза 5)
supabase/
  migrations/     — SQL-миграции (Фаза 2)
```

Полная инструкция по Supabase, миграциям, ЮKassa и деплою на Vercel будет дописана в Фазе 7.
