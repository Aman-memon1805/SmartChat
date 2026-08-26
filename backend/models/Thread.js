import { Type } from "@google/genai";
import mongoose from "mongoose";
import User from "./User.js";

const Schema = mongoose.Schema;

const MessageSchema = new Schema({
    role : {
        type : String,
        enum : [ "user" , "assistant" ],
        required : true,
    },

    content : {
        type : String,
        required : true,
    },
    timestamp : {
        type : Date,
        default : Date.now(),
    }
});


const ThreadSchema = new Schema({
    threadId : {
        type: String,
        required : true,
        unique : true,
    },

    user: {
        type: Schema.Types.ObjectId,
        ref: User,
        required: true,
    },

    title : {
        type : String,
        default : 'New chat',
    },

    messages : [MessageSchema],

    createdAt : {
        type : Date,
        default : Date.now(),
    },
    updatedAt : {
        type : Date,
        default : Date.now(),
    }
});

export default mongoose.model("Thread",ThreadSchema);