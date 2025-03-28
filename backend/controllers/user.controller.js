import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { User } from "../models/user.model.js";

export const register = async (req, res) => {
    try {
        const { name, email, address,  password, bio, profile_pic } = req.body;
         
        if (!name || !email || !address || !password ) {
            return res.status(400).json({
                message: "Something is missing",
                success: false
            });
        };

        const user = await User.findOne({ email });
        if (user) {
            return res.status(400).json({
                message: 'User already exist with this email.',
                success: false,
            })
        }
        const hashedPassword = await bcrypt.hash(password, 10);

        await User.create({
            name,
            email,
            address,
            password: hashedPassword,
            bio,
            profile_pic
        });

        return res.status(201).json({
            message: "Account created successfully.",
            success: true
        });
    } catch (error) {
        console.log(error);
    }
}
export const login = async (req, res) => {
    try {
        const { email, password } = req.body;
        
        if (!email || !password) {
            return res.status(400).json({
                message: "Something is missing",
                success: false
            });
        }

        let user = await User.findOne({ email });
        if (!user) {
            return res.status(400).json({
                message: "Incorrect email or password.",
                success: false,
            });
        }

        const isPasswordMatch = await bcrypt.compare(password, user.password);
        if (!isPasswordMatch) {
            return res.status(400).json({
                message: "Incorrect email or password.",
                success: false,
            });
        }
        
        const tokenData = { userId: user._id };
        const token = jwt.sign(tokenData, process.env.SECRET_KEY, { expiresIn: '1d' });

        user = {
            _id: user._id,
            fullname: user.name,
            email: user.email,
            address: user.address,
            bio: user.bio,
            profile_pic: user.profile_pic
        };

        
        res.cookie("debug", "test_value", { maxAge: 60 * 1000, httpOnly: false, sameSite: "strict" }); // Test cookie
        res.cookie("token", token, { maxAge: 1 * 24 * 60 * 60 * 1000, httpOnly: false, sameSite: 'strict'});

        return res.status(200).json({
            message: `Welcome back ${user.fullname}`,
            user,
            success: true
        });
    } catch (error) {
        console.log("Login Error:", error);
        res.status(500).json({ message: "Internal Server Error", success: false });
    }
};

export const logout = async (req, res) => {
    try {
        return res.status(200).cookie("token", "", { maxAge: 0 }).json({
            message: "Logged out successfully.",
            success: true
        })
    } catch (error) {
        console.log(error);
    }
}
export const updateProfile = async (req, res) => {
    try {
        const { name, email,  bio, profile_pic } = req.body;

        // console.log("server req", req.body);
        const userId = req.user?.id; // middleware authentication

        // console.log("user id", userId);
        let user = await User.findById(userId);

        if (!user) {
            return res.status(400).json({
                message: "User not found.",
                success: false
            })
        }
        // updating data
        // console.log("user", name);
        user.name = name || user.name;
        user.email = email || user.email;
        user.bio = bio || user.bio;
        user.profile_pic = profile_pic || user.profile_pic;
        // if(password) {
        //     const hashedPassword = await bcrypt.hash(password, 10);
        //     user.password = hashedPassword
        // }
      

        await user.save();
        console.log("finally updated user saved");

        user = {
            _id: user._id,
            name: user.name,
            email: user.email,
            address: user.address,
            bio: user.bio,
            profile_pic: user.profile_pic
        }

        return res.status(200).json({
            message:"Profile updated successfully.",
            user,
            success:true
        })
    } catch (error) {
        console.log(error);
    }
}


export const getAllUsers = async (req, res) => {
    try {
        const users = await User.find({}, "name bio address profile_pic");
        
        return res.status(200).json({
            message: "Users fetched successfully.",
            users,
            success: true
        });
    } catch (error) {
        console.log(error);
        return res.status(500).json({
            message: "Internal server error.",
            success: false
        });
    }
};

export const getProfile = async (req, res) => {
    try {
      // Extract user ID from request (assuming authentication middleware adds it)
      const userId = req.user.id;
  
      // Fetch user data from database
      const user = await User.findById(userId).select("-password");
      
      
      
    //   console.log("user-bio", user.bio);
    //   console.log("pic", user.profile_pic)          // Exclude password from response
  
      if (!user) {
        return res.status(404).json({ message: "User not found" });
      }
  
      res.json(user);
    } catch (error) {
      console.error("Error fetching profile:", error);
      res.status(500).json({ message: "Internal Server Error" });
    }
  };


