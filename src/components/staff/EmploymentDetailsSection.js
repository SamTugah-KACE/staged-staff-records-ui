// src/components/staff/EmploymentDetailsSection.js
import React from 'react';
import { Button, Descriptions } from 'antd';
import { EditOutlined } from '@ant-design/icons';
import './EmploymentDetailsSection.css';

const EmploymentDetailsSection = ({ employmentDetails, onEdit }) => {
  const { hire_date, department, rank,['employee-type']: empType } = employmentDetails || {};

  console.log("employee details:: ", employmentDetails);
  // Check if the user is a guest and return null if so
  if (empType === 'guest') {
    return null;
  }
  // Check if employmentDetails is not null or undefined
  if (!employmentDetails) {
    return <div className="error-message">No employment details available.</div>;
  }

  return (
    // {employmentDetails && (
      <Descriptions bordered column={1}>
       
        {employmentDetails?.hire_date && (
          <Descriptions.Item label="Appointment Date">{employmentDetails.hire_date || 'N/A'}</Descriptions.Item>
        )}
        {empType?.type_code && (
          <Descriptions.Item label="Appointment Type">{empType.type_code || 'N/A'}</Descriptions.Item> 
        )}
        {department?.name && (
          <Descriptions.Item label="Department">{department.name || 'N/A'}</Descriptions.Item>
        )}
        {rank?.name && (
          <Descriptions.Item label="Rank">{rank.name || 'N/A'}</Descriptions.Item>
        )}
        {department.branch?.name && (
          <Descriptions.Item label="Branch">{department.branch.name || 'N/A'}</Descriptions.Item>
        )}

        </Descriptions>
      );
    };





    // <div className="employment-details-section">
      {/* <div className="section-header"> */}
       
      
      /* {employmentDetails?.hire_date && (
        <div className="form-group">
          <label>Appointment Date</label>
          <div className="detail-value">{employmentDetails.hire_date}</div>
        </div>
      )}

      {department.branch?.name && (
        <div className="form-group">
          <label>Branch</label>
          <div className="detail-value">{department.branch.name}</div>
        </div>
      )}
      
     

{department?.name && (
        <div className="form-group">
          <label>Department</label>
          <div className="detail-value">{department.name}</div>
        </div>
      )}

      {rank?.name && (
        <div className="form-group">
          <label>Rank</label>
          <div className="detail-value">{rank.name}</div>
        </div>
      )}

      {empType?.type_code && (
        <div className="form-group">
          <label>Employee Type</label>
          <div className="detail-value">{empType.type_code}</div>
        </div>
      )}
    </div> 
    */


  

    

  //   {/* new: get a docs array once */}
  //   {(() => {
  //     const docs = docsFor(currentDetails);
  //     const hasLegacy = !!currentDetails.filePath;
  //     return (docs.length > 0 || hasLegacy) ? (
  //         <Descriptions.Item label="Documents">
  //         <div className="document-section">
  //           <Button
  //             icon={<EyeOutlined />}
  //             onClick={() => {
  //               if (docs.length > 0) {
  //                 // show the list in the same way your "Download" / "View" modals do
  //                 setDocList(docs);
  //                 setDocMode('view');
  //                 setDocModalVisible(true);
  //               } else if (hasLegacy) {
  //                 handlePreview({
  //                   url: currentDetails.filePath,
  //                   name: `${type}_qualification_${currentDetails.id}`,
  //                 });
  //               }
  //             }}
  //           >
  //             View Documents
  //           </Button>
  //           <Dropdown overlay={downloadMenu(currentDetails)} style={{ marginLeft: 8 }}>
  //             <Button icon={<DownloadOutlined />}>Download</Button>
  //           </Dropdown>
  //         </div>
  //       </Descriptions.Item>
  //     ) : null;
  //  })()}
  // </Descriptions>
// )}

    
  // );
// };

export default EmploymentDetailsSection;