const jwt = require("jsonwebtoken");
const Administrateur = require("../Models/Administrateur");
const Enseignant = require("../Models/Enseignant");
const Etudiant = require("../Models/Etudiant");

const checkAdmin = (req, res, next) => {
  const token = req.cookies.jwt;



  if (token) {
    jwt.verify(token, "CLE_SECRET", async (err, decodedToken) => {
      if (err) {
        res.locals.admin = null;
        next();
      } else {
        let admin = await Administrateur.findById(decodedToken.id);
        res.locals.admin = admin;
        next();
      }
    });
  } else {
    res.locals.admin = null;
    return res.status(401).json({ message: "Accès non autorisé. Token manquant."});
  }
};

module.exports = { checkAdmin };
