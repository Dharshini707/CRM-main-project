const express = require("express");
const dotenv = require("dotenv");
const cors = require("cors");
const connectDB = require("./config/db");

dotenv.config();
connectDB();

const app = express();

app.use(cors());
app.use(express.json());

app.use("/api/auth", require("./app/routes/authRoutes"));
app.use("/api/customers", require("./app/routes/customerRoutes"));
app.use("/api/cases", require("./app/routes/caseRoutes"));

app.get("/", (req, res) => {
  res.send("CRM Backend Running Successfully");
});

// ✅ FIX 1: Removed duplicate app.listen() — was binding port twice causing EADDRINUSE crash
const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});