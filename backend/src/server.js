const express = require("express");
const cors    = require("cors");
const apiRouter = require("./routes/api");

const app  = express();
const PORT = process.env.PORT || 3001;

app.use(cors());
app.use(express.json());

app.use("/api", apiRouter);

// Health check
app.get("/", (_req, res) => res.json({ status: "ok", message: "pi backend" }));

app.listen(PORT, () => {
  console.log(`Backend listening on http://localhost:${PORT}`);
});

module.exports = app;
