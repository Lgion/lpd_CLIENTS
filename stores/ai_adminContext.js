"use client"

import { createContext, useState, useCallback, useEffect } from 'react';

export const AiAdminContext = createContext({});

export const AdminContextProvider = ({ children }) => {
  // States
  const [eleves, setEleves] = useState([]);
  const [enseignants, setEnseignants] = useState([]);
  const [classes, setClasses] = useState([]);

  // --- ELEVE CRUD ---
  const fetchEleves = useCallback(async () => {
    const res = await fetch('/api/school_ai/eleves');
    setEleves(await res.json());
  }, []);

  const saveEleve = useCallback(async (data) => {
    const method = data._id ? 'PUT' : 'POST';
    const res = await fetch('/api/school_ai/eleves', {
      method,
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    });
    await fetchEleves();
    return await res.json();
  }, [fetchEleves]);

  const deleteEleve = useCallback(async (_id) => {
    await fetch('/api/school_ai/eleves', {
      method: 'DELETE',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ _id }),
    });
    await fetchEleves();
  }, [fetchEleves]);

  // --- ENSEIGNANT CRUD ---
  const fetchEnseignants = useCallback(async () => {
    const res = await fetch('/api/school_ai/enseignants');
    setEnseignants(await res.json());
  }, []);

  const saveEnseignant = useCallback(async (data) => {
    const method = data._id ? 'PUT' : 'POST';
    const res = await fetch('/api/school_ai/enseignants', {
      method,
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    });
    await fetchEnseignants();
    return await res.json();
  }, [fetchEnseignants]);

  const deleteEnseignant = useCallback(async (_id) => {
    await fetch('/api/school_ai/enseignants', {
      method: 'DELETE',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ _id }),
    });
    await fetchEnseignants();
  }, [fetchEnseignants]);

  // --- CLASSE CRUD ---
  const fetchClasses = useCallback(async () => {
    const res = await fetch('/api/school_ai/classes');
    setClasses(await res.json());
  }, []);

  const saveClasse = useCallback(async (data) => {
    const method = data._id ? 'PUT' : 'POST';
    const res = await fetch('/api/school_ai/classes', {
      method,
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    });
    await fetchClasses();
    return await res.json();
  }, [fetchClasses]);

  const deleteClasse = useCallback(async (_id) => {
    await fetch('/api/school_ai/classes', {
      method: 'DELETE',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ _id })
    });
    await fetchClasses();
  }, [fetchClasses]);

  // --- UPLOAD ---
  const uploadFile = useCallback(async (payload) => {
    const { file, type, documents, ...payload_ } = payload;
    let json = JSON.stringify(payload_);
    const formData = new FormData();
    if (file) formData.append('file', file);
    if (documents && Array.isArray(documents)) {
      documents.forEach(doc => {
        formData.append('file', doc.file);
      });
      // Ajoute la meta des noms personnalisés dans l'ordre
      formData.append('documentsMeta', JSON.stringify(documents.map(doc => doc.customName)));
    }
    formData.append('type', type);
    formData.append('payload', json);
    payload.entityType && formData.append('entityType', payload.entityType);
    const res = await fetch('/api/school_ai/media', {
      method: 'POST',
      body: formData
    });
    return await res.json(); // { paths }
  }, []);

  // --- AUTO FETCH CLASSES AU MONTAGE ---
  useEffect(() => {
    if (classes.length === 0) fetchClasses();
  }, [classes.length, fetchClasses]);


  return (
    <AiAdminContext.Provider
      value={{
        eleves, fetchEleves, saveEleve, deleteEleve,
        enseignants, fetchEnseignants, saveEnseignant, deleteEnseignant,
        classes, fetchClasses, saveClasse, deleteClasse,
        uploadFile
      }}
    >
      {children}
    </AiAdminContext.Provider>
  );
};
