const express = require("express");
const router = express.Router();

const EtudiantCTRL = require("../Controller/Etudiant");
const checkUser = require("../midlleware/Authentification");

// Connexion 
router.post("/Login", EtudiantCTRL.Login_post);
router.post("/Logout", EtudiantCTRL.Logout);
router.put("/ModifierMotDePasse/:id", EtudiantCTRL.Modifiermdp);

// CRUD
router.post("/Ajouter", EtudiantCTRL.CreateEtudiant);
router.put("/Update/:id", EtudiantCTRL.UpateEtudiant);  
router.get("/Afficher/:id", EtudiantCTRL.AfficherEtudiant);
router.delete("/Supprimer/:id", EtudiantCTRL.DeletEtudiant);
router.get("/AfficherAllEtudiant", EtudiantCTRL.ReadALLStudent);


// Autres fonction
router.get("/AfficherProjetInscrit/:id", EtudiantCTRL.AfficherProjetInscrit);
router.put("/Inscrire/:id", EtudiantCTRL.InscrireProjet);
router.put("/Desinscrire/:id", EtudiantCTRL.DesinscrireProjet);

router.put("/Favoris/:id", EtudiantCTRL.Favourite);
router.put("/FavorisNote/:id", EtudiantCTRL.FavouriteNot);  
router.put("/CompetenceUpdate/:id", EtudiantCTRL.ProgrsseCompetence);  












module.exports = router;