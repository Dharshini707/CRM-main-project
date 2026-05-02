const mongoose = require("mongoose");

const CaseSchema = new mongoose.Schema({
  customer_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Customer",
    required: true
  },
  assigned_to: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User"
  },
  priority: { type: String, enum: ["Low","Medium","High"] },
  status: { type: String, enum: ["Open","In Progress","Closed","On Hold"] },
  created_at: {
    type: Date,
    default: Date.now
  }
}, { strict: true });

module.exports = mongoose.model("Case", CaseSchema);