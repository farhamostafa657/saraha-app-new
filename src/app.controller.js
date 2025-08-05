import authRouter from "./Modules/Auth/auth.controller.js";
import userRouter from "./Modules/Users/users.controller.js";
import messageRouter from "./Modules/Messages/message.controller.js";
import connectDB from "./DB/connection.js";
import { globalErrorHandling } from "./Utils/globalErrorHandling.js";

export const bootstrap = async (app, express) => {
  app.use(express.json());

  await connectDB();

  app.use("/api/auth", authRouter);
  app.use("/api/user", userRouter);
  app.use("/api/message", messageRouter);

  app.all("/*dummy", (req, res, next) => {
    return next(new Error("Not Found Handler ", { cause: 404 }));
  });

  app.use(globalErrorHandling);
};
