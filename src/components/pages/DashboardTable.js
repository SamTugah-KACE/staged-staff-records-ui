// DashboardTable.js
import React, { useState, useEffect, useRef } from 'react';
import FileModal from './FileModal';
import ActionModal from './ActionModal';
import { Modal, Descriptions, Button, message } from "antd";
import './DashboardTable.css';
import { toast } from 'react-toastify';
// import useEmployeeInputs from '../../hooks/useEmployeeInputs';
import useEmployeeInputs from '../../hooks/useEMployeeInputs';



// Regex to detect a UUID4 string
const uuid4Regex = /^[0-9a-f]{8}-[0-9a-f]{4}-[4][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;

// A simple mapping from data‐field keys → human‐friendly labels
const LABEL_MAP = {
  // top‐level or nested keys
  email: "Email",
  title: "Title",
  gender: "Gender",
  hire_date: "Hire Date",
  last_name: "Last Name",
  first_name: "First Name",
  middle_name: "Middle Name",
  marital_status: "Marital Status",
  date_of_birth: "Date of Birth",
  termination_date: "Termination Date",
  contact_info: "Contact Info",
  phone: "Phone",
  "residential address": "Residential Address",
  custom_data: "Custom Data",
  // Academic fields
  degree: "Degree",
  institution: "Institution",
  year_obtained: "Year Obtained",
  details: "Details",
  gpa: "GPA",
  id: "ID",
  // file‐path fields
  certificate_path: "Certification(s)",
  profile_image_path: "Profile Image(s)",
  // Add more as needed...
};


const DashboardTable = ({ orgId, token }) => {
  const [rowsPerPage, setRowsPerPage] = useState(3);

  // const [data, setData] = useState([]);
   // 1) Initial load + setData from hook
  const { data, loading, error, setData } = useEmployeeInputs(orgId);
  const [fileToView, setFileToView] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [recordModal, setRecordModal] = useState({ visible: false, record: null });
   const [actionModal, setActionModal] = useState({ isOpen: false, type: '', rowId: null });
  const [wsError, setWsError] = useState(null);
  const wsRef = useRef(null);
  const reconnectTimeout = useRef(null);

  useEffect(() => {
    if (!orgId || !token) return;

  let ws;
  let backoff = 1000;

  

    const connect = () => {
      const wsUrl = `${process.env.REACT_APP_API_WS_URL || 'ws://localhost:8000'}/ws/employee-inputs?token=${encodeURIComponent(token)}&organization_id=${orgId}`;
      const ws = new WebSocket(wsUrl);

       wsRef.current = ws;

      ws.onopen = () => {
        backoff = 1000;
        console.log('WS connected');
        setWsError(null);
      };

      ws.onmessage = (ev) => {
        try {
          const {type, payload} = JSON.parse(ev.data);
          // setData(payload);
          setData(current => {
            switch (type) {
              case 'new_input': return [payload, ...current];
              case 'updated_input': return current.map(r => r.id === payload.id ? payload : r);
              default: return current;
            }
          });
        } catch (err) {
          console.error('Invalid WS message', err);
        }
      };

      ws.onerror = (err) => {
        console.error('WS error', err);
        setWsError('WebSocket connection error');
      };

      ws.onclose = (ev) => {
  console.log(`WS closed (code ${ev.code})`);
  wsRef.current = null;

  // 1008 = POLICY_VIOLATION (invalid token / unauthorized)
  if (ev.code === 1008) {
    setWsError('Unauthorized or session expired.  No more reconnect attempts.');
    return;
  }

  // otherwise, schedule a reconnect
  reconnectTimeout.current = setTimeout(connect, backoff);
   backoff = Math.min(backoff * 2, 30000);
};
      // wsRef.current = ws;
    };

    connect();

    return () => {
      if (reconnectTimeout.current) clearTimeout(reconnectTimeout.current);
      if (wsRef.current) wsRef.current.close();
    };
  }, [orgId, token, setData]);

  const handleViewFile = (att) => setFileToView(att);
  const handleCloseModal = () => setFileToView(null);

  // 2) Open record-details modal
  const openRecordModal = (record) => {
    setRecordModal({ visible: true, record });
  };
  const closeRecordModal = () => setRecordModal({ visible: false, record: null });


  const openActionModal = (rowId, type) => {
    setActionModal({ isOpen: true, rowId, type });
  };
  const closeActionModal = () =>
    setActionModal({ isOpen: false, rowId: null, type: '' });

  const handleActionConfirm = async ({ status, comments }) => {
    const { rowId } = actionModal;
    console.log("rowID: ", rowId);
    try {
      if (!comments){
        comments = '';
      }

      const resp = await fetch(
        `${process.env.REACT_APP_API_URL || 'http://localhost:8000'}/employee-data-inputs/${rowId}`,
        {
          method: 'PATCH',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({ status, comments }),
        }
      );
      if (!resp.ok) throw new Error('API error');
      const updated = await resp.json();
      // update local state
      setData(d =>
        d.map(r => (r.id === rowId ? { ...r, Issues: updated.status, Comments: updated.comments } : r))
      );
      toast.success(`Request ${updated.status}`);
      

    } catch (err) {
      console.error('Action failed', err);
    } finally {
      closeActionModal();
    }
  };


  // 4) Rename a key to a label, or fallback
  const getLabel = (key) => {
    if (LABEL_MAP[key]) return LABEL_MAP[key];
    // fallback: underscore → space, title case
    return key
      .split(/[_\s]+/)
      .map((w) => w.charAt(0).toUpperCase() + w.slice(1))
      .join(" ");
  };


  // 5) Render JSON into AntD Descriptions with custom rules
  const renderDescriptions = (obj) => {
    if (!obj || typeof obj !== "object") return null;

    return (
      <Descriptions bordered column={1} size="small" style={{ marginBottom: "1rem" }}>
        {Object.entries(obj).map(([rawKey, value]) => {
          const key = rawKey.trim();

          // Skip keys whose value is a UUID4 string
          if (typeof value === "string" && uuid4Regex.test(value)) {
            return null;
          }

          // If key is exactly "additional_info", drop the label but render the value’s children:
          if (key.toLowerCase() === "additional_info" && typeof value === "object" && value !== null) {
            return <React.Fragment key={key}>{renderDescriptions(value)}</React.Fragment>;
          }

          // Keys containing 'path' → render View/Download as Certification(s) or Document(s)
          if (key.toLowerCase().includes("path")) {
            let attachments = [];

            // Case: JSON‐encoded dict string
            if (typeof value === "string" && value.trim().startsWith("{") && value.trim().endsWith("}")) {
              try {
                const parsed = JSON.parse(value);
                if (parsed && typeof parsed === "object") {
                  attachments = Object.entries(parsed).map(([fn, url]) => ({ filename: fn, url }));
                }
              } catch {
                // parse failure → treat as single URL
                attachments = [{ filename: key, url: value }];
              }
            }
            // Case: native object
            else if (typeof value === "object" && !Array.isArray(value) && value !== null) {
              attachments = Object.entries(value).map(([fn, url]) => ({ filename: fn, url }));
            }
            // Case: plain URL string
            else if (typeof value === "string") {
              attachments = [{ filename: key, url: value }];
            }

            return (
              <Descriptions.Item label={getLabel(key)} key={key}>
                {attachments.map((att, i) => (
                  <div key={i} style={{ marginBottom: "0.5rem" }}>
                    <span style={{ fontWeight: "bold" }}>{att.filename}</span>
                    <Button
                      type="link"
                      onClick={() => setFileToView(att)}
                      style={{ marginLeft: 8 }}
                    >
                      View
                    </Button>
                    <a href={att.url} download={att.filename}>
                      <Button type="link">Download</Button>
                    </a>
                  </div>
                ))}
              </Descriptions.Item>
            );
          }

          // Nested object
          if (value && typeof value === "object" && !Array.isArray(value)) {
            return (
              <Descriptions.Item label={getLabel(key)} key={key}>
                {renderDescriptions(value)}
              </Descriptions.Item>
            );
          }

          // Primitive or Array
          return (
            <Descriptions.Item label={getLabel(key)} key={key}>
              {Array.isArray(value) ? JSON.stringify(value) : `${value}`}
            </Descriptions.Item>
          );
        })}
      </Descriptions>
    );
  };


  const totalPages = Math.ceil(data.length / rowsPerPage);
// const totalPages = Math.ceil(data.length / 3);

  return (
    <div className="dashboard-table">
     

      {/* <div className="table-header">
        <span>Page {currentPage}</span>
      </div> */}
      <div className="pagination-controls">
  <label htmlFor="rowsPerPage">Rows per page: </label>
  <select
    id="rowsPerPage"
    value={rowsPerPage}
    onChange={(e) => {
      setRowsPerPage(Number(e.target.value));
      setCurrentPage(1); // Reset to first page
    }}
  >
    <option value={3}>3</option>
    <option value={5}>5</option>
    <option value={10}>10</option>
  </select>
</div>

      <table>
        <thead>
          <tr>
            <th>Account Name</th>
            <th>Role</th>
            <th>Issue(s)</th>
            <th>Attachment(s)</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
           {wsError && <div className="ws-error">{wsError}</div>}
          {/* {data.map((row, idx) => */}
          {data
            // .slice((currentPage - 1) * 3, currentPage * 3)
            .slice((currentPage - 1) * rowsPerPage, currentPage * rowsPerPage)
            .map((row, idx) =>
           {
            const accountName = row["Account Name"];
            const role        = row.Role;
            const issues      = row.Issues;
            const attachments = row.Attachments || [];
            const actions     = row.Actions;
            const record = row.Data;


            return (
              <tr key={idx}>
                <td data-label="Account Name">{accountName}</td>
                <td data-label="Role">{role}</td>
                  {/* “Records” column */}
                <td data-label="Issue(s)">
                  {record ? (
                    <Button type="link" onClick={() => openRecordModal(record)}>
                      View Details
                    </Button>
                  ) : (
                    <span>N/A</span>
                  )}
                </td>
                <td data-label="Attachment(s)">
                  {attachments.map((att, i) => (
                    <div key={i} className="attachment-cell">
                      <div className="file-name">{att.filename}</div>
                      <div className="file-actions">
                        <button onClick={() => handleViewFile(att)}>View</button>
                        <a href={att.url} download={att.filename}>
                          <button>Download</button>
                        </a>
                      </div>
                    </div>
                  ))}
                </td>
                <td data-label="Actions">
                           {issues === 'Request Approval' && (
                    <>
                      <button onClick={() => openActionModal(row.id, 'Approved')} className="table-btn">
                        Approve
                      </button>
                      <button onClick={() => openActionModal(row.id, 'Rejected')} className="table-btn">
                        Decline
                      </button>
                    </>
                  )}
                  {(issues === 'Approved' || issues === 'Rejected') && <span>{issues}</span>}
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>

      <div className="pagination">
        <button
          disabled={currentPage === 1}
          onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
        >
          Prev
        </button>
        {/* <button onClick={() => setCurrentPage((p) => p + 1)}>Next</button> */}
       <span style={{ margin: '0 1rem' }}>
    Page {currentPage} of {totalPages}
  </span>
  <button
    disabled={currentPage === totalPages}
    onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
  >
    Next
  </button>
      </div>

      {fileToView && (
        <FileModal file={fileToView} onClose={handleCloseModal} />
      )}

       <ActionModal
        isOpen={actionModal.isOpen}
        type={actionModal.type}
        onClose={closeActionModal}
        onConfirm={handleActionConfirm}
      />

        {/* 6) Record Details Modal */}
      <Modal
        visible={recordModal.visible}
        title="Record Details"
        onCancel={closeRecordModal}
        footer={[
          <Button key="ok" type="primary" onClick={closeRecordModal}>
            OK
          </Button>,
        ]}
        width={"60vw"}        // responsive: 60% of viewport
        style={{ maxWidth: 800 }}
        bodyStyle={{ maxHeight: "60vh", overflowY: "auto" }}
      >
        {renderDescriptions(recordModal.record)}
      </Modal>

    </div>
  );
};

export default DashboardTable;



















// import React, { useState, useEffect, useRef } from 'react';
// import FileModal from './FileModal';
// import './DashboardTable.css';

// const DashboardTable = (orgId, token) => {
//   const [fileToView, setFileToView] = useState(null);
//   const [currentPage, setCurrentPage] = useState(1);
//   const [employeeData, setEmployeeData] = useState(null);
//   const [wsError, setWsError] = useState(null);
// const [data, setData] = useState(null);

// const wsRef = useRef(null);
  
  // const data = [
  //   {
  //     id: 1,
  //     accountName: 'User One',
  //     role: 'Admin',
  //     issues: 'Deactivation',
  //     attachments: ['file1.pdf'],
  //   },
  //   {
  //     id: 2,
  //     accountName: 'User Two',
  //     role: 'User',
  //     issues: 'Approval',
  //     attachments: ['file2.docx'],
  //   },
  // ];
  // const staffId

  // useEffect(() => {
  //    if (!orgId) return;
 
     // inputService.fetchPending(staffId)
     //   .then(setPendingInputs)
     //   .catch(err => console.error(err));
     
     // const token = auth.token;
    //  const wsUrl = `${process.env.REACT_APP_API_WS_URL || 'ws://localhost:8000'}/ws/employee-inputs?token=${token}&organization_id=${orgId}`;
     // const ws = new WebSocket(wsUrl, token ? [ `Bearer ${token}` ] : undefined);
 
//      const ws = new WebSocket(wsUrl);
 
//      ws.onopen = () => {
//        console.log('WS connected');
//        setWsError(null);            // clear any prior error
//      };
//      ws.onmessage = (ev) => {
//        const msg = JSON.parse(ev.data);
//        console.log("\n\nweb sock payload: ", msg.payload);
//        if (['initial','update'].includes(msg.type)) {
//          setData(msg.payload);
//        }
//      };
//      ws.onerror = (err) => {
//        console.error('WS error', err);
//        setWsError('WebSocket connection error.');
//      };
//      ws.onclose = (ev) => {
//        console.log('WS closed', ev.code, ev.reason);
//      };
 
//      wsRef.current = ws;
//      return () => ws.close();
//    }, [ orgId, token]   ); /*staffId, auth.token*/ // Adjust based on your auth context





//   const handleViewFile = (file) => setFileToView(file);
//   const handleCloseModal = () => setFileToView(null);

//   return (
//     <div className="dashboard-table">
//       <div className="table-header">
//         <span>Page {currentPage}</span>
//       </div>
//       <table>
//         <thead>
//           <tr>
//             <th>Account Name</th>
//             <th>Role</th>
//             <th>Issue(s)</th>
//             <th>Attachment(s)</th>
//             <th>Actions</th>
//           </tr>
//         </thead>
//         <tbody>
//           {data.map((row) => {
//             const showDeactivate = row.issues.toLowerCase().includes('deactivation');
//             const showApproval = row.issues.toLowerCase().includes('approval');
//             return (
//               <tr key={row.id}>
//                 <td>{row.accountName}</td>
//                 <td>{row.role}</td>
//                 <td>{row.issues}</td>
//                 <td>
//                   {row.attachments.map((att, idx) => (
//                     <div key={idx} className="attachment-cell">
//                       <div className="file-name">{att}</div>
//                       <div className="file-actions">
//                         <button onClick={() => handleViewFile(att)}>View</button>
//                         <button>Download</button>
//                       </div>
//                     </div>
//                   ))}
//                 </td>
//                 <td>
//                   {showDeactivate && <button className="table-btn">Deactivate</button>}
//                   {showApproval && (
//                     <>
//                       <button className="table-btn">Approve</button>
//                       <button className="table-btn">Decline</button>
//                     </>
//                   )}
//                 </td>
//               </tr>
//             );
//           })}
//         </tbody>
//       </table>
//       {/* Pagination controls (stub) */}
//       <div className="pagination">
//         <button disabled={currentPage === 1} onClick={() => setCurrentPage(currentPage - 1)}>Prev</button>
//         <button onClick={() => setCurrentPage(currentPage + 1)}>Next</button>
//       </div>
//       {fileToView && <FileModal file={fileToView} onClose={handleCloseModal} />}
//     </div>
//   );
// };

// export default DashboardTable;
