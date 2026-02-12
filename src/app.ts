import express, { Application } from "express";
import cors from "cors";
import { toNodeHandler } from "better-auth/node";
import { auth } from "./lib/auth";
import router from "./route";
import { errorHandler } from "./middlewares/error.middleware";
const app: Application = express();
const allowedOrigins = ["http://localhost:3000", process.env.BETTER_AUTH_URL];
app.use(
  cors({
    origin: [
      "http://localhost:3000",
      process.env.BETTER_AUTH_URL || "http://localhost:5000",
    ],
    credentials: true,
  }),
);

app.all("/api/auth/*splat", toNodeHandler(auth));
app.use(express.json());
app.use(router);
app.use(errorHandler);

app.get("/", (req, res) => {
  res.send("hello world dddd");
});

export default app;
