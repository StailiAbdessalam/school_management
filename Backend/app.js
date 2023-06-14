const express = require('express');
const mongoose = require("mongoose");
const bodyParser = require("body-parser");
const app = express();
const cors = require('cors')
const cookieParser = require("cookie-parser");
const RouteAdministrateur = require("./Route/Administrateur");
const RouteEtudiant = require("./Route/Etudiant")
const RouteEnseignant = require("./Route/Enseignant")
const RouteProjet = require("./Route/Projet")


// on connecte la base de donné
mongoose.connect("mongodb+srv://root:root@cluster0.82dm1zp.mongodb.net/?retryWrites=true&w=majority",
    { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => console.log("connextion reussi "))
  .catch((err) => console.log("connextion echoué " + err));


app.use(cors({
  credentials: true,
  origin: ['http://localhost:4200']
}))

  app.use(cookieParser());
  app.use(bodyParser.urlencoded({ extended: false }));
  app.use(bodyParser.json());
  
  app.get('/', (req,res) =>{
    res.send("hello world")
  })

app.use("/Administrateur", RouteAdministrateur);
app.use("/Etudiant", RouteEtudiant);
app.use("/Enseignant", RouteEnseignant);
app.use("/Enseignant/Projet", RouteProjet);
module.exports = app;