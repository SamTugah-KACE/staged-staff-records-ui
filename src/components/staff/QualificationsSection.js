// src/components/QualificationsSection.js
import React, { useEffect, useState } from 'react';
import FileModal from './FileModal';
import { Button, Modal, Table, Badge } from 'antd';
import QualificationsTable from './QualificationsTable';
import AcademicForm from './AcademicForm';
import ProfessionalForm from './ProfessionalForm';
import './QualificationsSection.css';

const QualificationsSection = ({ type, items=[], pending, onRequestChange }) => {
 
  const [showModal, setShowModal] = useState(false);
  const [currentRecord, setCurrentRecord] = useState(null);
  const [modalFile, setModalFile] = useState(null);
  const [editing, setEditing] = useState(false);

  // Keep local copy of items for table refresh
  const [data, setData] = useState(items);
  useEffect(() => setData(items), [items]);


  const handleAdd = () => {
    setCurrentRecord(null);
    setEditing(false);
    setShowModal(true);
    
  };
  
 

  const handleCloseModal = () => {
    setModalFile(null);
  };

  const handleDownload = (filePath) => {
    // For demo, we create a temporary link to trigger download.
    const link = document.createElement('a');
    link.href = filePath;
    link.download = filePath.split('/').pop();
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const handleProposeUpdate = () => {
    console.log("Proposing qualification update.");
  };

  const handleDelete = (id) => {
    setData(data.filter(item => item.id !== id));
  };

  

  const handleSave = async (qualification,  newFiles ) => {
  
    try {
      console.log('Saving qualification:', qualification);
      console.log('Files to upload:', newFiles);
      console.log('Saving qualification:', qualification);
      console.log('Files to upload:', qualification.documents);
   
      // console.log('New files:', newFiles);
      console.log('\nExisting id::', qualification?.id);
      // console.log("r\n\nequets_type:: ", rq_type);

      // Call the onRequestChange function with the new data
      await onRequestChange({
        data: qualification,
        requestType: qualification?.id ? "update" :"save",
        dataType: type === 'academic' ? 'academic_qualifications' : 'professional_qualifications',
        files: newFiles,
      });
    
      // Update the local data state with the new qualification
      // if (currentRecord) {
      //   // Update existing record
      //   setData(data.map(item => (item.id === currentRecord.id ? { ...item, ...qualification } : item)));
      // } else {
      //   // Add new record
      //   setData([...data, { ...qualification, id: Date.now() }]); // Use a temporary ID for new records
      // }

     
      setShowModal(false);
      setCurrentRecord(null);
    } catch (error) {
      console.error('Error saving qualification:', error);
    }
  };

  const handleCancel = () => {
    setShowModal(false);
    setCurrentRecord(null);
  };

  const handleEdit = (record) => {
    
    setCurrentRecord(record);
    setEditing(true);
    setShowModal(true);
   
  }


  
  const modalTitle = `${currentRecord ? 'Edit' : 'Add'} ${type === 'academic' ? 'Academic' : 'Professional'} Qualification`;


  return (
    <div className="qualifications-section">
      {pending && (
        <div className="pending-banner">
          ⚠️ Your { type==='academic' ? 'Academic' : 'Professional' } qualifications changes are pending approval
        </div>
      )}
       <div className="action-buttons">
        <Button
          type="primary"
          onClick={handleAdd}
          disabled={pending}
          
        >
          Add {type === 'academic' ? 'Academic' : 'Professional'} Qualification
        </Button>
      </div>


<QualificationsTable
        data={data}
        type={type}
        onEdit={handleEdit}
        onDelete={handleDelete}
      />
      
       {/* Modal for qualification forms */}
       <Modal
        title={modalTitle}
        visible={showModal}
        onCancel={handleCancel}
        footer={null}
        width={800}
        destroyOnClose={true}
      >
        {type === 'academic' ? (
          <AcademicForm
            initialValues={currentRecord || {documents: []}}
            onSave={handleSave} 
            onCancel={handleCancel}
          />
        ) : (
          <ProfessionalForm
            initialValues={currentRecord || {documents: []}}
            onSave={handleSave}
            onCancel={handleCancel}
          />
        )}
      </Modal>

      {/* <div className="section-actions">
        <button onClick={handleSave}>Save</button>
        <button onClick={handleProposeUpdate}>Propose Update</button>
      </div> */}
      {modalFile && <FileModal filePath={modalFile} onClose={handleCloseModal} />}
    </div>
  );
};

export default QualificationsSection;
