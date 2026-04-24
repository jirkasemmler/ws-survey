# PRD: ws-survey — Dotazník pro účastníky workshopu

## Problém

Potřebuji od účastníků workshopu sebrat odpovědi na 5 předem daných otázek.
Odpovídat můžou jen lidé, jejichž email je předem na seznamu (whitelist).
Každý účastník může svoje odpovědi upravovat.

## Cílový uživatel

Účastníci workshopu, kteří mají svůj email předem na whitelistu (spravuje
organizátor přímo v Supabase).

## User Stories

- Jako účastník chci zadat svůj email, aby mi appka ověřila, že smím odpovídat.
- Jako účastník chci vidět hlášku "email není na seznamu", když zadám email mimo whitelist.
- Jako účastník chci vyplnit 5 otázek (mix freetext + výběr) a odeslat je.
- Jako účastník chci po návratu do appky vidět svoje odpovědi a moct je upravit.
- Jako účastník chci, aby si browser pamatoval moje "přihlášení", abych nemusel email zadávat při každé návštěvě.

## MVP Scope

### In scope

- Přihlášení emailem s kontrolou proti whitelistu
- Perzistence přihlášení v browseru (localStorage)
- Tlačítko pro odhlášení (smaže localStorage)
- Formulář s 5 otázkami (2 freetext, 2 výběr, 1 podmíněný freetext)
- Uložení odpovědí do Supabase (1 řádek na email)
- Zobrazení již vyplněných odpovědí po návratu
- Úprava odpovědí (přepíše existující řádek)
- Responzivní UI (mobile-first, Tailwind)
- Správa whitelistu a prohlížení odpovědí rovnou v Supabase (není admin UI)

### Out of scope

- Admin UI v aplikaci (správa emailů, export odpovědí)
- Magic link nebo OTP přihlášení (skutečná autentizace přes Supabase Auth)
- Statistiky a grafy odpovědí
- Notifikace (email po odeslání)
- Více dotazníků (aplikace má jen jeden fixní)
- Export odpovědí do CSV / Excelu

## Otázky v dotazníku

1. **Jaké je tvé očekávání od workshopu?** *(freetext)*
2. **Jakou zkušenost máš s AI-assisted vývojem (Claude Code, Cursor, Copilot...)?** *(výběr)*
   - něco jsem zkusil/a
   - pravidelně používám
   - používám denně, profi
3. **Máš nápad na appku, co si chceš odnést? Popiš max dvěma větami.** *(freetext)*
4. **Jaký máš OS?** *(výběr)* — Windows / Mac / Linux
5. **Budeš chtít pomoct s instalací nějakého toolu?** *(podmíněný freetext)* — ne / ano + popis
6. **Preferuješ Claude CLI nebo Claude Desktop?** *(výběr)* — CLI / Desktop

## Datový model

### Tabulka: `allowed_emails`

Whitelist emailů, které smí odpovídat. Spravuje organizátor manuálně v Supabase.

| Sloupec | Typ | Popis |
|---------|-----|-------|
| `id` | `integer` (PK, generated always as identity) | Primární klíč |
| `email` | `text` (unique, not null) | Email účastníka |
| `created_at` | `timestamptz` (default now()) | Kdy byl email přidán |

### Tabulka: `responses`

Odpovědi účastníků. Na email je unikátní constraint → 1 účastník = 1 řádek
(úprava přepíše).

| Sloupec | Typ | Popis |
|---------|-----|-------|
| `id` | `integer` (PK, generated always as identity) | Primární klíč |
| `email` | `text` (unique, not null) | Email účastníka (musí být v `allowed_emails`) |
| `q1_expectation` | `text` | Q1 — očekávání (freetext) |
| `q2_ai_experience` | `text` | Q2 — `'zkusil'` / `'pravidelne'` / `'denne'` |
| `q3_app_idea` | `text` | Q3 — nápad na appku (freetext, max 2 věty) |
| `q4_os` | `text` | Q4 — `'windows'` / `'mac'` / `'linux'` |
| `q5_help_needed` | `text` | Q5 — prázdné/NULL = ne, jinak popis instalace |
| `q6_claude_pref` | `text` | Q6 — `'cli'` / `'desktop'` |
| `created_at` | `timestamptz` (default now()) | První odeslání |
| `updated_at` | `timestamptz` (default now()) | Poslední úprava |

## SQL pro Supabase

```sql
-- Whitelist emailů účastníků (spravuje organizátor ručně v Supabase)
create table allowed_emails (
  id integer generated always as identity primary key,
  email text unique not null,
  created_at timestamptz not null default now()
);

alter table allowed_emails disable row level security;

-- Odpovědi účastníků — 1 řádek na email (úprava přepíše)
create table responses (
  id integer generated always as identity primary key,
  email text unique not null,
  q1_expectation text,
  q2_ai_experience text,
  q3_app_idea text,
  q4_os text,
  q5_help_needed text,
  q6_claude_pref text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

alter table responses disable row level security;

-- Trigger na auto-update updated_at
create or replace function set_updated_at()
returns trigger as $$
begin
  new.updated_at = now();
  return new;
end;
$$ language plpgsql;

create trigger responses_set_updated_at
  before update on responses
  for each row execute function set_updated_at();
```
