const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");    
const Administrateur = require("../Models/Administrateur");
const Enseignant = require("../Models/Enseignant");
const Etudiant = require("../Models/Etudiant");

const createToken = (id) => {
  return jwt.sign({ id }, "RANDOM_TOKEN_SECRET", { expiresIn: "2h" });
};

/************************************************************************************************** */
/****************************************************Connexion************************************* */

// Se connecter
module.exports.Login_post = async (req, res) => {
  try {
    const enseignant = await Enseignant.findOne({ email: req.body.email });

    if (enseignant) 
    {

      const passwordValide = await bcrypt.compare( req.body.password, enseignant.password);
      if (!passwordValide) 
      {

        res.status(400).json({ error: "Mot de passe incorrect" });
      }
      else
      {
        const token = createToken(enseignant);
        res.cookie("jwt", token, { httpOnly: true });
        res.status(200).json({ enseignant: enseignant, token})
      }
    } 
    else 
    {
      res.status(401).json(error, error.message)
    }
  } catch (error) {
    res.status(500).json(error)
  }
};

// Se déconnecter
module.exports.Logout = async (req, res) => {
  res.cookie("jwt", "", { maxAge: 1 });
  res.status(200).json("exit ")
};

// modifier mot de passe
module.exports.Modifiermdp = async (req, res) => {

  try {
    const salt = await bcrypt.genSalt(10);
    const hashpassword = await bcrypt.hash(req.body.password, salt);
    const enseignant = await Enseignant.updateOne({ _id: req.params.id },{password : hashpassword});
    res.status(201).json(enseignant)
  } catch (error) {
    
    res.status(400).json(error)
  }
}

/********************************************************************************************* */
/****************************************************CRUD************************************* */

// Création de l'étudiant 
const nodemailer = require('nodemailer');
// Création de l'enseignant
module.exports.CreateEnseignant = async (req, res) => {
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

        const enseignant = await Enseignant.create({
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
          subject: 'Compte Enseignant créé',
          text: `Votre compte enseignant a été créé avec succès. Voici vos informations de connexion:\n\nEmail: ${req.body.email}\nMot de passe: ${generatedPassword}`,
        };
  
        transporter.sendMail(mailOptions, (error, info) => {
          if (error) {
            console.log(error);
          } else {
            console.log('Email envoyé: ' + info.response);
          }
        });
  
        res.status(201).json(enseignant);
      } else {
        return res.status(400).json({ message: "Un enseignant a déjà créé un compte avec cet email" });
      }
    } catch (error) {
      return res.status(400).json({ error, message: "Cet enseignant ne peut pas être créé" });
    }
  };


// Afficher un administrateur
module.exports.AfficherEnseignant = async (req, res ) =>
{
    try {
        const enseignant = await Enseignant.findOne(
          { _id: req.params.id },
          { ...req.body }
        ).populate('projetsCreer');
        res.status(200).json(enseignant);
      } catch (err) {
        res.status(400).json({ err: err.message });
      }
}


// Afficher tous les enseignant

module.exports.ReadALL = async (req, res ) =>
{
    try {
        const enseignant = await Enseignant.find(
          { ...req.body }
        )
        res.status(200).json(enseignant);
      } catch (err) {
        res.status(400).json({ err: err.message });
      }
}
// Modifier l'enseignant
module.exports.UpateEnseignant= async (req, res) => {
  try {
    const enseignant = await Enseignant.findOne({ _id: req.params.id });

    // rechercher si un émail de cette adresse email existe
    const administrateur = await Administrateur.findOne({ email: req.body.email });
    const Enseignants = await Enseignant.findOne({ email: req.body.email });
    const etudiant = await Etudiant.findOne({ email: req.body.email });
  
    try {
      if (!enseignant) {
        return res.status(500).json({ message: "enseignant non trouvé" });
      }
    
      let {email, adresse, ville, telephone } = req.body;
    
      if (!email) {      
        email = enseignant.email;
      }
  
      if (!adresse) {
        adresse = enseignant.adresse;
      }
      if (!ville) {
        ville = enseignant.ville;
      }
    
      if (!telephone) {
        telephone = enseignant.telephone;
      }
      enseignant.adresse = adresse;
      enseignant.ville = ville;
      enseignant.telephone = telephone;
      try {
        if (!administrateur && !Enseignants && !etudiant) {
          enseignant.email = email;
        }
        else{
          res.status(500).json({error, message: "email enseignant déja existant" })
        }
      } catch (error) {
        res.status(500).json({error, message: "email enseignant déja existant" })
      }
      await enseignant.save()
    } catch (error) {
      res.status(500).json(error)
    }
    res.status(201).json(enseignant);
  } catch (err) {
    res.status(500).json({ err: err.message });
  }
  
}  

// Supprimer l'eneignnant
module.exports.DeletEnseignant= async (req, res) =>{

  try {

    const enseignant = await Enseignant.findOneAndDelete({_id: req.params.id})
    res.status(201).json(enseignant)
    
  } catch (error) {
    res.status(500).json(error, error.message)
  }
}

/********************************************************************************************************* */
/****************************************************autres fonctions************************************* */


module.exports.GetStat = async (req, res) => {
  try {
    const TabStat = [];
    const etudiant = await Etudiant.find({...req.body}).populate('projetInscrit.projet')
    

    for (let i = 0; i < etudiant.length; i++) {
      for (let j = 0; j < etudiant[i].projetInscrit.length; j++) {
        if (etudiant[i].projetInscrit[j].projet._id.toString() === req.params.id) {
          TabStat.push(etudiant[i].projetInscrit[j].projet)
        }
      }      
    }

    const moyenne = (TabStat.length *100)/etudiant.length

    res.status(200).json(moyenne);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};