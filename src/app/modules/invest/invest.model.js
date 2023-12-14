const mongoose = require("mongoose");

const InvestSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: [true, "User is required"],
    },
    group: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Group",
      required: [true, "Group is required"],
    },
    investDuration: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "InvestDuration",
      required: [true, "Invest Duration is required"],
    },
    amount: {
      type: Number,
      required: [true, "Amount is required"],
    },
    transactionId: {
      type: String,
      required: [true, "Transaction Id is required"],
      unique: true,
    },
    provider: {
      type: String,
      required: [true, "Provider is required"],
      enum: ["bkash", "nagad", "rocket"],
    },
    status: {
      type: String,
      required: [true, "Status is required"],
      enum: ["pending", "approved", "rejected"],
      default: "pending",
    },
    approvedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
    startDate: {
      type: Date,
    },
    endDate: {
      type: Date,
    },
  },
  { timestamps: true, versionKey: false }
);

const Invest = mongoose.model("Invest", InvestSchema);

module.exports = Invest;
