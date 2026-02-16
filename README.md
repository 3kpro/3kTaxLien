# Tax Lien Pro — Oklahoma Investment Tracker

A React dashboard for managing tax lien investments in Oklahoma counties.

## Features
- **Dashboard** — Budget tracking, ROI, pipeline summary, Oklahoma's 3-sale system overview
- **🟢 Buy Now** — OTC certificates and county-owned properties available TODAY
- **Properties** — Track parcels through the pipeline (Researching → Target → Won → Flipped)
- **Glossary** — 28 tax lien terms with hover/tap tooltips throughout the app
- **Checklist** — Phased action items from today through post-auction
- **Calculator** — Min bid calculator using Oklahoma's "lesser of" rule
- **Counties** — 7 Oklahoma counties with phone numbers, addresses, and links

## Quick Start

```bash
npm install
npm run dev
```

Opens at http://localhost:5173

## Build for Production

```bash
npm run build
```

Output goes to `dist/` folder.

## Included Files
- `TaxLienPro_Research_Tracker.xlsx` — Excel spreadsheet with property tracker, due diligence checklist, and county contacts

## Key Oklahoma Tax Sale Dates
| Sale | When | What You Get |
|------|------|-------------|
| October Tax Sale | 1st Monday of October | Tax lien certificate (8% interest) |
| OTC Purchase | Year-round | Unsold certificates from October |
| June Resale | 2nd Monday of June | Tax deed (property ownership) |
| Commissioner Sale | Year-round | County-owned properties |

## Tech Stack
- React 18 + Vite
- No external UI libraries — pure inline styles
- localStorage for data persistence
