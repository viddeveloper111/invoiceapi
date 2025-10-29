const mongoose = require("mongoose");

const invoiceSchema = new mongoose.Schema(
  {
    invoiceNo: { type: String, required: true },
    date: { type: String, required: true },

    clientId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Client",
      required: true,
    },

    products: [
      {
        productId: {
          type: mongoose.Schema.Types.ObjectId,
          ref: "Product",
          required: true,
        },
        quantity: { type: Number, required: true },
      },
    ],

    deliveryNote: String,
    paymentTerms: String,
    referenceNo: String,
    otherReferences: String,
    buyersOrderNo: String,
    orderDated: String,
    dispatchDocNo: String,
    deliveryNoteDate: String,
    dispatchedThrough: String,
    destination: String,
    termsOfDelivery: String,

    subTotal: Number,
    cgst: Number,
    sgst: Number,
    totalAmount: Number,

    createdAt: { type: Date, default: Date.now },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Invoice", invoiceSchema);
