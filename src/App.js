import express from "express";
const app = express();
import cors from "cors";
import { authorController } from "./modules/author/index.js";
import { connectDB } from "./DB/db.js";
import { globalErrorHandling } from "./middleware/index.js";
import { PORT } from "./config.js";
import { userController } from "./modules/user/index.js";
import { messageController } from "./modules/message/index.js";


//DB connection
await connectDB(app, PORT);
//login-With Google drive
app.use(cors())
//level-middleware
app.use(cors(), express.json());
//routing
app.get("/", async (req, res, next) => {
  return res.json({ message: "welcome to my API" });
});


app.use(authorController);  
app.use(userController);     
app.use(messageController);     

app.all("{/*dummy}", (req, res, next) => {
  return res.status(404).json({ message: "Invalid application routing" });
});
app.use(globalErrorHandling);



