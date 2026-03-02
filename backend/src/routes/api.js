const express = require("express");
const router  = express.Router();

const { SP500_CONSTITUENTS } = require("../data/sp500");
const { getPositions }       = require("../data/positions");
const { calculateOrders, applyEditedOrders } = require("../engine/calculator");

/**
 * GET /api/constituents
 * Returns S&P 500 index constituents and their target weights.
 */
router.get("/constituents", (_req, res) => {
  res.json({ constituents: SP500_CONSTITUENTS });
});

/**
 * GET /api/positions
 * Returns current portfolio positions (simulated in development).
 */
router.get("/positions", (_req, res) => {
  res.json({ positions: getPositions() });
});

/**
 * GET /api/orders?totalValue=<number>
 * Returns the base set of orders needed to align the portfolio with S&P 500.
 * Query parameter `totalValue` (USD) is required.
 */
router.get("/orders", (req, res) => {
  const totalValue = parseFloat(req.query.totalValue);
  if (!totalValue || totalValue <= 0) {
    return res.status(400).json({ error: "totalValue query parameter must be a positive number" });
  }

  const positions = getPositions();
  const rows      = calculateOrders(positions, totalValue);
  res.json({ totalValue, rows });
});

/**
 * POST /api/calculate
 * Body: { totalValue: number, editedOrders: [{ ticker, orderValue }, ...] }
 * Returns full portfolio view with user-edited orders applied.
 */
router.post("/calculate", (req, res) => {
  const { totalValue, editedOrders = [] } = req.body;

  if (!totalValue || totalValue <= 0) {
    return res.status(400).json({ error: "totalValue must be a positive number" });
  }

  const positions = getPositions();
  const rows      = applyEditedOrders(positions, totalValue, editedOrders);
  res.json({ totalValue, rows });
});

module.exports = router;
