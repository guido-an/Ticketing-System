const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const User = require('../models/User')
const Customer = require('../models/Customer')

const ticketSchema = new Schema(
  {
    status: String,
    author: String,
    title: { type: String, required: true },
    message: { type: String, required: true },
    active: Boolean,
    user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    customer: { type: mongoose.Schema.Types.ObjectId, ref: "Customer", required: true },
    answers: Array,
    time: String,
    picture: Object
  },
  {
    timestamps: {
      createdAt: "created_at",
      updatedAt: "updated_at"
    }
  }
) 

const Ticket = mongoose.model("Ticket", ticketSchema);
module.exports = Ticket;

// var myTicket = new Ticket({
//   title: "title",
//   message: "message",
//   user: "5d2c7791d3194e24321bdf5f"
// })
// myTicket.save()






