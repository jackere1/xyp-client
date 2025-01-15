import { otpRoutes } from "@route";
import { basicAuthHandler, jwtAuthHandler, winstonStream } from "@utils";
import express from "express";
import morgan from "morgan";

const app = express();

//Middlewares
app.use(
  express.json(),
  morgan((tokens, req, res) =>
    [
      tokens.method(req, res),
      tokens.url(req, res),
      tokens.status(req, res),
      "-",
      tokens["response-time"](req, res),
      "ms :",
      JSON.stringify(req.body)
    ].join(" "),
    { stream: winstonStream }),
  // jwtAuthHandler
  // basicAuthHandler
);

//Routes
app.use('/xyp', otpRoutes);

app.use("*", (req, res) => {
  res.status(404).json({ message: "NOT_FOUND" })
})

export default app;