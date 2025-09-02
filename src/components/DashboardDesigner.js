import React, { useState } from 'react';
import './DashboardDesigner.css';

const availableComponents = [
  { id: 1, name: 'Text Field' },
  { id: 2, name: 'Date Picker' },
  { id: 3, name: 'Checkbox' },
  // ... more components
];

const DashboardDesigner = ({ onClose }) => {
  const [layout, setLayout] = useState([]);

  const addComponent = (comp) => {
    setLayout((prev) => [...prev, comp]);
  };

  const saveDesign = () => {
    // In production, generate the UI code and POST it to the server
    const generatedCode = JSON.stringify(layout, null, 2);
    alert('Design saved:\n' + generatedCode);
    onClose();
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="designer-modal" onClick={(e) => e.stopPropagation()}>
        <h2>Dashboard/Form Designer</h2>
        <div className="designer-content">
          <div className="available-components">
            <h3>Components</h3>
            <ul>
              {availableComponents.map(comp => (
                <li key={comp.id} onClick={() => addComponent(comp)}>
                  {comp.name}
                </li>
              ))}
            </ul>
          </div>
          <div className="design-area">
            <h3>Your Design</h3>
            {layout.length === 0 ? <p>Drag and drop components here.</p> : (
              <ul>
                {layout.map((comp, index) => (
                  <li key={index}>{comp.name}</li>
                ))}
              </ul>
            )}
          </div>
        </div>
        <div className="designer-actions">
          <button onClick={saveDesign}>Save Design</button>
          <button onClick={onClose}>Close</button>
        </div>
      </div>
    </div>
  );
};

export default DashboardDesigner;
