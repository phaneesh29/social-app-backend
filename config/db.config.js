import mongoose from "mongoose";

function connectToDB(){
    mongoose.connect(process.env.MONGO_URI).then(()=>{
        console.log("Connected To DB")
    }).catch((err)=>{
        console.log("Invalid Connection ",err)
    })
}

export default connectToDB