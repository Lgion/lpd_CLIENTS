import { useState, useEffect } from 'react';

export default function NatureItemsSelector({ onItemsChange }) {
  const [settings, setSettings] = useState([]);
  const [items, setItems] = useState([]); // [{ setting_id, label, unit, quantity }]
  
  useEffect(() => {
    fetch('/api/nature-settings')
      .then(res => res.json())
      .then(data => {
        if(Array.isArray(data)) setSettings(data.filter(s => s.is_active));
      });
  }, []);

  const handleAdd = (setting, quantity) => {
    if (!quantity || quantity <= 0) return;
    const newItems = [...items, { 
      setting_id: setting._id, 
      label: setting.label, 
      unit: setting.unit, 
      quantity: Number(quantity) 
    }];
    setItems(newItems);
    onItemsChange(newItems);
  };

  const handleRemove = (index) => {
    const newItems = items.filter((_, i) => i !== index);
    setItems(newItems);
    onItemsChange(newItems);
  };

  return (
    <div className="nature-items-selector">
      <h4>Ajouter des items à votre don</h4>
      
      <div className="nature-items-selector__icons">
        {settings.map(setting => (
          <div key={setting._id} className="nature-item-adder">
            <span className="icon" title={setting.label}>{setting.icon}</span>
            <span className="label">{setting.label} ({setting.unit})</span>
            <input 
              type="number" 
              min="1" 
              id={`qty-${setting._id}`}
              placeholder="Qté" 
              className="qty-input"
            />
            <button 
              type="button" 
              onClick={(e) => {
                e.preventDefault();
                const input = document.getElementById(`qty-${setting._id}`);
                handleAdd(setting, input.value);
                input.value = '';
              }}
            >
              Ajouter
            </button>
          </div>
        ))}
      </div>

      {items.length > 0 && (
        <div className="nature-items-selector__list">
          <h5>Items validés pour votre don :</h5>
          <ul>
            {items.map((item, idx) => (
              <li key={idx}>
                {item.quantity} {item.unit} de {item.label}
                <button type="button" onClick={() => handleRemove(idx)}>❌</button>
              </li>
            ))}
          </ul>
          <input type="hidden" name="nature_items" value={JSON.stringify(items)} />
        </div>
      )}
    </div>
  );
}
