import React, { useState } from 'react';

function JsonForm({ json }) {
  const [formData, setFormData] = useState(json);

  const handleInputChange = (event, key) => {
    const { value } = event.target;
    setFormData(prevFormData => ({
      ...prevFormData,
      [key]: value
    }));
  };

  const handleSubmit = event => {
    event.preventDefault();
    // Faire quelque chose avec les données modifiées (formData)
    console.log(formData);
  };

  const renderFormFields = () => {
    return Object.entries(formData).map(([key, value]) => (
      <div key={key}>
        <label htmlFor={key}>{key}</label>
        <input
          type="text"
          id={key}
          value={value}
          onChange={event => handleInputChange(event, key)}
        />
      </div>
    ));
  };

  return (
    <form onSubmit={handleSubmit}>
      {renderFormFields()}
      <button type="submit">Enregistrer</button>
    </form>
  );
}

export default JsonForm;
