import jwt from "jsonwebtoken";

const isAuthenticated = async (req, res, next) => {
  try {
    console.log("Cookies received:", req.cookies); // ✅ Debugging cookies
    const token = req.cookies?.token;

    if (!token) {
      console.log("❌ No token found in cookies");
      return res.status(401).json({ message: "Unauthorized: Token missing.", success: false });
    }

    const decoded = jwt.verify(token, process.env.SECRET_KEY);
    console.log("Decoded Token:", decoded); // ✅ Debugging token payload

    if (!decoded || !decoded.userId) {
      console.log("❌ Token decoding failed or userId missing");
      return res.status(401).json({ message: "Unauthorized: Invalid token.", success: false });
    }

    req.user = { id: decoded.userId }; // ✅ Attach user object with ID
    console.log("✅ User authenticated:", req.user); // ✅ Debugging user object

    next();
  } catch (error) {
    console.error("Auth Error:", error);
    return res.status(401).json({ message: "Invalid token", success: false });
  }
};

export default isAuthenticated;
