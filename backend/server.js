const express=require("express");
const mongoose=require("mongoose");
const cors=require("cors");
const dotenv=require("dotenv");

dotenv.config();

const app=express();
app.use(cors({
  origin: "http://localhost:3000"
}));
app.use(express.json());
const taskroutes=require("./routes/tasks");
app.use("/api/tasks",taskroutes);

mongoose.connect(process.env.MONGO_URI)
  .then(() => {
    console.log("MongoDB connected");
    app.listen(4000, () => console.log("Server running on port 4000"));
  })
  .catch(err => console.log(err));