import jwt from "jsonwebtoken";

export const verifyToken = async (req, res, next) => {
  try {
    let token = req.header("Authorization");

    if (!token) {
      return res.status(403).send("Access Denied: No token provided");
    }

    if (token.startsWith("Bearer ")) {
      token = token.slice(7, token.length).trimLeft();
    }

    const verified = jwt.verify(token, process.env.JWT_SECRET);
    if (!verified) {
      return res.status(403).send("Access Denied: Invalid token");
    }

    req.user = verified;
    next();
  } catch (err) {
    console.error("Token verification error:", err.message);
    res.status(500).json({ error: "Server Error" });
  }
};
