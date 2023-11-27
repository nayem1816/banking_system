const mongoose = require("mongoose");
const validator = require("validator");

const userInfoSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: [true, "User is required"],
    },
    userPhoto: {
      url: {
        type: String,
        trim: true,
        validate: {
          validator: function (v) {
            return validator.isURL(v);
          },
        },
      },
      fileName: {
        type: String,
      },
      public_id: {
        type: String,
      },
      type: {
        type: String,
      },
      size: {
        type: Number,
      },
    },
    phone: {
      type: String,
      trim: true,
      unique: true,
      validate: {
        validator: function (v) {
          return /\+?(88)?0?1[3456789][0-9]{8}\b/.test(v);
        },
      },
    },
    nationalID: {
      type: String,
      trim: true,
      unique: true,
      validate: {
        validator: function (v) {
          return /\d{10,17}/.test(v);
        },
      },
    },
    address: {
      type: String,
      trim: true,
    },
    gender: {
      type: String,
      trim: true,
    },
    emergencyContact: {
      type: String,
      trim: true,
      validate: {
        validator: function (v) {
          return /\+?(88)?0?1[3456789][0-9]{8}\b/.test(v);
        },
      },
    },
    maritalStatus: {
      type: String,
      trim: true,
    },
    birthDay: {
      type: Date,
    },
  },
  { timestamps: true, versionKey: false }
);

const UserInfo = mongoose.model("UserInfo", userInfoSchema);

module.exports = UserInfo;
