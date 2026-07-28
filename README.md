# PrompTom — каталог AI-промтов

Продакшн-каталог AI-промтов: Next.js (App Router) + TypeScript + Tailwind CSS v4, Supabase (Postgres, Auth, Storage, RLS), оплата через ЮKassa.

## Запуск локально

```bash
npm install
cp .env.example .env.local   # заполните ключи
npm run dev                  # http://localhost:3000
```

Без ключей Supabase сайт тоже работает: каталог статичный, авторизация просто выключена и на странице входа висит пояснение.

## Вход

Два способа, оба уже написаны. Разница только в том, сколько нужно настроить.

| Способ | Что настраивать |
|---|---|
| **Ссылка на почту** | ничего, кроме ключей Supabase — провайдер email включён по умолчанию |
| Google | дополнительно OAuth-клиент в Google Cloud |

### Быстрый путь: ссылка на почту

1. Создайте проект на [supabase.com/dashboard](https://supabase.com/dashboard/projects).
2. Скопируйте **Project URL** и ключ **anon public** из **Project Settings → API**.
3. **Authentication → URL Configuration**: в **Site URL** укажите адрес прода, в **Redirect URLs** добавьте `<адрес>/auth/callback`.
4. Задайте `NEXT_PUBLIC_SUPABASE_URL`, `NEXT_PUBLIC_SUPABASE_ANON_KEY` и `NEXT_PUBLIC_SITE_URL` — локально в `.env.local`, на проде в переменных проекта Vercel.

Всё. На странице входа появится поле для почты: пользователь вводит адрес, получает письмо со ссылкой и входит по ней. Паролей нет.

Одно ограничение стоит знать. Ссылка по умолчанию использует PKCE: секрет остаётся в браузере, который запросил вход. Если запросить ссылку в одном браузере, а открыть письмо в другом, обмен не пройдёт и пользователь увидит «Ссылка не сработала». Роут `/auth/callback` умеет и второй способ проверки — `token_hash`, который от устройства не зависит; чтобы Supabase присылал такие ссылки, в **Authentication → Email Templates** замените `{{ .ConfirmationURL }}` на:

```
{{ .SiteURL }}/auth/callback?token_hash={{ .TokenHash }}&type=email
```

Встроенная почта Supabase — общая на всех проектах и шлёт **2 письма в час**. Этого не хватает даже на отладку: пара попыток входа, и следующая ссылка придёт только через час. Подключите свой SMTP в **Project Settings → Authentication → SMTP Settings** — у Resend, Brevo и подобных есть бесплатные тарифы на тысячи писем.

### Добавить Google (по желанию)

Нужен ещё один сервис. Кнопка Google появится, только когда переменная `NEXT_PUBLIC_GOOGLE_AUTH=true` **и** провайдер включён в Supabase — иначе она падала бы с «Unsupported provider».

#### 1. Google Cloud

**APIs & Services → Credentials → Create credentials → OAuth client ID**, тип **Web application**.

В **Authorized redirect URIs** добавьте адрес обратного вызова Supabase:

```
https://<ваш-проект>.supabase.co/auth/v1/callback
```

Сохраните **Client ID** и **Client secret**.

Важно: сюда идёт адрес **Supabase**, а не сайта. Google возвращает пользователя в Supabase, и уже Supabase — на сайт. Адрес сайта здесь даёт ошибку `redirect_uri_mismatch`.

Пока приложение в режиме **Testing** (экран **Audience**), войти смогут только добавленные вручную тестировщики. Для публичного сайта нажмите **Publish app**.

#### 2. Supabase

**Authentication → Providers → Google**: включите и вставьте Client ID и Client secret из предыдущего шага.

#### 3. Переменная

```
NEXT_PUBLIC_GOOGLE_AUTH=true
```

### Переменные окружения

В `.env.local` (локально) и в переменных проекта на Vercel:

| Переменная | Значение |
|---|---|
| `NEXT_PUBLIC_SUPABASE_URL` | `https://<проект>.supabase.co` |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | `anon public` из Project Settings → API |
| `NEXT_PUBLIC_SITE_URL` | `https://prompt-catalog-alpha.vercel.app` |
| `NEXT_PUBLIC_GOOGLE_AUTH` | `true`, только если настроен Google |

`anon`-ключ публичный, его можно отдавать в браузер. `SUPABASE_SERVICE_ROLE_KEY` в авторизации не участвует и на клиент попадать не должен.

`NEXT_PUBLIC_*` подставляются на сборке, а не в рантайме: после изменения переменных на Vercel нужен **Redeploy**, иначе старый деплой их не увидит.

### Как это устроено

| Файл | Роль |
|---|---|
| `src/lib/supabase/client.ts` | клиент для браузера |
| `src/lib/supabase/server.ts` | серверный клиент, читает сессию из cookie |
| `src/middleware.ts` | продлевает сессию, иначе вход слетал бы через час |
| `src/components/EmailSignIn.tsx` | форма входа по ссылке на почту |
| `src/components/GoogleSignIn.tsx` | кнопка Google |
| `src/app/auth/callback/route.ts` | меняет код или token_hash на сессию |
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

Проект `prompt-catalog` на Vercel связан с этим репозиторием напрямую, поэтому публикация идёт сама:

| Событие | Что происходит |
|---|---|
| мёрж в `main` | продакшн-деплой на `https://prompt-catalog-alpha.vercel.app` |
| пуш в ветку с pull request | превью-деплой, ссылка появляется в PR |

Ни токенов, ни GitHub Actions для этого не нужно. Раньше здесь лежал `deploy.yml`, который через Vercel CLI обновлял отдельный проект `promptvault`; он удалён — интеграция с git делает то же самое надёжнее.

Переменные окружения задаются в настройках проекта на Vercel (**Settings → Environment Variables**), а не в репозитории.
