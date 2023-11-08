import crypto from "crypto";
import httpStatus from "http-status";

import asyncHandler from "../../middlewares/async";
import config from "../../config/config";
import emailService from "../../utils/sendEmail";
import ErrorResponse from "../../utils/errorResponse";
import { getGoogleUserData } from "../../utils/helpers";
import sendSessionResponse from "../helpers/sendSessionResponse";
import User from "../../models/User";

// @desc      Register user
// @route     POST /api/v1/auth/register
// @access    Public
const register = asyncHandler(async (req, res, next) => {
  const { firstName, lastName, email, password } = req.body;
  if (email && (await User.findOne({ email }))) {
    return res.status(httpStatus.CONFLICT).json({
      success: false,
      errors: ["An account with that email address already exists"],
    });
  }

  const user = await User.create({
    firstName,
    lastName,
    email,
    password,
  });

  sendSessionResponse(user, httpStatus.OK, res, false);
});

// @desc      Update user details
// @route     PUT /api/v1/auth/me
// @access    Private
const updateDetails = asyncHandler(async (req, res) => {
  const { firstName, lastName } = req.body;

  const user = await User.findByIdAndUpdate(
    req.user.id,
    { firstName, lastName },
    {
      new: true,
      runValidators: true,
    },
  );

  res.status(httpStatus.OK).json({
    success: true,
    data: user,
  });
});


export {  register, updateDetails };
