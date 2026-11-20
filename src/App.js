import express from "express";
import { authorController } from "./modules/author/index.js";
import { connectDB } from "./DB/db.js";
import { globalErrorHandling } from "./middleware/index.js";
import { ORIGINS, PORT } from "./config.js";
import { userController } from "./modules/user/index.js";
import { messageController } from "./modules/message/index.js";

import cors from "cors";
import helmet  from "helmet";
import { denerateLimiter } from "./common/utils/limiter.js";
import morgan from "morgan";

const app = express();
// Database & Redis Connections
await connectDB(app, PORT);

// var corsOptions = {
//   origin: ['http://localhost:3000', 'http://localhost:3001', 'http://localhost:3002'],
//   optionsSuccessStatus: 200 // some legacy browsers (IE11, various SmartTVs) choke on 204
// }
var corsOptions = {
  origin: function (origin, callback) {
    if (!ORIGINS.includes(origin)) {
      callback(new Error ("unauthorized origin",{cause:{status: 401}}) , ORIGINS)
    }
  else{
    callback(null ,ORIGINS)
  }
}
} 


const limiter =denerateLimiter({})

app.set("trust proxy", true)
//login-With Google drive
app.use(cors());
//level-middleware
app.use(cors(),helmet(),morgan("dev") ,limiter, express.json());
//multer- imge
app.use("/assets", express.static("./assets"));
//routing
app.all("/", async (req, res, next) => res.status(200).send({massage: "Welcom to Be API"}) )


app.use("/auth",authorController);
app.use("/message", messageController);
app.use(userController);

app.all("{/*dummy}", (req, res, next) => {
  return res.status(404).send({ message: "Invalid application routing" });
});
app.use(globalErrorHandling);



