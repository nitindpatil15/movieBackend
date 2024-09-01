import User from "../models/User.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { asynchandler } from "../utils/asynchandler.js";
import { uploadOnCloudinary } from "../utils/cloudinary.js";

export const getAllUser = asynchandler(async (req, res) => {
  try {
    const users = await User.find({}).select("-password");
    console.log("Users: ", users);
    return res
      .status(200)
      .json(new ApiResponse(200, users, "Fetched all Users"));
  } catch (error) {
    throw new ApiError(500, error?.message || "Server error");
  }
});

export const updateuser = asynchandler(async (req, res) => {
  const { userId } = req.params;
  const { name, email, phone } = req.body;

  console.log("Received Data:", { userId, name, email, phone });

  // Validate required fields
  if (!userId || !name || !email || !phone) {
    throw new ApiError(400, "Please provide all required fields.");
  }

  try {
    let profile;
    if (req.file) {
      const avatarLocalpath = req.file.path;
      profile = await uploadOnCloudinary(avatarLocalpath);
      if (!profile) {
        throw new ApiError(500, "Failed to upload image to server.");
      }
    }

    const updatedData = {
      name,
      email,
      phone,
    };

    if (profile?.url) {
      updatedData.avatar = profile.url;
    }

    const userupdated = await User.findByIdAndUpdate(
      userId,
      { $set: updatedData },
      { new: true }
    ).select("-password");

    console.log("Updated User:", userupdated);

    return res
      .status(200)
      .json(new ApiResponse(200, userupdated, "User updated successfully."));
  } catch (error) {
    console.error("Update Error:", error);
    throw new ApiError(500, error?.message || "Server error");
  }
});

export const deleteUser = asynchandler(async (req, res) => {
  const { userId } = req.params;
  try {
    const userDeleted = await User.findByIdAndDelete(userId);
    if (!userDeleted) {
      throw new ApiError(404, "User Not Found");
    }
    return res
      .status(200)
      .json(new ApiResponse(200, userDeleted, "User Deleted Successfully"));
  } catch (error) {
    throw new ApiError(500, userDeleted, "User Deleted Successfully");
  }
});

export const getCurrentUser = asynchandler(async (req, res) => {
  const userId = req.user._id;
  try {
    const user = await User.findById(userId).select("-password");
    if (!user) {
      throw new ApiError(404, "User Not Found");
    }
    return res.status(200).json(new ApiResponse(200, user, "User Fetche"));
  } catch (error) {
    throw new ApiError(500, error?.message || "Server Error");
  }
});
