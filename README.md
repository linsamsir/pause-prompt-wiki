# Pause Prompt Wiki · 一時停止

> 凝視一個 Prompt 的重量 — a Japanese-styled, bilingual (繁體中文 / English) AI prompt library.

Built with Next.js 16 App Router · TypeScript · Tailwind CSS v4 · shadcn-style components · Supabase (Auth + Postgres + RLS).

GitHub: https://github.com/linsamsir/pause-prompt-wiki
Supabase: `mliqkpmezfniouagozye.supabase.co`

---

## 功能

- 🏮 **首頁** — Hero、熱門 Prompt、分類入口、社群統計
- 📜 **Prompt Wiki** — 列表、全文搜尋、分類 / 排序 / NSFW 篩選，詳情頁
- 🎛 **Prompt Builder** — 以 `subject / scene / lighting / camera / style / quality / negative` 七大模組組裝
- 🎲 **Random Generator** — 每次隨機擲一組新的 Prompt
- 🏆 **Leaderboard** — 按讚數 / 收藏數排行
- 🔐 **Auth** — Supabase Magic Link (無密碼)
- ❤️ 按讚 · ⭐ 收藏
- 🛠 **管理後台** — Prompt / 分類 / Builder 元素 CRUD（限 `profiles.is_admin = true` 的使用者）

### 設計

- 主色：**beni 紅** `#C0392B`
- 背景：washi 米白 `#faf7f0`
- 字體：`Noto Serif TC` / `Noto Sans TC`
- 直角卡片、細邊框、印章式 badge、左側紅色粗線 section title

---

## 快速開始

```bash
# 1. 安裝依賴
npm install

# 2. 環境變數
cp .env.local.example .env.local
# 填入 Supabase 專案 URL 與 anon key

# 3. 建立資料庫
# 到 Supabase Studio → SQL Editor
#   a) 貼上並執行 supabase/schema.sql
#   b) 貼上並執行 supabase/seed.sql
# 在 Authentication → URL Configuration 加入
#   http://localhost:3000/auth/callback
#   https://<your-production-domain>/auth/callback

# 4. 啟動
npm run dev
# http://localhost:3000
```

### 既有資料庫升級（若先前已跑過 schema.sql）

`profiles` 需要一欄 `age_verified`，在 Supabase SQL Editor 跑：

```sql
alter table public.profiles
  add column if not exists age_verified boolean not null default false;
```

（新專案直接跑最新的 `supabase/schema.sql` 即可，此欄已包含其中。）

### 成為管理員

1. 開 `http://localhost:3000/login` 輸入 email
2. 點信裡的 Magic Link 完成登入（會自動建立 `profiles` row）
3. 到 Supabase → Table Editor → `profiles` 把你的 row 的 `is_admin` 設為 `true`
4. 重整，就能進入 `/admin`

---

## 部署到 Vercel

```bash
# 已與 GitHub repo 連動後
git add .
git commit -m "feat: pause prompt wiki"
git push
```

在 Vercel 專案的 Environment Variables 設定：

| 名稱 | 值 |
| --- | --- |
| `NEXT_PUBLIC_SUPABASE_URL` | `https://mliqkpmezfniouagozye.supabase.co` |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | Supabase Settings → API → anon / public |
| `NEXT_PUBLIC_SITE_URL` | 最終 production domain |

也記得把 production domain 加到 Supabase 的 **Redirect URLs** 白名單（`/auth/callback`）。

---

## 資料模型

```
auth.users  ─┐
             └─ profiles (1:1)
categories ─┐
            ├─ prompts ─┬─ likes  (user, prompt)
            │           └─ favorites (user, prompt)
            │
builder_elements (subject / scene / lighting / camera / style / quality / negative)
```

- `prompts.likes_count` / `favorites_count` 由 trigger 自動同步
- `prompts.views_count` 由 `public.increment_views(uuid)` 這支 `SECURITY DEFINER` RPC 遞增
- RLS：
  - 讀 — 未登入可讀 `is_published = true` 的 prompt、全部 categories、builder elements
  - 寫 — 作者可改自己的 prompt；`is_admin` 可全權 CRUD；likes / favorites 由當事人自行管理

---

## 專案結構

```
app/
  layout.tsx           # 字體、Locale Provider、Header / Footer
  page.tsx             # 首頁
  wiki/                # 列表 + 詳情
  builder/             # 組裝器
  random/              # 隨機
  leaderboard/         # 排行
  login/               # Magic link 登入
  auth/callback/       # OAuth code exchange
  admin/               # 後台 (is_admin gated)
    prompts/ categories/ elements/
  not-found.tsx
components/
  ui/                  # shadcn-style primitives
  layout/              # Header, Footer, LanguageToggle, NsfwToggle
  prompt-card.tsx
  builder-form.tsx
  random-roller.tsx
  action-buttons.tsx   # Like / Favorite
  wiki-filters.tsx
  copy-button.tsx
  login-form.tsx
lib/
  i18n/                # dictionary + LocaleProvider
  supabase/            # client, server, proxy, types
  constants.ts
  utils.ts
proxy.ts               # Next.js 16 proxy (= former middleware)
supabase/
  schema.sql
  seed.sql
```

---

## Next.js 16 備忘

本專案遵循 Next.js 16 的新規範：

- `middleware.ts` → **`proxy.ts`**（export `proxy`），位於 root；Edge runtime 不支援 proxy。
- `cookies()` / `headers()` / `params` / `searchParams` 全部是 **async**，需要 `await`。
- Turbopack 為預設編譯器。
- `next lint` 已移除；使用 `eslint` 直接執行。

---

## Roadmap

- [ ] 個人頁面 (`/u/[username]`)，顯示作者的 prompts / 收藏
- [ ] 標籤雲與 `/t/[tag]` 頁
- [ ] Prompt 投稿流程（非 admin 使用者送草稿）
- [ ] OG image 自動生成
- [ ] Supabase Edge Function for 每週 digest

---

© Pause Prompt Wiki · 一期一會
