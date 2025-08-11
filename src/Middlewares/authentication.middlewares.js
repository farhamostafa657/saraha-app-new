import { userModel } from "../DB/models/user.model.js";
import { verifyToken } from "../Utils/token.js";
import * as dbService from "../DB/dbService.js";

export const authentication = async (req, res, next) => {
  const { authorization } = req.headers;

  const [barear, token] = authorization.split(" ") || [];
  if (!barear || !token) {
    return next(new Error("Invalid token", { cause: 400 }));
  }

  let signature = { accessSignature: undefined, refreshSignature: undefined };
  switch (barear) {
    case "Admin":
      signature.accessSignature = process.env.ACCESS_ADMIN_SIGNATURE_TOKEN;
      signature.refreshSignature = process.env.REFRESH_ADMIN_SIGNATURE_TOKEN;
      break;
    default:
      signature.accessSignature = process.env.ACCESS_USER_SIGNATURE_TOKEN;
      signature.refreshSignature = process.env.REFRESH_USER_SIGNATURE_TOKEN;
      break;
  }

  const decoded = verifyToken(token, signature.accessSignature);
  const user = await dbService.findById({
    model: userModel,
    id: { _id: decoded._id },
  });

  if (!user) return next(new Error("User Not Found ", { cause: 404 }));

  req.user = user;

  return next();
};
