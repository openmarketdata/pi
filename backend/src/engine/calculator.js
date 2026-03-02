/**
 * Calculation engine.
 *
 * Given current positions and a total portfolio value, compute:
 *   1. The weight difference between each position and its S&P 500 target.
 *   2. The dollar-value orders (positive = buy, negative = sell) needed to
 *      bring the portfolio into alignment with the index.
 */

/**
 * Calculate orders required to align portfolio with S&P 500 targets.
 *
 * @param {Array}  positions   - Output of getPositions()
 * @param {number} totalValue  - Total portfolio value in USD
 * @returns {Array} rows with full position + order details
 */
function calculateOrders(positions, totalValue) {
  return positions.map((p) => {
    const targetValue   = (p.sp500Weight / 100) * totalValue;
    const currentValue  = (p.posWeight   / 100) * totalValue;
    const orderValue    = parseFloat((targetValue - currentValue).toFixed(2));
    const orderWeight   = parseFloat((p.sp500Weight - p.posWeight).toFixed(4));

    return {
      ticker:      p.ticker,
      name:        p.name,
      sp500Weight: p.sp500Weight,
      posWeight:   p.posWeight,
      orderWeight,
      orderValue,
      // Derived fields
      currentValue:  parseFloat(currentValue.toFixed(2)),
      targetValue:   parseFloat(targetValue.toFixed(2)),
    };
  });
}

/**
 * Apply a set of user-supplied orders on top of the base orders and
 * recompute the target weights / value deltas.
 *
 * @param {Array}  positions      - Output of getPositions()
 * @param {number} totalValue     - Total portfolio value in USD
 * @param {Array}  editedOrders   - Array of { ticker, orderValue } overrides
 * @returns {Array} recalculated rows
 */
function applyEditedOrders(positions, totalValue, editedOrders) {
  const overrideMap = {};
  for (const o of editedOrders) {
    overrideMap[o.ticker] = o.orderValue;
  }

  return positions.map((p) => {
    const currentValue  = (p.posWeight / 100) * totalValue;
    const sp500Value    = (p.sp500Weight / 100) * totalValue;

    // Use override if provided, otherwise use base order
    const baseOrder     = sp500Value - currentValue;
    const orderValue    = overrideMap[p.ticker] !== undefined
      ? parseFloat(Number(overrideMap[p.ticker]).toFixed(2))
      : parseFloat(baseOrder.toFixed(2));

    const targetValue   = currentValue + orderValue;
    const targetWeight  = parseFloat(((targetValue / totalValue) * 100).toFixed(4));
    const weightDiff    = parseFloat((targetWeight - p.sp500Weight).toFixed(4));
    const orderWeight   = parseFloat((orderValue / totalValue * 100).toFixed(4));

    return {
      ticker:       p.ticker,
      name:         p.name,
      sp500Weight:  p.sp500Weight,
      posWeight:    p.posWeight,
      orderWeight,
      orderValue,
      currentValue: parseFloat(currentValue.toFixed(2)),
      targetValue:  parseFloat(targetValue.toFixed(2)),
      targetWeight,
      weightDiff,
    };
  });
}

module.exports = { calculateOrders, applyEditedOrders };
