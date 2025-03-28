import jwt from "jsonwebtoken";

const isAuthenticated = async (req, res, next) => {
    try {

    
        const token = req.cookies.token; // Get token from cookies

        if (!token) {
            return res.status(401).json({
                message: "User not authenticated",
                success: false,
            });
        }

        // Verify token
        const decoded = jwt.verify(token, process.env.SECRET_KEY);
        if (!decoded) {
            return res.status(401).json({
                message: "Invalid token",
                success: false,
            });
        }

        req.user = { id: decoded.userId }; 
        // console.log("token", req.user);
        // Corrected (req.user instead of req.id)
        next();
    } catch (error) {
        console.log(error);
        res.status(500).json({ message: "Internal Server Error" });
    }
};

export default isAuthenticated;
