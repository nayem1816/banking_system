const mongoose = require("mongoose");

const InvestDurationSchema = new mongoose.Schema(
  {
    month: {
      type: Number,
      required: [true, "Month is required"],
    },
    interestPercentage: {
      type: Number,
      required: [true, "Interest percentage is required"],
    },
    status: {
      type: String,
      required: [true, "Status is required"],
      enum: ["active", "inactive"],
      default: "active",
    },
  },
  { timestamps: true, versionKey: false }
);

const InvestDuration = mongoose.model("InvestDuration", InvestDurationSchema);

module.exports = InvestDuration;
