const User = require("../models/User");
const jwt = require("jsonwebtoken");

const isAuth = async (req, res, next) => {
  try {
    //verification de configuration de l'environnement
    if (!process.env.JWT_SECRET) {
      return res.status(500).json({
        success: false,
        errors: [{ message: "JWT_SECRET is not configured in environment variables" }],
        });
    }
    //recuperation du token depuis les cookies (req.cookies.token is provided by cookie-parser middleware)
    const token = req.cookies.token;

    if (!token) {
        return  res.status(401).json({  
            success: false,
            errors: [{ message: "No token provided." }],
        });
    }

    // verifier le token et decodage
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    /// verifier si l'utilisateur existe
    const foundUser = await User.findById(decoded.userId).populate('role');
    if (!foundUser) {
        return res.status(404).json({
            success: false,
            errors: [{ message: "Invalid token. User does not exist." }],
        });
    }
    // ajouter les informations de l'utilisateur a la requete
    req.user = {
        id: foundUser._id,
        role: foundUser.role.titre,
    };
    next();
  } catch (error) {
    return res.status(500).json({
        success: false,
        errors: [{ message: "Server error" }],
    });
    }   
};

module.exports = isAuth;