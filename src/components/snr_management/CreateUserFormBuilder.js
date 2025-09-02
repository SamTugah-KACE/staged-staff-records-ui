// // src/components/snr_management/CreateUserFormBuilder.js
// import React, { useState, useEffect, useCallback } from 'react';
// import { DndProvider, useDrag, useDrop } from 'react-dnd';
// import { HTML5Backend } from 'react-dnd-html5-backend';
// import { motion } from 'framer-motion';
// import './FormBuilderModal.css';
// import request from '../request';
// import FieldConfiguration from './FieldConfiguration';


// // Define the available fields.
// const availableFields = [
//   { id: 'text', label: 'Text Input' },
//   { id: 'email', label: 'Email Input' },
//   { id: 'url', label: 'URL Input' },
//   { id: 'date', label: 'Date Picker' },
//   { id: 'phone', label: 'Phone Number' },
//   { id: 'radio', label: 'Radio Buttons' },
//   { id: 'checkbox', label: 'Checkboxes' },
//   { id: 'file', label: 'File Upload' },
//   { id: 'role_select', label: 'Role Selection' },
//   { id: 'submit', label: 'Submit Button' },
//   { id: 'text_area', label: 'Text Area' },
//   { id: 'number', label: 'Number Input' },
//   { id: 'select', label: 'Dropdown Select' },
// ];

// const initialFormFields = [];

// /** FieldConfiguration renders inline controls for each dropped field */
// // const FieldConfiguration = ({ field, index, onFieldUpdate }) => {
// //   const handleChange = (e) => {
// //     const { name, value, type, checked } = e.target;
// //     const newVal = type === 'checkbox' ? checked : value;
// //     onFieldUpdate(index, { [name]: newVal });
// //   };

// //   return (
// //     <div className="field-config">
// //       <div className="config-group">
// //         <label>Label</label>
// //         <input
// //           type="text"
// //           name="label"
// //           value={field.label}
// //           onChange={handleChange}
// //           placeholder="Field label"
// //         />
// //       </div>
// //       {['radio', 'checkbox', 'select'].includes(field.id) && (
// //         <div className="config-group">
// //           <label>Options (comma separated)</label>
// //           <input
// //             type="text"
// //             name="choices"
// //             value={field.options?.choices ? field.options.choices.join(',') : ''}
// //             onChange={(e) =>
// //               onFieldUpdate(index, {
// //                 options: {
// //                   ...field.options,
// //                   choices: e.target.value.split(',').map((opt) => opt.trim()),
// //                 },
// //               })
// //             }
// //             placeholder="e.g., Option1, Option2"
// //           />
// //         </div>
// //       )}
// //       <div className="config-group">
// //         <label>
// //           <input
// //             type="checkbox"
// //             name="required"
// //             checked={field.required || false}
// //             onChange={handleChange}
// //           />{' '}
// //           Required
// //         </label>
// //       </div>
// //     </div>
// //   );
// // };

// /** DraggableField for the available fields palette */
// const DraggableField = ({ field }) => {
//   const [{ isDragging }, drag] = useDrag(() => ({
//     type: 'FIELD',
//     item: { field },
//     collect: (monitor) => ({ isDragging: monitor.isDragging() }),
//   }));
//   return (
//     <div ref={drag} className="field-item" style={{ opacity: isDragging ? 0.5 : 1 }}>
//       {field.label}
//     </div>
//   );
// };

// /** FormFieldItem: a draggable field in the builder area with inline configuration */
// const FormFieldItem = ({ field, index, moveField, onFieldUpdate }) => {
//   const ref = React.useRef(null);
//   const [, drop] = useDrop({
//     accept: 'BUILDER_FIELD',
//     hover(item, monitor) {
//       if (!ref.current) return;
//       const dragIndex = item.index;
//       const hoverIndex = index;
//       if (dragIndex === hoverIndex) return;
//       const hoverBoundingRect = ref.current.getBoundingClientRect();
//       const hoverMiddleY = (hoverBoundingRect.bottom - hoverBoundingRect.top) / 2;
//       const clientOffset = monitor.getClientOffset();
//       const hoverClientY = clientOffset.y - hoverBoundingRect.top;
//       if (dragIndex < hoverIndex && hoverClientY < hoverMiddleY) return;
//       if (dragIndex > hoverIndex && hoverClientY > hoverMiddleY) return;
//       moveField(dragIndex, hoverIndex);
//       item.index = hoverIndex;
//     },
//   });

//   const [{ isDragging }, drag] = useDrag({
//     type: 'BUILDER_FIELD',
//     item: { type: 'BUILDER_FIELD', id: field.id, index },
//     collect: (monitor) => ({ isDragging: monitor.isDragging() }),
//   });
//   drag(drop(ref));

//   return (
//     <motion.div
//       ref={ref}
//       className="form-field"
//       style={{ opacity: isDragging ? 0.5 : 1 }}
//       initial={{ opacity: 0, y: 10 }}
//       animate={{ opacity: 1, y: 0 }}
//       transition={{ duration: 0.2 }}
//     >
//       <div className="field-display">
//         <strong>{field.label}</strong>
//       </div>
//       <FieldConfiguration field={field} index={index} onFieldUpdate={onFieldUpdate} />
//     </motion.div>
//   );
// };

// /** The main form builder component */
// const CreateUserFormBuilder = ({ organizationId, onClose, onSaveSuccess }) => {
//   const [formFields, setFormFields] = useState(initialFormFields);
//   const [userCreateUrl, setUserCreateUrl] = useState('');
//   const [roleOptions, setRoleOptions] = useState([]);

//   // Fetch the user create URL.
//   useEffect(() => {
//     const fetchCreateUrl = async () => {
//       try {
//         const res = await request.get('/organizations/create-url');
//         if (res.status !== 200) throw new Error('Failed to fetch create URL');
//         const data = await res.json();
//         setUserCreateUrl(data.user_create_url);
//       } catch (error) {
//         console.error('Error fetching create URL:', error);
//       }
//     };
//     fetchCreateUrl();
//   }, []);

//   // Fetch role options.
//   useEffect(() => {
//     const fetchRoleOptions = async () => {
//       try {
//         let res = await request.get(`/fetch?organization_id=${organizationId}&skip=0&limit=100`);
//         let data = await res.json();
//         if (!data?.data || data.data.length === 0) {
//           res = await request.get(`/default/fetch-all/?skip=0&limit=100`);
//           data = await res.json();
//         }
//         if (data?.data) {
//           const roles = data.data.map((role) => ({ id: role.id, name: role.name }));
//           setRoleOptions(roles);
//         }
//       } catch (error) {
//         console.error('Error fetching role options:', error);
//       }
//     };
//     fetchRoleOptions();
//   }, [organizationId]);

//   // Move field for reordering within the builder.
//   const moveField = useCallback((dragIndex, hoverIndex) => {
//     setFormFields((prevFields) => {
//       const updatedFields = Array.from(prevFields);
//       const [removed] = updatedFields.splice(dragIndex, 1);
//       updatedFields.splice(hoverIndex, 0, removed);
//       return updatedFields;
//     });
//   }, []);

//   const updateField = (index, updateProps) => {
//     setFormFields((prev) => {
//       const newFields = [...prev];
//       newFields[index] = { ...newFields[index], ...updateProps };
//       return newFields;
//     });
//   };

//   // The drop zone for adding fields from the palette.
//   const FormBuilderArea = () => {
//     const [, drop] = useDrop({
//       accept: 'FIELD',
//       drop: (item) => {
//         const field = availableFields.find((f) => f.id === item.field.id);
//         if (field) {
//           const newField = {
//             ...field,
//             options: ['role_select', 'radio', 'checkbox', 'select'].includes(field.id)
//               ? { choices: [] }
//               : {},
//             required: false,
//             validation: field.id === 'phone'
//               ? { countryCodes: ['+1', '+44', '+91'], maxLength: 10 }
//               : field.id === 'email'
//               ? { regex: '^[\\w-.]+@([\\w-]+\\.)+[\\w-]{2,4}$' }
//               : {},
//           };
//           setFormFields((prev) => [...prev, newField]);
//         }
//       },
//     });
//     return (
//       <div ref={drop} className="form-builder">
//         <h3>Your Form</h3>
//         {formFields.map((field, index) => (
//           <FormFieldItem
//             key={index}
//             field={field}
//             index={index}
//             moveField={moveField}
//             onFieldUpdate={updateField}
//           />
//         ))}
//       </div>
//     );
//   };

//   // Automatically ensure a "submit" field exists before saving.
//   const ensureSubmitField = (fields) => {
//     if (!fields.some((field) => field.id === 'submit')) {
//       return [
//         ...fields,
//         {
//           id: 'submit',
//           label: 'Submit',
//           required: false,
//           options: {},
//           validation: {},
//         },
//       ];
//     }
//     return fields;
//   };

//   // Save the form design.
//   const handleSaveForm = async () => {
//     const fieldsWithSubmit = ensureSubmitField(formFields);
//     const formDesign = {
//       fields: fieldsWithSubmit,
//       submitCode: "",
//     };
//     try {
//       const res = await request.post('/dashboards/dashboards', JSON.stringify({ organization_id: organizationId, form_design: formDesign })
//       //   {
//       //   method: 'POST',
//       //   headers: {
//       //     'Content-Type': 'application/json',
//       //     Authorization: `Bearer ${localStorage.getItem('token')}`,
//       //   },
//       //   body: JSON.stringify({ organization_id: organizationId, form_design: formDesign }),
//       // }
//     );
//       if (!res.ok) throw new Error('Error saving form design');
//       onSaveSuccess();
//       onClose();
//     } catch (error) {
//       console.error('Error saving form design:', error);
//       alert(error.message);
//     }
//   };

//   return (
//     <DndProvider backend={HTML5Backend}>
//       <div className="modal-overlay">
//         <div className="modal-content">
//           <h2>Form Builder</h2>
//           <div className="builder-container">
//             <div className="field-palette">
//               <h3>Available Fields</h3>
//               {availableFields.map((field) => (
//                 <DraggableField key={field.id} field={field} />
//               ))}
//             </div>
//             <FormBuilderArea />
//           </div>
//           <div className="modal-actions">
//             <button onClick={handleSaveForm}>Save Form Design</button>
//             <button onClick={onClose}>Cancel</button>
//           </div>
//         </div>
//       </div>
//     </DndProvider>
//   );
// };

// export default CreateUserFormBuilder;


// src/components/snr_management/CreateUserFormBuilder.js
import React, { useState, useEffect, useCallback } from 'react';
import { DndProvider, useDrag, useDrop } from 'react-dnd';
import { HTML5Backend } from 'react-dnd-html5-backend';
// import { motion, AnimatePresence } from 'framer-motion'; // Temporarily disabled for drag and drop debugging
import './FormBuilderModal.css';
import request from '../request';
import FieldConfiguration from './FieldConfiguration';
import { FaTrashAlt } from 'react-icons/fa'; // For remove button
import { toast } from 'react-toastify';
import { compileForm, validateFormCompilation } from './FormCompiler';

// Define the available fields.
const availableFields = [
  { id: 'text', label: 'Text Input' },
  { id: 'email', label: 'Email Input' },
  { id: 'url', label: 'URL Input' },
  { id: 'date', label: 'Date Picker' },
  { id: 'phone', label: 'Phone Number' },
  { id: 'radio', label: 'Radio Buttons' },
  { id: 'checkbox', label: 'Checkboxes' },
  { id: 'file', label: 'File Upload' },
  { id: 'role_select', label: 'Role Selection' },
  { id: 'submit', label: 'Submit Button' },
  { id: 'text_area', label: 'Text Area' },
  { id: 'number', label: 'Number Input' },
  { id: 'select', label: 'Dropdown Select' },
];

const initialFormFields = [];

/** DraggableField: Displays each available field in the palette */
const DraggableField = ({ field }) => {
  const [{ isDragging }, drag] = useDrag(() => ({
    type: 'FIELD',
    item: () => {
      console.log('Drag started for field:', field); // Debug log
      return { field };
    },
    collect: (monitor) => ({ 
      isDragging: monitor.isDragging() 
    }),
    end: (item, monitor) => {
      console.log('Drag ended for field:', field); // Debug log
    },
  }));
  
  return (
    <div 
      ref={drag} 
      className={`field-item ${isDragging ? 'dragging' : ''}`}
      style={{ 
        cursor: isDragging ? 'grabbing' : 'grab',
        opacity: isDragging ? 0.5 : 1 
      }}
    >
      {field.label}
    </div>
  );
};

/** FormFieldItem: Displays a dropped field with inline configuration and a remove button */
const FormFieldItem = ({ field, index, moveField, onFieldUpdate, onRemove }) => {
  const ref = React.useRef(null);
  
  // Enable drop to reorder.
  const [, drop] = useDrop({
    accept: 'BUILDER_FIELD',
    hover(item, monitor) {
      if (!ref.current) return;
      const dragIndex = item.index;
      const hoverIndex = index;
      if (dragIndex === hoverIndex) return;
      const hoverBoundingRect = ref.current.getBoundingClientRect();
      const hoverMiddleY = (hoverBoundingRect.bottom - hoverBoundingRect.top) / 2;
      const clientOffset = monitor.getClientOffset();
      const hoverClientY = clientOffset.y - hoverBoundingRect.top;
      if (dragIndex < hoverIndex && hoverClientY < hoverMiddleY) return;
      if (dragIndex > hoverIndex && hoverClientY > hoverMiddleY) return;
      moveField(dragIndex, hoverIndex);
      item.index = hoverIndex;
    },
  });
  const [{ isDragging }, drag] = useDrag({
    type: 'BUILDER_FIELD',
    item: () => ({ type: 'BUILDER_FIELD', id: field.id, index }),
    collect: (monitor) => ({ isDragging: monitor.isDragging() }),
  });
  drag(drop(ref));

  return (
    <div
      ref={ref}
      className="form-field"
      style={{ opacity: isDragging ? 0.5 : 1 }}
    >
      <div className="field-display">
        <strong>{field.label}</strong>
        <button
          type="button"
          className="remove-field-btn"
          onClick={() => onRemove(index)}
          title="Remove field"
        >
          <FaTrashAlt />
        </button>
      </div>
      <FieldConfiguration field={field} index={index} onFieldUpdate={onFieldUpdate} />
    </div>
  );
};

/** FormBuilderArea: The drop zone where fields are assembled */
const FormBuilderArea = ({ formFields, setFormFields, moveField, updateField, removeField }) => {
  const [{ isOver, canDrop }, drop] = useDrop({
    accept: 'FIELD',
    drop: (item, monitor) => {
      console.log('Dropped item:', item); // Debug log
      console.log('Drop result:', monitor.getDropResult()); // Debug log
      
      const field = availableFields.find((f) => f.id === item.field.id);
      if (field) {
        const newField = {
          ...field,
          options: ['role_select', 'radio', 'checkbox', 'select'].includes(field.id)
            ? { choices: [] }
            : {},
          required: false,
          validation: field.id === 'phone'
            ? { countryCodes: ['+1', '+44', '+91', '+233'], maxLength: 10 }
            : field.id === 'email'
            ? { regex: '^[\\w-.]+@([\\w-]+\\.)+[\\w-]{2,4}$' }
            : {},
        };
        console.log('Adding new field:', newField); // Debug log
        setFormFields((prev) => [...prev, newField]);
      }
    },
    collect: (monitor) => ({
      isOver: monitor.isOver(),
      canDrop: monitor.canDrop(),
    }),
  });
  return (
    <div 
      ref={drop} 
      className={`form-builder ${isOver ? 'drag-over' : ''} ${canDrop ? 'can-drop' : ''}`}
    >
      <h3>Your Form</h3>
      {isOver && canDrop && (
        <div style={{ 
          position: 'absolute', 
          top: '50%', 
          left: '50%', 
          transform: 'translate(-50%, -50%)',
          background: 'rgba(0, 123, 255, 0.1)',
          padding: '20px',
          borderRadius: '8px',
          border: '2px dashed #007bff',
          color: '#007bff',
          fontWeight: 'bold',
          zIndex: 10
        }}>
          Drop field here
        </div>
      )}
      {formFields.map((field, index) => (
        <FormFieldItem
          key={`${field.id}-${index}`}
          field={field}
          index={index}
          moveField={moveField}
          onFieldUpdate={updateField}
          onRemove={removeField}
        />
      ))}
      {formFields.length === 0 && (
        <div className="empty-state">
          Drag fields from the palette to build your form
          <p>Please include fields for the following records</p>
          <br/>
          <i>Title or Prefix</i> - Dropdown Selection <br/>
          <i>First Name or Given Name</i> - Text Input <br/>
          <i>Middle Name</i> - Text Input <br/>
          <i>Last Name or Surname</i> - Text Input <br/>
          <i>Email</i> - Email Field & <br/>
          <i>Role</i> - Role Selection Field
          <br/>
        <strong>System accepts just one File Upload Field</strong>
        </div>
      )}
    </div>
  );
};

const CreateUserFormBuilder = ({ organizationId, userId, onClose, onSaveSuccess }) => {
  const [formFields, setFormFields] = useState(initialFormFields);
  const [userCreateUrl, setUserCreateUrl] = useState('');

  // Fetch the user create URL.
  useEffect(() => {
    const fetchCreateUrl = async () => {
      try {
        const res = await request.get('/organizations/create-url');
        if (res.status !== 200) throw new Error('Failed to fetch create URL');
        const data = await res.data;
        console.log("user_create_url data: ", data);
        console.log("user_create_url: ", data.user_create_url);
        setUserCreateUrl(data.user_create_url);
      } catch (error) {
        console.error('Error fetching create URL:', error);
      }
    };
    fetchCreateUrl();
  }, []);

  // Note: Role options are handled by the FieldConfiguration component

  // Reorder fields.
  const moveField = useCallback((dragIndex, hoverIndex) => {
    setFormFields((prevFields) => {
      const updatedFields = Array.from(prevFields);
      const [removed] = updatedFields.splice(dragIndex, 1);
      updatedFields.splice(hoverIndex, 0, removed);
      return updatedFields;
    });
  }, []);

  // Update a field's properties.
  const updateField = (index, updateProps) => {
    setFormFields((prev) => {
      const newFields = [...prev];
      newFields[index] = { ...newFields[index], ...updateProps };
      return newFields;
    });
  };

  // Remove a field from the form.
  const removeField = (index) => {
    setFormFields((prev) => prev.filter((_, i) => i !== index));
  };

  // Ensure a "submit" field exists.
  // Optionally check if a submit field is already included; if not, we do not add one automatically.
  const ensureSubmitField = (fields) => {
    if (!fields.some((field) => field.id === 'submit')) {
      return [
        ...fields,
        {
          id: 'submit',
          label: 'Submit',
          required: false,
          options: {},
          validation: {},
        },
      ];
    }
    return fields;
  };

  // Save the form design with compiled HTML, CSS, and JS
  const handleSaveForm = async () => {
    console.log("userId: ", userId);
    console.log("organizationId: ", organizationId);
    
    const fieldsWithSubmit = ensureSubmitField(formFields);
    
    // Compile the form using the FormCompiler utility
    const compiledForm = compileForm(fieldsWithSubmit);
    
    // Validate the compiled form
    const validation = validateFormCompilation(compiledForm);
    if (!validation.isValid) {
      toast.error(`Form validation failed: ${validation.errors.join(', ')}`);
      return;
    }
    
    // Add submit code and additional metadata
    const formDesign = {
      ...compiledForm,
      submitCode: "",
      submitUrl: userCreateUrl || "/users/create"
    };
    
    // Prepare a complete dashboard payload
    const dashboardPayload = {
      dashboard_name: "User Registration Form",
      dashboard_data: formDesign,
      access_url: userCreateUrl || "",
      organization_id: organizationId,
      user_id: userId || null,
    };
    
    try {
      const res = await request.post(
        '/dashboards/upsert',
        JSON.stringify(dashboardPayload)
      );
      
      if (res.status !== 201) {
        throw new Error('Error saving form design');
      }
      
      console.log('Compiled form saved successfully:', compiledForm);
      toast.success(`Form design saved successfully! ${compiledForm.isMultiStep ? `Multi-step form with ${compiledForm.totalSteps} steps created.` : 'Single-step form created.'}`);
      onSaveSuccess();
      onClose();
    } catch (error) {
      console.error('Error saving form design:', error);
      toast.error(`Error saving form design: ${error.message}`);
    }
  };

  // Handle keyboard events
  useEffect(() => {
    const handleKeyDown = (event) => {
      if (event.key === 'Escape') {
        onClose();
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [onClose]);

  // Debug: Log when component mounts
  useEffect(() => {
    console.log('CreateUserFormBuilder mounted');
    console.log('Available fields:', availableFields);
  }, []);

  return (
    <DndProvider backend={HTML5Backend}>
      <div className="modal-overlay" onClick={onClose}>
        <div 
          className="modal-content" 
          onClick={(e) => e.stopPropagation()}
        >
          <h2>Form Builder</h2>
          <button 
            className="close-btn" 
            onClick={onClose} 
            aria-label="Close modal"
            tabIndex={0}
          >
            &times;
          </button>
          
          <div className="description">
            Drag fields from the palette to build your form. Configure each field as needed.
          </div>

          <div className="builder-container">
            <div className="field-palette">
              <h3>Available Fields</h3>
              {availableFields.map((field) => (
                <DraggableField key={field.id} field={field} />
              ))}
            </div>
            <FormBuilderArea
              formFields={formFields}
              setFormFields={setFormFields}
              moveField={moveField}
              updateField={updateField}
              removeField={removeField}
            />
          </div>
          <div className="modal-actions">
            <button onClick={handleSaveForm}>
              Save Form Design
            </button>
            <button onClick={onClose}>
              Cancel
            </button>
          </div>
        </div>
      </div>
    </DndProvider>
  );
};

export default CreateUserFormBuilder;






































// import React, { useState, useEffect } from 'react';
// import { DragDropContext, Droppable, Draggable } from 'react-beautiful-dnd';
// import './FormBuilderModal.css';
// import request from '../request';
// import { motion } from 'framer-motion';

// // Available field definitions; note the added "role_select" option.
// const availableFields = [
//   { id: 'text', label: 'Text Input' },
//   { id: 'email', label: 'Email Input' },
//   { id: 'url', label: 'URL Input' },
//   { id: 'date', label: 'Date Picker' },
//   { id: 'phone', label: 'Phone Number' },
//   { id: 'radio', label: 'Radio Buttons' },
//   { id: 'checkbox', label: 'Checkboxes' },
//   { id: 'file', label: 'File Upload' },
//   { id: 'role_select', label: 'Role Selection' },
//   { id: 'submit', label: 'Submit Button' },
//   {id: 'text_area', label: 'Text Area'},
//   {id: 'number', label: 'Number Input'},
//   {id: 'select', label: 'Dropdown Select'},
//   // add other fields as needed
// ];

// const initialFormFields = [];

// const CreateUserFormBuilderBuilder = ({ organizationId, onClose, onSaveSuccess }) => {
//   // State holds the current form fields, fetched create URL, and available role options.
//   const [formFields, setFormFields] = useState(initialFormFields);
//   const [userCreateUrl, setUserCreateUrl] = useState('');
//   const [roleOptions, setRoleOptions] = useState([]); // { id, name }

//   // Prefetch the User Create API URL.
//   useEffect(() => {
//     const fetchCreateUrl = async () => {
//       try {
//         const res = await request.get('/organizations/create-url', 
//         //   {
//         //   method: 'GET',
//         //   // headers: {
//         //   //   Authorization: `Bearer ${localStorage.getItem('token')}`,
//         //   // },
//         // }
//       );
//         if (!res.ok) throw new Error('Failed to fetch create URL');
//         const data = await res.json();
//         setUserCreateUrl(data.user_create_url);
//       } catch (error) {
//         console.error('Error fetching create URL:', error);
//       }
//     };
//     fetchCreateUrl();
//   }, []);

//   // Fetch role options using the protected endpoint. If empty, fallback to default API.
//   useEffect(() => {
//     const fetchRoleOptions = async () => {
//       try {
//         // First try the primary API.
//         let res = await request.get(
//           `/fetch?organization_id=${organizationId}&skip=0&limit=100`,
//           // {
//           //   // headers: {
//           //   //   Authorization: `Bearer ${localStorage.getItem('token')}`,
//           //   // },
//           // }
//         );
//         let data = await res.json();
//         // If empty array, fetch from fallback.
//         if (!data?.data || data.data.length === 0) {
//           res = await request.get(`/default/fetch-all/?skip=0&limit=100`, 
//           //   {
//           //   headers: {
//           //     Authorization: `Bearer ${localStorage.getItem('token')}`,
//           //   },
//           // }
//         );
//           data = await res.json();
//         }
//         // Expecting data.data to be an array of roles.
//         if (data?.data) {
//           // Map the list so that each role has id (unique identifier) and name.
//           const roles = data.data.map(role => ({
//             id: role.id,
//             name: role.name,
//           }));
//           setRoleOptions(roles);
//         }
//       } catch (error) {
//         console.error('Error fetching role options:', error);
//       }
//     };
//     fetchRoleOptions();
//   }, [organizationId]);

//   // Handle reordering in the form builder area.
//   const reorderFields = (list, startIndex, endIndex) => {
//     const result = Array.from(list);
//     const [removed] = result.splice(startIndex, 1);
//     result.splice(endIndex, 0, removed);
//     return result;
//   };

//   // Field configuration component renders inline controls for updating field properties.
//   const FieldConfiguration = ({ field, index, onFieldUpdate }) => {
//     const handleChange = (e) => {
//       const { name, value, type, checked } = e.target;
//       const newVal = type === 'checkbox' ? checked : value;
//       onFieldUpdate(index, { [name]: newVal });
//     };

//     return (
//       <div className="field-config">
//         <div className="config-group">
//           <label>Label</label>
//           <input
//             type="text"
//             name="label"
//             value={field.label}
//             onChange={handleChange}
//             placeholder="Field label"
//           />
//         </div>
//         {['radio', 'checkbox', 'select'].includes(field.id) && (
//           <div className="config-group">
//             <label>Options (comma separated)</label>
//             <input
//               type="text"
//               name="choices"
//               value={field.options?.choices ? field.options.choices.join(',') : ''}
//               onChange={(e) =>
//                 onFieldUpdate(index, { options: { ...field.options, choices: e.target.value.split(',').map(opt => opt.trim()) } })
//               }
//               placeholder="e.g., Option1, Option2"
//             />
//           </div>
//         )}
//         <div className="config-group">
//           <label>
//             <input
//               type="checkbox"
//               name="required"
//               checked={field.required || false}
//               onChange={handleChange}
//             />{' '}
//             Required
//           </label>
//         </div>
//       </div>
//     );
//   };

//   const updateField = (index, updateProps) => {
//     setFormFields(prev => {
//       const newFields = [...prev];
//       newFields[index] = { ...newFields[index], ...updateProps };
//       return newFields;
//     });
//   };

//   // Drag and drop handler.
//   const onDragEnd = (result) => {
//     const { source, destination, draggableId } = result;
//     if (!destination) return;

//     // When dragging from palette to form builder, add a new field.
//     if (source.droppableId === 'availableFields' && destination.droppableId === 'formBuilder') {
//       const field = availableFields.find(f => f.id === draggableId);
//       // For role selection field, attach an empty options array that will be replaced by roleOptions.
//       const newField = {
//         ...field,
//         // If field is role_select, set options to roleOptions; else initialize empty options object.
//         options: ['role_select', 'radio', 'checkbox', 'select'].includes(field.id)
//           ? { choices: [] }
//           : {},
//         required: false,
//         validation:
//           field.id === 'phone'
//             ? { countryCodes: ['+1', '+44', '+91'], maxLength: 10 }
//             : field.id === 'email'
//             ? { regex: '^[\\w-.]+@([\\w-]+\\.)+[\\w-]{2,4}$' }
//             : {},
//       };
//       setFormFields(prev => [...prev, newField]);
//       return;
//     }

//     // If reordering within the form builder area.
//     if (
//       source.droppableId === 'formBuilder' &&
//       destination.droppableId === 'formBuilder'
//     ) {
//       const reordered = reorderFields(formFields, source.index, destination.index);
//       setFormFields(reordered);
//     }
//   };

//   // Update a field's options.
//   const updateFieldOptions = (index, options) => {
//     setFormFields(prev => {
//       const newFields = [...prev];
//       newFields[index].options = { ...newFields[index].options, ...options };
//       return newFields;
//     });
//   };

//   // Toggle a field's required flag.
//   const toggleRequired = (index) => {
//     setFormFields(prev => {
//       const newFields = [...prev];
//       newFields[index].required = !newFields[index].required;
//       return newFields;
//     });
//   };

//   // Automatically ensure a "submit" field exists.
//   const ensureSubmitField = (fields) => {
//     const hasSubmit = fields.some(field => field.id === 'submit');
//     if (!hasSubmit) {
//       return [
//         ...fields,
//         {
//           id: 'submit',
//           label: 'Submit',
//           required: false,
//           // No options or validation needed.
//           options: {},
//           validation: {}
//         }
//       ];
//     }
//     return fields;
//   };

//   // Build the form payload (used if not file-upload).
//   const buildFormPayload = () => {
//     const payload = {};
//     formFields.forEach(field => {
//       // For non-submit fields, gather values from the DOM. In a real app, use controlled components.
//       if (field.id !== 'submit') {
//         const el = document.getElementById(field.id);
//         if (el) payload[field.id] = el.value;
//       }
//     });
//     payload.organization_id = organizationId;
//     return payload;
//   };

//   // Robust submit function that handles file fields.
//   const submitForm = async () => {
//     try {
//       let response;
//       const hasFileField = formFields.some(field => field.id === 'file');
//       if (hasFileField) {
//         // Build FormData object for file uploads.
//         const formData = new FormData();
//         formFields.forEach(field => {
//           const el = document.getElementById(field.id);
//           if (el) {
//             if (field.id === 'file') {
//               if (el.files && el.files.length) {
//                 Array.from(el.files).forEach(file => formData.append(field.id, file));
//                 if (field.options.acceptedFiles) {
//                   formData.append(`${field.id}_acceptedFiles`, field.options.acceptedFiles.join(','));
//                 }
//                 if (field.options.maxFiles) {
//                   formData.append(`${field.id}_maxFiles`, field.options.maxFiles);
//                 }
//               }
//             } else {
//               formData.append(field.id, el.value);
//             }
//           }
//         });
//         formData.append('organization_id', organizationId);
//         response = await request.post(userCreateUrl, {
//           method: 'POST',
//           headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
//           body: formData
//         });
//       } else {
//         // Otherwise send as JSON.
//         const payload = buildFormPayload();
//         response = await request.post(userCreateUrl, {
//           method: 'POST',
//           headers: {
//             'Content-Type': 'application/json',
//             Authorization: `Bearer ${localStorage.getItem('token')}`
//           },
//           body: JSON.stringify(payload)
//         });
//       }
//       if (!response.ok) {
//         const errorData = await response.json();
//         throw new Error(errorData.detail || 'Submission failed');
//       }
//       alert('Form submitted successfully!');
//     } catch (error) {
//       console.error('Submit Form Error:', error);
//       alert(error.message);
//     }
//   };

//   // Handle save form design.
//   const handleSaveForm = async () => {
//     // Ensure the submit field is part of the design.
//     const fieldsWithSubmit = ensureSubmitField(formFields);
//     // Package the design as JSON.
//     const formDesign = {
//       fields: fieldsWithSubmit,
//       // The submitCode is NOT compiled on the frontend.
//       // Instead, the backend will precompile the dynamic submit code and embed it.
//       submitCode: ""
//     };
//     try {
//       const res = await request.post('/dashboards/dashboards', {
//         method: 'POST',
//         headers: {
//           'Content-Type': 'application/json', 
//           Authorization: `Bearer ${localStorage.getItem('token')}`
//         },
//         body: JSON.stringify({ organization_id: organizationId, form_design: formDesign })
//       });
//       if (!res.ok) throw new Error('Error saving form design');
//       onSaveSuccess();
//       onClose();
//     } catch (error) {
//       console.error('Error saving form design:', error);
//       alert(error.message);
//     }
//   };

  

//   return (
//     <div className="modal-overlay">
//       <div className="modal-content">
//         <h2>Form Builder</h2>
//         <div className="builder-container">
//           <div className="field-palette">
//             <h3>Available Fields</h3>
//             <DragDropContext onDragEnd={onDragEnd}>
//               <Droppable droppableId="availableFields">
//                 {(provided) => (
//                   <div ref={provided.innerRef} {...provided.droppableProps}>
//                     {availableFields.map((field, index) => (
//                       <Draggable key={field.id} draggableId={field.id} index={index}>
//                         {(provided) => (
//                           <div className="field-item"
//                             ref={provided.innerRef}
//                             {...provided.draggableProps}
//                             {...provided.dragHandleProps}>
//                             {field.label}
//                           </div>
//                         )}
//                       </Draggable>
//                     ))}
//                     {provided.placeholder}
//                   </div>
//                 )}
//               </Droppable>
//             </DragDropContext>
//           </div>

//           <div className="form-builder">
//             <h3>Your Form</h3>
//             <DragDropContext onDragEnd={onDragEnd}>
//               <Droppable droppableId="formBuilder">
//                 {(provided) => (
//                   <div ref={provided.innerRef} {...provided.droppableProps}>
//                     {formFields.map((field, index) => (
//                       <motion.div
//                       key={index}
//                       className="form-field"
//                       initial={{ opacity: 0, y: 10 }}
//                       animate={{ opacity: 1, y: 0 }}
//                       transition={{ duration: 0.2 }}
//                     >
//                        <div className="field-display">
//                           <strong>{field.label}</strong>
//                         </div>
//                         <FieldConfiguration
//                           field={field}
//                           index={index}
//                           onFieldUpdate={updateField}
//                         />
//                       </motion.div>
//                     ))}
//                       {provided.placeholder}
//                   </div>
//                 )}
//               </Droppable>
//             </DragDropContext>
//           </div>
//         </div>
//         <div className="modal-actions">
//           <button onClick={handleSaveForm}>Save Form Design</button>
//           <button onClick={onClose}>Cancel</button>
//         </div>
//       </div>
//     </div>
//   );
// };

// export default CreateUserFormBuilderBuilder;
