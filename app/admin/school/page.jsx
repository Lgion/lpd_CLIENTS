import DonationsDashboard from "./_/DonationsDashboard";
import ProjectsAdmin from "./_/ProjectsAdmin";
import NatureSettingsAdmin from "./_/NatureSettingsAdmin";

export default function School() {
  return (
    <main id="admin" className="school" style={{ textAlign: "center", padding: "20px" }}>
      <h1>Administration de l'École et des Dons</h1>
      <p style={{marginBottom: "30px"}}>
        L'application de l'école fait l'objet d'un projet de développement pour l'étendre à d'autres écoles.
        <br />
        <a target="_blank" href="https://school-managment-project.vercel.app/">Application externe de l'école de Bolobi</a>
      </p>

      <div style={{ textAlign: "left", marginTop: "40px" }}>
        <DonationsDashboard />
        <ProjectsAdmin />
        <NatureSettingsAdmin />
      </div>
    </main>
  );
}