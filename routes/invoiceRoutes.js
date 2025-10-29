const express = require("express");
const {
  createInvoice,
  getAllInvoices,
  getInvoiceById,
  deleteInvoice,
  updateInvoice,
} = require("../controllers/invoiceController");

const router = express.Router();

router.post("/create", createInvoice);
router.get("/getAll", getAllInvoices);
router.get("/get/:id", getInvoiceById);
router.put("/:id", updateInvoice);
router.delete("/delete/:id", deleteInvoice);

module.exports = router;
