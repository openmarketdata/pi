# pi — Portfolio Index

A full-stack application that tracks a portfolio against the S&P 500 index.

## Architecture

```
pi/
├── backend/          # Node.js + Express REST API
│   └── src/
│       ├── data/
│       │   ├── sp500.js        # S&P 500 constituents & weights
│       │   └── positions.js    # Simulated current positions
│       ├── engine/
│       │   └── calculator.js   # Order calculation engine
│       ├── routes/
│       │   └── api.js          # REST API routes
│       └── server.js
└── frontend/         # React + Vite + ag-Grid
    └── src/
        ├── components/
        │   ├── PortfolioGrid.jsx  # Read-only overview grid
        │   └── OrdersGrid.jsx    # Editable orders grid
        └── App.jsx
```

## Getting Started

### Prerequisites

- Node.js 18+

### Install dependencies

```bash
npm run install:all
```

### Run in development

Open two terminals:

```bash
# Terminal 1 — backend (port 3001)
npm run dev:backend

# Terminal 2 — frontend (port 5173, proxies /api to backend)
npm run dev:frontend
```

Then open http://localhost:5173.

## API Endpoints

| Method | Path | Description |
|--------|------|-------------|
| `GET`  | `/api/constituents` | S&P 500 constituents & weights |
| `GET`  | `/api/positions` | Current portfolio positions |
| `GET`  | `/api/orders?totalValue=<n>` | Base orders to align with index |
| `POST` | `/api/calculate` | Apply edited orders & recalculate |

## Features

### Backend
- **Data layer** — S&P 500 top-50 constituents with approximate index weights; simulated positions use the same weights with small deterministic random offsets (replace `getPositions()` in `backend/src/data/positions.js` with a real data feed for production).
- **Calculation engine** — computes weight deltas and dollar-value orders needed to bring the portfolio in line with the index given an input total portfolio value.

### Frontend
1. **Portfolio Overview grid** (read-only, sortable, filterable, paginated)
   - *Position (Legacy)* — current position weight & value
   - *Orders (Δ)* — order weight and dollar value
   - *Target (Result)* — post-order position weight & value
   - *vs S&P 500* — index weight & difference highlighted in red/green

2. **Editable Orders grid**
   - Edit the *Order Value* column for any ticker
   - Changes instantly flow back and recalculate the Portfolio Overview grid
   - **Reset Orders to Index** button restores all orders to the index-aligned defaults

## Tests

```bash
npm run test:backend
```
