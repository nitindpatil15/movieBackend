import Ad from "../models/Ad.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { asynchandler } from "../utils/asynchandler.js";
import { uploadOnCloudinary } from "../utils/cloudinary.js";

export const addAds = asynchandler(async (req, res) => {
  try {
    const { title, description, link, targetAudience, impressions } =
      req.body;
    if (
      [title, description, link, targetAudience, impressions].some(
        (field) => field?.trim() === ""
      )
    ) {
      throw new ApiError(400, "Please fill all fields");
    }

    let AdImage;
    if (req.file && req.file.path) {
        AdImage = req.file.path;
    } else {
      throw new ApiError(400, "Ad Image is Required");
    }

    const Image = await uploadOnCloudinary(AdImage);
    if (!Image) {
      throw new ApiError(402, "Failed to upload movie image");
    }
    const ads = await Ad.create({
      title,
      description,
      imageUrl:Image?.url,
      link,
      targetAudience,
      impressions,
      advertiser: req.user,
    });
    const addedAd = await ads.save();

    return res
      .status(200)
      .json(new ApiResponse(200, addedAd, "Added Advertisement Successfully"));
  } catch (error) {
    throw new ApiError(500, `Server Error: ${error?.message}`);
  }
});

export const DeleteAd = asynchandler(async (req, res) => {
  const { adId } = req.params;
  try {
    const deletedAdvertise = await Ad.findByIdAndDelete(adId);
    if (!deletedAdvertise) {
      throw new ApiError(404, "Advertisement not found");
    }
    return res
      .status(200)
      .json(new ApiResponse(200, deletedAdvertise, "Advertisement deleted"));
  } catch (error) {
    throw new ApiError(500, `Server Error: ${error?.message}`);
  }
});

export const fetchAds = asynchandler(async(req,res)=>{
  try {
    const ads = await Ad.find({})
    if(!ads){
      throw new ApiError(402,"No Ads Available")
    }
    console.log(ads)
    return res.status(200).json(new ApiResponse(200,ads,"Ads Fetched"))
  } catch (error) {
    console.error(error?.message)
  }
})