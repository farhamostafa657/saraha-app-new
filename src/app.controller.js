import authRouter from "./Modules/Auth/auth.controller.js";
import userRouter from "./Modules/Users/users.controller.js";
import messageRouter from "./Modules/Messages/message.controller.js";
import connectDB from "./DB/connection.js";

export const bootstrap = async (app, express) => {
  app.use(express.json());

  await connectDB();

  app.use("/api/auth", authRouter);
  app.use("/api/user", userRouter);
  app.use("/api/message", messageRouter);

  app.all("/*dummy", (req, res, next) => {
    return res.status(400).json({ message: "Not Found Handler" });
  });

  app.use((err, req, res, next) => {
    const status = err.cause || 500;
    return res.status(status).json({
      message: "Somthing Went Wrong",
      error: err.message,
      stack: err.stack,
    });
  });
};
