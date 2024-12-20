import { asynchandler } from "../utils/asynchandler.js";
import { ApiError } from "../utils/ApiError.js"
import { Prof } from "../models/professional.model.js"
import { uploadOnCloudinary } from "../utils/cloudinary.js"
import { ApiResponse } from "../utils/ApiResponse.js";

const registerProfessional = asynchandler(async (req, res) => {
    // get user details from frontend
    // validation - not empty
    // check if user already exists: username, email
    // check for images, check for avatar
    // upload them to cloudinary, avatar
    // create user object - create entry in db
    // remove password and refresh token field from response
    // check for user creation
    // return res


    const { fullName, email, phoneNumber, username, profilePicture, yearsOfExperience, graduationYear, collegeName, currentCompany } = req.body
    //console.log("email: ", email);

    if (
        [fullName, email, phoneNumber, username, profilePicture, yearsOfExperience, graduationYear, collegeName, currentCompany].some(field => !field || (typeof field === "string" && field.trim() === ""))
    ) {
        throw new ApiError(400, "All fields are required")
    }

    const existedUser = await Prof.findOne({
        $or: [{ username }, { email }]
    })

    if (existedUser) {
        throw new ApiError(409, "User with email or username already exists")
    }
    //console.log(req.files);

    const profileLocalPath = await req.files?.profilePicture[0]?.path;
    //const coverImageLocalPath = req.files?.coverImage[0]?.path;

  


    if (!profileLocalPath) {
        throw new ApiError(400, "Profile picture is required")
    }

    const profile = await uploadOnCloudinary(profileLocalPath)

    if (!profile) {
        throw new ApiError(400, "Profile file is required")
    }


    const user = await Prof.create({
        fullName,
        profilePicture: profile.url,
        email,
        yearsOfExperience,
        phoneNumber,
        graduationYear,
        collegeName,
        currentCompany,
        username: username.toLowerCase()
    })

    const createdUser = await Prof.findById(user._id).select(
       
    )

    if (!createdUser) {
        throw new ApiError(500, "Something went wrong while registering the user")
    }

    return res.status(201).json(
        new ApiResponse(200, createdUser, "User registered Successfully")
    )

})


export {
    registerProfessional,
}