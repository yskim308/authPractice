import express from "express";
import jwt from "jsonwebtoken";
import type { JwtPayload } from "jsonwebtoken";
import cors from "cors";

const app = express();
app.use(express.json());
app.use(cors());

// should be the middleware
interface CustomRequest extends express.Request {
  user?: JwtPayload | { [key: string]: any }; // Allow any type for user
}
function verifyToken(
  req: CustomRequest,
  res: express.Response,
  next: express.NextFunction,
) {
  const token = req.headers.authorization?.split(" ")[1]; // extract jwt

  if (!token) {
    return res.status(401).send("Unathorized: no token provided");
  }
  if (!process.env.JWT_SECRET) {
    return res.status(401).send("no jwt secret env detected");
  }

  jwt.verify(token, process.env.JWT_SECRET, (err, decoded) => {
    if (err) {
      return res.status(401).send("Unathorized: invalid token");
    }
    req.user = decoded as JwtPayload;
    next();
  });
}

app.get(
  "/protected",
  verifyToken as (
    req: express.Request,
    res: express.Response,
    next: express.NextFunction,
  ) => void,
  (req: express.Request, res: express.Response) => {
    const customReq = req as CustomRequest;
    res.json({ message: "protected endpoint accessed", user: customReq.user });
  },
);

app.listen(4000, () => {
  console.log("listening on port 4000");
});
