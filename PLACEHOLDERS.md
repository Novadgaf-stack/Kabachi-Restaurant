# PLACEHOLDERS.md — Kabachi Chinese Restaurant, Bar & Lodge

This document catalogs every token, placeholder item, and photo asset used in the pitch demo ordering website.

---

## 1. Content & Contact Tokens

All tokens are defined centrally in `/data/kabachi.ts` and `/src/data/kabachi.ts`.

| Token | Default Demo Value | Description / Where It Appears |
| :--- | :--- | :--- |
| `{{ADDRESS}}` | `3b Adekunle Lawal Rd, Ikoyi, Lagos 101232, Lagos, Nigeria` | Restaurant location, pickup address, Visit section, footer |
| `{{PHONE}}` | `+234 905 841 4398` | Kitchen call button, header/footer, confirmation call button |
| `{{WHATSAPP_NUMBER}}` | `2349058414398` | Direct WhatsApp dispatch URL (`https://wa.me/2349058414398?text=...`) |
| `{{CITY}}` | `Lagos` | Hero subheadline ("Order for delivery or pickup in Lagos") |
| `{{HOURS}}` | `11:30 AM – 10:30 PM Daily` | Subheadline, Store status banner, Visit section, Footer |
| `{{MIN_ORDER}}` | `5000` (`₦5,000`) | Minimum order threshold required to checkout |
| `{{BANK_NAME}}` | `{{BANK_NAME}}` | Bank name shown when customer chooses "Direct Bank Transfer" |
| `{{ACCOUNT_NUMBER}}` | `{{ACCOUNT_NUMBER}}` | 10-digit NUBAN bank account number for transfer payments |

---

## 2. Menu Item Placeholders (12 Items)

All 12 items are defined in `/data/kabachi.ts` and marked `// REPLACE`.

| # | Item ID | Category | Demo Item Name | Price | Status |
| :---: | :--- | :--- | :--- | :--- | :--- |
| 1 | `kb-01` | Starters | Steamed Prawn & Chicken Dim Sum | ₦6,500 | `// REPLACE` (Popular) |
| 2 | `kb-02` | Starters | Crispy Vegetable Spring Rolls | ₦4,500 | `// REPLACE` |
| 3 | `kb-03` | Rice | Kabachi Special Fried Rice | ₦9,000 | `// REPLACE` (Popular) |
| 4 | `kb-04` | Rice | Yang Chow Fried Rice | ₦7,500 | `// REPLACE` |
| 5 | `kb-05` | Noodles | Singapore Rice Noodles | ₦8,500 | `// REPLACE` (Popular) |
| 6 | `kb-06` | Noodles | Beef Chow Mein Noodles | ₦8,000 | `// REPLACE` |
| 7 | `kb-07` | Chicken | Szechuan Pepper Chicken | ₦7,500 | `// REPLACE` (Popular) |
| 8 | `kb-08` | Chicken | Sweet & Sour Crispy Chicken | ₦7,000 | `// REPLACE` |
| 9 | `kb-09` | Beef | Shredded Beef in Hot Garlic Sauce | ₦8,500 | `// REPLACE` (Popular) |
| 10 | `kb-10` | Beef | Crispy Beef with Ginger & Scallions | ₦8,500 | `// REPLACE` |
| 11 | `kb-11` | Seafood | Salt & Pepper Jumbo Prawns | ₦12,500 | `// REPLACE` (Popular) |
| 12 | `kb-12` | Drinks | Chilled Hibiscus Citrus Spritz | ₦2,500 | `// REPLACE` |

---

## 3. Curated Photography Placeholders

All photo URLs live in `/data/photos.ts` (and `/src/data/photos.ts`) with warm, moody editorial styling and explicit comments:

- `starter-dim-sum`: `// PLACEHOLDER — replace with real photo of Steamed Dim Sum Dumplings`
- `starter-spring-rolls`: `// PLACEHOLDER — replace with real photo of Crispy Vegetable Spring Rolls`
- `rice-special-fried`: `// PLACEHOLDER — replace with real photo of Kabachi Special Fried Rice`
- `rice-yang-chow`: `// PLACEHOLDER — replace with real photo of Yang Chow Fried Rice`
- `noodles-singapore`: `// PLACEHOLDER — replace with real photo of Singapore Rice Noodles`
- `noodles-chow-mein`: `// PLACEHOLDER — replace with real photo of Beef Chow Mein`
- `chicken-szechuan-pepper`: `// PLACEHOLDER — replace with real photo of Szechuan Pepper Chicken`
- `chicken-sweet-sour`: `// PLACEHOLDER — replace with real photo of Sweet and Sour Chicken`
- `beef-hot-garlic`: `// PLACEHOLDER — replace with real photo of Shredded Beef in Hot Garlic Sauce`
- `beef-ginger-scallion`: `// PLACEHOLDER — replace with real photo of Crispy Ginger Beef`
- `seafood-salt-pepper-prawns`: `// PLACEHOLDER — replace with real photo of Salt & Pepper Jumbo Prawns`
- `drinks-hibiscus-spritz`: `// PLACEHOLDER — replace with real photo of Chilled Hibiscus Citrus Spritz`
- `hero-dish`: `// PLACEHOLDER — replace with real photo of Kabachi signature dish for Hero`
- `restaurant-interior`: `// PLACEHOLDER — replace with real photo of Kabachi Restaurant main dining floor`
- `bar-interior`: `// PLACEHOLDER — replace with real photo of Kabachi Bar & Lounge counter`
- `lodge-room`: `// PLACEHOLDER — replace with real photo of Kabachi Lodge guest rooms upstairs`
- `gallery-*`: 4 interior, kitchen wok, and drinks atmosphere shots

---

## 4. Brand Asset (Logo)

- **File Path**: `/public/logo.png`
- **Rule**: Brush-script red logo on white background. Displayed strictly on light backgrounds (`#FAF9F6`, `#F4F1EC`). Never recolored, cropped, or placed in dark sections.
- **Dark Section (Visit, `#1A1A1A`)**: Shows plain tracked-out Archivo text wordmark `KABACHI` (with comment: `// TODO: swap for white/reversed logo if Kabachi provides one`).
