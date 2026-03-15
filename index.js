require("dotenv").config();
const express   = require("express");
const cors      = require("cors");
const mongoose  = require("mongoose");

const app = express();

app.use(cors({ origin: process.env.CLIENT_URL || "*" }));
app.use(express.json());

// Routes
app.use("/api/stream",  require("./routes/stream"));
app.use("/api/stats",   require("./routes/stats"));
app.use("/api/trigger", require("./routes/trigger"));
app.use("/api/webhook", require("./routes/webhook"));

app.get("/api/health", (req, res) => {
  const { getQueueSize, isProcessing } = require("./lib/queue");
  res.json({ status: "ok", service: "QuantumDocsSyncer", queue: getQueueSize(), running: isProcessing() });
});

mongoose
  .connect(process.env.MONGO_URI)
  .then(() => {
    console.log("MongoDB connected");
    const PORT = process.env.PORT || 5000;
    app.listen(PORT, () => console.log(`\nQuantumDocsSyncer server → http://localhost:${PORT}\n`));
  })
  .catch(err => { console.error("MongoDB error:", err.message); process.exit(1); });
