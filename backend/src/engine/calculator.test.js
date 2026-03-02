const { describe, it } = require("node:test");
const assert = require("node:assert/strict");

const { SP500_CONSTITUENTS } = require("../data/sp500");
const { getPositions } = require("../data/positions");
const { calculateOrders, applyEditedOrders } = require("../engine/calculator");

describe("SP500 data", () => {
  it("has at least 50 constituents (including OTHER bucket)", () => {
    assert.ok(SP500_CONSTITUENTS.length >= 50);
  });

  it("total weights sum to ~100", () => {
    const total = SP500_CONSTITUENTS.reduce((s, c) => s + c.weight, 0);
    assert.ok(Math.abs(total - 100) < 0.1, `Expected ~100, got ${total}`);
  });
});

describe("positions", () => {
  it("returns an array with sp500Weight and posWeight for each entry", () => {
    const positions = getPositions();
    assert.ok(Array.isArray(positions));
    assert.ok(positions.length > 0);
    for (const p of positions) {
      assert.ok(typeof p.sp500Weight === "number");
      assert.ok(typeof p.posWeight === "number");
    }
  });

  it("position weights sum to ~100", () => {
    const positions = getPositions();
    const total = positions.reduce((s, p) => s + p.posWeight, 0);
    assert.ok(Math.abs(total - 100) < 0.5, `Expected ~100, got ${total}`);
  });
});

describe("calculateOrders", () => {
  const TOTAL = 1_000_000;

  it("returns one row per position", () => {
    const positions = getPositions();
    const rows = calculateOrders(positions, TOTAL);
    assert.equal(rows.length, positions.length);
  });

  it("order value equals targetValue - currentValue", () => {
    const positions = getPositions();
    const rows = calculateOrders(positions, TOTAL);
    for (const r of rows) {
      assert.ok(
        Math.abs(r.currentValue + r.orderValue - r.targetValue) < 1,
        `${r.ticker}: currentValue(${r.currentValue}) + orderValue(${r.orderValue}) !== targetValue(${r.targetValue})`
      );
    }
  });
});

describe("applyEditedOrders", () => {
  const TOTAL = 500_000;

  it("uses override order value when provided", () => {
    const positions = getPositions();
    const override = [{ ticker: "MSFT", orderValue: 5000 }];
    const rows = applyEditedOrders(positions, TOTAL, override);
    const msft = rows.find((r) => r.ticker === "MSFT");
    assert.equal(msft.orderValue, 5000);
  });

  it("keeps base order for non-overridden tickers", () => {
    const positions = getPositions();
    const rows = applyEditedOrders(positions, TOTAL, []);
    for (const r of rows) {
      const expected = ((r.sp500Weight - r.posWeight) / 100) * TOTAL;
      assert.ok(
        Math.abs(r.orderValue - expected) < 1,
        `${r.ticker} base order mismatch`
      );
    }
  });
});
