export interface IHome{
  nom: String
}

export interface IEtudiant
{
  nom: String,
  prenom: String,
  adresse: String,
  email: String,
  dateDeNaissance: any,
  ville: string,
  telephone: Number,
  sexe: Boolean,
  role: String,
  projetsFavoris: any[],
  projetsInscrits: any[],
}

export interface IEnseignant
{
  nom: String,
  prenom: String,
  adresse: String,
  email: String,
  password: string,
  dateDeNaissance: any,
  ville: string,
  telephone: Number,
  sexe: Boolean,
  role: String,
  projetsCreer: any[]
}


export interface IAdminstrateur
{
  nom: String,
  prenom: String,
  adresse: String,
  email: String,
  password: string,
  dateDeNaissance: any,
  ville: string,
  telephone: Number,
  sexe: Boolean,
  role: String,
}
  export interface IProjet{

    nom: string,
    description: string,
    image: string,
    prerequis: any
    competence: [{
        nomCompetence: string,
        statut: string}]
    utilisateurs: any
    enseignat: any

  }
