const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const { isEmail } = require("validator");
const ObjectId = Schema.ObjectId;
 
  const Enseignant = mongoose.Schema({
    nom: { type: String, required: true, maxlength: 30, minlength: 2 },
    prenom: { type: String, required: true, maxlength: 30, minlength: 2 },
    adresse: { type: String, required: true },
    email: { type: String, required: true, lowercase: true, unique: true, validate: [isEmail], trimp: true, },
    password: { type: String, required: true, minlength: 8 },
    dateDeNaissance: { type: Date },
    ville: { type: String, required: true },
    telephone: { type: Number, required: true, maxlength: 10, minlength: 10 },
    sexe: { type: Boolean, required: true },
    projetsCreer: [{ type: ObjectId, ref: 'Projet' }],
    role: { type: String, default: "Enseignant" }
  }, 
  { timestamps: true });

module.exports = mongoose.model("Enseignant", Enseignant);