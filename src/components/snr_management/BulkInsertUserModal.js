
import React, { useEffect, useState } from 'react';
import './Modal.css';
// import { Formik, Form, Field } from 'formik';
// import * as Yup from 'yup';
// import Select from 'react-select';
import request from '../request';
// import { useOrganization } from '../../context/OrganizationContext';
import { toast } from 'react-toastify';
import './BulkInsertUserModal.css'; // Additional custom CSS for spinner, if needed.


// Modal for Bulk Insert Users
const BulkInsertUsersModal = ({ organizationId, onClose, onSuccess }) => {
    const [selectedFile, setSelectedFile] = useState(null);
    const [uploading, setUploading] = useState(false);
  
    const handleFileChange = e => {
      setSelectedFile(e.target.files[0]);
    };
  
    const handleSubmit = async e => {
      e.preventDefault();
      if (!selectedFile) {
        // alert("Please select a file to upload.");
        toast.info("Please select the excel file containing your employee records.");
        return;
      }
      const formData = new FormData();
      formData.append('file', selectedFile);
      formData.append('organization_id', organizationId);
      console.log("\n\nFormData: ", formData.get('file'));
      console.log("Organization ID: ", formData.get('organization_id'));
      setUploading(true);
      try {
        const response = await request.post('/users/bulk_insert_employee_data_api', formData,
            {
                headers: { "Content-Type": "multipart/form-data" },
              }
        // {
        //   method: 'POST',
        // //   headers: {
        // //     Authorization: `Bearer ${localStorage.getItem('token')}`
        // //   },
        //   body: formData
        // }
        );
        if (response.status !== 200) {
          // Handle error response from the server.
          // Using either .json() or response.data if Axios.
          const errData = typeof response.json === 'function' ? await response.json() : response.data;
          throw new Error(errData.message || errData.detail || "Bulk insert failed");
        }
        
        // Extract a friendly message from the response.
      const resData = typeof response.json === 'function' ? await response.json() : response.data;
      const message = resData.message || resData.detail || JSON.stringify(resData);
      toast.info(JSON.stringify(resData));
        // onSuccess();
        onClose();
      } catch (error) {
        console.error("Bulk Insert Error:", error);
        // alert(error.message);
        toast.error(`${error.message}`);
      } finally {
        setUploading(false);
      }
    };
  
    // Efficiently download the sample file using the download API.
  const handleDownloadSample = async () => {
    try {
      // Send a GET request to the download API.
      // Send a GET request to the download API with responseType: 'blob'
      const response = await request.get(`/download/sample-file/${organizationId}`, { responseType: 'blob' });
      if (response.status !== 200) {
        // Handle error response from the server.
        throw new Error("Failed to download sample file");
      }
      // For Axios, the Blob is in response.data
    const blob = response.data;
      // Create a temporary object URL and trigger download.
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      // Optionally, set the filename. You can also get this from response headers.
      a.download = "sample.xlsx";
      document.body.appendChild(a);
      a.click();
      a.remove();
      window.URL.revokeObjectURL(url);
    } catch (error) {
      console.error("Download error:", error);
      toast.error(`Error downloading sample file: ${error.message}`);
    //   alert(error.message);
    }
  };
  
    return (
      <div className="modal-overlay">
        <div className="modal-content">
          <h2>Bulk Insert Users</h2>
          <form onSubmit={handleSubmit}>
            <div className="form-group">
              <label htmlFor="bulkFile">Upload CSV File</label>
              <input 
                type="file" 
                id="bulkFile" 
                accept=".csv, application/vnd.openxmlformats-officedocument.spreadsheetml.sheet, application/vnd.ms-excel, .xls, .xlsx"
                onChange={handleFileChange} 
              />
            </div>
            <div className="modal-actions">
              <button type="button" onClick={handleDownloadSample}>
                Download Sample File
              </button>
              <button type="submit" disabled={uploading}>
              {uploading ? (<span className="spinner"></span>) : 'Submit'}
              {uploading && <span className="uploading-text"> Processing...</span>}
                {/* {uploading ? 'Uploading…' : 'Submit'} */}
              </button>
              <button type="button" onClick={onClose}>Cancel</button>
            </div>
          </form>
        </div>
      </div>
    );
  };

  export default BulkInsertUsersModal;