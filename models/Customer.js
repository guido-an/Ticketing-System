const mongoose = require("mongoose");
const Schema   = mongoose.Schema;
const Ticket = require('../models/Ticket')

const customerSchema = new Schema({
  name: String,
  tickets: [{ type: mongoose.Schema.Types.ObjectId, ref: "Ticket" }],
  originalName: String
}, {
  timestamps: { createdAt: "created_at", updatedAt: "updated_at" }
});

const Customer = mongoose.model("Customer", customerSchema);
module.exports = Customer;


