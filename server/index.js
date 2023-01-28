import dotenv from "dotenv";
import express from "express";
import cors from "cors";
import morgan from "morgan";

import connectDB from "./config/db.js";

import issueRoutes from "./api/issues.js";
import userRoutes from "./api/users.js";

//for accessing the .env file
dotenv.config();

const app = express();

//logging info of the requests
morgan.token("body", (req) => {
  JSON.stringify(req.body);
});
app.use(morgan("tiny"));

app.use(express.json({ limit: "10mb" }));
app.use(express.urlencoded({ extended: false }));

//connecting to mongoDB
connectDB();

app.use(cors({ origin: "*" }));

app.use("/issues", issueRoutes);
app.use("/users", userRoutes);

const PORT = process.env.PORT || 8000;

const server = app.listen(PORT, (err) => {
  const port = server.address().port;
  if (err) console.log("Error in server setup");
  console.log(`Server running on ${port}`);
});