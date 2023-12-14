const ApiError = require("../../../errors/apiError");
const { userSearchableFields } = require("./user.constant");
const User = require("./user.model");
const ReferralCode = require("../referral_code/referral_code.model");
const Group = require("../group/group.model");
const GroupMember = require("../group_member/group_member.model");
const { default: mongoose } = require("mongoose");
const UserInfo = require("../user_info/user_info.model");
const { paginationHelpers } = require("../../../helpers/paginationHelpers");
const { maxGroupMembers } = require("../../../constants/siteNeed");

const registerUserService = async (payload) => {
  const requiredFields = [
    "firstName",
    "lastName",
    "email",
    "password",
    "referCode",
  ];

  for (const field of requiredFields) {
    if (!payload[field]) {
      throw new ApiError(400, `Please provide ${field}`);
    }
  }

  const isExistReferCode = await ReferralCode.findOne({
    code: payload.referCode,
  });

  if (!isExistReferCode) {
    throw new ApiError(400, "This referral code is invalid.");
  }

  const findGroupId = await Group.findOne({
    groupAdmin: isExistReferCode.user,
  });
  if (!findGroupId) {
    throw new ApiError(400, "This referral code is invalid.");
  }

  const totalUserOfReferGroup = await GroupMember.countDocuments({
    group: findGroupId._id,
  });

  if (totalUserOfReferGroup >= maxGroupMembers) {
    throw new ApiError(
      400,
      `This referral code is already used ${maxGroupMembers} user.`
    );
  }

  // ------------------ generate referral code ------------------
  const generateReferralCode = async () => {
    const timestamp = Date.now();
    const randomNumber = Math.floor(100000 + Math.random() * 900000);

    const referralCode = `${timestamp}${randomNumber}`;

    const isExistCode = await ReferralCode.findOne({ code: referralCode });

    if (isExistCode) {
      return generateReferralCode();
    }

    return referralCode;
  };
  const myReferralCode = await generateReferralCode();

  // ------------------ save user data ------------------
  const saveUserData = {
    fullName: payload.firstName + " " + payload.lastName,
    email: payload.email,
    password: payload.password,
  };

  const session = await mongoose.startSession();

  try {
    session.startTransaction();

    // ------------------ create user ------------------
    const result = await User.create([saveUserData], { session });

    // create referral code for my self
    const saveReferralData = {
      user: result[0]._id,
      code: myReferralCode,
    };
    await ReferralCode.create([saveReferralData], {
      session,
    });

    // update refer code is used or not
    await ReferralCode.updateOne(
      { code: payload.referCode },
      { isUsed: true },
      { session }
    );

    // create group
    const saveGroupData = {
      groupAdmin: result[0]._id,
    };
    const groupResult = await Group.create([saveGroupData], { session });

    // create group member
    const saveGroupMemberData = {
      group: groupResult[0]._id,
      user: result[0]._id,
    };
    await GroupMember.create([saveGroupMemberData], { session });

    // new user add in refer user group
    const saveReferUserGroupMemberData = {
      group: findGroupId._id,
      user: result[0]._id,
    };

    await GroupMember.create([saveReferUserGroupMemberData], { session });
    await UserInfo.create([{ userId: result[0]._id }], { session });

    await session.commitTransaction();
    await session.endSession();

    return result;
  } catch (error) {
    await session.abortTransaction();
    await session.endSession();
    throw new ApiError(500, error.message);
  }
};

const registerUserByAdminService = async (payload, userId) => {
  const getReferId = await ReferralCode.findOne({ user: userId });

  if (!getReferId) {
    throw new ApiError(400, "This referral code is invalid.");
  }

  payload.referCode = getReferId.code;

  const requiredFields = [
    "firstName",
    "lastName",
    "email",
    "password",
    "referCode",
  ];

  for (const field of requiredFields) {
    if (!payload[field]) {
      throw new ApiError(400, `Please provide ${field}`);
    }
  }

  // const totalUserOfReferGroup = await GroupMember.countDocuments({
  //   group: payload.referCode,
  // });

  // if (totalUserOfReferGroup >= maxGroupMembers) {
  //   throw new ApiError(
  //     400,
  //     `This referral code is already used ${maxGroupMembers} user.`
  //   );
  // }

  const isExistReferCode = await ReferralCode.findOne({
    code: payload.referCode,
  });

  if (!isExistReferCode) {
    throw new ApiError(400, "This referral code is invalid.");
  }

  const findGroupId = await Group.findOne({
    groupAdmin: isExistReferCode.user,
  });
  if (!findGroupId) {
    throw new ApiError(400, "This referral code is invalid.");
  }

  const totalUserOfReferGroup = await GroupMember.countDocuments({
    group: findGroupId._id,
  });

  if (totalUserOfReferGroup >= maxGroupMembers) {
    throw new ApiError(
      400,
      `This referral code is already used ${maxGroupMembers} user.`
    );
  }

  // ------------------ generate referral code ------------------
  const generateReferralCode = async () => {
    const timestamp = Date.now();
    const randomNumber = Math.floor(100000 + Math.random() * 900000);

    const referralCode = `${timestamp}${randomNumber}`;

    const isExistCode = await ReferralCode.findOne({ code: referralCode });

    if (isExistCode) {
      return generateReferralCode();
    }

    return referralCode;
  };
  const myReferralCode = await generateReferralCode();

  // ------------------ save user data ------------------
  const saveUserData = {
    fullName: payload.firstName + " " + payload.lastName,
    email: payload.email,
    password: payload.password,
  };

  const session = await mongoose.startSession();

  try {
    session.startTransaction();

    // ------------------ create user ------------------
    const result = await User.create([saveUserData], { session });

    // create referral code for my self
    const saveReferralData = {
      user: result[0]._id,
      code: myReferralCode,
    };
    await ReferralCode.create([saveReferralData], {
      session,
    });

    // update refer code is used or not
    await ReferralCode.updateOne(
      { code: payload.referCode },
      { isUsed: true },
      { session }
    );

    // create group
    const saveGroupData = {
      groupAdmin: result[0]._id,
    };
    const groupResult = await Group.create([saveGroupData], { session });

    // create group member
    const saveGroupMemberData = {
      group: groupResult[0]._id,
      user: result[0]._id,
    };
    await GroupMember.create([saveGroupMemberData], { session });

    // new user add in refer user group
    const saveReferUserGroupMemberData = {
      group: findGroupId._id,
      user: result[0]._id,
    };
    await GroupMember.create([saveReferUserGroupMemberData], { session });
    await UserInfo.create([{ userId: result[0]._id }], { session });

    await session.commitTransaction();
    await session.endSession();

    return result;
  } catch (error) {
    await session.abortTransaction();
    await session.endSession();
    throw new ApiError(500, error.message);
  }
};

const registerAdminService = async (payload, userId) => {
  const getReferId = await ReferralCode.findOne({ user: userId });

  if (!getReferId) {
    throw new ApiError(400, "This referral code is invalid.");
  }

  payload.referCode = getReferId.code;

  const requiredFields = [
    "firstName",
    "lastName",
    "email",
    "password",
    "referCode",
  ];

  for (const field of requiredFields) {
    if (!payload[field]) {
      throw new ApiError(400, `Please provide ${field}`);
    }
  }

  const isExistReferCode = await ReferralCode.findOne({
    code: payload.referCode,
  });

  if (!isExistReferCode) {
    throw new ApiError(400, "This referral code is invalid.");
  }

  const findGroupId = await Group.findOne({
    groupAdmin: isExistReferCode.user,
  });
  if (!findGroupId) {
    throw new ApiError(400, "This referral code is invalid.");
  }

  // ------------------ generate referral code ------------------
  const generateReferralCode = async () => {
    const timestamp = Date.now();
    const randomNumber = Math.floor(100000 + Math.random() * 900000);

    const referralCode = `${timestamp}${randomNumber}`;

    const isExistCode = await ReferralCode.findOne({ code: referralCode });

    if (isExistCode) {
      return generateReferralCode();
    }

    return referralCode;
  };
  const myReferralCode = await generateReferralCode();

  // ------------------ save user data ------------------
  const saveUserData = {
    fullName: payload.firstName + " " + payload.lastName,
    email: payload.email,
    password: payload.password,
    role: "admin",
  };

  const session = await mongoose.startSession();

  try {
    session.startTransaction();

    // ------------------ create user ------------------
    const result = await User.create([saveUserData], { session });

    // create referral code for my self
    const saveReferralData = {
      user: result[0]._id,
      code: myReferralCode,
    };
    await ReferralCode.create([saveReferralData], {
      session,
    });

    // update refer code is used or not
    await ReferralCode.updateOne(
      { code: payload.referCode },
      { isUsed: true },
      { session }
    );

    // create group
    const saveGroupData = {
      groupAdmin: result[0]._id,
    };
    const groupResult = await Group.create([saveGroupData], { session });

    // create group member
    const saveGroupMemberData = {
      group: groupResult[0]._id,
      user: result[0]._id,
    };
    await GroupMember.create([saveGroupMemberData], { session });

    // new user add in refer user group
    const saveReferUserGroupMemberData = {
      group: findGroupId._id,
      user: result[0]._id,
    };
    await GroupMember.create([saveReferUserGroupMemberData], { session });
    await UserInfo.create([{ userId: result[0]._id }], { session });

    await session.commitTransaction();
    await session.endSession();

    return result;
  } catch (error) {
    await session.abortTransaction();
    await session.endSession();
    throw new ApiError(500, error.message);
  }
};

const registerSuperAdminService = async (payload) => {
  const requiredFields = ["firstName", "lastName", "email", "password", "role"];

  for (const field of requiredFields) {
    if (!payload[field]) {
      throw new ApiError(400, `Please provide ${field}`);
    }
  }

  // ------------------ generate referral code ------------------
  const generateReferralCode = async () => {
    const timestamp = Date.now();
    const randomNumber = Math.floor(100000 + Math.random() * 900000);

    const referralCode = `${timestamp}${randomNumber}`;

    const isExistCode = await ReferralCode.findOne({ code: referralCode });

    if (isExistCode) {
      return generateReferralCode();
    }

    return referralCode;
  };
  const myReferralCode = await generateReferralCode();

  // ------------------ save user data ------------------
  const saveUserData = {
    fullName: payload.firstName + " " + payload.lastName,
    email: payload.email,
    password: payload.password,
    role: payload.role,
  };

  const session = await mongoose.startSession();

  try {
    session.startTransaction();

    // ------------------ create user ------------------
    const result = await User.create([saveUserData], { session });

    // create referral code for my self
    const saveReferralData = {
      user: result[0]._id,
      code: myReferralCode,
    };
    await ReferralCode.create([saveReferralData], {
      session,
    });

    // create group
    const saveGroupData = {
      groupAdmin: result[0]._id,
    };
    const groupResult = await Group.create([saveGroupData], { session });

    // create group member
    const saveGroupMemberData = {
      group: groupResult[0]._id,
      user: result[0]._id,
    };
    await GroupMember.create([saveGroupMemberData], { session });
    await UserInfo.create([{ userId: result[0]._id }], { session });

    await session.commitTransaction();
    await session.endSession();

    return result;
  } catch (error) {
    await session.abortTransaction();
    await session.endSession();
    throw new ApiError(500, error.message);
  }
};

const getAllUsersService = async (filters, paginationOptions) => {
  const { searchTerm, ...filtersData } = filters;

  const { page, limit, skip, sortBy, sortOrder } =
    paginationHelpers.calculatePagination(paginationOptions);

  const aggregationPipeline = [];
  const matchStage = {};

  if (searchTerm) {
    const searchConditions = userSearchableFields.map((field) => ({
      [field]: {
        $regex: searchTerm,
        $options: "i",
      },
    }));

    matchStage.$or = searchConditions;
  }

  if (Object.keys(filtersData).length) {
    matchStage.$and = Object.entries(filtersData).map(([field, value]) => ({
      [field]: value,
    }));
  }

  if (Object.keys(matchStage).length > 0) {
    aggregationPipeline.push({ $match: matchStage });
  }

  // Sort Stage
  const sortConditions = {};

  // Dynamic sort needs fields to do sorting
  if (sortBy && sortOrder) {
    sortConditions[sortBy] = sortOrder;
  }

  // Add Sort Stage to Aggregation Pipeline
  if (Object.keys(sortConditions).length > 0) {
    aggregationPipeline.push({ $sort: sortConditions });
  }

  // Pagination Stage
  aggregationPipeline.push({ $skip: skip });
  aggregationPipeline.push({ $limit: limit });
  aggregationPipeline.push(
    {
      $project: {
        password: 0,
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
    }
    // {
    //   $project: {
    //     _id: 1,
    //     fullName: 1,
    //     email: 1,
    //     phone: 1,
    //     status: 1,
    //     role: 1,
    //     createdAt: 1,
    //     userInfo: 1,
    //   },
    // }
  );

  const result = await User.aggregate(aggregationPipeline);
  const total = await User.countDocuments(matchStage);

  return {
    meta: {
      page,
      limit,
      total,
    },
    data: result,
  };
};

const getMyRoleService = async (userId) => {
  const result = await User.findOne({ _id: userId }).select("role");

  return result;
};

module.exports = {
  registerUserService,
  registerUserByAdminService,
  registerAdminService,
  registerSuperAdminService,
  getAllUsersService,
  getMyRoleService,
};
