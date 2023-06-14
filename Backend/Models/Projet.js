const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const ObjectId = Schema.ObjectId;

const Projet = mongoose.Schema(
  {
    nom: { type: String, required: true, maxlength: 60, minlength: 2 },
    description: { type: String, required: true, minlength: 2 },
    image: { type: String, default: "../../frontend/src/assets/IMG/Default.jpg" },
    prerequis: { type: Array},
    isFavorit: { type: Boolean, default: false },
    enseignat: { type: ObjectId, ref: 'Enseignant' },
    competences: [{ type: String }], // Ajout d'un tableau de compétences
  },
  { timestamps: true }
);

module.exports = mongoose.model("Projet", Projet);
