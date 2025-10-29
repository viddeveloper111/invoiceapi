const Invoice = require("../models/invoiceModel");
const Client = require("../models/Client");
const Product = require("../models/Product");

// 🧾 Create Invoice
const createInvoice = async (req, res) => {
  try {
    const {
      invoiceNo,
      date,
      clientId,
      products,
      deliveryNote,
      paymentTerms,
      referenceNo,
      otherReferences,
      buyersOrderNo,
      orderDated,
      dispatchDocNo,
      deliveryNoteDate,
      dispatchedThrough,
      destination,
      termsOfDelivery,
    } = req.body;

    let subTotal = 0;
    let cgst = 0;
    let sgst = 0;

    const client = await Client.findById(clientId);
    if (!client) return res.status(404).json({ message: "Client not found" });

    for (const item of products) {
      const product = await Product.findById(item.productId);
      if (product) {
        const productTotal = product.price * item.quantity;
        const gstRate = product.gst || 0;
        const gstAmount = (productTotal * gstRate) / 100;
        subTotal += productTotal;

        if (client.stateName?.toLowerCase() === "rajasthan") {
          cgst += gstAmount / 2;
          sgst += gstAmount / 2;
        } else {
          cgst += 0;
          sgst += gstAmount; // IGST treated as SGST
        }
      }
    }

    const totalAmount = subTotal + cgst + sgst;

    const newInvoice = new Invoice({
      invoiceNo,
      date,
      clientId,
      products,
      deliveryNote,
      paymentTerms,
      referenceNo,
      otherReferences,
      buyersOrderNo,
      orderDated,
      dispatchDocNo,
      deliveryNoteDate,
      dispatchedThrough,
      destination,
      termsOfDelivery,
      subTotal,
      cgst,
      sgst,
      totalAmount,
    });

    await newInvoice.save();
    res.status(201).json({ success: true, invoice: newInvoice });
  } catch (error) {
    console.error("Error creating invoice:", error);
    res.status(500).json({ success: false, message: error.message });
  }
};

// 📋 Get All Invoices
const getAllInvoices = async (req, res) => {
  try {
    const invoices = await Invoice.find()
      .populate("clientId", "name stateName gstin address")
      .populate("products.productId", "name price gst model");
    res.json({ success: true, invoices });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// 🔍 Get Single Invoice
const getInvoiceById = async (req, res) => {
  try {
    const invoice = await Invoice.findById(req.params.id)
      .populate("clientId", "name stateName gstin address")
      .populate("products.productId", "name price gst model");
    if (!invoice) return res.status(404).json({ message: "Invoice not found" });
    res.json({ success: true, invoice });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// ❌ Delete Invoice
const deleteInvoice = async (req, res) => {
  try {
    const invoice = await Invoice.findByIdAndDelete(req.params.id);
    if (!invoice) return res.status(404).json({ message: "Invoice not found" });
    res.json({ success: true, message: "Invoice deleted successfully" });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};
const updateInvoice = async (req, res) => {
  try {
    const {
      invoiceNo,
      date,
      clientId,
      products,
      deliveryNote,
      paymentTerms,
      referenceNo,
      otherReferences,
      buyersOrderNo,
      orderDated,
      dispatchDocNo,
      deliveryNoteDate,
      dispatchedThrough,
      destination,
      termsOfDelivery,
    } = req.body;

    const invoice = await Invoice.findById(req.params.id);
    if (!invoice) return res.status(404).json({ message: "Invoice not found" });

    const client = await Client.findById(clientId);
    if (!client) return res.status(404).json({ message: "Client not found" });

    let subTotal = 0;
    let cgst = 0;
    let sgst = 0;

    for (const item of products) {
      const product = await Product.findById(item.productId);
      if (product) {
        const productTotal = product.price * item.quantity;
        const gstRate = product.gst || 0;
        const gstAmount = (productTotal * gstRate) / 100;
        subTotal += productTotal;

        if (client.stateName?.toLowerCase() === "rajasthan") {
          cgst += gstAmount / 2;
          sgst += gstAmount / 2;
        } else {
          cgst += 0;
          sgst += gstAmount; // IGST treated as SGST
        }
      }
    }

    const totalAmount = subTotal + cgst + sgst;

    invoice.invoiceNo = invoiceNo;
    invoice.date = date;
    invoice.clientId = clientId;
    invoice.products = products;
    invoice.deliveryNote = deliveryNote;
    invoice.paymentTerms = paymentTerms;
    invoice.referenceNo = referenceNo;
    invoice.otherReferences = otherReferences;
    invoice.buyersOrderNo = buyersOrderNo;
    invoice.orderDated = orderDated;
    invoice.dispatchDocNo = dispatchDocNo;
    invoice.deliveryNoteDate = deliveryNoteDate;
    invoice.dispatchedThrough = dispatchedThrough;
    invoice.destination = destination;
    invoice.termsOfDelivery = termsOfDelivery;
    invoice.subTotal = subTotal;
    invoice.cgst = cgst;
    invoice.sgst = sgst;
    invoice.totalAmount = totalAmount;

    await invoice.save();

    res.json({ success: true, message: "Invoice updated successfully", invoice });
  } catch (error) {
    console.error("Error updating invoice:", error);
    res.status(500).json({ success: false, message: error.message });
  }
};


module.exports = {
  createInvoice,
  getAllInvoices,
  updateInvoice,
  getInvoiceById,
  deleteInvoice,
};
