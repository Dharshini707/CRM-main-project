const express = require("express");
const router = express.Router();
const controller = require("../controllers/caseController");
const auth = require("../middleware/authMiddleware");

router.get("/", auth, controller.getCases);
router.post("/", auth, controller.createCase);
router.patch("/:id", auth, controller.updateCase);

module.exports = router;