const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const User = require('../models/User')

const ticketSchema = new Schema(
  {
    status: String,
    title: { type: String, required: true },
    message: { type: String, required: true },
    user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    answers: Array
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
