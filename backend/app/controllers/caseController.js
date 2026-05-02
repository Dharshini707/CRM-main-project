const Case = require("../models/Case");

exports.getCases = async (req, res) => {

  const cases = await Case.find()
    .populate("customer_id")
    .populate("assigned_to");

  res.json(cases);
};

exports.createCase = async (req, res) => {
  const payload = {
    customer_id: req.body.customer_id,         // ObjectId should remain as provided by client
    assigned_to: req.body.assigned_to,
    priority: req.body.priority != null ? String(req.body.priority) : undefined,
    status: req.body.status != null ? String(req.body.status) : undefined
  };

  const newCase = new Case(payload);
  await newCase.save();
  res.json(newCase);
};

exports.updateCase = async (req, res) => {
  const payload = {};
  if (req.body.customer_id != null) payload.customer_id = req.body.customer_id;
  if (req.body.assigned_to != null) payload.assigned_to = req.body.assigned_to;
  if (req.body.priority != null) payload.priority = String(req.body.priority);
  if (req.body.status != null) payload.status = String(req.body.status);

  const updated = await Case.findByIdAndUpdate(
    req.params.id,
    payload,
    { new: true }
  );

  res.json(updated);
};