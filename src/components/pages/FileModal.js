// FileModal.js
import React, { useRef, useEffect } from 'react';
import ReactDOM from 'react-dom';
import './FileModal.css';

const modalRoot = document.getElementById('modal-root');

const FileModal = ({ file, onClose }) => {
  // 1) Always create the container and register the effect
  const elRef = useRef(document.createElement('div'));
  useEffect(() => {
    const el = elRef.current;
    modalRoot.appendChild(el);
    return () => {
      modalRoot.removeChild(el);
    };
  }, []);

  // 2) Early return after hooks
  if (!file || !file.url) {
    return null;
  }

  // 3) Build the modal content
  const modalContent = (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={e => e.stopPropagation()}>
        <button className="modal-close" onClick={onClose}>×</button>
        <div className="iframe-container">
          <iframe
            src={file.url}
            title={file.filename}
            frameBorder="0"
            allowFullScreen
          />
        </div>
      </div>
    </div>
  );

  // 4) Portal it
  return ReactDOM.createPortal(modalContent, elRef.current);
};

export default FileModal;



// // FileModal.js
// import React, { useEffect } from 'react';
// import ReactDOM from 'react-dom';
// import './FileModal.css';

// const modalRoot = document.getElementById('modal-root');

// const FileModal = ({ file, onClose }) => {
//   // file = { filename: string, url: string }
//   if (!file || !file.url) return null;

  

//   return (
//     <div className="modal-overlay" onClick={onClose}>
//       <div className="modal-content" onClick={e => e.stopPropagation()}>
//         <button className="modal-close" onClick={onClose}>×</button>
//         <div className="iframe-container">
//           <iframe
//             src={file.url}
//             title={file.filename}
//             frameBorder="0"
//             allowFullScreen
//           />
//         </div>
//       </div>
//     </div>
//   );
// };

// export default FileModal;
