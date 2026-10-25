import express from "express";
const app = express();
import cors from "cors";
import { authorController } from "./modules/author/index.js";
import { connectDB } from "./DB/db.js";
import { globalErrorHandling } from "./middleware/index.js";
import { PORT } from "./config.js";
import { userController } from "./modules/user/index.js";
import { messageController } from "./modules/message/index.js";

// Database & Redis Connections
await connectDB(app, PORT);

//login-With Google drive
app.use(cors());
//level-middleware
app.use(cors(), express.json());
//multer- imge
app.use("/assets", express.static("./assets"));
//routing
app.all("/", async (req, res, next) => res.status(200).send({massage: "Welcom to Be API"}) )

app.use(authorController);
app.use(userController);
app.use(messageController);

app.all("{/*dummy}", (req, res, next) => {
  return res.status(404).send({ message: "Invalid application routing" });
});
app.use(globalErrorHandling);



