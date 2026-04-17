// Supprimer "use client" car nous allons faire le rendu côté serveur
// import Link from "next/link";
// import EditMongoForm from "./EditMongoForm.jsx"
// import AdminContext from "../../../stores/adminContext.js"
// import MembersList from "./_/MembersList.jsx";
// import NavAdminMenus from "./NavAdminMenus.jsx";
// import TableClasse from "./_/TableClasse.jsx";
// import TeachersStudentsView from "./_/TeachersStudentsView.jsx";

// Fonction pour charger les données statiquement
async function getModels() {
  const res = await fetch('/api/ecole', { cache: 'force-cache' });
  if (!res.ok) throw new Error('Failed to fetch models');
  return res.json();
}

export default async function School() {
  // const models = await getModels();
  // const { schemaEleve } = models;

  // let tmpDate = new Date();
  // console.log(schemaEleve);

  return (<main id="admin" className="school" style={{ "textAlign": "center" }}>
    {/* <NavAdminMenus /> */}
    <p>L'application de l'école fait l'objet d'un projet de développement pour l'étendres à d'autre école.</p>
    <p>Voici un lien vers l'application de l'école de Bolobi (École Martin de Porrès): </p>
    <a target="_blank" href="https://school-managment-project.vercel.app/">Application de l'école</a>
  </main>)
}