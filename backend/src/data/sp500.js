/**
 * S&P 500 index constituents with approximate weights.
 * Weights represent percentage of index (top 50 holdings shown; remainder
 * is bucketed as "OTHER" to keep the dataset manageable).
 */

const SP500_CONSTITUENTS = [
  { ticker: "MSFT",  name: "Microsoft Corp",              weight: 7.04 },
  { ticker: "AAPL",  name: "Apple Inc",                   weight: 6.47 },
  { ticker: "NVDA",  name: "NVIDIA Corp",                 weight: 5.12 },
  { ticker: "AMZN",  name: "Amazon.com Inc",              weight: 3.52 },
  { ticker: "META",  name: "Meta Platforms Inc",          weight: 2.48 },
  { ticker: "GOOGL", name: "Alphabet Inc Class A",        weight: 2.20 },
  { ticker: "GOOG",  name: "Alphabet Inc Class C",        weight: 1.98 },
  { ticker: "BRK.B", name: "Berkshire Hathaway Inc",      weight: 1.75 },
  { ticker: "TSLA",  name: "Tesla Inc",                   weight: 1.72 },
  { ticker: "LLY",   name: "Eli Lilly and Co",            weight: 1.58 },
  { ticker: "UNH",   name: "UnitedHealth Group Inc",      weight: 1.40 },
  { ticker: "JPM",   name: "JPMorgan Chase & Co",         weight: 1.35 },
  { ticker: "V",     name: "Visa Inc",                    weight: 1.25 },
  { ticker: "AVGO",  name: "Broadcom Inc",                weight: 1.18 },
  { ticker: "XOM",   name: "Exxon Mobil Corp",            weight: 1.12 },
  { ticker: "JNJ",   name: "Johnson & Johnson",           weight: 1.02 },
  { ticker: "MA",    name: "Mastercard Inc",              weight: 0.98 },
  { ticker: "PG",    name: "Procter & Gamble Co",         weight: 0.92 },
  { ticker: "HD",    name: "Home Depot Inc",              weight: 0.88 },
  { ticker: "MRK",   name: "Merck & Co Inc",              weight: 0.85 },
  { ticker: "COST",  name: "Costco Wholesale Corp",       weight: 0.82 },
  { ticker: "ABBV",  name: "AbbVie Inc",                  weight: 0.80 },
  { ticker: "CVX",   name: "Chevron Corp",                weight: 0.78 },
  { ticker: "AMD",   name: "Advanced Micro Devices Inc",  weight: 0.76 },
  { ticker: "NFLX",  name: "Netflix Inc",                 weight: 0.74 },
  { ticker: "CRM",   name: "Salesforce Inc",              weight: 0.72 },
  { ticker: "BAC",   name: "Bank of America Corp",        weight: 0.70 },
  { ticker: "PEP",   name: "PepsiCo Inc",                 weight: 0.68 },
  { ticker: "TMO",   name: "Thermo Fisher Scientific Inc",weight: 0.66 },
  { ticker: "ORCL",  name: "Oracle Corp",                 weight: 0.65 },
  { ticker: "ACN",   name: "Accenture PLC",               weight: 0.63 },
  { ticker: "MCD",   name: "McDonald's Corp",             weight: 0.61 },
  { ticker: "CSCO",  name: "Cisco Systems Inc",           weight: 0.59 },
  { ticker: "WMT",   name: "Walmart Inc",                 weight: 0.58 },
  { ticker: "ABT",   name: "Abbott Laboratories",         weight: 0.56 },
  { ticker: "DHR",   name: "Danaher Corp",                weight: 0.54 },
  { ticker: "INTC",  name: "Intel Corp",                  weight: 0.52 },
  { ticker: "TXN",   name: "Texas Instruments Inc",       weight: 0.50 },
  { ticker: "NEE",   name: "NextEra Energy Inc",          weight: 0.49 },
  { ticker: "QCOM",  name: "Qualcomm Inc",                weight: 0.48 },
  { ticker: "PM",    name: "Philip Morris International", weight: 0.47 },
  { ticker: "UNP",   name: "Union Pacific Corp",          weight: 0.46 },
  { ticker: "AMGN",  name: "Amgen Inc",                   weight: 0.45 },
  { ticker: "LOW",   name: "Lowe's Companies Inc",        weight: 0.44 },
  { ticker: "INTU",  name: "Intuit Inc",                  weight: 0.43 },
  { ticker: "CAT",   name: "Caterpillar Inc",             weight: 0.42 },
  { ticker: "SPGI",  name: "S&P Global Inc",              weight: 0.41 },
  { ticker: "GS",    name: "Goldman Sachs Group Inc",     weight: 0.40 },
  { ticker: "RTX",   name: "RTX Corp",                    weight: 0.39 },
  { ticker: "ISRG",  name: "Intuitive Surgical Inc",      weight: 0.38 },
];

// All remaining constituents bucketed together
const topWeightSum = SP500_CONSTITUENTS.reduce((sum, c) => sum + c.weight, 0);
const otherWeight = Math.max(0, parseFloat((100 - topWeightSum).toFixed(4)));

if (otherWeight > 0) {
  SP500_CONSTITUENTS.push({
    ticker: "OTHER",
    name: "All Other S&P 500 Constituents",
    weight: otherWeight,
  });
}

module.exports = { SP500_CONSTITUENTS };
