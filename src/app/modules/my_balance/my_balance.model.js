const mongoose = require("mongoose");

const myBalanceSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: [true, "User is required"],
    },
    amount: {
      type: Number,
      required: [true, "Amount is required"],
    },
  },
  { timestamps: true, versionKey: false }
);

const MyBalance = mongoose.model("MyBalance", myBalanceSchema);

module.exports = MyBalance;
