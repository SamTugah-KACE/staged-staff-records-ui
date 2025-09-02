// src/components/OthersSectionForm.js
import React, { useState } from 'react';
import PropTypes from 'prop-types';
import { useForm, Controller } from 'react-hook-form';
import { formatISO, parseISO, isValid } from 'date-fns';
import './Staff.css';

/**
 * Flattens nested custom_data and parses JSON strings if present.
 */
function prepareData(raw = {}) {
  let data = { ...raw };
  if (data.custom_data && typeof data.custom_data === 'object') {
    data = { ...data, ...data.custom_data };
  }
  Object.entries(data).forEach(([key, value]) => {
    if (typeof value === 'string' && value.trim().startsWith('{') && value.trim().endsWith('}')) {
      try {
        const parsed = JSON.parse(value);
        if (parsed && typeof parsed === 'object' && !Array.isArray(parsed)) {
          data = { ...data, ...parsed };
        }
      } catch {}
    }
  });
  return data;
}

function inferType(key, value) {
  const k = key.toLowerCase();
  if (k.includes('email')) return 'email';
  if (k.includes('phone') || k.includes('tel')) return 'tel';
  if (k.includes('date') || (typeof value === 'string' && !isNaN(Date.parse(value)))) return 'date';
  if (k.includes('file') || k.includes('document') || k.includes('affidavit') || k.includes('path')) return 'file';
  if (k.includes('status') || k.startsWith('is_') || typeof value === 'boolean') return 'radio';
  return 'text';
}

export default function OthersSectionForm({ customData = {}, dynamicData = {}, onSubmit }) {
  const flatCustom = prepareData(customData);
  const flatDynamic = prepareData(dynamicData);
  const { handleSubmit, control, register } = useForm({ defaultValues: { ...flatCustom, ...flatDynamic } });
  const [modalUrl, setModalUrl] = useState(null);

  const openModal = url => setModalUrl(url);
  const closeModal = () => setModalUrl(null);

  // helper to render links safely
  const renderLinks = value => {
    if (!value) return [];
    if (typeof value === 'string') return [{ name: 'View', url: value }];
    if (typeof value === 'object' && value !== null) {
      return Object.entries(value).map(([name, url]) => ({ name, url }));
    }
    return [];
  };

  return (
    <>
      <form onSubmit={handleSubmit(onSubmit)} className="others-form">
        {/* <h3>Other Information</h3> */}

        <fieldset>
          <legend>Custom Data</legend>
          {Object.entries(flatCustom).map(([key, value]) => {
            const type = inferType(key, value);
            const id = `custom_${key}`;
            return (
              <div key={key} className="field-row">
                <label htmlFor={id}>{key}</label>
                {type === 'file' ? (
                  renderLinks(value).map(({ name, url }) => (
                    <button
                      type="button"
                      key={url}
                      className="details-button"
                      onClick={() => openModal(url)}
                    >
                      {name}
                    </button>
                  ))
                ) : type === 'radio' ? (
                  <Controller
                    name={key}
                    control={control}
                    render={({ field }) => (
                      <div>
                        <label>
                          <input {...field} type="radio" value="true" checked={field.value === true || field.value === 'true'} /> Yes
                        </label>
                        <label>
                          <input {...field} type="radio" value="false" checked={field.value === false || field.value === 'false'} /> No
                        </label>
                      </div>
                    )}
                  />
                ) : type === 'date' ? (
                  <Controller
                    name={key}
                    control={control}
                    render={({ field }) => {
                      const v = isValid(parseISO(field.value))
                        ? formatISO(parseISO(field.value), { representation: 'date' })
                        : '';
                      return <input type="date" id={id} {...field} value={v} />;
                    }}
                  />
                ) : (
                  <input type={type} id={id} defaultValue={value ?? ''} {...register(key)} />
                )}
              </div>
            );
          })}
        </fieldset>

        <fieldset>
          <legend>Dynamic Data</legend>
          {Object.entries(flatDynamic).map(([key, value]) => {
            const type = inferType(key, value);
            const id = `dynamic_${key}`;
            return (
              <div key={key} className="field-row">
                <label htmlFor={id}>{key}</label>
                {type === 'file' ? (
                  renderLinks(value).map(({ name, url }) => (
                    <button
                      type="button"
                      key={url}
                      className="details-button"
                      onClick={() => openModal(url)}
                    >
                      {name}
                    </button>
                  ))
                ) : (
                  <input
                    type={type}
                    id={id}
                    defaultValue={value ?? ''}
                    {...register(key)}
                  />
                )}
              </div>
            );
          })}
        </fieldset>

        <div className="form-actions">
          <button type="submit" className="save-button">Save Changes</button>
        </div>
      </form>

      {modalUrl && (
        <div className="contact-details-modal">
          <div className="details-backdrop" onClick={closeModal} />
          <div className="details-content">
            <iframe
              src={modalUrl}
              title="Document Viewer"
              style={{ width: '100%', height: '80vh', border: 'none' }}
            />
            <button onClick={closeModal} className="cancel-button" style={{ marginTop: '1rem' }}>
              Close
            </button>
          </div>
        </div>
      )}
    </>
  );
}

OthersSectionForm.propTypes = {
  customData: PropTypes.object,
  dynamicData: PropTypes.object,
  onSubmit: PropTypes.func.isRequired,
};
