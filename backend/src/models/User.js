import mongoose from "mongoose";
import bcrypt from "bcryptjs";
const userSchema = new mongoose.Schema({
    fullName: {
        type: String,
        required: true,
    },
    email: {
        type: String,
        required: true,
        unique: true,
    },
    password: {
        type: String,
        required: true,
        minlength: 6,
    },
    bio: {
        type: String,
        default: "",
    },
    profilePic: {
        type: String,
        default: "",
    },
    nativeLanguage: {
        type: String,
        default: "",
    },
    learningLanguage: {
        type: String,
        default: "",
    },
    location: {
        type: String,
        default: "",
    },
    isOnboarded: {
        type: Boolean,
        default: false,
    },
    friends: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
    }],

},{timestamps:true});
userSchema.pre("save", async function (next) {
    if(!this.isModified("password")) {
        return next();
    }
    try{
        const salt= await bcrypt.genSalt(10);
        this.password = await bcrypt.hash(this.password, salt);
        next();
    }catch (error) {
        next(error);
    }
});

userSchema.methods.comparePassword = async function (password) {
    try{
        return await bcrypt.compare(password, this.password);
    }catch (error) {
        throw new Error("Password comparison failed");
    }
};

const User = mongoose.model("User", userSchema);

//pre hook


export default User;
