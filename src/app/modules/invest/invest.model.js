const mongoose = require("mongoose");

const referralCodeSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: [true, "User is required"],
    },
    code: {
      type: Number,
      required: [true, "Code is required"],
      trim: true,
      unique: true,
    },
    isUsed: {
      type: Boolean,
      default: false,
    },
    status: {
      type: String,
      enum: ["active", "inactive"],
      default: "active",
    },
  },
  { timestamps: true, versionKey: false }
);

const ReferralCode = mongoose.model("ReferralCode", referralCodeSchema);

module.exports = ReferralCode;
