import User from "../models/User.js";
import { ApiError } from "../utils/ApiError.js";
import { asynchandler } from "../utils/asynchandler.js";
import bcrypt from "bcryptjs";
import { generateToken } from "../utils/jwtUtils.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { uploadOnCloudinary } from "../utils/cloudinary.js";
import Theatre from "../models/Theater.js";

const registerUser = asynchandler(async (req, res) => {
  const { name, email, password, phone, gender } = req.body;
  if ([name, email, phone, password].some((field) => field?.trim() === "")) {
    throw new ApiError(400, "All Fields are Required");
  }

  try {
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      throw new ApiError(400, "Email already exists");
    }

    let avatarLocalpath;
    console.log("Avatar from req", req.file);
    if (req.file && req.file.path) {
      avatarLocalpath = req.file.path;
    }

    if (!avatarLocalpath) {
      throw new ApiError(400, "Avatar is Required");
    }

    // uploading Files on Cloudinary
    const profile = await uploadOnCloudinary(avatarLocalpath);
    if (!profile) {
      throw new ApiError(500, "Failed to Upload Image On Server");
    }

    const hashedPassword = await bcrypt.hash(password, 12);
    const newUser = new User({
      name,
      email,
      password: hashedPassword,
      avatar: profile?.url || "",
      role: "Customer",
      phone,
      gender,
    });
    await newUser.save();
    return res
      .status(201)
      .json(new ApiResponse(200, newUser, "User registered successfully"));
  } catch (error) {
    console.error("Error: ", error);
    throw new ApiError(500, "Registration Failed");
  }
});

const userLogin = asynchandler(async (req, res) => {
  const { email, password } = req.body;
  try {
    const user = await User.findOne({ email });
    if (!user) {
      throw new ApiError(401, "User not found");
    }
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      throw new ApiError(401, "Incorrect Password!!!");
    }

    const token = generateToken(user._id);
    return res
      .cookie("accessToken", token)
      .json(new ApiResponse(200, { user, token }, "Login successful"));
  } catch (error) {
    console.log("Error:", error);
    throw new ApiError("Login failed");
  }
});

const createAdmin = asynchandler(async (req, res) => {
  const { theatreId } = req.params;
  const { name, email, password, phone, gender } = req.body;

  console.log("Received data:", req.body); // Log received body

  try {
    console.log(req.body);
    if (!password) {
      throw new ApiError(400, "Password is required");
    }

    let avatarLocalpath;
    if (
      req.files &&
      Array.isArray(req.files.avatar) &&
      req.files.avatar.length > 0
    ) {
      avatarLocalpath = req.files.avatar[0].path;
    }

    // uploading Files on Cloudinary
    const profile = await uploadOnCloudinary(avatarLocalpath);

    const hashedPassword = await bcrypt.hash(password, 12);
    const newAdmin = new User({
      name,
      email,
      password: hashedPassword,
      avatar: profile,
      role: "Admin",
      gender,
      phone,
      theatre: theatreId,
    });
    await newAdmin.save();

    const theatre = await Theatre.findById(theatreId);
    theatre.owner = newAdmin._id;
    await theatre.save();

    return res
      .status(200)
      .json(new ApiResponse(200, newAdmin, "Admin created successfully..."));
  } catch (error) {
    console.error("Error for adminCreation: ", error);
    throw new ApiError(401, "Admin creation failed");
  }
});

const superAdminLogin = asynchandler(async (req, res) => {
  const { email, password } = req.body;

  // Find the user by email
  const superAdmin = await User.findOne({ email });

  if (!superAdmin) {
    return new ApiError(401, "Invalid Email");
  }

  // Check if the user has the role of superAdmin
  if (superAdmin.role !== "SuperAdmin") {
    return new ApiError(
      402,
      "Access denied. Only super admins are allowed to login."
    );
  }

  // Compare the provided password with the hashed password in the database
  const isValidPassword = await bcrypt.compare(password, superAdmin.password);

  if (!isValidPassword) {
    return new ApiError(403, "Invalid email or password");
  }

  const token = generateToken(superAdmin._id);
  return res
    .cookie("accessToken", token)
    .json(new ApiResponse(200, {superAdmin,token}, "Login successful"));
});

const AdminLogin = asynchandler(async (req, res) => {
  const { email, password } = req.body;

  // Find the user by email
  const Admin = await User.findOne({ email });

  if (!Admin) {
    throw new ApiError(401, "Invalid Email");
  }

  // Check if the user has the role of superAdmin
  if (Admin.role !== "Admin") {
    throw new ApiError(
      402,
      "Access denied. Only super admins are allowed to login."
    );
  }

  // Compare the provided password with the hashed password in the database
  const isValidPassword = await bcrypt.compare(password, Admin.password);

  if (!isValidPassword) {
    throw new ApiError(403, "Invalid email or password");
  }

  const token = generateToken(Admin._id);
  return res.status(200)
    .cookie("accessToken", token)
    .json(new ApiResponse(200, {Admin,token}, "Login successful"));
});

const logoutforAll = asynchandler(async (req, res) => {
  try {
    await User.findByIdAndUpdate(
      req.user._id,
      {
        $unset: {
          refreshToken: 1, // this removes the field from document
        },
      },
      {
        new: true,
      }
    );

    const options = {
      httpOnly: true,
    };

    return res
      .status(200)
      .clearCookie("accessToken", options)
      .json(new ApiResponse(200, {}, "User Logged Out Successfully"));
  } catch (error) {
    throw new ApiError(500, "Internal Server Error");
  }
});

export {
  registerUser,
  userLogin,
  createAdmin,
  superAdminLogin,
  AdminLogin,
  logoutforAll,
};
