const express = require("express");
const router = express.Router();
const controller = require("../controllers/customerController");
const auth = require("../middleware/authMiddleware");

router.get("/", auth, controller.getCustomers);
router.post("/", auth, controller.createCustomer);
router.patch("/:id", auth, controller.updateCustomer);
router.delete("/:id", auth, controller.deleteCustomer);

module.exports = router;