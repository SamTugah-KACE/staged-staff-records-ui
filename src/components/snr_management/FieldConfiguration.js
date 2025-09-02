import React, { useState } from 'react';
import { FaPencilAlt, FaSave } from 'react-icons/fa'; // Using react-icons for visual cues
import './FieldConfiguration.css'; // You may create a dedicated CSS file for styling

const FieldConfiguration = ({ field, index, onFieldUpdate }) => {
  const [isEditingLabel, setIsEditingLabel] = useState(false);
  const [tempLabel, setTempLabel] = useState(field.label);

  const [isEditingOptions, setIsEditingOptions] = useState(false);
  const [tempOptions, setTempOptions] = useState(
    field.options && field.options.choices ? field.options.choices.join(', ') : ''
  );

  // Handle label input change
  const handleLabelChange = (e) => {
    setTempLabel(e.target.value);
  };

  // Save the new label value
  const saveLabel = () => {
    onFieldUpdate(index, { label: tempLabel });
    setIsEditingLabel(false);
  };

  // Handle key press on input field (save on Enter)
  const handleKeyPress = (e) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      saveLabel();
    }
  };

  
  // Handle options changes.
  const handleOptionsChange = (e) => setTempOptions(e.target.value);
  const saveOptions = () => {
    const choices = tempOptions.split(',').map((opt) => opt.trim());
    onFieldUpdate(index, { options: { ...field.options, choices } });
    setIsEditingOptions(false);
  };
  const handleOptionsKeyPress = (e) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      saveOptions();
    }
  };

  const handleRequiredChange = (e) => {
    onFieldUpdate(index, { required: e.target.checked });
  };

  return (
    <div className="field-config">
      <div className="config-row">
        <span className="config-label">Label:</span>
        {isEditingLabel ? (
          <input
            type="text"
            value={tempLabel}
            onChange={handleLabelChange}
            onBlur={saveLabel}
            onKeyPress={handleKeyPress}
            className="config-input"
          />
        ) : (
          <>
            <span className="config-static-label">{field.label}</span>
            <button type="button" className="icon-btn" onClick={() => setIsEditingLabel(true)}  title="Edit Label">
              <FaPencilAlt />
            </button>
          </>
        )}
      </div>
      {/* Options Editing for radio, checkbox, select fields */}
      {['radio', 'checkbox', 'select'].includes(field.id) && (
        <div className="config-row">
          <span className="config-label">Options:</span>
          {isEditingOptions ? (
            <input
              type="text"
              value={tempOptions}
              onChange={handleOptionsChange}
              onBlur={saveOptions}
              onKeyPress={handleOptionsKeyPress}
              className="config-input"
              placeholder="e.g., Option1, Option2"
            />
          ) : (
            <>
              <span className="config-static-label">
                {field.options?.choices ? field.options.choices.join(', ') : 'N/A'}
              </span>
              <button
                type="button"
                className="icon-btn"
                onClick={() => setIsEditingOptions(true)}
                title="Edit Options"
              >
                <FaPencilAlt />
              </button>
            </>
          )}
        </div>
      )}
      {/* Required Checkbox */}
      <div className="config-row inline">
        <input
          type="checkbox"
          checked={field.required || false}
          onChange={handleRequiredChange}
          id={`required-${index}`}
        />
        <label htmlFor={`required-${index}`} className="config-required-label">
          Required
        </label>
      </div>
    </div>
  );
};

export default FieldConfiguration;
