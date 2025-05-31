const express = require("express");
const cors = require("cors"); /// helps with communication between front and back end
const app = express();
const mongoose = require("mongoose");
const userRoute = require("./Routes/userRoute");
const chatRoute = require("./Routes/chatRoute");
const messageRoute = require("./Routes/messageRoute");

require("dotenv").config();
app.use(express.json());
app.use(cors());
app.use("/api/users", userRoute);
app.use("/api/chats", chatRoute);
app.use("/api/messages", messageRoute);

app.get("/", (req, res) => {    
    res.send("Hello World...");
}  );

const port = process.env.PORT || 3000;
const uri = process.env.ATLAS_URI;

app.listen(port, (req,res) => {
  console.log(`server is running on port 3000... ${port}`);
});

mongoose.connect(uri, { useNewUrlParser: true, useUnifiedTopology: true }).then(() => { 
    console.log("MongoDB database connection established successfully");
}).catch(err => {
    console.log("connection to MongoDB failed",err);
}   );
