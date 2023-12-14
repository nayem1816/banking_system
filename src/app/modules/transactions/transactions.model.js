const mongoose = require("mongoose");

const transactionSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: [true, "User is required"],
    },
    investId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Invest",
      required: [true, "Investment is required"],
    },
    amount: {
      type: Number,
      required: [true, "Amount is required"],
    },
    transactionId: {
      type: String,
      unique: true,
      required: [true, "Transaction Id is required"],
    },
  },
  { timestamps: true, versionKey: false }
);

const Transaction = mongoose.model("Transaction", transactionSchema);

module.exports = Transaction;
