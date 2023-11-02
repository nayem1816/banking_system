const mongoose = require("mongoose");

const groupSchema = new mongoose.Schema(
  {
    groupAdmin: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: [true, "Group admin is required"],
    },
    groupName: {
      type: String,
      default: null,
    },
    status: {
      type: String,
      enum: ["active", "inactive"],
      default: "active",
    },
  },
  { timestamps: true, versionKey: false }
);

const Group = mongoose.model("Group", groupSchema);

module.exports = Group;
