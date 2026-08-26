import dotenv from "dotenv";
dotenv.config();
import express from "express";
const app = express();
import cors from "cors";
import mongoose from 'mongoose';
import ChatsRouter from './routes/chat.js';
import authRouter from './routes/auth.js';
import dns from 'dns';
dns.setServers(['8.8.8.8', '8.8.4.4']);

const port = process.env.PORT || 3000;;

app.use(express.json());
app.use(cors());

mongoose.connect(process.env.MONGODB_URL)
  .then(() => console.log('Connected!'));

app.use("/chat",ChatsRouter); 
app.use("/auth", authRouter);   

app.get("/",(req,res)=>{
    res.send("Hi , this is SmartChat");
});

app.listen(port,()=>{
    console.log("Server is litening on : ",port);
});

