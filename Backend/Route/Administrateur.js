const express = require("express"); 
const router = express.Router();

const AdministrateurCTRL = require("../Controller/Administrateur");
// const { checkAdmin  } = require("../midlleware/Authentification");

// Connexion
router.post("/Login", AdministrateurCTRL.Login_post);
router.put("/ModifierMotDePasse/:id", AdministrateurCTRL.Modifiermdp);
router.post("/Logout",AdministrateurCTRL.Logout);

// CRUD
router.post("/Ajouter", AdministrateurCTRL.CreateAdministrateur);
router.get("/Afficher/:id", AdministrateurCTRL.AfficherAdministrateur);
router.put("/Modifier/:id",AdministrateurCTRL.UpateAdministrateur);
router.delete("/Supprimer/:id", AdministrateurCTRL.DeletAdministrateur);

// Autres Fonctions
router.put("/UpdateEtudiant/:id",  AdministrateurCTRL.ModifierEtudiant);
router.put("/UpdateEnseignant/:id", AdministrateurCTRL.ModifierEnseignant);

module.exports = router;
