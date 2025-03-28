import express from "express";
import cookieParser from "cookie-parser";
import dotenv from "dotenv";
import connectDB from "./utils/db.js";
import userRoute from "./routes/user.route.js";
import cors from 'cors';
 import path from 'path'
dotenv.config({});

const app = express();

 const _dirname = path.resolve();
// middleware





app.use(express.json());
app.use(express.urlencoded({extended:true}));
app.use(cookieParser());
const corsOptions = {
    origin:'https://binbag-assignment1.vercel.app',
    credentials:true
}

app.use(cors(corsOptions));

const PORT = process.env.PORT || 3000;



// api's
app.use("/api/user", userRoute);

app.use(express.static(path.join(_dirname, "/my-app/dist")));
app.get('*', (_ , res) => {
    res.sendFile(path.resolve(_dirname, "my-app", "dist", "index.html"));
})

app.listen(PORT,()=>{
    connectDB();
    console.log(`Server running at port ${PORT}`);
})
