const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const { isEmail } = require("validator");
const ObjectId = Schema.ObjectId;
const Etudiant = mongoose.Schema({
  nom: { type: String, required: true, maxlength: 30, minlength: 2 },
  prenom: { type: String, required: true, maxlength: 30, minlength: 2 },
  adresse: { type: String, required: true },
  email: { type: String, required: true, lowercase: true, unique: true, validate: [isEmail], trimp: true },
  password: { type: String, required: true, minlength: 8 },
  dateDeNaissance: { type: Date },
  ville: { type: String, required: true },
  telephone: { type: Number, required: true, maxlength: 10, minlength: 10 },
  sexe: { type: Boolean, required: true },
  role: { type: String, default: "Etudiant" },
  projetsFavoris: [{ type: ObjectId, ref: 'Projet' }],
  projetInscrit: [
    {
      projet: { type: ObjectId, ref: 'Projet' },
      competences: [{ 
        nom: { type: String },
        progression: { type: Number, min: 0, max: 100, default: 0 }, // Ajout de la progression dans la compétence
      }],
    }
  ],
});
module.exports = mongoose.model("Etudiant", Etudiant);
