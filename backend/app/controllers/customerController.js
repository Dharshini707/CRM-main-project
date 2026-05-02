const Customer = require("../models/Customer");

exports.getCustomers = async (req, res) => {
  const customers = await Customer.find();
  res.json(customers);
};

exports.createCustomer = async (req, res) => {
  // always coerce primitive values to strings so the database
  // cannot accidentally store objects/arrays if the client misbehaves
  const payload = {
    name: String(req.body.name || ""),
    email: String(req.body.email || ""),
    phone: req.body.phone != null ? String(req.body.phone) : undefined,
    company: req.body.company != null ? String(req.body.company) : undefined,
    notes: req.body.notes != null ? String(req.body.notes) : undefined,
    status: String(req.body.status || "Lead")
  };

  const customer = new Customer(payload);
  await customer.save();
  res.json(customer);
};

exports.updateCustomer = async (req, res) => {
  const payload = {};
  if (req.body.name != null) payload.name = String(req.body.name);
  if (req.body.email != null) payload.email = String(req.body.email);
  if (req.body.phone != null) payload.phone = String(req.body.phone);
  if (req.body.company != null) payload.company = String(req.body.company);
  if (req.body.notes != null) payload.notes = String(req.body.notes);
  if (req.body.status != null) payload.status = String(req.body.status);

  const customer = await Customer.findByIdAndUpdate(
    req.params.id,
    payload,
    { new: true }
  );

  res.json(customer);
};

exports.deleteCustomer = async (req, res) => {

  await Customer.findByIdAndDelete(req.params.id);

  res.json({ message: "Customer deleted" });
};