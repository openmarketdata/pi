import React, { useMemo, useCallback, useRef } from "react";
import { AgGridReact } from "ag-grid-react";
import "ag-grid-community/styles/ag-grid.css";
import "ag-grid-community/styles/ag-theme-alpine.css";

const fmtDollar = (v) =>
  v === undefined || v === null
    ? ""
    : new Intl.NumberFormat("en-US", {
        style: "currency",
        currency: "USD",
        maximumFractionDigits: 0,
      }).format(v);

/**
 * Editable orders grid.
 *
 * Props:
 *   rows           - full portfolio rows from /api/calculate
 *   totalValue     - total portfolio value
 *   onOrdersChange - called with array of { ticker, orderValue } when user edits a cell
 */
export default function OrdersGrid({ rows, totalValue, onOrdersChange }) {
  const gridRef = useRef();

  // Track user overrides: { [ticker]: orderValue }
  const overridesRef = useRef({});

  const columnDefs = useMemo(
    () => [
      {
        headerName: "Ticker",
        field: "ticker",
        pinned: "left",
        width: 90,
        filter: "agTextColumnFilter",
        sortable: true,
        editable: false,
      },
      {
        headerName: "Name",
        field: "name",
        width: 240,
        filter: "agTextColumnFilter",
        sortable: true,
        editable: false,
      },
      {
        headerName: "Current Weight %",
        field: "posWeight",
        width: 150,
        valueFormatter: (p) => (p.value ?? 0).toFixed(4) + "%",
        sortable: true,
        filter: "agNumberColumnFilter",
        editable: false,
      },
      {
        headerName: "Index Weight %",
        field: "sp500Weight",
        width: 140,
        valueFormatter: (p) => (p.value ?? 0).toFixed(4) + "%",
        sortable: true,
        filter: "agNumberColumnFilter",
        editable: false,
      },
      {
        headerName: "Order Value ($) ✏️",
        field: "orderValue",
        width: 170,
        editable: true,
        sortable: true,
        filter: "agNumberColumnFilter",
        valueFormatter: (p) => fmtDollar(p.value),
        cellStyle: { background: "#fefce8", fontWeight: "600" },
        valueSetter: (params) => {
          const raw = String(params.newValue).replace(/[$,\s]/g, "");
          const num = parseFloat(raw);
          if (!isNaN(num)) {
            params.data.orderValue = num;
            return true;
          }
          return false;
        },
      },
      {
        headerName: "Order Weight %",
        field: "orderWeight",
        width: 140,
        valueFormatter: (p) => (p.value ?? 0).toFixed(4) + "%",
        sortable: true,
        filter: "agNumberColumnFilter",
        editable: false,
      },
    ],
    []
  );

  const defaultColDef = useMemo(
    () => ({
      resizable: true,
    }),
    []
  );

  /** When a cell value changes, collect all current order overrides and notify parent */
  const onCellValueChanged = useCallback(
    (event) => {
      if (event.column.colId !== "orderValue") return;

      overridesRef.current[event.data.ticker] = event.newValue;

      // Build override array from all rows currently in the grid
      const api = gridRef.current?.api;
      if (!api) return;

      const editedOrders = [];
      api.forEachNode((node) => {
        const { ticker, orderValue } = node.data;
        if (overridesRef.current[ticker] !== undefined) {
          editedOrders.push({ ticker, orderValue });
        }
      });

      onOrdersChange(editedOrders);
    },
    [onOrdersChange]
  );

  /** Reset all order overrides back to index-aligned values */
  const handleReset = useCallback(() => {
    overridesRef.current = {};
    onOrdersChange([]);
  }, [onOrdersChange]);

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
      <div style={{ padding: "8px 18px" }}>
        <button
          onClick={handleReset}
          style={{
            padding: "6px 14px",
            background: "#1a1a2e",
            color: "#fff",
            border: "none",
            borderRadius: 4,
            cursor: "pointer",
            fontSize: "0.85rem",
          }}
        >
          Reset Orders to Index
        </button>
        <span style={{ marginLeft: 12, fontSize: "0.82rem", color: "#6b7280" }}>
          Click a cell in the <em>Order Value</em> column to edit.
        </span>
      </div>
      <div className="ag-theme-alpine" style={{ height: 420, width: "100%" }}>
        <AgGridReact
          ref={gridRef}
          rowData={rows}
          columnDefs={columnDefs}
          defaultColDef={defaultColDef}
          pagination
          paginationPageSize={20}
          paginationPageSizeSelector={[10, 20, 50]}
          onCellValueChanged={onCellValueChanged}
          stopEditingWhenCellsLoseFocus
          domLayout="normal"
        />
      </div>
    </div>
  );
}
