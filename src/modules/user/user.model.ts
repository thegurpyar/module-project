import mongoose from "mongoose";


const userSchema = new mongoose.Schema({
    full_name:{
        type:String,
        required:true,
    },
    otp:{
        type:String,
        default:"",
    },
    otpValidTill:{
        type:Date,
        default:Date.now() + 10 * 60 * 1000,
    },
    otpVerified:{
        type:Boolean,
        default:false,
    },
    number:{
        type:String,
    },
    status:{
        type:Number,
        default:1,
        enum:[1,2]  //1->active, 2->inactive
    },
    isDeleted:{
        type:Boolean,
        default:false,
    },
    passwordChangedAt:{
        type:Date,
        default:null,
    },
    role:{
        type:String,
        default:"user",
        enum:["user","agent","admin"]
    },
    email:{
        type:String,
        default:"",
    },
    password:{
        type:String,
    }
});

const user = mongoose.model("User",userSchema);

export default user;

export interface IUser {
    full_name: string;
    otp: string;
    otpVerified: boolean;
    number?: string;
    status: number;
    isDeleted: boolean;
    role: string;
    passwordChangedAt: Date | null;
}