import React, { useState, useEffect, useCallback } from "react";
import PortfolioGrid from "./components/PortfolioGrid.jsx";
import OrdersGrid from "./components/OrdersGrid.jsx";
import "./App.css";

const DEFAULT_TOTAL_VALUE = 1_000_000;

export default function App() {
  const [totalValue, setTotalValue]       = useState(DEFAULT_TOTAL_VALUE);
  const [inputValue, setInputValue]       = useState(String(DEFAULT_TOTAL_VALUE));
  const [portfolioRows, setPortfolioRows] = useState([]);
  const [editedOrders, setEditedOrders]   = useState([]);
  const [loading, setLoading]             = useState(false);
  const [error, setError]                 = useState(null);

  /** Recalculate portfolio rows from backend whenever totalValue or editedOrders change */
  const recalculate = useCallback(async (value, orders) => {
    if (!value || value <= 0) return;
    setLoading(true);
    setError(null);
    try {
      const res = await fetch("/api/calculate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ totalValue: value, editedOrders: orders }),
      });
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      const data = await res.json();
      setPortfolioRows(data.rows);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }, []);

  // Initial load and whenever totalValue changes
  useEffect(() => {
    recalculate(totalValue, editedOrders);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [totalValue]);

  /** Called by OrdersGrid when the user edits an order value */
  const handleOrdersChange = useCallback(
    (updatedOrders) => {
      setEditedOrders(updatedOrders);
      recalculate(totalValue, updatedOrders);
    },
    [totalValue, recalculate]
  );

  const handleTotalValueSubmit = (e) => {
    e.preventDefault();
    const parsed = parseFloat(inputValue.replace(/,/g, ""));
    if (!isNaN(parsed) && parsed > 0) {
      setTotalValue(parsed);
    }
  };

  return (
    <div className="app">
      <header className="app-header">
        <h1>Portfolio Index (PI)</h1>
        <form className="total-value-form" onSubmit={handleTotalValueSubmit}>
          <label htmlFor="totalValue">Portfolio Value ($):</label>
          <input
            id="totalValue"
            type="text"
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
          />
          <button type="submit">Recalculate</button>
        </form>
      </header>

      {error && <div className="error-banner">Error: {error}</div>}

      <main className="app-main">
        <section className="grid-section">
          <h2>
            Portfolio Overview
            <span className="grid-hint">
              &nbsp;— Legacy positions · Orders (Δ) · Target · vs S&amp;P 500
            </span>
          </h2>
          {loading ? (
            <div className="loading">Calculating…</div>
          ) : (
            <PortfolioGrid rows={portfolioRows} totalValue={totalValue} />
          )}
        </section>

        <section className="grid-section">
          <h2>
            Editable Orders
            <span className="grid-hint">
              &nbsp;— Edit order values to see live impact above
            </span>
          </h2>
          <OrdersGrid
            rows={portfolioRows}
            totalValue={totalValue}
            onOrdersChange={handleOrdersChange}
          />
        </section>
      </main>
    </div>
  );
}
