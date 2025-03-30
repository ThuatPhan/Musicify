import express from "express";
import bodyParser from "body-parser";
import path from "path";
import cors from "cors";
import { errorHandler } from "@src/middlewares/ErrorHandler";
import router from "@src/routes/AppRoutes";

const server = express();
const port = process.env.PORT || 3001;
server.use(
  cors({
    origin: ["http://localhost:5000"],
  })
);
export const uploadDir = path.join(__dirname, "public/uploads");

server.use("/uploads", express.static(uploadDir));
server.use(bodyParser.json());
server.use("/api", router);
server.use(errorHandler);
server.listen(port, () => {
  console.log(`🚀 Server is running on port ${port}`);
});
