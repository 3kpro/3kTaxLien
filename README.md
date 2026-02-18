# Tax Lien Pro — National Investment Tracker

A React dashboard for managing tax lien investments across Oklahoma and select national markets.

## Features
- **Dashboard** — Budget tracking, pipeline summary, and multi-state opportunities
- **🟢 Buy Now** — OK, AZ, and FL OTC options plus county-owned properties
- **States** — National tax lien/deed profiles with filters and platform info
- **Online** — Auction platforms and research tools
- **Properties** — Track parcels with state, county, and status fields
- **Glossary** — Expanded tax lien/deed terminology
- **Checklist** — Phased action items for OK + online states
- **Calculator** — Min bid calculator using Oklahoma's "lesser of" rule
- **OK Counties** — Oklahoma county directory with contact info

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
