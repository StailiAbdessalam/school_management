const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const Administrateur = require("../Models/Administrateur");
const Enseignant = require("../Models/Enseignant");
const Etudiant = require("../Models/Etudiant");

const createToken = (id) => {
  return jwt.sign({ id }, "CLE_SECRET", { expiresIn: "15s" });
};

// Se connecter
module.exports.Login_post = async (req, res) => {
  try {
    const administrateur = await Administrateur.findOne({ email: req.body.email });

    if (administrateur) 
    {
      const passwordValide = await bcrypt.compare( req.body.password, administrateur.password);
      if (!passwordValide) 
      {
        return res.status(404).json({ error: "Mot de passe incorrect" });
      }
      else
      {
        const token = createToken(administrateur);
        res.cookie("jwt", token, { httpOnly: true });
        res.status(200).json({administrateur: administrateur, token})
      }
    } 
    else 
    {
      return res.status(404).json({message: "Administrateur non trouvé"})
    }
  } catch (error) {

    return res.status(500).json({error, message: "Erreur est servenu veuillez réssayer"})
  }
};

// Se déconnecter
module.exports.Logout = (req, res) => {
  res.clearCookie("jwt");
  res.status(200).json("exit")
};

// Modifier mot de passe
module.exports.Modifiermdp = async (req, res) => {
  try {

    const salt = await bcrypt.genSalt(10);
    const hashpassword = await bcrypt.hash(req.body.password, salt);

    const etudiant = await Administrateur.updateOne(
      { _id: req.params.id },
      { $set: { password: hashpassword } }
    );

    res.status(201).json({etudiant, message:"changement de mot de passe réussi"});
  } catch (err) {
    res.status(404).json({ err: err.message });
  }
};

// Creation Administrateur
module.exports.CreateAdministrateur = async (req, res) => {
  try {
    const administrateur = await Administrateur.findOne({ email: req.body.email });
    const enseignant = await Enseignant.findOne({ email: req.body.email });
    const etudiant = await Etudiant.findOne({ email: req.body.email });
    if (!administrateur && !enseignant && !etudiant) {
      
      const salt = await bcrypt.genSalt(10);
      const hashpassword = await bcrypt.hash(req.body.Password, salt);

      const administrateur = await Administrateur.create({
        nom: req.body.Nom,
        prenom: req.body.Prenom,
        adresse: req.body.Adresse,
        email: req.body.email,
        password: hashpassword,
        dateDeNaissance: req.body.DateDeNaissance,
        ville: req.body.Ville,
        telephone: req.body.Telephone,
        sexe: req.body.Sexe,     
      });
      res.status(201).json(administrateur);
    } else {
      res.status(400).json({ error: "Un administrateur a déjà créé un compte avec cet email" });
    }
  } catch (error) {
    res.status(400).json({ error: "Cet administrateur ne peut pas être créé" + error });
  }
};

// Afficher un administrateur
module.exports.AfficherAdministrateur = async (req, res ) =>
{
    try {
        const administrateur = await Administrateur.findOne(
          { _id: req.params.id },
          { ...req.body }
        )
        res.status(200).json(administrateur);
      } catch (err) {
        res.status(400).json({ err: err.message });
      }
}

// Supprimer un administrateur
module.exports.DeletAdministrateur = async (req, res ) => {
  try {
    const administrateur = await Administrateur.findOneAndDelete({_id: req.params.id})
    res.status(201).json(administrateur)
  } catch (error) {
    res.status(500).json(error)
  }
}

// Modifier un administrateur
module.exports.UpateAdministrateur = async (req, res) => {
  try {
    const administrateur = await Administrateur.findOne({ _id: req.params.id });

    // rechercher si un émail de cette adresse email existe
    const Administrateurs = await Administrateur.findOne({ email: req.body.email });
    const enseignant = await Enseignant.findOne({ email: req.body.email });
    const etudiant = await Etudiant.findOne({ email: req.body.email });
  
    try {
      if (!administrateur) {
        return res.status(500).json({ message: "Administrateur non trouvé" });
      }
    
      let {email, adresse, ville, telephone } = req.body;
    
      if (!email) {      
        email = administrateur.email;
      }
  
      if (!adresse) {
        adresse = administrateur.adresse;
      }
      if (!ville) {
        ville = administrateur.ville;
      }
    
      if (!telephone) {
        telephone = administrateur.telephone;
      }
      administrateur.adresse = adresse;
      administrateur.ville = ville;
      administrateur.telephone = telephone;
      if (!Administrateurs && !enseignant && !etudiant) {
        administrateur.email = email;
      }
      else{
        return res.status(404).json({message: "email déja existant" })
      }
      await administrateur.save()
    } catch (error) {
      res.status(401).json(error)
    }
    res.status(201).json(administrateur);
  } catch (err) {
    res.status(401).json({ err: err.message });
    return;
  }
}

// Modifier un étudiant
module.exports.ModifierEtudiant = async (req, res) =>
{
  try {
    const etudiant = await Etudiant.findOne({ _id: req.params.id });

    // rechercher si un émail de cette adresse email existe
    const administrateur = await Administrateur.findOne({ email: req.body.email });
    const enseignant = await Enseignant.findOne({ email: req.body.email });
    const Etudiants = await Etudiant.findOne({ email: req.body.email });
  
    try {
      if (!etudiant) {
        return res.status(404).json({ message: "etudiant non trouvé" });
      }
    
      let {nom, prenom, email, telephone, adresse, ville, dateDeNaissance  } = req.body;
    
      if (!nom) {      
        nom = etudiant.nom;
      }

      if (!prenom) {      
        prenom = etudiant.prenom;
      }

      if (!email) {      
        email = etudiant.email;
      }
      if (!telephone) {
        telephone = etudiant.telephone;
      }
  
      if (!adresse) {
        adresse = etudiant.adresse;
      }
      if (!ville) {
        ville = etudiant.ville;
      }

      if (!dateDeNaissance) {
        dateDeNaissance = etudiant.dateDeNaissance;
      }
    
      etudiant.nom = nom
      etudiant.prenom = prenom
      etudiant.telephone = telephone;
      etudiant.adresse = adresse;
      etudiant.ville = ville;
      etudiant.dateDeNaissance = dateDeNaissance
        if (!administrateur && !enseignant && !Etudiants) {
          etudiant.email = email;
        }
        else{
          return res.status(404).json({message: "email etudiant déja existant" })
        }
      await etudiant.save()
    } catch (error) {
      return res.status(404).json({error, message: "une erreur est survenue veuillez réessayer plus tard"})
    }
    res.status(201).json(etudiant);
  } catch (err) {
    return res.status(404).json({error, message: "une erreur est survenue veuillez réessayer plus tard"})
  }
}

// Modifier un enseignant
module.exports.ModifierEnseignant = async (req, res) =>
{
  try {
    const enseignant = await Enseignant.findOne({ _id: req.params.id });

    // rechercher si un émail de cette adresse email existe
    const administrateur = await Administrateur.findOne({ email: req.body.email });
    const enseignantExistant = await Enseignant.findOne({ email: req.body.email });
    const etudiant = await Etudiant.findOne({ email: req.body.email });
  
    try {
      if (!enseignant) {
        return res.status(404).json({ message: "enseignant non trouvé" });
      }
    
      let {nom, prenom, email, telephone, adresse, ville, dateDeNaissance  } = req.body;
    
      if (!nom) {      
        nom = enseignant.nom;
      }

      if (!prenom) {      
        prenom = enseignant.prenom;
      }

      if (!email) {      
        email = enseignant.email;
      }
      if (!telephone) {
        telephone = enseignant.telephone;
      }
  
      if (!adresse) {
        adresse = enseignant.adresse;
      }
      if (!ville) {
        ville = enseignant.ville;
      }

      if (!dateDeNaissance) {
        dateDeNaissance = enseignant.dateDeNaissance;
      }
    
      enseignant.nom = nom
      enseignant.prenom = prenom
      enseignant.telephone = telephone;
      enseignant.adresse = adresse;
      enseignant.ville = ville;
      enseignant.dateDeNaissance = dateDeNaissance
        if (!administrateur && !enseignantExistant && !etudiant) {
          enseignant.email = email;
        }
        else{
          return res.status(404).json({message: "enseignant déjà existant" })
        }
      await enseignant.save()
    } catch (error) {
      return res.status(404).json({error, message: "une erreur est survenue veuillez réessayer plus tard"})
    }
    res.status(201).json(enseignant);
  } catch (err) {
    return res.status(404).json({error, message: "une erreur est survenue veuillez réessayer plus tard"})
  }
}