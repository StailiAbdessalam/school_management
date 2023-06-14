const Projet = require("../Models/Projet");
const Enseignant = require("../Models/Enseignant");
const Etudiant = require("../Models/Etudiant");

//******************************************************************************************************************************* */
//****************************************************************CRUD*********************************************************** */
// Creer un Administrateur depuis postman 
module.exports.CreateProjet = async (req, res) => {
  try {

    const projet = await Projet.create({
        nom: req.body.nom,
        description: req.body.description,
        Image: req.body.Image,
        prerequis: req.body.prerequis,
        competences: req.body.competences
    })
    const AjouterList = await Enseignant.updateOne({_id: req.params.id}, { $push: { projetsCreer:projet} })
    const userWithProjet = await Enseignant.findById(req.params.id).populate('projetsCreer');
    res.status(200).json(userWithProjet)
  } catch (error) {
    res.status(400).json({ error: error });
  }
}; 

module.exports.AfficherAll = async (req, res ) =>
{
  try {
    const projet = await Projet.find({...req.body})
    res.status(200).json(projet)
    
  } catch (error) {
    res.status(404).json({error: error})
  }
}

module.exports.DeletProjet = async(req,res) => {

}
module.exports.UpdateProjet = async (req, res) => {
  try {
    const etudiants = await Etudiant.find();

    for (let i = 0; i < etudiants.length; i++) {
      for (let j = 0; j < etudiants[i].projetInscrit.length; j++) {
        if (etudiants[i].projetInscrit[j].projet == req.params.id) {
          return res.status(401).json("Impossible de modifier un projet");

        }
      }
    }

    const projet = await Projet.updateOne(
      { _id: req.params.id },
      {
        nom: req.body.nom,
        description: req.body.description,
        image: req.body.image,
        prerequis: req.body.prerequis,
        competence: req.body.competence,
      }
    );

    res.status(201).json(projet);
  } catch (error) {
    res.status(401).json(error);
  }
};
//******************************************************************************************************************************* */
//************************************************************Autres Fonctions*************************************************** */

module.exports.ProjetDetails = async (req, res) => {
  try {
    const projet = await Projet.findOne(          
      { _id: req.params.id },
      { ...req.body }
    )
    res.status(200).json(projet);
  } catch (error) {
    res.status(400).json({ error: error });
  }
};


module.exports.AjouterCompetence = async (req, res) => {
  try {

    const projet = await Projet.findOneAndUpdate({_id: req.params.id}, { $push: { competence: { nom: req.body.competence } } }, { new: true })

    res.status(201).json(projet)
  } catch (error) {
    res.status(401).json(error)
  }
}
