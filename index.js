require("dotenv").config();
const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors");
const mongoose = require("mongoose");//library allows to connect to MongoDB 
const feedbackModel = require("./feedback-model");
const app = express();

app.use(bodyParser.json());
app.use(cors());

const port = process.env.PORT || 4001;
const mongodbUrl = 
  process.env.MONGODB_URL || "mongodb://localhost:27017/defaultDB";

  mongoose.connect(mongodbUrl,{
    useNewUrlParser: true,  //makes sure to be compatible with latest MongoDb
    useUnifiedTopology: true, //makes sure to be compatible with latest MongoDb
})
.then(() =>
   console.log("Connected to MongoDB"))
.catch((error) => console.error("MongoDB connection failed:", error));

//let feedbacks = [];

//GET all feedbacks
app.get("/feedbacks", async(req, res) =>{
    try{
        const feedbacks = await feedbackModel.find();
    res.status(200).json({success: true, data: feedbacks});
    }catch (error) {
        res  
           .status(500)
           .json({success: false, message: "Error occured",
              error: error.message
           });
  }
});

//POST
app.post("/feedbacks", async(req, res) =>{
    try{
        const feedback = new feedbackModel({
            name: req.body.name,
            email: req.body.email,
            message: req.body.message,
        })
        const savedfeedback = await feedback.save();
        res 
        .status(201)
        .json({success: true, message:"New Feedbacks added!!", data: savedfeedback});
    }catch(error){
       res
          .status(500)
          .json({success: false, message:"Error Occurred!", error: error.message});
    }
//    const{name, email, message} = req.body;
//    const currentDateTime = new Date();
//    if(!name || !email || !message){
//         return res
//             .status(400)
//             .json({success: false, message: "All fields required!"});
//    }

//    const newFeed = {
//        id: feedbacks.length + 1,
//        name,
//        email,
//        message,
//        currentDateTime
//    };

//     feedbacks.push(newFeed);
//    res 
//    .status(201)
//    .json({success: true, message:"New Feedbacks added!!", data: newFeed})
});

//Get feedbacks by ID
app.get("/feedbacks/:id", async(req,res) =>{
    try{
        const feedId = req.params.id;
        const feed =  await feedbackModel.findById(feedId);
        if(!feedId){
            return res 
              .status(404)
              .json({success: false, message:"Entered Feedbacks Not Found"});
        }
        res.json({success: true, message:"Feedback Retrieved successfully", data: feed});
    }catch(error){
        res
          .status(500)
          .json({success: false, message:"Error Occurred!", error: error.message});
    }
   
});
//DELETE Feedback by ID
app.delete("/feedbacks/:id", async(req, res) =>{
    try{
        const feedbackId = req.params.id;
        const deletedFeed = await feedbackModel.findByIdAndDelete(feedbackId);
        if(!deletedFeed){
            res
               .status(404)
               .json({success: false, message: "Entered feedback not found!"})
        }else{
            res
               .status(200)
               .json({success: true, message: "Feedback deleted successfully!!"})
        }
    }catch(error){
        res
        .status(500)
        .json({success: false, message:"Error Occurred!", error: error.message});
    }
    // const feedId = parseInt(req.params.id);
    // const feedIndex = feedbacks.findIndex((f) => f.id === feedId);
    // if(feedIndex === -1 ){
    //     return res
    //     .status(404)
    //     .json({success: false, message:"Entered Feedback Not Found"});
    // }
    // feedbacks.splice(feedIndex,1); 
    // res.json({success: true, message: "Feedback Deleted Successfully"});

  });
//start the server
//const PORT = 4001;
app.listen(port , ()=>{
   console.log(`Server is running on http://localhost:${port}`);

});