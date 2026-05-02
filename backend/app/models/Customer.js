const mongoose = require("mongoose");

const CustomerSchema = new mongoose.Schema({
  // fields used by the React client (Dashboard / CustomerModal)
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  phone: String,
  company: String,
  notes: String,
  status: {
    type: String,
    enum: ["Lead", "Active", "Prospect", "Churned"],
    default: "Lead"
  }
}, {
  strict: true // drop any other properties that might be sent by mistake
});

module.exports = mongoose.model("Customer", CustomerSchema);