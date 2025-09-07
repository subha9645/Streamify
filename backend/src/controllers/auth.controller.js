import User from "../models/User.js";
import jwt from "jsonwebtoken";
import { upsertStreamUser } from "../lib/stream.js";
export async function signup(req, res) {
    const { email, password,fullName } = req.body;
    try{
    if(!email || !password || !fullName) {
        return res.status(400).json({ message: "Please fill all fields" }); 
    }
        if(password.length < 6) {
            return res.status(400).json({ message: "Password must be at least 6 characters" });
        }
        const emaailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if(!emaailRegex.test(email)) {
            return res.status(400).json({ message: "Invalid email format" });
        }
        const existingUser = await User.findOne({ email });
        if(existingUser) {
            return res.status(400).json({ message: "Email already exists" });
        }
        const idx=Math.floor(Math.random() * 100)+1;
        const randomAvatar = `https://avatar.iran.liara.run/public/${idx}.png`;
        const newUser = await User.create({
            fullName,
            email,
            password,
            profilePic: randomAvatar,
        });
        try {
           await upsertStreamUser({
            id: newUser._id.toString(),
            name: newUser.fullName,
            image: newUser.profilePic || "",
        }) ;
        console.log("Stream user upserted successfully");
        } catch (error) {
          console.error("Error upserting Stream user:", error);  
        }
        
        const token = jwt.sign({ userId: newUser._id }, process.env.JWT_SECRET, {
expiresIn: "30d",
        });
        res.cookie("jwt",token, {
            httpOnly: true,
            sameSite: "strict",
            secure: process.env.NODE_ENV === "production",
            maxAge: 30 * 24 * 60 * 60 * 1000, // 30 days
        });
        res.status(201).json({success: true, user: newUser}); 
    } catch (error) {
  console.log("Error during signup:", error);
        res.status(500).json({ message: "Internal server error" });
    }
}
export async function login(req, res) {
   try{
 const { email, password } = req.body;
        if(!email || !password) {
            return res.status(400).json({ message: "Please fill all fields" });
        }
        const user = await User.findOne({ email });
        if(!user) {
            return res.status(400).json({ message: "Invalid email or password found" });
        }
        const isPasswordValid = await user.comparePassword(password);
        if(!isPasswordValid) {
            return res.status(400).json({ message: "Invalid email or password" });
        }
        const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET, {
expiresIn: "30d",
        });
        res.cookie("jwt",token, {
            httpOnly: true,
            sameSite: "strict",
            secure: process.env.NODE_ENV === "production",
            maxAge: 30 * 24 * 60 * 60 * 1000, // 30 days
        });
        res.status(200).json({ success: true, user });
   } catch (error) {
console.log("Error in controller:", error.message);
        res.status(500).json({ message: "Internal server error" });
   }


}
export async function logout(req, res) {
    res.clearCookie("jwt") 
    res.status(200).json({success:true, message: "Logged out successfully" });
         
}
export async function onboarding(req, res) {
    
    try {
    const userId = req.user._id;

    const { fullName, bio, nativeLanguage, learningLanguage, location } = req.body;

    if (!fullName || !bio || !nativeLanguage || !learningLanguage || !location) {
      return res.status(400).json({
        message: "All fields are required",
        missingFields: [
          !fullName && "fullName",
          !bio && "bio",
          !nativeLanguage && "nativeLanguage",
          !learningLanguage && "learningLanguage",
          !location && "location",
        ].filter(Boolean),
      });
    }

    const updatedUser = await User.findByIdAndUpdate(
      userId,
      {
          fullName,
    bio,
    nativeLanguage,
    learningLanguage,
    location,
        isOnboarded: true,
      },
      { new: true }
    );

    if (!updatedUser) return res.status(404).json({ message: "User not found" });

    try {
      await upsertStreamUser({
        id: updatedUser._id.toString(),
        name: updatedUser.fullName,
        image: updatedUser.profilePic || "",
      });
      console.log(`Stream user updated after onboarding for ${updatedUser.fullName}`);
    } catch (streamError) {
      console.log("Error updating Stream user during onboarding:", streamError.message);
    }

    res.status(200).json({ success: true, user: updatedUser });
  } catch (error) {
    console.error("Onboarding error:", error);
    res.status(500).json({ message: "Internal Server Error" });
  }
}