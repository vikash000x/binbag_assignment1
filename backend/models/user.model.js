import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true,
        unique: true
    },
    address:{
        type:String,
        required:true
    },
   
    password:{
        type:String,
        required:true,
    },
    bio:{
        type:String,
        
    },
    profile_pic:{
        type:String,
        
    },
   
   
},{timestamps:true});
export const User = mongoose.model('User', userSchema);