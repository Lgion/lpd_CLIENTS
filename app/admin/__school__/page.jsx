// Supprimer "use client" car nous allons faire le rendu côté serveur
import Link from "next/link";
import EditMongoForm from "./EditMongoForm.jsx"
import AdminContext from "../../../stores/adminContext.js"
import MembersList from "./_/MembersList.jsx";
import NavAdminMenus from "./_/NavAdminMenus.jsx";
import TableClasse from "./_/TableClasse.jsx";
import TeachersStudentsView from "./_/TeachersStudentsView.jsx";

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

  return (<main id="admin" className="school">
    <NavAdminMenus />
  </main>)
}