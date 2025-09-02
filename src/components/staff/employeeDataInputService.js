// src/services/employeeDataInputService.js
import request from '../request';

const BASE = '/employee-data-inputs/';

const employeeDataInputService = {
  async fetchPending(employeeId) {
    const resp = await request.get(BASE, { params: { employee_id: employeeId } });
    console.log('Pending data:', resp.data);
    return resp.data;
  },


/**
   * data: the JSON object you’re sending
   * files: optional array of File objects (from <input type="file"/> or drag-drop)
   */
async submit({ employeeId, organizationId, data, requestType, dataType, files = [] }) {
  // 1️⃣ Build FormData
  const form = new FormData();
  form.append('employee_id',   employeeId);
  form.append("organization_id", organizationId);
  form.append('data_type',     dataType);
  form.append('request_type',  requestType);

// if we were handed a wrapper, extract the real bit
 const payload = data && data.data !== undefined 
               ? data.data 
               : data;

  form.append('data',          JSON.stringify(payload));

  // only append if we actually got files
  // if (Array.isArray(files) && files.length > 0) {
  //   console.log('Submitting files:', files);
  //   // Append each file to the FormData object\
  //   // Note: 'files' is the key name used in the backend to access the files
  //   files.forEach(file => form.append('files', file));
  // }

    // Only real File objects make it here:
    if (Array.isArray(files) && files.length) {
      files.forEach(file => form.append('files', file));
      console.log('Submitting files:', files);
    }

    // Only real File objects end up here:
    // files.forEach(file => form.append('files', file)); 

  console.log('\n\nFormData:', form);

  // 3️⃣ Send as multipart/form-data
//   const resp = await request.post(BASE, form, {
//     headers: { 'Content-Type': 'multipart/form-data' }
//   }
// );

   const resp = await request.post(BASE, form);
  return resp.data;
}
};




export default employeeDataInputService;
