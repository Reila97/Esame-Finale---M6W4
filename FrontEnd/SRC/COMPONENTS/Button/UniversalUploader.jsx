import React, { useState } from 'react';

// Aggiungiamo 'method' alle props, con un valore predefinito 'PATCH'
const UniversalUploader = ({ endpoint, fieldName, onUploadSuccess, method = "PATCH" }) => {
  const [file, setFile] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleUpload = async () => {
    if (!file) return alert("Seleziona un file!");

    setLoading(true);
    const formData = new FormData();
    formData.append(fieldName, file);

    try {
      const token = localStorage.getItem('token');
      const response = await fetch(endpoint, {
        method: method, // <--- ORA USA IL METODO PASSATO DAL GENITORE
        headers: {
          'Authorization': `Bearer ${token}`
        },
        body: formData,
      });

      if (!response.ok) throw new Error('Errore nel caricamento');

      const data = await response.json();
      
      // Gestiamo la risposta: se è uploadTemp avremo data.url, 
      // se è la rotta specifica avremo data.cover
      onUploadSuccess(data.url || data.cover); 
      alert("File caricato correttamente!");
    } catch (err) {
      console.error(err);
      alert("Errore durante l'upload.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="d-flex align-items-center gap-2">
      <input 
        type="file" 
        onChange={(e) => setFile(e.target.files[0])} 
        className="form-control form-control-sm"
      />
      <button 
        type="button" // IMPORTANTE: evita che il form faccia il submit
        onClick={handleUpload}
        disabled={!file || loading}
        className="btn btn-info btn-sm"
      >
        {loading ? '...' : 'Upload'}
      </button>
    </div>
  );
};

export default UniversalUploader;