import express, { Application } from "express";
import cors from "cors";

const app: Application = express();

app.use(
  cors({
    origin: process.env.BETTER_AUTH_URL,
    credentials: true,
  }),
);

app.use(express.json());

app.get("/", (req, res) => {
  res.send("hello world");
});

export default app;
