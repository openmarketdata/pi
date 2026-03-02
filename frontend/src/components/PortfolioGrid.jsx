import React, { useMemo } from "react";
import { AgGridReact } from "ag-grid-react";
import "ag-grid-community/styles/ag-grid.css";
import "ag-grid-community/styles/ag-theme-alpine.css";

const fmt4 = (v) => (v === undefined || v === null ? "" : v.toFixed(4));
const fmtDollar = (v) =>
  v === undefined || v === null
    ? ""
    : new Intl.NumberFormat("en-US", { style: "currency", currency: "USD", maximumFractionDigits: 0 }).format(v);

function WeightDiffRenderer(params) {
  const v = params.value;
  if (v === undefined || v === null) return null;
  const color = v > 0.05 ? "#dc2626" : v < -0.05 ? "#16a34a" : "#374151";
  return <span style={{ color, fontWeight: 600 }}>{fmt4(v)}%</span>;
}

function OrderValueRenderer(params) {
  const v = params.value;
  if (v === undefined || v === null) return null;
  const color = v > 0 ? "#16a34a" : v < 0 ? "#dc2626" : "#374151";
  return <span style={{ color }}>{fmtDollar(v)}</span>;
}

/** Read-only portfolio overview grid */
export default function PortfolioGrid({ rows, totalValue }) {
  const columnDefs = useMemo(
    () => [
      {
        headerName: "Ticker",
        field: "ticker",
        pinned: "left",
        minWidth: 90,
        width: 100,
        filter: "agTextColumnFilter",
        sortable: true,
      },
      {
        headerName: "Name",
        field: "name",
        width: 240,
        filter: "agTextColumnFilter",
        sortable: true,
      },
      // ── Legacy (Current Positions) ──────────────────────────────
      {
        headerName: "Position (Legacy)",
        children: [
          {
            headerName: "Weight %",
            field: "posWeight",
            width: 110,
            valueFormatter: (p) => fmt4(p.value) + "%",
            sortable: true,
            filter: "agNumberColumnFilter",
          },
          {
            headerName: "Value ($)",
            field: "currentValue",
            width: 130,
            valueFormatter: (p) => fmtDollar(p.value),
            sortable: true,
            filter: "agNumberColumnFilter",
          },
        ],
      },
      // ── Orders (Deltas) ─────────────────────────────────────────
      {
        headerName: "Orders (Δ)",
        children: [
          {
            headerName: "Order Wt %",
            field: "orderWeight",
            width: 120,
            valueFormatter: (p) => fmt4(p.value) + "%",
            sortable: true,
            filter: "agNumberColumnFilter",
          },
          {
            headerName: "Order Value ($)",
            field: "orderValue",
            width: 140,
            cellRenderer: OrderValueRenderer,
            sortable: true,
            filter: "agNumberColumnFilter",
          },
        ],
      },
      // ── Target (Position + Orders) ──────────────────────────────
      {
        headerName: "Target (Result)",
        children: [
          {
            headerName: "Target Wt %",
            field: "targetWeight",
            width: 120,
            valueFormatter: (p) => fmt4(p.value) + "%",
            sortable: true,
            filter: "agNumberColumnFilter",
          },
          {
            headerName: "Target Value ($)",
            field: "targetValue",
            width: 140,
            valueFormatter: (p) => fmtDollar(p.value),
            sortable: true,
            filter: "agNumberColumnFilter",
          },
        ],
      },
      // ── S&P 500 Benchmark ───────────────────────────────────────
      {
        headerName: "S&P 500",
        children: [
          {
            headerName: "Index Wt %",
            field: "sp500Weight",
            width: 110,
            valueFormatter: (p) => fmt4(p.value) + "%",
            sortable: true,
            filter: "agNumberColumnFilter",
          },
          {
            headerName: "vs Index (Δ%)",
            field: "weightDiff",
            width: 130,
            cellRenderer: WeightDiffRenderer,
            sortable: true,
            filter: "agNumberColumnFilter",
          },
        ],
      },
    ],
    []
  );

  const defaultColDef = useMemo(
    () => ({
      resizable: true,
      suppressMovable: false,
    }),
    []
  );

  return (
    <div className="ag-theme-alpine" style={{ height: 480, width: "100%" }}>
      <AgGridReact
        rowData={rows}
        columnDefs={columnDefs}
        defaultColDef={defaultColDef}
        pagination
        paginationPageSize={20}
        paginationPageSizeSelector={[10, 20, 50]}
        domLayout="normal"
        enableCellTextSelection
      />
    </div>
  );
}
