"use client";
import { useState, useEffect } from 'react';

export default function DonationsDashboard() {
  const [donations, setDonations] = useState([]);
  const [assigningStudent, setAssigningStudent] = useState(null); // ID of donation
  const [studentForm, setStudentForm] = useState({ nom: '', prenoms: '', sexe: 'M', age: '', classe: '', description: '', photo: '' });

  useEffect(() => {
    fetchDonations();
  }, []);

  const fetchDonations = async () => {
    const res = await fetch('/api/donation');
    const data = await res.json();
    setDonations(data);
  };

  const handleAssignSubmit = async (e) => {
    e.preventDefault();
    // In a real app we might have a specific PUT route, here we can create an api route for it
    await fetch('/api/donation-assign-student', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ donationId: assigningStudent, studentData: studentForm })
    });
    setAssigningStudent(null);
    setStudentForm({ nom: '', prenoms: '', sexe: 'M', age: '', classe: '', description: '', photo: '' });
    fetchDonations();
  };

  // Group by donor
  const donorsMap = {};
  donations.forEach(d => {
    if (!donorsMap[d.user_id]) {
      donorsMap[d.user_id] = {
        name: `${d.firstname} ${d.lastname || ''}`,
        email: d.email,
        phone: d.phone_number,
        count: 0,
        total: 0
      };
    }
    donorsMap[d.user_id].count += 1;
    donorsMap[d.user_id].total += d.montant || 0;
  });

  return (
    <div>
      <div style={{ display: 'flex', gap: '20px' }}>
        <div style={{ flex: 1, border: '1px solid #ccc', padding: '20px' }}>
          <h2>Annuaire des Donateurs</h2>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
            {Object.entries(donorsMap).map(([id, donor]) => (
              <div key={id} style={{ border: '1px solid #eee', padding: '10px', position: 'relative' }}>
                <span style={{ position: 'absolute', top: 10, right: 10, background: '#007bff', color: 'white', borderRadius: '50%', width: 30, height: 30, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  {donor.count}
                </span>
                <h4>{donor.name}</h4>
                <p>{donor.email} | {donor.phone}</p>
                <p>Total donné: {donor.total} FCFA</p>
              </div>
            ))}
          </div>
        </div>

        <div style={{ flex: 2, border: '1px solid #ccc', padding: '20px' }}>
          <h2>Derniers Dons</h2>
          <table style={{ width: '100%', textAlign: 'left' }}>
            <thead>
              <tr>
                <th>Date</th>
                <th>Donateur</th>
                <th>Type</th>
                <th>Détails</th>
                <th>Action</th>
              </tr>
            </thead>
            <tbody>
              {donations.map(d => (
                <tr key={d._id} style={{ borderBottom: '1px solid #eee' }}>
                  <td>{new Date(d.createdAt).toLocaleDateString()}</td>
                  <td>{d.firstname} {d.lastname}</td>
                  <td>{d.donation_type}</td>
                  <td>
                    {d.montant > 0 && <div>{d.montant} FCFA</div>}
                    {d.donation_type === 'scolarity' && (
                      <div>
                        {d.scolarity_student_assigned ? 'Elève assigné' : <strong style={{color:'red'}}>Attente assignation</strong>}
                      </div>
                    )}
                  </td>
                  <td>
                    {d.donation_type === 'scolarity' && !d.scolarity_student_assigned && (
                      <button onClick={() => setAssigningStudent(d._id)}>Assigner un élève</button>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>

          {assigningStudent && (
            <div style={{ marginTop: '20px', border: '1px dashed #007bff', padding: '20px' }}>
              <h3>Assigner un élève au don scolarité</h3>
              <form onSubmit={handleAssignSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                <input type="text" placeholder="Nom" required onChange={e => setStudentForm({...studentForm, nom: e.target.value})} />
                <input type="text" placeholder="Prénoms" required onChange={e => setStudentForm({...studentForm, prenoms: e.target.value})} />
                <select onChange={e => setStudentForm({...studentForm, sexe: e.target.value})}>
                  <option value="M">Masculin</option>
                  <option value="F">Féminin</option>
                </select>
                <input type="number" placeholder="Age" required onChange={e => setStudentForm({...studentForm, age: e.target.value})} />
                <input type="text" placeholder="Classe" required onChange={e => setStudentForm({...studentForm, classe: e.target.value})} />
                <textarea placeholder="Description" onChange={e => setStudentForm({...studentForm, description: e.target.value})}></textarea>
                <input type="text" placeholder="URL Photo" onChange={e => setStudentForm({...studentForm, photo: e.target.value})} />
                <button type="submit">Valider l'assignation</button>
                <button type="button" onClick={() => setAssigningStudent(null)}>Annuler</button>
              </form>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
