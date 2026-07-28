# PrompTom — каталог AI-промтов

Продакшн-каталог AI-промтов: Next.js (App Router) + TypeScript + Tailwind CSS v4, Supabase (Postgres, Auth, Storage, RLS), оплата через ЮKassa.

## Запуск локально

```bash
npm install
cp .env.example .env.local   # заполните ключи
npm run dev                  # http://localhost:3000
```

Без ключей Supabase сайт тоже работает: каталог статичный, авторизация просто выключена и на странице входа висит пояснение.

## Вход через Google

Код авторизации уже в проекте. Чтобы кнопка заработала, нужно настроить два внешних сервиса.

### 1. Google Cloud

**APIs & Services → Credentials → Create credentials → OAuth client ID**, тип **Web application**.

В **Authorized redirect URIs** добавьте адрес обратного вызова Supabase:

```
https://<ваш-проект>.supabase.co/auth/v1/callback
```

Сохраните **Client ID** и **Client secret**.

### 2. Supabase

**Authentication → Providers → Google**: включите и вставьте Client ID и Client secret из предыдущего шага.

**Authentication → URL Configuration**:

| Поле | Значение |
|---|---|
| Site URL | адрес прода, например `https://promptvault-theta-rose.vercel.app` |
| Redirect URLs | `http://localhost:3000/auth/callback` и `https://<домен>/auth/callback` |

### 3. Переменные окружения

В `.env.local` (локально) и в переменных проекта на Vercel:

```
NEXT_PUBLIC_SUPABASE_URL=https://<проект>.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=<anon-ключ>
NEXT_PUBLIC_SITE_URL=https://<домен прода>
```

`anon`-ключ публичный, его можно отдавать в браузер. `SUPABASE_SERVICE_ROLE_KEY` в авторизации не участвует и на клиент попадать не должен.

### Как это устроено

| Файл | Роль |
|---|---|
| `src/lib/supabase/client.ts` | клиент для браузера |
| `src/lib/supabase/server.ts` | серверный клиент, читает сессию из cookie |
| `src/middleware.ts` | продлевает сессию, иначе вход слетал бы через час |
| `src/app/auth/callback/route.ts` | меняет код Google на сессию |
| `src/app/auth/signout/route.ts` | выход, только POST |

Пользователь проверяется через `getUser()`, а не `getSession()`: первый подтверждает токен на сервере Supabase, второму на сервере доверять нельзя.

## Структура

```
src/
  app/            — страницы (App Router)
  components/     — UI-компоненты
  lib/            — категории, промты, инструменты, клиенты Supabase
supabase/
  migrations/     — SQL-миграции (Фаза 2)
```

## Деплой

Публикация на Vercel идёт через GitHub Actions: `.github/workflows/deploy.yml`. Нужен секрет репозитория `VERCEL_TOKEN`.
