/**
 * Simulated current positions.
 *
 * In development, positions are derived from S&P 500 constituent weights
 * with small random adjustments to simulate portfolio drift.
 * In production, replace `getPositions()` with a real data feed.
 */

const { SP500_CONSTITUENTS } = require("./sp500");

/**
 * Generate a reproducible-ish random adjustment in the range [-maxDelta, +maxDelta].
 * Uses a simple deterministic seed based on the ticker string so results are
 * stable across server restarts in development.
 */
function seededAdjustment(ticker, maxDelta = 1.5) {
  let hash = 0;
  for (let i = 0; i < ticker.length; i++) {
    hash = (hash * 31 + ticker.charCodeAt(i)) >>> 0;
  }
  // Normalize to [-1, 1] then scale
  const normalised = ((hash % 1000) / 1000) * 2 - 1;
  return parseFloat((normalised * maxDelta).toFixed(4));
}

/**
 * Return the current portfolio positions.
 *
 * Each position contains:
 *   ticker       - stock symbol
 *   name         - company name
 *   posWeight    - current position weight (%)
 *   sp500Weight  - index target weight (%)
 */
function getPositions() {
  const raw = SP500_CONSTITUENTS.map((c) => ({
    ticker: c.ticker,
    name: c.name,
    sp500Weight: c.weight,
    posWeight: Math.max(0, c.weight + seededAdjustment(c.ticker)),
  }));

  // Re-normalise so position weights sum to 100
  const totalPos = raw.reduce((s, p) => s + p.posWeight, 0);
  return raw.map((p) => ({
    ...p,
    posWeight: parseFloat(((p.posWeight / totalPos) * 100).toFixed(4)),
  }));
}

module.exports = { getPositions };
