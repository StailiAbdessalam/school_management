const express = require("express");
const router = express.Router();

const EnseignantCTRL = require("../Controller/Projet");


// CRUD
router.post("/AjouterProjet/:id", EnseignantCTRL.CreateProjet);
router.get("/AfficherAllProjet", EnseignantCTRL.AfficherAll)
router.delete("/Supprimer/:id", EnseignantCTRL.DeletProjet)
router.put("/Update/:id", EnseignantCTRL.UpdateProjet)

// Autres fonction
router.get("/ProjetDetails/:id", EnseignantCTRL.ProjetDetails)
router.put("/AjouterCompetence/:id", EnseignantCTRL.AjouterCompetence)



module.exports = router;