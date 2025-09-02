import React, { useState, useRef, useEffect } from 'react';
import { FaTimes, FaUpload, FaTrash, FaStar } from 'react-icons/fa';
import './LogoModal.css';

// Helper to normalize both array and dict-form logos
const normalizeLogos = (logos) => {
  if (Array.isArray(logos)) return logos;
  if (logos && typeof logos === 'object') {
    return Object.entries(logos).map(([name, url]) => ({
      id: null,         // no id in dict-form
      name,
      url,
      isDefault: false, // or derive your default logic
    }));
  }
  return [];
};

const LogoModal = ({ 
  isOpen, 
  onClose, 
  organization, 
  onAddLogos, 
  onUpdateTableLogos, 
  onRemoveLogo, 
  onSetDefault,
  getAllLogos, 
  isDarkMode,
}) => {
  const [selectedLogos, setSelectedLogos] = useState([]);
  const [defaultLogoId, setDefaultLogoId] = useState(null);
  const fileInputRef = useRef(null);

  useEffect(() => {
    if (isOpen && organization) {
      // Normalize logos before filtering
      const allOrgLogos = normalizeLogos(organization.logos);
      const currentTableLogos = allOrgLogos.filter(logo => logo.url !== '○');
      setSelectedLogos(currentTableLogos);
      const defaultLogo = currentTableLogos.find(logo => logo.isDefault);
      setDefaultLogoId(defaultLogo ? defaultLogo.id : null);
    }
  }, [isOpen, organization]);

  if (!isOpen || !organization) return null;

  const handleFileUpload = (event) => {
    const files = Array.from(event.target.files);
    if (files.length > 0) {
      onAddLogos(organization.id, files);
      event.target.value = null;
    }
  };

  const handleLogoSelect = (logo) => {
    setSelectedLogos(prev => {
      const isSelected = prev.some(selected => 
        selected.id === logo.id || (selected.url === logo.url && !logo.id)
      );
      if (isSelected && logo.id === defaultLogoId) return prev;
      if (isSelected) {
        return prev.filter(selected => selected.id !== logo.id && selected.url !== logo.url);
      } else {
        if (prev.length < 2) return [...prev, logo];
        if (defaultLogoId) {
          const defaultLogo = prev.find(selected => selected.id === defaultLogoId);
          return [defaultLogo, logo];
        }
        return [prev[1], logo];
      }
    });
  };

  const handleSetDefault = (logo) => {
    const logoId = logo.id;
    if (defaultLogoId === logoId) {
      setDefaultLogoId(null);
      onSetDefault(organization.id, null);
      return;
    }
    setDefaultLogoId(logoId);
    onSetDefault(organization.id, logoId);
    setSelectedLogos(prev => {
      const isAlreadySelected = prev.some(selected => selected.id === logoId);
      if (!isAlreadySelected) {
        if (prev.length < 2) return [...prev, logo];
        const otherLogos = prev.filter(selected => selected.id !== defaultLogoId);
        return [logo, otherLogos[0]];
      }
      return prev;
    });
  };

  const handleRemoveLogo = (logo) => {
    if (logo.id === defaultLogoId) {
      alert("Cannot remove the default logo. Please set another logo as default first.");
      return;
    }
    onRemoveLogo(organization.id, logo.id);
    setSelectedLogos(prev => prev.filter(selected => selected.id !== logo.id));
  };

  const handleSaveSelection = () => {
    const updatedSelection = selectedLogos.map(logo => ({
      ...logo,
      isDefault: logo.id === defaultLogoId
    }));
    onUpdateTableLogos(organization.id, updatedSelection);
    onClose();
  };

  // Normalize full set of logos before displaying
  const allLogosRaw = getAllLogos(organization.id);
  const allLogos = normalizeLogos(allLogosRaw);

  return (
    <div className={`logo-modal-overlay ${isDarkMode ? 'dark-mode' : ''}`} onClick={onClose}>
      <div className="logo-modal-content" onClick={(e) => e.stopPropagation()}>
        <div className="logo-modal-header">
          <h2>Manage Logos</h2>
          <button className="logo-modal-close-button" onClick={onClose}>
            <FaTimes />
          </button>
        </div>

        <div className="logo-modal-body">
          <div className="upload-section">
            <button 
              className="upload-button"
              onClick={() => fileInputRef.current?.click()}
            >
              <FaUpload /> Upload New Logos
            </button>
            <input
              type="file"
              ref={fileInputRef}
              onChange={handleFileUpload}
              accept="image/*"
              multiple
              style={{ display: 'none' }}
            />
          </div>

          <div className="logos-grid">
            {allLogos.length === 0 ? (
              <div className="no-logos">
                <p>No logos uploaded yet. Upload some logos to get started!</p>
              </div>
            ) : (
              allLogos.map((logo) => {
                const isSelected = selectedLogos.some(selected => 
                  selected.id === logo.id || selected.url === logo.url
                );
                const isDefault = logo.id === defaultLogoId;
                return (
                  <div 
                    key={logo.id || logo.url} 
                    className={`logo-item ${isSelected ? 'selected' : ''} ${isDefault ? 'default-logo' : ''}`}
                  >
                    <div className="logo-image-container">
                      <img 
                        src={logo.url} 
                        alt={logo.name}
                        className="logo-image"
                      />
                    </div>

                    <div className="logo-info">
                      <p className="logo-name">
                        {logo.name}
                        {isDefault && <span className="default-text"> (Default)</span>}
                      </p>
                      <div className="logo-actions">
                        <button
                          className={`select-button ${isSelected ? 'selected' : ''}`}
                          onClick={() => handleLogoSelect(logo)}
                          disabled={(!isSelected && selectedLogos.length >= 2) || isDefault}
                          title={isDefault ? "Default logo is always selected" : ""}
                        >
                          {isSelected ? (isDefault ? 'Default' : 'Selected') : 'Select'}
                        </button>
                        <button
                          className={`default-button ${isDefault ? 'active' : ''}`}
                          onClick={() => handleSetDefault(logo)}
                          title={isDefault ? "Click to unset as default" : "Set as default"}
                        >
                          <FaStar />
                        </button>
                        <button
                          className="remove-button"
                          onClick={() => handleRemoveLogo(logo)}
                          disabled={isDefault}
                          title={isDefault ? "Cannot remove default logo" : "Remove logo"}
                        >
                          <FaTrash />
                        </button>
                      </div>
                    </div>
                  </div>
                );
              })
            )}
          </div>

          <div className="selection-info">
            <p>Selected logos for table display: {selectedLogos.length}/2</p>
            {defaultLogoId && (
              <p className="default-info">
                Default logo: {allLogos.find(logo => logo.id === defaultLogoId)?.name}
              </p>
            )}
            {selectedLogos.length >= 2 && (
              <p className="max-selection">Maximum 2 logos can be displayed on the table</p>
            )}
          </div>
        </div>

        <div className="logo-modal-footer">
          <button className="cancel-button" onClick={onClose}>
            Cancel
          </button>
          <button className="save-button" onClick={handleSaveSelection}>
            Save Selection
          </button>
        </div>
      </div>
    </div>
  );
};

export default LogoModal;





// import React, { useState, useRef, useEffect } from 'react';
// import { FaTimes, FaUpload, FaTrash, FaStar } from 'react-icons/fa';
// import './LogoModal.css';



// // Helper to normalize both array and dict-form logos
// const normalizeLogos = (logos) => {
//   if (Array.isArray(logos)) return logos;
//   if (logos && typeof logos === 'object') {
//     return Object.entries(logos).map(([name, url]) => ({
//       id: null,         // no id in dict-form
//       name,
//       url,
//       isDefault: false, // or derive your default logic
//     }));
//   }
//   return [];
// };



// const LogoModal = ({ 
//   isOpen, 
//   onClose, 
//   organization, 
//   onAddLogos, 
//   onUpdateTableLogos, 
//   onRemoveLogo, 
//   onSetDefault,
//   getAllLogos, 
//   isDarkMode,
// }) => {
//   const [selectedLogos, setSelectedLogos] = useState([]);
//   const [defaultLogoId, setDefaultLogoId] = useState(null);
//   const fileInputRef = useRef(null);

//   useEffect(() => {
//     if (isOpen && organization) {
//       const currentTableLogos = organization.logos.filter(logo => logo.url !== '○');
//       setSelectedLogos(currentTableLogos);
      
//       const defaultLogo = currentTableLogos.find(logo => logo.isDefault);
//       setDefaultLogoId(defaultLogo ? defaultLogo.id : null);
//     }
//   }, [isOpen, organization]);

//   if (!isOpen || !organization) return null;

//   const handleFileUpload = (event) => {
//     const files = Array.from(event.target.files);
//     if (files.length > 0) {
//       onAddLogos(organization.id, files);
//       event.target.value = null;
//     }
//   };

//   const handleLogoSelect = (logo) => {
//     setSelectedLogos(prev => {
//       const isSelected = prev.some(selected => 
//         selected.id === logo.id || (selected.url === logo.url && !logo.id)
//       );
      
//       if (isSelected && logo.id === defaultLogoId) {
//         return prev; 
//       }
      
//       if (isSelected) {
//         return prev.filter(selected => 
//           selected.id !== logo.id && selected.url !== logo.url
//         );
//       } else {
//         if (prev.length < 2) {
//           return [...prev, logo];
//         } else {
//           if (defaultLogoId) {
//             const defaultLogo = prev.find(selected => selected.id === defaultLogoId);
//             return [defaultLogo, logo];
//           }
//           return [prev[1], logo];
//         }
//       }
//     });
//   };

//   const handleSetDefault = (logo) => {
//     const logoId = logo.id;
    
//     if (defaultLogoId === logoId) {
//       setDefaultLogoId(null);
//       onSetDefault(organization.id, null); 
//       return;
//     }
    
//     setDefaultLogoId(logoId);
//     onSetDefault(organization.id, logoId);
    
//     setSelectedLogos(prev => {
//       const isAlreadySelected = prev.some(selected => selected.id === logoId);
      
//       if (!isAlreadySelected) {
//         if (prev.length < 2) {
//           return [...prev, logo];
//         } else {
//           const otherLogos = prev.filter(selected => selected.id !== defaultLogoId);
//           return [logo, otherLogos[0]];
//         }
//       }
      
//       return prev;
//     });
//   };

//   const handleRemoveLogo = (logo) => {
//     if (logo.id === defaultLogoId) {
//       alert("Cannot remove the default logo. Please set another logo as default first.");
//       return;
//     }
    
//     onRemoveLogo(organization.id, logo.id);
//     setSelectedLogos(prev => prev.filter(selected => selected.id !== logo.id));
//   };

//   const handleSaveSelection = () => {
//     const updatedSelection = selectedLogos.map(logo => ({
//       ...logo,
//       isDefault: logo.id === defaultLogoId
//     }));
    
//     onUpdateTableLogos(organization.id, updatedSelection);
//     onClose();
//   };

//   const allLogos = getAllLogos(organization.id);

//   return (
//     <div className={`logo-modal-overlay ${isDarkMode ? 'dark-mode' : ''}`} onClick={onClose}>
//       <div className="logo-modal-content" onClick={(e) => e.stopPropagation()}>
//         <div className="logo-modal-header">
//           <h2>Manage Logos</h2>
//           <button className="logo-modal-close-button" onClick={onClose}>
//             <FaTimes />
//           </button>
//         </div>
        
//         <div className="logo-modal-body">
//           <div className="upload-section">
//             <button 
//               className="upload-button"
//               onClick={() => fileInputRef.current?.click()}
//             >
//               <FaUpload /> Upload New Logos
//             </button>
//             <input
//               type="file"
//               ref={fileInputRef}
//               onChange={handleFileUpload}
//               accept="image/*"
//               multiple
//               style={{ display: 'none' }}
//             />
//           </div>

//           <div className="logos-grid">
//             {allLogos.length === 0 ? (
//               <div className="no-logos">
//                 <p>No logos uploaded yet. Upload some logos to get started!</p>
//               </div>
//             ) : (
//               allLogos.map((logo) => {
//                 const isSelected = selectedLogos.some(selected => 
//                   selected.id === logo.id || selected.url === logo.url
//                 );
//                 const isDefault = logo.id === defaultLogoId;
                
//                 return (
//                   <div 
//                     key={logo.id || logo.url} 
//                     className={`logo-item ${isSelected ? 'selected' : ''} ${isDefault ? 'default-logo' : ''}`}
//                   >
//                     <div className="logo-image-container">
//                       <img 
//                         src={logo.url} 
//                         alt={logo.name}
//                         className="logo-image"
//                       />
                      
//                     </div>
                    
//                     <div className="logo-info">
//                       <p className="logo-name">
//                         {logo.name}
//                         {isDefault && <span className="default-text"> (Default)</span>}
//                       </p>
//                       <div className="logo-actions">
//                         <button
//                           className={`select-button ${isSelected ? 'selected' : ''}`}
//                           onClick={() => handleLogoSelect(logo)}
//                           disabled={(!isSelected && selectedLogos.length >= 2) || isDefault}
//                           title={isDefault ? "Default logo is always selected" : ""}
//                         >
//                           {isSelected ? (isDefault ? 'Default' : 'Selected') : 'Select'}
//                         </button>
//                         <button
//                           className={`default-button ${isDefault ? 'active' : ''}`}
//                           onClick={() => handleSetDefault(logo)}
//                           title={isDefault ? "Click to unset as default" : "Set as default"}
//                         >
//                           <FaStar />
//                         </button>
//                         <button
//                           className="remove-button"
//                           onClick={() => handleRemoveLogo(logo)}
//                           disabled={isDefault}
//                           title={isDefault ? "Cannot remove default logo" : "Remove logo"}
//                         >
//                           <FaTrash />
//                         </button>
//                       </div>
//                     </div>
//                   </div>
//                 );
//               })
//             )}
//           </div>

//           <div className="selection-info">
//             <p>Selected logos for table display: {selectedLogos.length}/2</p>
//             {defaultLogoId && (
//               <p className="default-info">
//                 Default logo: {allLogos.find(logo => logo.id === defaultLogoId)?.name}
//               </p>
//             )}
//             {selectedLogos.length >= 2 && (
//               <p className="max-selection">Maximum 2 logos can be displayed on the table</p>
//             )}
//           </div>
//         </div>

//         <div className="logo-modal-footer">
//           <button className="cancel-button" onClick={onClose}>
//             Cancel
//           </button>
//           <button className="save-button" onClick={handleSaveSelection}>
//             Save Selection
//           </button>
//         </div>
//       </div>
//     </div>
//   );
// };

// export default LogoModal;