import express from 'express';
import Thread from '../models/Thread.js';
const router = express.Router();
import apiResponse from '../utils/groq.js';
import authMiddleware from "../authMiddleware.js";

// to get all threads (chats)
router.get("/thread",authMiddleware, async (req,res)=>{
    try {
        const threads = await Thread.find({user: req.user.userId}).sort({updatedAt : -1});
        res.json(threads);
    } catch (error) {
        console.log(error);
        res.status(500).json({error : "Failed to load!"});
    }
});

// to get specific thread
router.get("/thread/:threadId", authMiddleware, async (req,res)=>{
    try {
        let {threadId} = req.params;
        const thread = await Thread.findOne({threadId , user: req.user.userId});

        if(!thread){
            res.status(500).json({error : "Thread not found!"});
        }

        // console.log(thread);
        res.json(thread.messages);
    } catch (error) {
        console.log(error);
        res.status(500).json({error : "Failed to load!"});
    }
});

// delete thread
router.delete("/thread/:threadId" , authMiddleware, async (req,res)=>{
    try {
        let {threadId} = req.params;

        let deletedThread = await Thread.findOneAndDelete({threadId , user: req.user.userId});

        if(!deletedThread){
            res.status(404).json({error : "No thread found to delete!"});
        }

        console.log("Deleted sucessfully",deletedThread);
        res.json(deletedThread);
    } catch (error) {
        console.log(error);
        res.status(500).json({error : "Failed to delete!"});
    }
});

// to post thread
router.post("/chat",authMiddleware, async (req,res)=>{
    let {threadId , message} = req.body;

    if(!threadId || !message){
        res.status(400).json({error : "Missing required fields!"});
    }

    try {
        let thread = await Thread.findOne({threadId , user: req.user.userId});
        if(!thread){
            // create a new thread in DB
            thread = new Thread({
                threadId : threadId,
                title : message,
                messages : [
                    {
                        role : 'user',
                        content : message,
                    },
                ],
                user: req.user.userId,
            });
        }else {
            // update in existing thread
            thread.messages.push({role : "user" , content : message });
        }

        let aiMessage = await apiResponse(message);
        thread.messages.push({role : "assistant" , content : aiMessage });
        thread.updatedAt = new Date();

        await thread.save();
        res.json({reply : aiMessage});

    } catch (error) {
        console.log(error);
        res.status(500).json({error : "Failed to load!"});
    }
});

export default router;