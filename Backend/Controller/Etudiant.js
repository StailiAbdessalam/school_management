const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");    
const Administrateur = require("../Models/Administrateur");
const Enseignant = require("../Models/Enseignant");
const Etudiant = require("../Models/Etudiant");
const Projet = require("../Models/Projet");


// Création du token
const createToken = (id) => {
  return jwt.sign({ id }, "RANDOM_TOKEN_SECRET", { expiresIn: "2h" });
};

// Se connecté Etudiant
module.exports.Login_post = async (req, res) => {
  try {
    const etudiant = await Etudiant.findOne({ email: req.body.email });

    if (etudiant) 
    {
      const passwordValide = await bcrypt.compare( req.body.password, etudiant.password);
      if (!passwordValide) 
      {
        res.status(400).json({ error: "Mot de passe incorrect" });
      }
      else
      {
        const token = createToken(etudiant);
        res.cookie("jwt", token, { httpOnly: true }); // http only pour que le coockies ne sera pas visualiser en js
        res.status(200).json({ etudiant: etudiant, token})
      }
    } 
    else 
    {
      res.status(400).json(error);
    }
  } catch (error) {
    res.status(400).json(error)
  }
};
// Se déconnecté
module.exports.Logout = (req, res) => {
  res.cookie("jwt", "", { maxAge: 1 });
  res.status(200).json("exit ")
};

// Modifier mot de passe
module.exports.Modifiermdp = async (req, res) => {
  try {

    const salt = await bcrypt.genSalt(10);
    const hashpassword = await bcrypt.hash(req.body.password, salt);

    const etudiant = await Etudiant.updateOne(
      { _id: req.params.id },
      { $set: { password: hashpassword } }
    );

    res.status(201).json({etudiant, message:"changement de mot de passe réussi"});
  } catch (err) {
    res.status(404).json({ err: err.message });
  }
};

/********************************************************************************************* */
/****************************************************CRUD************************************* */

// Création de l'étudiant 
const nodemailer = require('nodemailer');

module.exports.CreateEtudiant = async (req, res) => {
  try {
    const administrateur = await Administrateur.findOne({ email: req.body.email });
    const enseignant = await Enseignant.findOne({ email: req.body.email });
    const etudiant = await Etudiant.findOne({ email: req.body.email });

    const length = 10;
    const charset = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789!@#$%^&*()";
  
    let generatedPassword = "";
    for (let i = 0; i < length; i++) {
      const randomIndex = Math.floor(Math.random() * charset.length);
      generatedPassword += charset[randomIndex];
    }
    if (!administrateur && !enseignant && !etudiant) {
      const salt = await bcrypt.genSalt(10);
      const hashpassword = await bcrypt.hash(generatedPassword, salt);

      const etudiant = await Etudiant.create({
        nom: req.body.nom,
        prenom: req.body.prenom,
        adresse: req.body.adresse,
        email: req.body.email,
        password: hashpassword,
        dateDeNaissance: req.body.dateDeNaissance,
        ville: req.body.ville,
        telephone: req.body.telephone,
        sexe: req.body.sexe,
      });

      // Envoi de l'email
      const transporter = nodemailer.createTransport({
        service: 'gmail',
        auth: {
          user: ' daaouabdessamed@gmail.com',
          pass: 'vxdlmkuyrffkydgr',
        },
      });

      const mailOptions = {
        from: 'daaouabdessamed@gmail.com',
        to: req.body.email,
        subject: 'Compte étudiant créé',
        text: `Votre compte étudiant a été créé avec succès. Voici vos informations de connexion:\n\nEmail: ${req.body.email}\nMot de passe: ${generatedPassword}`,
      };

      transporter.sendMail(mailOptions, (error, info) => {
        if (error) {
          console.log(error);
        } else {
          console.log('Email envoyé: ' + info.response);
        }
      });

      res.status(201).json(etudiant);
    } else {
      return res.status(400).json({ message: "Un étudiant a déjà créé un compte avec cet email" });
    }
  } catch (error) {
    return res.status(400).json({ error, message: "Cet étudiant ne peut pas être créé" });
  }
};



// Afficher un étudiant
module.exports.AfficherEtudiant = async (req, res ) =>
{
  try {
    const etudiant = await Etudiant.findOne({ _id: req.params.id })
    .populate({
      path: 'projetInscrit',
      populate: { path: 'competences' },
    })
    .populate('projetInscrit.projet')  
    .populate('projetsFavoris');
    res.status(200).json(etudiant);
  } catch (err) {
    res.status(400).json({ err: err.message });
  }
}



// Read all Etudiant
module.exports.ReadALLStudent = async (req, res ) =>
{
  try {
    const etudiant = await Etudiant.find(
      { ...req.body }
    )
    res.status(200).json(etudiant);
  } catch (err) {
    res.status(400).json({ err: err.message });
  }
}

// Suprrimer un étudiant
module.exports.DeletEtudiant = async (req, res ) => {

  try {

    const etudiant = await Etudiant.findOneAndDelete({_id: req.params.id})

    res.status(201).json(etudiant)
    
  } catch (error) {
    res.status(500).json(error)
  }
}
// modifier un étudiant
module.exports.UpateEtudiant= async (req, res) => {
  try {
    const etudiant = await Etudiant.findOne({ _id: req.params.id });

    // rechercher si un émail de cette adresse email existe
    const administrateur = await Administrateur.findOne({ email: req.body.email });
    const enseignant = await Enseignant.findOne({ email: req.body.email });
    const Etudiants = await Etudiant.findOne({ email: req.body.email });
  
    try {
      if (!etudiant) {
        return res.status(500).json({ message: "etudiant non trouvé" });
      }
    
      let {email, adresse, ville, telephone } = req.body;
    
      if (!email) {      
        email = etudiant.email;
      }
  
      if (!adresse) {
        adresse = etudiant.adresse;
      }
      if (!ville) {
        ville = etudiant.ville;
      }
    
      if (!telephone) {
        telephone = etudiant.telephone;
      }
      etudiant.adresse = adresse;
      etudiant.ville = ville;
      etudiant.telephone = telephone;
      try {
        if (!administrateur && !enseignant && !Etudiants) {
          etudiant.email = email;
        }
        else{
          res.status(500).json({error, message: "email etudiant déja existant" })
        }
      } catch (error) {
        res.status(500).json({error, message: "email etudiant déja existant" })
      }
      await etudiant.save()
    } catch (error) {
      res.status(500).json(error)
    }
    res.status(201).json(etudiant);
  } catch (err) {
    res.status(500).json({ err: err.message });
  }
}  

/********************************************************************************************************* */
/****************************************************Autres Fonctions************************************* */

// inscrire dans un projet 
module.exports.InscrireProjet = async (req, res) => {
  try {

    prerequisTab = []
    const projet = await Projet.findOne({ _id: req.body.idProjet });
    const etudiant = await Etudiant.findById(req.params.id);
  
      for (let i = 0; i < projet.prerequis.length; i++) {
        prerequisTab.push(projet.prerequis[i])
      }

      for (let i = 0; i < etudiant.projetInscrit.length; i++) {
       
        for (let j = 0; j < etudiant.projetInscrit[i].competences.length; j++) {
          
          if(prerequisTab.includes(etudiant.projetInscrit[i].competences[j].nom && 
            etudiant.projetInscrit[i].competences.progression != 100) || 
            prerequisTab.includes(etudiant.projetInscrit[i].competences[j].nom == false ))
          {

          }
          
        }
        
      }
    // Ajout du projet et des compétences avec une progression initiale de 0
    etudiant.projetInscrit.push({projet: projet._id,
      competences: projet.competences.map((competence) => ({
        nom: competence,
        progression: 0,
      })),
    });
  
    await etudiant.save();
  
    // Récupération de l'étudiant avec le projet inscrit et les compétences
    const etudiantWithProjet = await Etudiant.findById(req.params.id).populate('projetInscrit.projet');
    res.status(200).json(etudiantWithProjet);
  } catch (error) {
    res.status(404).json({ error });
  }
  
}  
// Déesinscrire de projet
module.exports.DesinscrireProjet = async (req, res ) => {
  try {
    const etudiant = await Projet.findOne({_id: req.body.idProjet});
    const user = await Etudiant.updateOne({_id: req.params.id}, { $pull: { projetInscrit: etudiant._id } });
    const userWithProjet = await Etudiant.findById(req.params.id).populate('projetInscrit');
    res.status(200).json(userWithProjet);
  } catch (error) {
    res.status(404).json({ error });
  }
}  

// afficher les projet inscrit ( mes projet )
module.exports.AfficherProjetInscrit = async (req, res) =>{
  try {
    const etudiant = await Etudiant.findOne({_id: req.params.id}, {projetsInscrits: 1})

    res.status(200).json(etudiant)
  } catch (error) {
    
    res.status(400).json(error)
  }
}


module.exports.Favourite = async (req, res) => {
  try {
    const etudiant = await Projet.findOneAndUpdate({_id: req.body.idProjet}, {isFavorit: true});
    const user = await Etudiant.updateOne({_id: req.params.id}, { $push: { projetsFavoris: etudiant._id } });
    const userWithProjet = await Etudiant.findOne({_id: req.params.id} , {projetsFavoris: req.body.idProjet}).populate('projetsFavoris');
    res.status(200).json(userWithProjet);
  } catch (error) {
    res.status(404).json({ error });
  }
}  


module.exports.FavouriteNot = async (req, res) => {
  try {
    const etudiant = await Projet.findOneAndUpdate({_id: req.body.idProjet}, {isFavorit: false});
    const user = await Etudiant.updateOne({_id: req.params.id}, { $pull: { projetsFavoris: etudiant._id } });
    const userWithProjet = await Etudiant.findById(req.params.id).populate('projetsFavoris');
    res.status(200).json(userWithProjet);
  } catch (error) {
    res.status(404).json({ error });
  }
}  

module.exports.ProgrsseCompetence = async (req, res) => {
  try {
    const etudiant = await Etudiant.findById(req.params.id);

    // Recherche du projet inscrit correspondant à l'ID du projet
    const projetInscrit = etudiant.projetInscrit.find((projet) => projet.projet.equals(req.body.idProjet));

    if (!projetInscrit) {
      return res.status(404).json({ error: "Projet non trouvé pour cet étudiant" });
    }

    // Recherche de la compétence correspondante dans le projet inscrit
    const competence = projetInscrit.competences.find((competence) => competence.nom === req.body.nomCompetence);

    if (!competence) {
      return res.status(404).json({ error: "Compétence non trouvée pour ce projet inscrit" });
    }

    // Vérification de la compétence précédente
    const currentIndex = projetInscrit.competences.indexOf(competence);
    if (currentIndex > 0) {
      const previousCompetence = projetInscrit.competences[currentIndex - 1];
      if (previousCompetence.progression !== 100) {
        return res.status(400).json({ error: "Impossible de modifier cette compétence. La compétence précédente doit être à 100%." });
      }
    }

    // Mise à jour de la progression de la compétence
    competence.progression = req.body.progression;

    await etudiant.save();

    res.status(200).json(etudiant);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

