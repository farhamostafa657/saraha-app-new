import { userModel } from "../DB/models/user.model.js";
import { verifyToken } from "../Utils/token.js";
import * as dbService from "../DB/dbService.js";

export const authentication = async (req, resizeBy, next) => {
  const { authorization } = req.headers;
  const decoded = verifyToken(authorization);
  const user = await dbService.findById({
    model: userModel,
    id: { _id: decoded._id },
  });

  if (!user) return next(new Error("User Not Found ", { cause: 404 }));

  req.user = user;

  return next();
};
