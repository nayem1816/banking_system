const ApiError = require("../../../errors/apiError");
const { default: mongoose } = require("mongoose");
const UserInfo = require("./user_info.model");
const User = require("../users/user.model");

const getMyInfoService = async (MyUserId) => {
  const result = await User.aggregate([
    {
      $match: {
        _id: new mongoose.Types.ObjectId(MyUserId),
      },
    },
    {
      $lookup: {
        from: "userinfos",
        localField: "_id",
        foreignField: "userId",
        as: "userInfo",
      },
    },
    {
      $unwind: {
        path: "$userInfo",
        preserveNullAndEmptyArrays: true,
      },
    },
    {
      $project: {
        _id: 0,
        userId: "$_id",
        fullName: 1,
        email: 1,
        role: 1,
        phone: "$userInfo.phone",
        nationalID: "$userInfo.nationalID",
        address: "$userInfo.address",
        userPhoto: "$userInfo.userPhoto",
        gender: "$userInfo.gender",
        emergencyContact: "$userInfo.emergencyContact",
        maritalStatus: "$userInfo.maritalStatus",
        birthDay: "$userInfo.birthDay",
        status: 1,
      },
    },
  ]);

  if (!result.length) {
    throw new ApiError(404, "User not found");
  }

  return result;
};

const updateMyInfoService = async (MyUserId, payload, userPhoto) => {
  const user = await User.findById(MyUserId);
  if (!user) {
    throw new ApiError(404, "User not found");
  }

  const userInfo = await UserInfo.findOne({ userId: MyUserId });
  if (!userInfo) {
    throw new ApiError(404, "User info not found");
  }

  const isExistPhone = await UserInfo.findOne({
    phone: payload.phone,
    userId: { $ne: MyUserId },
  });

  if (isExistPhone) {
    throw new ApiError(400, "Phone already exist");
  }

  const isExistNationalID = await UserInfo.findOne({
    nationalID: payload.nationalID,
    userId: { $ne: MyUserId },
  });

  if (isExistNationalID) {
    throw new ApiError(400, "National ID already exist");
  }

  const updateInfo = {};

  if (userPhoto?.url) {
    updateInfo.userPhoto = userPhoto;
  }
  if (payload.phone) {
    updateInfo.phone = payload.phone;
  }
  if (payload.nationalID) {
    updateInfo.nationalID = payload.nationalID;
  }
  if (payload.address) {
    updateInfo.address = payload.address;
  }
  if (payload.birthDay) {
    updateInfo.birthDay = payload.birthDay;
  }
  if (payload.emergencyContact) {
    updateInfo.emergencyContact = payload.emergencyContact;
  }
  if (payload.gender) {
    updateInfo.gender = payload.gender;
  }
  if (payload.maritalStatus) {
    updateInfo.maritalStatus = payload.maritalStatus;
  }

  const session = await mongoose.startSession();

  try {
    session.startTransaction();

    await User.findByIdAndUpdate(
      MyUserId,
      {
        fullName: payload.fullName,
      },
      { session }
    );

    const result = await UserInfo.findOneAndUpdate(
      { userId: MyUserId },
      updateInfo,
      { session, new: true }
    );

    await session.commitTransaction();
    await session.endSession();

    return result;
  } catch (error) {
    await session.abortTransaction();
    await session.endSession();
    throw new ApiError(500, error.message);
  }
};

module.exports = {
  getMyInfoService,
  updateMyInfoService,
};
