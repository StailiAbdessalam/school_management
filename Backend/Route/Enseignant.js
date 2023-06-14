const express = require("express");
const router = express.Router();
const EnseignantCTRL = require("../Controller/Enseignant");


// Connexion 

router.post("/Logout", EnseignantCTRL.Logout); 
router.post("/Login", EnseignantCTRL.Login_post);
router.put("/UpdatePassword/:id", EnseignantCTRL.Modifiermdp); 

// CRUD

router.post("/Ajouter", EnseignantCTRL.CreateEnseignant);
router.get("/Afficher/:id", EnseignantCTRL.AfficherEnseignant);
router.put("/Update/:id", EnseignantCTRL.UpateEnseignant);
router.delete("/Supprimer/:id", EnseignantCTRL.DeletEnseignant);

// Autres fonction

router.get("/AffihcerTousEnseignant", EnseignantCTRL.ReadALL )
router.get("/GetStatistiqueEtudiant/:id", EnseignantCTRL.GetStat )





module.exports = router;